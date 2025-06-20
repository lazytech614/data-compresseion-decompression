import { FilePayload } from "@/types";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string; 

//TODO: update the formdata type
export async function postCompression(formData: any) {
  try {
    const res = await fetch(`${API_BASE}/api/compress`, {
      method: 'POST',
      body: formData,
    });

    let responseData;
    try {
      responseData = await res.json();
    } catch (parseError) {
      const responseText = await res.text();
      console.error('Failed to parse response as JSON:', responseText);
      throw new Error(`Server returned invalid response: ${res.status} ${res.statusText}`);
    }

    if (!res.ok) {
      console.error('API Error Response:', responseData);
      
      const errorMessage = responseData?.error || 
                          responseData?.message || 
                          `HTTP ${res.status}: ${res.statusText}`;
      
      // Create detailed error object
      const error = new Error(errorMessage);
      (error as any).status = res.status;
      (error as any).statusText = res.statusText;
      (error as any).details = responseData?.details;
      (error as any).response = responseData;
      
      throw error;
    }

    return responseData;
    
  } catch (error: Error | any) {
    console.error('Compression API Error:', error);
    toast.error(error.message || 'Compression API error');
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to compression server');
    }
    
    throw error;
  }
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
  cpuPercent?: number;
  memoryUsage?: number;
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