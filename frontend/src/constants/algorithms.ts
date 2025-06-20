export const ALGORITHMS = [
  { id: 'huffman', name: 'Huffman Coding', desc: 'Lossless compression algorithm' },
  { id: 'lz77', name: 'LZ77', desc: 'Dictionary-based compression' },
  { id: 'lzw', name: 'LZW', desc: 'Lempel-Ziv-Welch algorithm' },
  { id: 'rle', name: 'Run-Length Encoding', desc: 'Simple lossless compression' }
];

export const ALGORITHM_DETAILS = [
  {
    name: 'Huffman Coding',
    type: 'Lossless',
    complexity: 'O(n log n)',
    bestFor: 'Text files, source code',
    description: 'Variable-length prefix coding based on character frequency. Creates optimal binary trees where frequent characters get shorter codes.',
    pros: ['Simple implementation', 'Optimal for single symbols', 'Good for text compression', 'Widely supported'],
    cons: ['Not adaptive', 'Requires two passes', 'Limited compression ratio', 'Poor for binary data'],
    learnMore: 'https://en.wikipedia.org/wiki/Huffman_coding',
    category: 'Statistical',
    icon: '📊',
    compressionRatio: '20-60%',
    realWorldUse: ['JPEG (for metadata)', 'ZIP files', 'MP3 compression']
  },
  {
    name: 'LZ77',
    type: 'Lossless',
    complexity: 'O(n²)',
    bestFor: 'General purpose, mixed content',
    description: 'Dictionary-based compression using sliding window to find repeated sequences and replace them with references.',
    pros: ['Adaptive compression', 'Good general performance', 'Basis for many formats', 'Single pass decoding'],
    cons: ['Slower than Huffman', 'Memory intensive', 'Complex implementation', 'Variable compression speed'],
    learnMore: 'https://en.wikipedia.org/wiki/LZ77_and_LZ78',
    category: 'Dictionary',
    icon: '📚',
    compressionRatio: '30-80%',
    realWorldUse: ['DEFLATE (ZIP, PNG)', 'LZO', '7-Zip']
  },
  {
    name: 'LZW (Lempel-Ziv-Welch)',
    type: 'Lossless',
    complexity: 'O(n)',
    bestFor: 'Images, general files',
    description: 'Dictionary-based compression with dynamic dictionary building. Builds dictionary on-the-fly during compression.',
    pros: ['Fast compression', 'Good for repetitive data', 'Single pass algorithm', 'Adaptive dictionary'],
    cons: ['Patent issues (expired)', 'Dictionary size limits', 'Not optimal for all data', 'Dictionary reset needed'],
    learnMore: 'https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Welch',
    category: 'Dictionary',
    icon: '🔤',
    compressionRatio: '25-75%',
    realWorldUse: ['GIF images', 'TIFF files', 'PostScript']
  },
  {
    name: 'Run-Length Encoding (RLE)',
    type: 'Lossless',
    complexity: 'O(n)',
    bestFor: 'Simple repetitive data',
    description: 'Encodes consecutive repeated values as a single value and count. Most effective on data with long runs of identical values.',
    pros: ['Very simple', 'Fast', 'Effective for repetitive data', 'Low memory usage'],
    cons: ['Inefficient for non-repetitive data', 'Limited compression', 'Not adaptive', 'Can increase file size'],
    learnMore: 'https://en.wikipedia.org/wiki/Run-length_encoding',
    category: 'Basic',
    icon: '🔁',
    compressionRatio: '10-90%',
    realWorldUse: ['BMP images', 'Fax transmission', 'Simple graphics']
  },
  {
    name: 'DEFLATE',
    type: 'Lossless',
    complexity: 'O(n log n)',
    bestFor: 'General purpose compression',
    description: 'Combines LZ77 with Huffman coding. Uses sliding window for duplicates, then Huffman codes the result.',
    pros: ['Excellent compression ratio', 'Widely supported', 'Good balance of speed/size', 'Patent-free'],
    cons: ['More complex than individual methods', 'Two-stage process', 'Memory intensive', 'Slower compression'],
    learnMore: 'https://en.wikipedia.org/wiki/DEFLATE',
    category: 'Hybrid',
    icon: '🎯',
    compressionRatio: '40-90%',
    realWorldUse: ['ZIP files', 'PNG images', 'HTTP compression']
  },
  {
    name: 'Arithmetic Coding',
    type: 'Lossless',
    complexity: 'O(n)',
    bestFor: 'High compression ratio needs',
    description: 'Encodes entire message as a single fractional number. Can achieve compression ratios closer to theoretical limits.',
    pros: ['Near-optimal compression', 'Adaptive', 'Good for any data type', 'High compression ratios'],
    cons: ['Complex implementation', 'Patent restrictions', 'Precision requirements', 'Slower than alternatives'],
    learnMore: 'https://en.wikipedia.org/wiki/Arithmetic_coding',
    category: 'Statistical',
    icon: '🔢',
    compressionRatio: '50-95%',
    realWorldUse: ['JBIG', 'Context-based compression', 'Some video codecs']
  },
  {
    name: 'JPEG',
    type: 'Lossy',
    complexity: 'O(n log n)',
    bestFor: 'Photographic images',
    description: 'DCT-based compression that removes visually redundant information. Uses quantization to achieve high compression.',
    pros: ['Excellent for photos', 'Adjustable quality', 'Small file sizes', 'Universal support'],
    cons: ['Lossy compression', 'Artifacts in graphics', 'Not suitable for text', 'Generation loss'],
    learnMore: 'https://en.wikipedia.org/wiki/JPEG',
    category: 'Transform',
    icon: '📸',
    compressionRatio: '90-99%',
    realWorldUse: ['Digital photography', 'Web images', 'Social media']
  },
  {
    name: 'MP3 (MPEG-1 Audio Layer 3)',
    type: 'Lossy',
    complexity: 'O(n log n)',
    bestFor: 'Audio compression',
    description: 'Psychoacoustic model removes sounds humans cannot perceive. Uses modified DCT and Huffman coding.',
    pros: ['Great audio quality', 'Small file sizes', 'Universal support', 'Streaming friendly'],
    cons: ['Lossy compression', 'Generation loss', 'Not ideal for editing', 'Patent issues (expired)'],
    learnMore: 'https://en.wikipedia.org/wiki/MP3',
    category: 'Perceptual',
    icon: '🎵',
    compressionRatio: '85-95%',
    realWorldUse: ['Music streaming', 'Digital audio', 'Podcasts']
  },
  {
    name: 'H.264/AVC',
    type: 'Lossy',
    complexity: 'O(n²)',
    bestFor: 'Video compression',
    description: 'Advanced video codec using motion compensation, transform coding, and entropy coding for efficient video compression.',
    pros: ['Excellent video quality', 'Hardware support', 'Streaming optimized', 'Widely adopted'],
    cons: ['Complex implementation', 'Patent licensing', 'High computational cost', 'Lossy compression'],
    learnMore: 'https://en.wikipedia.org/wiki/Advanced_Video_Coding',
    category: 'Video',
    icon: '🎬',
    compressionRatio: '95-99%',
    realWorldUse: ['YouTube', 'Blu-ray', 'Video streaming', 'Mobile video']
  },
  {
    name: 'Brotli',
    type: 'Lossless',
    complexity: 'O(n)',
    bestFor: 'Web compression',
    description: 'Modern compression algorithm by Google. Uses dictionary of common words and LZ77-style matching.',
    pros: ['Better than gzip', 'Fast decompression', 'Good for web content', 'Built-in dictionaries'],
    cons: ['Slower compression', 'Less universal support', 'More memory usage', 'Newer standard'],
    learnMore: 'https://en.wikipedia.org/wiki/Brotli',
    category: 'Modern',
    icon: '🌐',
    compressionRatio: '15-25% better than gzip',
    realWorldUse: ['Web compression', 'CDNs', 'WOFF2 fonts']
  }
];

export const CATEGORIES = ['All', 'Statistical', 'Dictionary', 'Basic', 'Hybrid', 'Transform', 'Perceptual', 'Video', 'Modern'];

