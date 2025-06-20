import { MIN_CHUNK_SIZE, MAX_CHUNK_SIZE } from "../core/constants.js";

export function calculateChunkSize(fileSize) {
  if (fileSize < 1024 * 1024) {
    // < 1MB
    return MIN_CHUNK_SIZE;
  } else if (fileSize < 10 * 1024 * 1024) {
    // < 10MB
    return 64 * 1024; // 64KB
  } else if (fileSize < 100 * 1024 * 1024) {
    // < 100MB
    return 256 * 1024; // 256KB
  } else {
    return MAX_CHUNK_SIZE; // 1MB
  }
}

export function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function buildFrequencyTableStreaming(
  inputBuffer,
  chunkSize = 64 * 1024
) {
  const freqTable = new Map();

  for (let i = 0; i < inputBuffer.length; i += chunkSize) {
    const chunk = inputBuffer.subarray(i, i + chunkSize);

    for (const byte of chunk) {
      freqTable.set(byte, (freqTable.get(byte) || 0) + 1);
    }
  }

  return freqTable;
}

export function buildFrequencyTableStreamingWithProgress(
  inputBuffer,
  chunkSize,
  progressCallback
) {
  const freqTable = new Map();
  let processedBytes = 0;

  for (let i = 0; i < inputBuffer.length; i += chunkSize) {
    const chunk = inputBuffer.subarray(i, i + chunkSize);

    for (const byte of chunk) {
      freqTable.set(byte, (freqTable.get(byte) || 0) + 1);
    }

    processedBytes += chunk.length;

    // Progress callback for frequency analysis phase (0-50%)
    if (progressCallback) {
      const progress = (processedBytes / inputBuffer.length) * 50;
      progressCallback(Math.round(progress), "Analyzing frequency");
    }
  }

  return freqTable;
}

export function serializeFrequencyTable(freqTable) {
  const serialized = {};
  for (const [byte, freq] of freqTable) {
    serialized[byte] = freq;
  }
  return serialized;
}

export function deserializeFrequencyTable(serializedFreqTable) {
  const freqTable = new Map();
  for (const [byte, freq] of Object.entries(serializedFreqTable)) {
    freqTable.set(parseInt(byte), freq);
  }
  return freqTable;
}

export function calculateMetrics(
  originalSize,
  compressedSize,
  processingTime,
  chunkSize
) {
  const compressionRatio = originalSize / compressedSize;
  const spaceSaved = originalSize - compressedSize;
  const compressionPercentage = (spaceSaved / originalSize) * 100;

  return {
    compressionRatio: parseFloat(compressionRatio.toFixed(2)),
    compressionPercentage: parseFloat(compressionPercentage.toFixed(2)),
    processingTime: processingTime,
    originalSize: formatBytes(originalSize),
    compressedSize: formatBytes(compressedSize),
    spaceSaved: formatBytes(spaceSaved),
    chunkSize: formatBytes(chunkSize),
    processingSpeed: formatBytes(originalSize / (processingTime / 1000)) + "/s",
  };
}
