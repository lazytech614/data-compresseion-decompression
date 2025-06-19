export const ALGORITHMS = [
  { id: 'huffman', name: 'Huffman Coding', desc: 'Lossless compression algorithm' },
  { id: 'lz77', name: 'LZ77', desc: 'Dictionary-based compression' },
  { id: 'lzw', name: 'LZW', desc: 'Lempel-Ziv-Welch algorithm' },
  { id: 'arithmetic', name: 'Arithmetic Coding', desc: 'Entropy encoding method' },
  { id: 'rle', name: 'Run-Length Encoding', desc: 'Simple lossless compression' }
];

export const ALGORITHM_DETAILS = [
  {
    name: 'Huffman Coding',
    type: 'Lossless',
    complexity: 'O(n log n)',
    bestFor: 'Text files, source code',
    description: 'Variable-length prefix coding based on character frequency',
    pros: ['Simple implementation', 'Good for text', 'Optimal for single symbols'],
    cons: ['Not adaptive', 'Requires two passes', 'Limited compression ratio'],
    learnMore: 'https://en.wikipedia.org/wiki/Huffman_coding'
  },
  {
    name: 'LZ77',
    type: 'Lossless',
    complexity: 'O(n²)',
    bestFor: 'General purpose, mixed content',
    description: 'Dictionary-based compression using sliding window',
    pros: ['Adaptive compression', 'Good general performance', 'Basis for many formats'],
    cons: ['Slower than Huffman', 'Memory intensive', 'Complex implementation'],
    learnMore: 'https://en.wikipedia.org/wiki/LZ77_and_LZ78'
  },
  {
    name: 'LZW (Lempel-Ziv-Welch)',
    type: 'Lossless',
    complexity: 'O(n)',
    bestFor: 'Images, general files',
    description: 'Dictionary-based compression with dynamic dictionary building',
    pros: ['Fast compression', 'Good for repetitive data', 'Single pass algorithm'],
    cons: ['Patent issues (expired)', 'Dictionary size limits', 'Not optimal for all data'],
    learnMore: 'https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Welch'
  },
  {
    name: 'Arithmetic Coding',
    type: 'Lossless',
    complexity: 'O(n)',
    bestFor: 'High compression ratio needs',
    description: 'Entropy encoding that approaches theoretical compression limits',
    pros: ['Excellent compression ratio', 'Adaptive', 'Handles any alphabet'],
    cons: ['Complex implementation', 'Slower processing', 'Precision requirements'],
    learnMore: 'https://en.wikipedia.org/wiki/Arithmetic_coding'
  },
  {
    name: 'Run-Length Encoding (RLE)',
    type: 'Lossless',
    complexity: 'O(n)',
    bestFor: 'Simple repetitive data (e.g., images, raw bitmaps)',
    description: 'Encodes consecutive repeated values as a single value and count',
    pros: ['Very simple', 'Fast', 'Effective for repetitive data'],
    cons: ['Inefficient for non-repetitive data', 'Limited compression', 'Not adaptive'],
    learnMore: 'https://en.wikipedia.org/wiki/Run-length_encoding'
  }
];
