import {
  buildFrequencyTable,
  buildHuffmanTree,
  generateCodes,
  invertCodes,
} from "../utils/huffmanUtils.js";

function compress(inputBuffer) {
  const inputString = inputBuffer.toString("utf-8");
  const freqTable = buildFrequencyTable(inputString);
  const tree = buildHuffmanTree(freqTable);
  const codes = generateCodes(tree);
  let bitString = "";
  for (const ch of inputString) {
    bitString += codes[ch];
  }
  const byteArray = [];
  for (let i = 0; i < bitString.length; i += 8) {
    const byte = bitString.substr(i, 8).padEnd(8, "0");
    byteArray.push(parseInt(byte, 2));
  }
  const compressedBuffer = Buffer.from(byteArray);
  const metadata = { freqTable }; // or serialize the tree
  return { compressedBuffer, metadata };
}

function decompress(inputBuffer, metadata) {
  const tree = buildHuffmanTree(metadata.freqTable);
  const codesToChar = invertCodes(generateCodes(tree));
  let bitString = "";
  for (const b of inputBuffer) {
    bitString += b.toString(2).padStart(8, "0");
  }
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
