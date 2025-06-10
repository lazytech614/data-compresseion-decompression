import {
  buildFrequencyTable,
  buildHuffmanTree,
  generateCodes,
} from "./huffmanUtils.js";

function compress(inputBuffer) {
  // 1. Convert buffer to string or array of bytes
  const inputString = inputBuffer.toString("utf-8");
  // 2. Build frequency table
  const freqTable = buildFrequencyTable(inputString);
  // 3. Build Huffman tree
  const tree = buildHuffmanTree(freqTable);
  // 4. Generate binary codes
  const codes = generateCodes(tree);
  // 5. Encode input
  let bitString = "";
  for (const ch of inputString) {
    bitString += codes[ch];
  }
  // 6. Convert bitString to actual Buffer (8‐bit chunks; pad the last byte)
  const byteArray = [];
  for (let i = 0; i < bitString.length; i += 8) {
    const byte = bitString.substr(i, 8).padEnd(8, "0");
    byteArray.push(parseInt(byte, 2));
  }
  const compressedBuffer = Buffer.from(byteArray);
  // 7. Metadata (e.g. frequency table or serialized tree) to allow decompression
  const metadata = { freqTable }; // or serialize the tree
  return { compressedBuffer, metadata };
}

function decompress(inputBuffer, metadata) {
  // Reconstruct Huffman tree from metadata.freqTable
  const tree = buildHuffmanTree(metadata.freqTable);
  const codesToChar = invertCodes(generateCodes(tree));
  // Convert inputBuffer to bitString
  let bitString = "";
  for (const b of inputBuffer) {
    bitString += b.toString(2).padStart(8, "0");
  }
  // Traverse bitString to decode characters
  let decoded = "";
  let current = "";
  for (const bit of bitString) {
    current += bit;
    if (codesToChar[current]) {
      decoded += codesToChar[current];
      current = "";
    }
  }
  return { decompressedBuffer: Buffer.from(decoded, "utf-8") };
}

export { compress, decompress };
