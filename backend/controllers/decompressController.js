import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { performance } from "perf_hooks";

import { decompress as huffmanDecompress } from "../algorithms/huffman.js";
import { decompress as rleDecompress } from "../algorithms/rle.js";
import { decompress as lz77Decompress } from "../algorithms/lz77.js";

import { calculateStats } from "../utils/statsCalculator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function handleDecompression(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const algorithm = req.body.algorithm;
    // For Huffman, we also need metadata (freq table). Suppose client sends metadata in body:
    const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};

    const compressedBuffer = fs.readFileSync(req.file.path);
    const compressedSize = compressedBuffer.length;

    const start = performance.now();
    let result;
    switch (algorithm) {
      case "huffman":
        result = huffmanDecompress(compressedBuffer, metadata);
        break;
      case "rle":
        result = rleDecompress(compressedBuffer);
        break;
      case "lz77":
        result = lz77Decompress(compressedBuffer);
        break;
      default:
        return res.status(400).json({ error: "Unsupported algorithm." });
    }
    const end = performance.now();
    const timeTakenMs = end - start;

    const decompressedBuffer = result.decompressedBuffer;
    const decompressedSize = decompressedBuffer.length;

    // Write decompressed file
    const decompressedFilename = `${req.file.filename}_${algorithm}_decompressed.bin`;
    const decompressedPath = path.join(
      __dirname,
      "../uploads",
      decompressedFilename
    );
    fs.writeFileSync(decompressedPath, decompressedBuffer);

    const stats = calculateStats(
      decompressedSize,
      compressedSize,
      timeTakenMs,
      true
    );

    const decompressedBase64 = decompressedBuffer.toString("base64");
    fs.unlinkSync(req.file.path); // remove compressed file

    return res.json({
      fileName: decompressedFilename,
      decompressedBase64,
      stats,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Server error during decompression." });
  }
}
