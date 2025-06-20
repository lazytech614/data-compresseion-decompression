class Node {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

// 1. Build frequency table { char: count }
export function buildFrequencyTable(input) {
  const freq = {};
  for (const ch of input) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq;
}

function buildFrequencyTableStreamingWithProgress(
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

// 2. Build Huffman tree from freqTable
export function buildHuffmanTree(freqTable) {
  // create a leaf node for each character
  const nodes = Object.entries(freqTable).map(
    ([ch, count]) => new Node(ch, count)
  );

  // helper to sort by frequency ascending
  const sortNodes = () => nodes.sort((a, b) => a.freq - b.freq);

  while (nodes.length > 1) {
    sortNodes();
    const left = nodes.shift();
    const right = nodes.shift();
    // merge lowest-freq two nodes
    const parent = new Node(null, left.freq + right.freq, left, right);
    nodes.push(parent);
  }

  // only one tree remains
  return nodes[0];
}

// 3. Generate codebook { char: bitString }
export function generateCodes(tree) {
  const codes = {};
  const traverse = (node, prefix) => {
    if (!node) return;
    if (node.char !== null) {
      // leaf
      codes[node.char] = prefix || "0"; // single‐char edge case
    } else {
      traverse(node.left, prefix + "0");
      traverse(node.right, prefix + "1");
    }
  };

  traverse(tree, "");
  return codes;
}

// 4. Invert codebook to { bitString: char }
export function invertCodes(codes) {
  const inverted = {};
  for (const [ch, bitStr] of Object.entries(codes)) {
    inverted[bitStr] = ch;
  }
  return inverted;
}

// Streaming frequency table builder
function buildFrequencyTableStreaming(inputBuffer, chunkSize = 64 * 1024) {
  const freqTable = new Map();

  for (let i = 0; i < inputBuffer.length; i += chunkSize) {
    const chunk = inputBuffer.subarray(i, i + chunkSize);

    for (const byte of chunk) {
      freqTable.set(byte, (freqTable.get(byte) || 0) + 1);
    }
  }

  return freqTable;
}
