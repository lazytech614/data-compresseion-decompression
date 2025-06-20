import { BitReader } from "../core/BitReader.js";
import {
  DEFAULT_MAX_FILE_SIZE,
  PROGRESS_UPDATE_INTERVAL,
} from "../core/constants.js";
import {
  buildHuffmanTree,
  generateCodes,
  invertCodes,
} from "../utils/huffmanUtils.js";
import { deserializeFrequencyTable } from "../utils/fileUtils.js";
import {
  validateMetadata,
  validateDecompressionOptions,
  validateExpectedOutputSize,
} from "../utils/validationUtils.js";

/**
 * Enhanced decompression function with validation and progress tracking
 * @param {Buffer} inputBuffer - Compressed data buffer
 * @param {Object} metadata - Compression metadata
 * @param {Object} options - Decompression options
 * @returns {Object} Decompression result
 */
export function decompressWithLimits(inputBuffer, metadata, options = {}) {
  // Validate inputs
  const validatedOptions = validateDecompressionOptions(options);

  // Handle empty buffer
  if (inputBuffer.length === 0 || !metadata.freqTable) {
    return { decompressedBuffer: Buffer.alloc(0) };
  }

  // Validate metadata
  validateMetadata(metadata);

  // Validate expected output size
  const expectedSize = metadata.originalSize || 0;
  validateExpectedOutputSize(expectedSize, validatedOptions.maxFileSize);

  // 1. Reconstruct frequency table
  const freqTable = deserializeFrequencyTable(metadata.freqTable);

  // 2. Reconstruct Huffman tree and codes
  const tree = buildHuffmanTree(freqTable);
  const codes = generateCodes(tree);
  const codesToByte = invertCodes(codes);

  // 3. Use BitReader for efficient bit reading
  const bitReader = new BitReader(inputBuffer, metadata.paddingBits || 0);

  // 4. Decode using streaming approach
  const decodedChunks = [];
  let currentCode = "";
  let decodedCount = 0;
  let lastProgressUpdate = 0;

  while (bitReader.hasMoreBits() && decodedCount < expectedSize) {
    const bit = bitReader.readBit();
    if (bit === null) break;

    currentCode += bit;

    const decodedByte = codesToByte.get(currentCode);
    if (decodedByte !== undefined) {
      decodedChunks.push(decodedByte);
      decodedCount++;
      currentCode = "";

      // Progress callback (update every PROGRESS_UPDATE_INTERVAL bytes)
      if (
        validatedOptions.enableProgressCallback &&
        validatedOptions.progressCallback &&
        decodedCount - lastProgressUpdate >= PROGRESS_UPDATE_INTERVAL
      ) {
        const progress = (decodedCount / expectedSize) * 100;
        validatedOptions.progressCallback(
          Math.round(progress),
          "Decompressing"
        );
        lastProgressUpdate = decodedCount;
      }
    }

    // Safety check to prevent infinite loops
    if (currentCode.length > 64) {
      // Reasonable max code length
      throw new Error(
        "Decompression error: Invalid or corrupted data detected"
      );
    }
  }

  // Final progress update
  if (
    validatedOptions.enableProgressCallback &&
    validatedOptions.progressCallback
  ) {
    validatedOptions.progressCallback(100, "Decompression complete");
  }

  // Verify we got the expected amount of data
  if (decodedCount !== expectedSize) {
    console.warn(
      `Warning: Expected ${expectedSize} bytes, got ${decodedCount} bytes`
    );
  }

  const decompressedBuffer = Buffer.from(decodedChunks);
  return { decompressedBuffer };
}

/**
 * Simple decompression function for backward compatibility
 * @param {Buffer} inputBuffer - Compressed data buffer
 * @param {Object} metadata - Compression metadata
 * @param {number} maxFileSize - Maximum allowed output size
 * @returns {Object} Decompression result
 */
export function decompress(
  inputBuffer,
  metadata,
  maxFileSize = DEFAULT_MAX_FILE_SIZE
) {
  return decompressWithLimits(inputBuffer, metadata, { maxFileSize });
}

/**
 * Verify the integrity of compressed data without full decompression
 * @param {Buffer} inputBuffer - Compressed data buffer
 * @param {Object} metadata - Compression metadata
 * @returns {Object} Verification result
 */
export function verifyCompressedData(inputBuffer, metadata) {
  try {
    // Basic metadata validation
    validateMetadata(metadata);

    // Check if we can reconstruct the Huffman tree
    const freqTable = deserializeFrequencyTable(metadata.freqTable);
    const tree = buildHuffmanTree(freqTable);
    const codes = generateCodes(tree);
    const codesToByte = invertCodes(codes);

    // Quick verification by reading a small portion
    const bitReader = new BitReader(inputBuffer, metadata.paddingBits || 0);
    const maxTestBytes = Math.min(1000, metadata.originalSize || 1000);
    let decodedCount = 0;
    let currentCode = "";

    while (bitReader.hasMoreBits() && decodedCount < maxTestBytes) {
      const bit = bitReader.readBit();
      if (bit === null) break;

      currentCode += bit;

      if (codesToByte.has(currentCode)) {
        decodedCount++;
        currentCode = "";
      }

      // Prevent infinite loops
      if (currentCode.length > 64) {
        return {
          isValid: false,
          error:
            "Invalid or corrupted compressed data: code length exceeded maximum",
        };
      }
    }

    // Check if we have any remaining incomplete code
    if (currentCode.length > 0 && decodedCount < maxTestBytes) {
      return {
        isValid: false,
        error: "Invalid compressed data: incomplete code sequence found",
      };
    }

    return {
      isValid: true,
      testedBytes: decodedCount,
      message: `Successfully verified ${decodedCount} bytes of compressed data`,
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Verification failed: ${error.message}`,
    };
  }
}
