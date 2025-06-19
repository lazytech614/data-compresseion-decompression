"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Download, 
  FileText, 
  Settings, 
  Upload, 
  Zap 
} from "lucide-react";

import AlgorithmSelector from "@/components/global/algorithm-selector";
import FileUploader from "@/components/global/file-uploader";
import { ALGORITHMS } from "@/constants/algorithms";
import { 
  postCompression, 
  postDecompression,
  saveCompressionJob,
  getCompressionJobs
} from '../../utils/api';

interface ApiResult {
  fileName: string;
  stats: {
    originalSize: number;
    newSize: number;
    compressionRatio: number;
    timeMs: number;
  };
  compressedBase64?: string;
  decompressedBase64?: string;
  metadata?: any;
  mode?: 'compress' | 'decompress';
}

interface CompressionJob {
  id: string;
  type: string;
  status: string;
  originalSize: string;
  compressedSize?: string;
  compressionRatio?: number;
  metadata: any;
  compressedBase64?: string;
  decompressedBase64?: string;
  duration?: number;
  startTime: string;
  endTime?: string;
  inputFiles: any[];
  mimeType: string;
  outputFiles: any[];
  algorithm: string;
}

export default function CompressionPortal() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [algorithms, setAlgorithms] = useState(ALGORITHMS);
  const [selectedAlgo, setSelectedAlgo] = useState<string>('huffman');
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [loading, setLoading] = useState(false);
  const [savedResults, setSavedResults] = useState<CompressionJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  // Load compression jobs from database on component mount
  useEffect(() => {
    loadCompressionJobs();
  }, []);

  // Clear file selection when switching to decompress mode
  useEffect(() => {
    if (mode === 'decompress') {
      setFile(null);
      setSelectedJobId('');
    }
  }, [mode]);

  const loadCompressionJobs = async () => {
    try {
      const response = await getCompressionJobs();
      setSavedResults(response.jobs || []);
    } catch (error) {
      console.error('Failed to load compression jobs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (mode === 'compress') {
    if (!file || !selectedAlgo) {
      return alert('Choose a file and algorithm.');
    }
  } else {
    // Decompress mode
    if (!selectedJobId || !selectedAlgo) {
      return alert('Choose a previously compressed file and algorithm.');
    }
  }

  const formData = new FormData();
  
  if (mode === 'compress') {
    formData.append('file', file!);
    formData.append('algorithm', selectedAlgo);
  } else {
    // For decompress, we need to get the selected job
    const selectedJob = savedResults.find(job => job.id === selectedJobId);
    if (!selectedJob) {
      return alert('Selected file not found.');
    }
    
    // Check if we have compressed data stored
    if (!selectedJob.metadata || !selectedJob.compressedBase64) {
      return alert('No compressed data found for this job. Cannot decompress.');
    }
    
    try {
      // Convert base64 compressed data back to binary
      const compressedBase64 = selectedJob.compressedBase64;
      const compressedBinary = atob(compressedBase64);
      const compressedBytes = new Uint8Array(compressedBinary.length);
      for (let i = 0; i < compressedBinary.length; i++) {
        compressedBytes[i] = compressedBinary.charCodeAt(i);
      }
      
      // Create a File object from the compressed data
      const compressedFile = new File(
        [compressedBytes], 
        `${selectedJob.inputFiles[0]?.originalName || 'compressed'}_${selectedJob.algorithm}_compressed.bin`,
        { type: 'application/octet-stream' }
      );
      
      // Add the compressed file to FormData
      formData.append('file', compressedFile);
      formData.append('algorithm', selectedAlgo);
      
      // Add metadata (excluding compressedBase64 to avoid sending it twice)
      const metadataForDecompression = { ...selectedJob.metadata };
      delete metadataForDecompression.compressedBase64;
      formData.append('metadata', JSON.stringify(metadataForDecompression));
      
    } catch (error) {
      console.error('Error reconstructing compressed file:', error);
      return alert('Error reconstructing compressed file data.');
    }
  }

  setLoading(true);
  try {
    const data: ApiResult =
      mode === 'compress'
        ? await postCompression(formData)
        : await postDecompression(formData);

    // Save to database
    const jobData = {
      type: mode,
      algorithm: selectedAlgo,
      fileName: data.fileName,
      originalSize: data.stats.originalSize,
      compressedSize: data.stats.newSize,
      compressionRatio: data.stats.compressionRatio,
      duration: data.stats.timeMs,
      compressedBase64: data.compressedBase64,
      decompressedBase64: data.decompressedBase64,
      metadata: data.metadata,
      status: 'COMPLETED'
    };

    if (mode === 'compress') {
      await saveCompressionJob({
        ...jobData,
        mimeType: file!.type,
        inputFiles: [{
          filename: file!.name,
          originalName: file!.name,
          mimeType: file!.type,
          size: file!.size,
          path: "",
        }],
        outputFiles: data.compressedBase64 ? [{
          filename: data.fileName,
          originalName: file!.name,
          mimeType: "application/octet-stream",
          size: data.stats.newSize,
          path: "",
        }] : [],
      });
    } else {
      // For decompress, use data from the selected job
      const selectedJob = savedResults.find(job => job.id === selectedJobId)!;
      await saveCompressionJob({
        ...jobData,
        mimeType: selectedJob.mimeType,
        inputFiles: [{
          filename: selectedJob.outputFiles[0]?.filename || 'compressed_file',
          originalName: selectedJob.outputFiles[0]?.originalName || 'unknown',
          mimeType: "application/octet-stream",
          size: parseInt(selectedJob.compressedSize || '0'),
          path: "",
        }],
        outputFiles: data.decompressedBase64 ? [{
          filename: data.fileName,
          originalName: selectedJob.inputFiles[0]?.originalName || 'decompressed_file',
          mimeType: selectedJob.mimeType,
          size: data.stats.newSize,
          path: "",
        }] : [],
      });
    }

    // Reload jobs to update the list
    await loadCompressionJobs();

    router.push('/result');
  } catch (err) {
    console.error(err);
    alert('Error while processing. See console.');
    
    // Save failed job to database
    try {
      const failedJobData = {
        type: mode,
        algorithm: selectedAlgo,
        status: 'FAILED',
        errorMessage: (err as Error).message,
        outputFiles: [],
      };

      if (mode === 'compress') {
        await saveCompressionJob({
          ...failedJobData,
          fileName: file!.name,
          originalSize: file!.size,
          mimeType: file!.type,
          inputFiles: [{
            filename: file!.name,
            originalName: file!.name,
            mimeType: file!.type,
            size: file!.size,
            path: "",
          }],
        });
      } else {
        const selectedJob = savedResults.find(job => job.id === selectedJobId);
        if (selectedJob) {
          await saveCompressionJob({
            ...failedJobData,
            fileName: selectedJob.outputFiles[0]?.filename || 'unknown',
            originalSize: parseInt(selectedJob.compressedSize || '0'),
            mimeType: selectedJob.mimeType,
            inputFiles: [{
              filename: selectedJob.outputFiles[0]?.filename || 'compressed_file',
              originalName: selectedJob.outputFiles[0]?.originalName || 'unknown',
              mimeType: "application/octet-stream",
              size: parseInt(selectedJob.compressedSize || '0'),
              path: "",
            }],
          });
        }
      }
      await loadCompressionJobs();
    } catch (saveError) {
      console.error('Failed to save error job:', saveError);
    }
  } finally {
    setLoading(false);
  }
};

  // Check if form is valid for submission
  const isFormValid = () => {
    if (mode === 'compress') {
      return file && selectedAlgo;
    } else {
      return selectedJobId && selectedAlgo;
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

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-4">
                Operation Mode
              </label>
              <div className="flex flex-col sm:flex-row gap-y-4 space-x-4">
                {(['compress', 'decompress'] as const).map((modeOption) => (
                  <label
                    key={modeOption}
                    className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex-1 ${
                      mode === modeOption
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mode"
                      value={modeOption}
                      checked={mode === modeOption}
                      onChange={() => setMode(modeOption)}
                      className="sr-only"
                    />
                    <div className={`p-2 rounded-lg ${
                      mode === modeOption ? 'bg-blue-500/20' : 'bg-slate-700'
                    }`}>
                      {modeOption === 'compress' ? (
                        <Download className={`w-5 h-5 ${
                          mode === modeOption ? 'text-blue-400' : 'text-slate-400'
                        }`} />
                      ) : (
                        <Upload className={`w-5 h-5 ${
                          mode === modeOption ? 'text-blue-400' : 'text-slate-400'
                        }`} />
                      )}
                    </div>
                    <div>
                      <span className={`font-medium capitalize ${
                        mode === modeOption ? 'text-blue-300' : 'text-slate-300'
                      }`}>
                        {modeOption}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        {modeOption === 'compress' ? 'Reduce file size' : 'Restore original file'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* File Uploader - Only show in compress mode */}
            {mode === 'compress' && (
              <FileUploader onFileSelect={setFile} file={file} />
            )}

            {/* File Selector - Only show in decompress mode */}
            {mode === 'decompress' && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Select Previously Compressed File
                </label>
                {savedResults.filter(r => 
                  r.type === 'COMPRESS' && 
                  r.status === 'COMPLETED' && 
                  r.metadata &&
                  (
                    (Array.isArray(r.metadata) && r.metadata.length > 0) ||
                    (!Array.isArray(r.metadata) && typeof r.metadata === 'object' && Object.keys(r.metadata).length > 0)
                  )
                ).length > 0 ? (
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select a compressed file to decompress</option>
                    {savedResults
                      .filter((r) => 
                        r.type === 'COMPRESS' && 
                        r.status === 'COMPLETED' && 
                        r.compressedBase64 &&
                        r.metadata &&
                        (
                          (Array.isArray(r.metadata) && r.metadata.length > 0) ||
                          (!Array.isArray(r.metadata) && typeof r.metadata === 'object' && Object.keys(r.metadata).length > 0)
                        ))
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.outputFiles[0]?.originalName || r.inputFiles[0]?.originalName || `Job ${r.id.slice(0, 8)}`} 
                          ({new Date(r.startTime).toLocaleDateString()}) - {r.algorithm}
                        </option>
                      ))}
                  </select>
                ) : (
                  <div className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-8 text-center">
                    <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400">No compressed files available for decompression</p>
                    <p className="text-slate-500 text-sm mt-1">Compress some files first to see them here</p>
                  </div>
                )}
              </div>
            )}

            <AlgorithmSelector
              algorithms={algorithms}
              selected={selectedAlgo}
              onChange={setSelectedAlgo}
            />

            <button
              onClick={handleSubmit}
              type="submit"
              disabled={loading || !isFormValid()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {mode === 'compress' ? (
                    <Download className="w-5 h-5" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  <span>
                    {mode === 'compress' ? 'Compress File' : 'Decompress File'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Display recent jobs */}
        {savedResults.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6">Recent Jobs</h3>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <div className="space-y-4">
                {savedResults.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">
                        {job.type} - {job.outputFiles[0]?.originalName || job.inputFiles[0]?.originalName || 'Unknown'}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {new Date(job.startTime).toLocaleString()} - {job.algorithm}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        job.status === 'COMPLETED' ? 'text-green-400' : 
                        job.status === 'FAILED' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {job.status}
                      </p>
                      {job.compressionRatio && (
                        <p className="text-slate-400 text-sm">
                          {(job.compressionRatio * 100).toFixed(1)}% ratio
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-8 h-8 text-blue-400" />,
              title: "Lightning Fast",
              description: "Optimized algorithms for maximum performance"
            },
            {
              icon: <FileText className="w-8 h-8 text-green-400" />,
              title: "Multiple Formats",
              description: "Support for all major file formats"
            },
            {
              icon: <Settings className="w-8 h-8 text-purple-400" />,
              title: "Advanced Options",
              description: "Fine-tune compression parameters"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="flex items-center space-x-4 mb-3">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}