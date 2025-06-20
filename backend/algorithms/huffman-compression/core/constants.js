// Configuration constants
export const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB default
export const ABSOLUTE_MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB absolute maximum
export const MIN_CHUNK_SIZE = 4 * 1024; // 4KB minimum chunk size
export const MAX_CHUNK_SIZE = 1024 * 1024; // 1MB maximum chunk size

// Progress tracking constants
export const FREQUENCY_ANALYSIS_WEIGHT = 50; // 0-50% of progress
export const COMPRESSION_WEIGHT = 50; // 50-100% of progress
export const PROGRESS_UPDATE_INTERVAL = 10000; // Update every 10k bytes processed
