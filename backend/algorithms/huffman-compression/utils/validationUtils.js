import {
  DEFAULT_MAX_FILE_SIZE,
  ABSOLUTE_MAX_FILE_SIZE,
} from "../core/constants.js";
import { formatBytes } from "./fileUtils.js";

export function validateFileSize(buffer, maxSize = DEFAULT_MAX_FILE_SIZE) {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Input must be a Buffer");
  }

  if (buffer.length === 0) {
    throw new Error("Input buffer is empty");
  }

  if (buffer.length > ABSOLUTE_MAX_FILE_SIZE) {
    throw new Error(
      `File size ${formatBytes(
        buffer.length
      )} exceeds absolute maximum of ${formatBytes(ABSOLUTE_MAX_FILE_SIZE)}`
    );
  }

  if (buffer.length > maxSize) {
    throw new Error(
      `File size ${formatBytes(
        buffer.length
      )} exceeds specified maximum of ${formatBytes(maxSize)}`
    );
  }

  return true;
}

export function validateCompressionOptions(options = {}) {
  const validated = {
    maxFileSize: DEFAULT_MAX_FILE_SIZE,
    enableProgressCallback: false,
    progressCallback: null,
    enableMetrics: false,
    ...options,
  };

  // Validate maxFileSize
  if (typeof validated.maxFileSize !== "number" || validated.maxFileSize <= 0) {
    throw new Error("maxFileSize must be a positive number");
  }

  if (validated.maxFileSize > ABSOLUTE_MAX_FILE_SIZE) {
    throw new Error(
      `maxFileSize ${formatBytes(
        validated.maxFileSize
      )} exceeds absolute maximum of ${formatBytes(ABSOLUTE_MAX_FILE_SIZE)}`
    );
  }

  // Validate progress callback
  if (
    validated.enableProgressCallback &&
    typeof validated.progressCallback !== "function"
  ) {
    throw new Error(
      "progressCallback must be a function when enableProgressCallback is true"
    );
  }

  // Validate boolean options
  if (typeof validated.enableProgressCallback !== "boolean") {
    validated.enableProgressCallback = false;
  }

  if (typeof validated.enableMetrics !== "boolean") {
    validated.enableMetrics = false;
  }

  return validated;
}

export function validateDecompressionOptions(options = {}) {
  const validated = {
    maxFileSize: DEFAULT_MAX_FILE_SIZE,
    enableProgressCallback: false,
    progressCallback: null,
    ...options,
  };

  // Validate maxFileSize
  if (typeof validated.maxFileSize !== "number" || validated.maxFileSize <= 0) {
    throw new Error("maxFileSize must be a positive number");
  }

  if (validated.maxFileSize > ABSOLUTE_MAX_FILE_SIZE) {
    throw new Error(
      `maxFileSize ${formatBytes(
        validated.maxFileSize
      )} exceeds absolute maximum of ${formatBytes(ABSOLUTE_MAX_FILE_SIZE)}`
    );
  }

  // Validate progress callback
  if (
    validated.enableProgressCallback &&
    typeof validated.progressCallback !== "function"
  ) {
    throw new Error(
      "progressCallback must be a function when enableProgressCallback is true"
    );
  }

  return validated;
}

export function validateMetadata(metadata) {
  if (!metadata || typeof metadata !== "object") {
    throw new Error("Metadata must be an object");
  }

  if (!metadata.freqTable || typeof metadata.freqTable !== "object") {
    throw new Error("Metadata must contain a valid frequency table");
  }

  if (
    typeof metadata.paddingBits !== "number" ||
    metadata.paddingBits < 0 ||
    metadata.paddingBits > 7
  ) {
    throw new Error("Metadata must contain valid paddingBits (0-7)");
  }

  if (typeof metadata.originalSize !== "number" || metadata.originalSize < 0) {
    throw new Error("Metadata must contain valid originalSize");
  }

  // Validate frequency table entries
  for (const [byte, freq] of Object.entries(metadata.freqTable)) {
    const byteValue = parseInt(byte);
    if (isNaN(byteValue) || byteValue < 0 || byteValue > 255) {
      throw new Error(`Invalid byte value in frequency table: ${byte}`);
    }

    if (typeof freq !== "number" || freq <= 0) {
      throw new Error(`Invalid frequency value for byte ${byte}: ${freq}`);
    }
  }

  return true;
}

export function validateExpectedOutputSize(expectedSize, maxSize) {
  if (expectedSize > ABSOLUTE_MAX_FILE_SIZE) {
    throw new Error(
      `Expected output size ${formatBytes(
        expectedSize
      )} exceeds absolute maximum of ${formatBytes(ABSOLUTE_MAX_FILE_SIZE)}`
    );
  }

  if (expectedSize > maxSize) {
    throw new Error(
      `Expected output size ${formatBytes(
        expectedSize
      )} exceeds specified maximum of ${formatBytes(maxSize)}`
    );
  }

  return true;
}
