export interface ApiResult {
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

export interface CompressionJob {
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

export interface JobRecord {
  id: string;
  status: string;
  type: string;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  startTime: string;
  inputFiles: any[];
  endTime?: string;
  duration?: number;
}

export interface UsagePoint {
  date: string;
  compressions: number;
  dataProcessed: number;  // in MB
}

export interface TypePoint {
  name: string;
  value: number;
  // you can drop color here if your chart assigns it
  color?: string;
}

export interface InputFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: string
  path: string
  url?: string
  // ...other fields if needed
}

export type OutputFile = InputFile;

export interface JobDetails {
  id: string
  status: string
  type: string
  quality?: number | null
  algorithm?: string | null
  originalSize: string
  compressedSize?: string | null
  compressionRatio?: number | null
  startTime: string
  endTime?: string | null
  duration?: number | null
  errorMessage?: string | null
  batchId?: string | null
  priority?: string
  metadata?: any
  compressedBase64?: string | null
  decompressedBase64?: string | null
  inputFiles: InputFile[]
  outputFiles: OutputFile[]
}

export interface SystemStats {
  date: string;
  totalUsers: number;
  totalStorageUsed: number;
  totalDataProcessed: number;
  totalCompressions: number;
  avgCompressionRatio: number;
  huffmanAvgRatio: number;
  huffmanAvgDuration: number;
  huffmanCount: number;
  lz77AvgRatio: number;
  lz77AvgDuration: number;
  lz77Count: number;
  lzwAvgRatio: number;
  lzwAvgDuration: number;
  lzwCount: number;
  arithmeticAvgRatio: number;
  arithmeticAvgDuration: number;
  arithmeticCount: number;
  documentAvgRatio: number;
  documentCount: number;
  textAvgRatio: number;
  textCount: number;
  photoAvgRatio: number;
  photoCount: number;
  videoAvgRatio: number;
  videoCount: number;
  audioAvgRatio: number;
  audioCount: number;
  unknownAvgRatio: number;
  unknownCount: number;
}

export interface FilePayload {
  filename:     string;
  originalName: string;
  mimeType:     string;
  size:         number;
  path?:        string;
  url?:         string;
}