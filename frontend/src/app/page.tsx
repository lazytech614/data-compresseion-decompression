"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

// Components
import AlgorithmSelector from "@/components/global/algorithm-selector";
import FileUploader from "@/components/global/file-uploader";
import ModeSelector from "@/components/compression/mode-selector";
import DecompressFileSelector from "@/components/compression/decompress-file-selector";
import ProcessingButton from "@/components/compression/processing-button";
import RecentJobs from "@/components/compression/recent-jobs";
import FeatureCards from "@/components/compression/feature-cards";

// Hooks
import { useCompressionJobs } from "@/hooks/useCompressionJobs";
import { useCompressionForm } from "@/hooks/useCompressionForm";

// Utils
import { postCompression, postDecompression } from '../../utils/api';
import { createFormData } from '../../utils/compression/fileProcessing';
import { createJobData, createFailedJobData } from '../../utils/compression/jobHelpers';
import { ApiResult } from "@/types";

export default function CompressionPortal() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  
  const { savedResults, saveJob } = useCompressionJobs();
  const {
    file,
    setFile,
    algorithms,
    selectedAlgo,
    setSelectedAlgo,
    mode,
    setMode,
    selectedJobId,
    setSelectedJobId,
    processing,
    setProcessing,
    isFormValid
  } = useCompressionForm();

  const handleSubmit = async () => {
    if (!isSignedIn) {
      router.push('/auth/sign-in');
      return;
    }

    if (mode === 'compress' && (!file || !selectedAlgo)) {
      return alert('Choose a file and algorithm.');
    }

    if (mode === 'decompress' && (!selectedJobId || !selectedAlgo)) {
      return alert('Choose a previously compressed file and algorithm.');
    }

    const selectedJob = mode === 'decompress' 
      ? savedResults.find(job => job.id === selectedJobId)
      : null;

    if (mode === 'decompress' && !selectedJob) {
      return alert('Selected file not found.');
    }

    setProcessing(true);

    try {
      const formData = createFormData(mode, file, selectedAlgo, selectedJob);

      const data: ApiResult = mode === 'compress'
        ? await postCompression(formData)
        : await postDecompression(formData);

      const jobData = createJobData(mode, selectedAlgo, data, file || undefined, selectedJob);

      const savedJob = await saveJob(jobData);
      const jobId = savedJob.jobId;

      router.push(`/result?jobId=${jobId}`);
      
    } catch (err) {
      console.error(err);
      alert('Error while processing. See console.');

      try {
        const failedJobData = createFailedJobData(
          mode, 
          selectedAlgo, 
          err as Error, 
          file || undefined, 
          selectedJob
        );
        await saveJob(failedJobData);
      } catch (saveError) {
        console.error('Failed to save error job:', saveError);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Data Compression & Decompression Portal
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Compress and decompress files using various algorithms with real-time visualization and performance metrics.
          </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 shadow-2xl">
          <div className="space-y-8">
            <ModeSelector mode={mode} onModeChange={setMode} />
            {mode === 'compress' && (
              <FileUploader onFileSelect={setFile} file={file} />
            )}
            {mode === 'decompress' && (
              <DecompressFileSelector
                savedResults={savedResults}
                selectedJobId={selectedJobId}
                onJobSelect={setSelectedJobId}
              />
            )}
            <AlgorithmSelector
              algorithms={algorithms}
              selected={selectedAlgo}
              onChange={setSelectedAlgo}
            />
            <ProcessingButton
              mode={mode}
              loading={processing}
              isFormValid={isFormValid()}
              onClick={handleSubmit}
            />
          </div>
        </div>
        <RecentJobs jobs={savedResults} />
        <FeatureCards />
      </div>
    </div>
  );
}