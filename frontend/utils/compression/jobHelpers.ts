import { ApiResult } from '@/types';

export const createJobData = (
  mode: 'compress' | 'decompress',
  selectedAlgo: string,
  data: ApiResult,
  file?: File,
  selectedJob?: any
) => {
  const baseJobData = {
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

  if (mode === 'compress' && file) {
    return {
      ...baseJobData,
      mimeType: file.type,
      inputFiles: [{
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: "",
      }],
      outputFiles: data.compressedBase64 ? [{
        filename: data.fileName,
        originalName: file.name,
        mimeType: "application/octet-stream",
        size: data.stats.newSize,
        path: "",
      }] : [],
    };
  } else if (mode === 'decompress' && selectedJob) {
    return {
      ...baseJobData,
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
    };
  }

  return baseJobData;
};

export const createFailedJobData = (
  mode: 'compress' | 'decompress',
  selectedAlgo: string,
  error: Error,
  file?: File,
  selectedJob?: any
) => {
  const baseFailedJobData = {
    type: mode,
    algorithm: selectedAlgo,
    status: 'FAILED',
    errorMessage: error.message,
    outputFiles: [],
  };

  if (mode === 'compress' && file) {
    return {
      ...baseFailedJobData,
      fileName: file.name,
      originalSize: file.size,
      mimeType: file.type,
      inputFiles: [{
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: "",
      }],
    };
  } else if (mode === 'decompress' && selectedJob) {
    return {
      ...baseFailedJobData,
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
    };
  }

  return baseFailedJobData;
};