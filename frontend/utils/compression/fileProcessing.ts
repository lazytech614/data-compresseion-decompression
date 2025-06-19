export const reconstructCompressedFile = (selectedJob: any) => {
  if (!selectedJob.metadata || !selectedJob.compressedBase64) {
    throw new Error('No compressed data found for this job. Cannot decompress.');
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
    
    return compressedFile;
  } catch (error) {
    console.error('Error reconstructing compressed file:', error);
    throw new Error('Error reconstructing compressed file data.');
  }
};

export const createFormData = (
  mode: 'compress' | 'decompress',
  file?: File | null,
  selectedAlgo?: string,
  selectedJob?: any
) => {
  const formData = new FormData();
  
  if (mode === 'compress' && file) {
    formData.append('file', file);
    formData.append('algorithm', selectedAlgo || '');
  } else if (mode === 'decompress' && selectedJob) {
    const compressedFile = reconstructCompressedFile(selectedJob);
    formData.append('file', compressedFile);
    formData.append('algorithm', selectedAlgo || '');
    
    // Add metadata (excluding compressedBase64 to avoid sending it twice)
    const metadataForDecompression = { ...selectedJob.metadata };
    delete metadataForDecompression.compressedBase64;
    formData.append('metadata', JSON.stringify(metadataForDecompression));
  }
  
  return formData;
};