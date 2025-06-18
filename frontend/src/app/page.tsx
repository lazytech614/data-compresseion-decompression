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
  duration?: number;
  startTime: string;
  endTime?: string;
  inputFiles: any[];
  outputFiles: any[];
}

export default function CompressionPortal() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [algorithms, setAlgorithms] = useState(ALGORITHMS);
  const [selectedAlgo, setSelectedAlgo] = useState<string>('huffman');
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [loading, setLoading] = useState(false);
  const [savedResults, setSavedResults] = useState<CompressionJob[]>([]);
  const [selectedMetadataFile, setSelectedMetadataFile] = useState<string>('');

  // Load compression jobs from database on component mount
  useEffect(() => {
    loadCompressionJobs();
  }, []);

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
    if (!file || !selectedAlgo) {
      return alert('Choose a file and algorithm.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('algorithm', selectedAlgo);

    if (mode === 'decompress') {
      const selected = savedResults.find((r) => 
        r.outputFiles.some(f => f.filename === selectedMetadataFile)
      );
      if (!selected) {
        return alert('No metadata found for selected file.');
      }
      // You might need to store metadata differently in your database
      // For now, we'll pass the job ID
      formData.append('jobId', selected.id);
    }

    setLoading(true);
    try {
      const data: ApiResult =
        mode === 'compress'
          ? await postCompression(formData)
          : await postDecompression(formData);

      // Save to database instead of localStorage
      await saveCompressionJob({
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
      });

      // Reload jobs to update the list
      await loadCompressionJobs();

      router.push('/result');
    } catch (err) {
      console.error(err);
      alert('Error while processing. See console.');
      
      // Save failed job to database
      try {
        await saveCompressionJob({
          type: mode,
          algorithm: selectedAlgo,
          fileName: file.name,
          originalSize: file.size,
          status: 'FAILED',
          errorMessage: err instanceof Error ? err.message : 'Unknown error'
        });
        await loadCompressionJobs();
      } catch (saveError) {
        console.error('Failed to save error job:', saveError);
      }
    } finally {
      setLoading(false);
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

            <FileUploader onFileSelect={setFile} file={file} />

            <AlgorithmSelector
              algorithms={algorithms}
              selected={selectedAlgo}
              onChange={setSelectedAlgo}
            />

            {mode === 'decompress' && savedResults.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Select Previously Compressed File
                </label>
                <select
                  value={selectedMetadataFile}
                  onChange={(e) => setSelectedMetadataFile(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select a file</option>
                  {savedResults
                    .filter((r) => r.type === 'COMPRESS' && r.status === 'COMPLETED')
                    .map((r) => (
                      <option key={r.id} value={r.outputFiles[0]?.filename || r.id}>
                        {r.outputFiles[0]?.originalName || `Job ${r.id.slice(0, 8)}`} 
                        ({new Date(r.startTime).toLocaleDateString()})
                      </option>
                    ))}
                </select>
              </div>
            )}

            <button
              onClick={handleSubmit}
              type="submit"
              disabled={loading || !file || !selectedAlgo}
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
                        {job.type} - {job.outputFiles[0]?.originalName || 'Unknown'}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {new Date(job.startTime).toLocaleString()}
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