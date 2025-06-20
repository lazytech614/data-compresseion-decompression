export const LZ77_CONSTANTS = {
  WINDOW_SIZE: 4096, // Search window size
  LOOKAHEAD_SIZE: 18, // Look-ahead buffer size
  MIN_MATCH_LENGTH: 3, // Minimum match length
  MAX_MATCH_LENGTH: 18, // Maximum match length
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB limit
  CHUNK_SIZE: 64 * 1024, // 64KB chunks for processing
};
