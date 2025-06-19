export function calculateStats(
  originalSize,
  newSize,
  timeMs,
  reversed = false
) {
  // reversed = true for decompression (newSize = compressed size; originalSize = decompressed size)
  const ratio = reversed
    ? (originalSize / newSize).toFixed(3) // compressed/original
    : (originalSize / newSize).toFixed(3); // compressed/original
  return {
    originalSize, // bytes
    newSize, // bytes
    compressionRatio: parseFloat(ratio),
    timeMs: Math.round(timeMs),
  };
}
