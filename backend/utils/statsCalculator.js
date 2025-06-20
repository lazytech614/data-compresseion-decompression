export function calculateStats(
  originalSize,
  newSize,
  timeMs,
  reversed = false
) {
  const ratio = reversed
    ? (newSize / originalSize).toFixed(3)
    : (originalSize / newSize).toFixed(3);
  return {
    originalSize,
    newSize,
    compressionRatio: parseFloat(ratio),
    timeMs: Math.round(timeMs),
  };
}
