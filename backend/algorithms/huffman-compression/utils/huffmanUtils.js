class Node {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

// 1. Build frequency table { byte: count } - returns Map for consistency
export function buildFrequencyTable(input) {
  const freq = new Map();
  for (const byte of input) {
    freq.set(byte, (freq.get(byte) || 0) + 1);
  }
  return freq;
}

// Streaming frequency table builder with progress callback
export function buildFrequencyTableStreamingWithProgress(
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

// 2. Build Huffman tree from freqTable (handles both Map and Object)
export function buildHuffmanTree(freqTable) {
  // Convert Map to array of entries, or Object to array of entries
  let entries;
  if (freqTable instanceof Map) {
    entries = Array.from(freqTable.entries());
  } else {
    entries = Object.entries(freqTable).map(([key, value]) => [
      parseInt(key),
      value,
    ]);
  }

  // Create a leaf node for each byte/character
  const nodes = entries.map(([byte, count]) => new Node(byte, count));

  // Handle single character case
  if (nodes.length === 1) {
    // Create a dummy root with the single node as left child
    return new Node(null, nodes[0].freq, nodes[0], null);
  }

  // Helper to sort by frequency ascending
  const sortNodes = () => nodes.sort((a, b) => a.freq - b.freq);

  while (nodes.length > 1) {
    sortNodes();
    const left = nodes.shift();
    const right = nodes.shift();
    // Merge lowest-freq two nodes
    const parent = new Node(null, left.freq + right.freq, left, right);
    nodes.push(parent);
  }

  // Only one tree remains
  return nodes[0];
}

// 3. Generate codebook - returns Map for consistency
export function generateCodes(tree) {
  const codes = new Map();

  const traverse = (node, prefix) => {
    if (!node) return;

    if (node.char !== null) {
      // Leaf node
      codes.set(node.char, prefix || "0"); // Handle single-char edge case
    } else {
      // Internal node
      if (node.left) traverse(node.left, prefix + "0");
      if (node.right) traverse(node.right, prefix + "1");
    }
  };

  traverse(tree, "");
  return codes;
}

// 4. Invert codebook to Map { bitString: byte }
export function invertCodes(codes) {
  const inverted = new Map();

  if (codes instanceof Map) {
    for (const [byte, bitStr] of codes.entries()) {
      inverted.set(bitStr, byte);
    }
  } else {
    // Handle object format
    for (const [byte, bitStr] of Object.entries(codes)) {
      inverted.set(bitStr, parseInt(byte));
    }
  }

  return inverted;
}

// Streaming frequency table builder (without progress)
export function buildFrequencyTableStreaming(
  inputBuffer,
  chunkSize = 64 * 1024
) {
  const freqTable = new Map();

  for (let i = 0; i < inputBuffer.length; i += chunkSize) {
    const chunk = inputBuffer.subarray(i, i + chunkSize);

    for (const byte of chunk) {
      freqTable.set(byte, (freqTable.get(byte) || 0) + 1);
    }
  }

  return freqTable;
}

// Helper function to convert between Map and Object for serialization
export function mapToObject(map) {
  const obj = {};
  for (const [key, value] of map.entries()) {
    obj[key] = value;
  }
  return obj;
}

export function objectToMap(obj) {
  const map = new Map();
  for (const [key, value] of Object.entries(obj)) {
    map.set(parseInt(key), value);
  }
  return map;
}

// Debug helper to inspect data structures
export function debugHuffmanStructures(freqTable, tree, codes) {
  console.log("=== Huffman Debug Info ===");

  console.log("Frequency Table:");
  if (freqTable instanceof Map) {
    console.log("- Type: Map");
    console.log("- Size:", freqTable.size);
    console.log(
      "- Sample entries:",
      Array.from(freqTable.entries()).slice(0, 5)
    );
  } else {
    console.log("- Type: Object");
    console.log("- Keys:", Object.keys(freqTable).slice(0, 5));
  }

  console.log("Tree:");
  console.log("- Root exists:", !!tree);
  console.log("- Root freq:", tree?.freq);
  console.log("- Is leaf:", tree?.char !== null);

  console.log("Codes:");
  if (codes instanceof Map) {
    console.log("- Type: Map");
    console.log("- Size:", codes.size);
    console.log("- Sample entries:", Array.from(codes.entries()).slice(0, 5));
  } else {
    console.log("- Type: Object");
    console.log("- Keys:", Object.keys(codes).slice(0, 5));
  }

  console.log("========================");
}
