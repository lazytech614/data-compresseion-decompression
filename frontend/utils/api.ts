const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string; 

//TODO: update the formdata type
export async function postCompression(formData: any) {
  // formData is a FormData with fields: file (Blob), algorithm (string), metadata (if needed)
  const res = await fetch(`${API_BASE}/api/compress`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Compression API error');
  return res.json();
}

export async function postDecompression(formData: any) {
  const res = await fetch(`${API_BASE}/api/decompress`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    throw new Error('Decompression API error');
  }
  return res.json();
}

export async function fetchAlgorithms() {
  const res = await fetch(`${API_BASE}/api/algorithms`);
  if (!res.ok) throw new Error('Failed to load algorithms');
  return res.json();
}

export interface FilePayload {
  filename:     string;
  originalName: string;
  mimeType:     string;
  size:         number;
  path?:        string;
  url?:         string;
}

export async function saveCompressionJob(jobData: {
  type: string;
  algorithm: string;
  fileName: string;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  duration?: number;
  compressedBase64?: string;
  decompressedBase64?: string;
  metadata?: any;
  mimeType: string;
  status: string;
  errorMessage?: string;
  inputFiles: FilePayload[];
  outputFiles: FilePayload[];
}) {
  const res = await fetch('/api/compression-jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData)
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to save compression job');
  }
  
  return res.json();
}

export async function getCompressionJobs() {
  const res = await fetch('/api/compression-jobs', {
    method: 'GET',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch compression jobs');
  }
  
  return res.json();
}

export async function getCompressionJobById(jobId: string) {
  const res = await fetch(`/api/compression-jobs/${jobId}`, {
    method: 'GET',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch compression job');
  }
  
  return res.json();
}

export async function deleteCompressionJob(jobId: string) {
  const res = await fetch(`/api/compression-jobs/${jobId}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete compression job');
  }
  
  return res.json();
}