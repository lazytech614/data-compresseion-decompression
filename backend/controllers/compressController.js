import fs from "fs";
import path from "path";
import { performence } from "perf_hooks";

import { compress as huffmanCompress } from "../algorithms/huffman";
import { compress as rleCompress } from "../algorithms/rle";
import { compress as lz77Compress } from "../algorithms/lz77";

const statsCalculator = require("../utils/statsCalculator");

export default async function handleCompression(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const algorithm = req.body.algorithm; // e.g., "huffman", "rle", "lz77"
    const inputPath = req.file.path;
    const inputBuffer = fs.readFileSync(inputPath);
    const originalSize = inputBuffer.length;

    // Time measurement
    const start = performance.now();

    let result;
    switch (algorithm) {
      case "huffman":
        result = huffmanCompress(inputBuffer);
        break;
      case "rle":
        result = rleCompress(inputBuffer);
        break;
      case "lz77":
        result = lz77Compress(inputBuffer);
        break;
      default:
        return res.status(400).json({ error: "Unsupported algorithm." });
    }

    const end = performance.now();
    const timeTakenMs = end - start;

    // Write compressed file to disk (or you can skip writing and send as buffer)
    const compressedFilename = `${req.file.filename}_${algorithm}.bin`;
    const compressedPath = path.join(
      __dirname,
      "../uploads",
      compressedFilename
    );
    fs.writeFileSync(compressedPath, result.compressedBuffer);

    // Calculate stats
    const compressedSize = result.compressedBuffer.length;
    const stats = statsCalculator(originalSize, compressedSize, timeTakenMs);

    // Respond with JSON (stats + file URL). For simplicity, send base64 in response:
    const compressedBase64 = result.compressedBuffer.toString("base64");

    // Clean up original upload
    fs.unlinkSync(inputPath);

    return res.json({
      fileName: compressedFilename,
      compressedBase64,
      stats,
      metadata: result.metadata, // so client could request decompression if needed
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error during compression." });
  }
}
