import { BitBuffer } from "../core/BitBuffer.js";
import { DEFAULT_MAX_FILE_SIZE } from "../core/constants.js";
import {
  buildFrequencyTable,
  buildHuffmanTree,
  generateCodes,
} from "../utils/huffmanUtils.js";
import {
  calculateChunkSize,
  buildFrequencyTableStreamingWithProgress,
  serializeFrequencyTable,
  calculateMetrics,
} from "../utils/fileUtils.js";
import {
  validateFileSize,
  validateCompressionOptions,
} from "../utils/validationUtils.js";

/**
 * Enhanced compression function with file size limits and options
 * @param {Buffer} inputBuffer - Input data to compress
 * @param {Object} options - Compression options
 * @returns {Object} Compression result with buffer and metadata
 */
export function compressWithLimits(inputBuffer, options = {}) {
  const startTime = Date.now();

  // Validate inputs
  const validatedOptions = validateCompressionOptions(options);
  validateFileSize(inputBuffer, validatedOptions.maxFileSize);

  // Handle empty buffer
  if (inputBuffer.length === 0) {
    return {
      compressedBuffer: Buffer.alloc(0),
      metadata: { freqTable: {}, paddingBits: 0, originalSize: 0 },
      metrics: validatedOptions.enableMetrics
        ? { compressionRatio: 1, processingTime: 0 }
        : undefined,
    };
  }

  // Calculate optimal chunk size
  const chunkSize = calculateChunkSize(inputBuffer.length);

  // 1. Build frequency table using streaming approach
  const freqTable = buildFrequencyTableStreamingWithProgress(
    inputBuffer,
    chunkSize,
    validatedOptions.enableProgressCallback
      ? validatedOptions.progressCallback
      : null
  );

  // 2. Build Huffman tree
  const tree = buildHuffmanTree(freqTable);

  // 3. Generate binary codes
  const codes = generateCodes(tree);

  // 4. Use BitBuffer for efficient encoding
  const bitBuffer = new BitBuffer();
  let processedBytes = 0;

  // Process input in chunks to avoid memory issues
  for (let i = 0; i < inputBuffer.length; i += chunkSize) {
    const chunk = inputBuffer.subarray(i, i + chunkSize);

    for (const byte of chunk) {
      const code = codes.get(byte);
      if (code) {
        bitBuffer.writeBits(code);
      }
    }

    processedBytes += chunk.length;

    // Progress callback for compression phase
    if (
      validatedOptions.enableProgressCallback &&
      validatedOptions.progressCallback
    ) {
      const progress = 50 + (processedBytes / inputBuffer.length) * 50; // 50-100%
      validatedOptions.progressCallback(Math.round(progress), "Compressing");
    }
  }

  const paddingBits = bitBuffer.getPaddingBits();
  const compressedBuffer = bitBuffer.finalize();

  // 5. Create metadata
  const metadata = {
    freqTable: serializeFrequencyTable(freqTable),
    paddingBits,
    originalSize: inputBuffer.length,
    chunkSize: chunkSize,
  };

  // 6. Calculate metrics if requested
  const processingTime = Date.now() - startTime;
  const result = { compressedBuffer, metadata };

  if (validatedOptions.enableMetrics) {
    result.metrics = calculateMetrics(
      inputBuffer.length,
      compressedBuffer.length,
      processingTime,
      chunkSize
    );
  }

  return result;
}

/**
 * Simple compression function for backward compatibility
 * @param {Buffer} inputBuffer - Input data to compress
 * @param {number} maxFileSize - Maximum allowed file size
 * @returns {Object} Compression result
 */
export function compress(inputBuffer, maxFileSize = DEFAULT_MAX_FILE_SIZE) {
  return compressWithLimits(inputBuffer, { maxFileSize });
}

/**
 * Estimate compression ratio without full compression
 * @param {Buffer} inputBuffer - Input data to analyze
 * @param {number} sampleSize - Size of sample to analyze
 * @returns {number} Estimated compression ratio
 */
export function estimateCompressionRatio(inputBuffer, sampleSize = 10000) {
  if (inputBuffer.length === 0) return 1;

  const sample = inputBuffer.subarray(
    0,
    Math.min(sampleSize, inputBuffer.length)
  );
  const freqTable = new Map();

  // Build frequency table for sample
  for (const byte of sample) {
    freqTable.set(byte, (freqTable.get(byte) || 0) + 1);
  }

  const tree = buildHuffmanTree(freqTable);
  const codes = generateCodes(tree);

  let totalBits = 0;
  for (const byte of sample) {
    const code = codes.get(byte);
    if (code) {
      totalBits += code.length;
    }
  }

  const originalBits = sample.length * 8;
  return totalBits > 0 ? originalBits / totalBits : 1;
}
