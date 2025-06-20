import fs from "fs";
import os from "os";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { compress as huffmanCompress } from "../algorithms/huffman.js";
import { compress as rleCompress } from "../algorithms/rle.js";
import { compress as lz77Compress } from "../algorithms/lz77.js";
import { compress as lzwCompress } from "../algorithms/lzw.js";
import { compress as arithmeticCodingCompress } from "../algorithms/arithmeticCoding.js";

import { calculateStats } from "../utils/statsCalculator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

export default async function handleCompression(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    const algorithm = req.body.algorithm;
    const inputPath = req.file.path;
    const inputBuffer = fs.readFileSync(inputPath);
    const originalSize = inputBuffer.length;

    // Time measurement
    const start = performance.now();

    // CPU usage measurment
    const startCPU = process.cpuUsage();

    //RAM usage
    const startMem = process.memoryUsage();

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
      case "lzw":
        result = lzwCompress(inputBuffer);
        break;
      case "arithmetic":
        result = arithmeticCodingCompress(inputBuffer);
        break;
      default:
        return res.status(400).json({ error: "Unsupported algorithm." });
    }

    const end = performance.now();
    const timeTakenMs = end - start;

    const deltaCPU = process.cpuUsage(startCPU);
    const cpuSec = (deltaCPU.user + deltaCPU.system) / 1e6; // convert μs → s
    const elapsedSec = timeTakenMs / 1000;
    const numCores = os.cpus().length;
    const cpuPercent = ((cpuSec / elapsedSec) * 100) / numCores;

    const endMem = process.memoryUsage();
    const memoryUsedBytes = endMem.heapUsed - startMem.heapUsed;

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
    const stats = calculateStats(originalSize, compressedSize, timeTakenMs);

    // Respond with JSON (stats + file URL). For simplicity, send base64 in response:
    const compressedBase64 = result.compressedBuffer.toString("base64");

    // Clean up original upload
    fs.unlinkSync(inputPath);

    const response = {
      fileName: compressedFilename,
      compressedBase64,
      stats: {
        originalSize,
        newSize: compressedSize,
        compressionRatio: stats.compressionRatio,
        timeMs: timeTakenMs,
        cpuPercent,
        memoryUsedBytes,
      },
      metadata: result.metadata,
      algorithm,
      success: true,
    };

    try {
      const dbResponse = await fetch(
        `${process.env.FRONTEND_URL}/api/compression-jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add authentication headers if needed
          },
          body: JSON.stringify({
            type: "compress",
            algorithm,
            fileName: compressedFilename,
            originalSize,
            compressedSize,
            compressionRatio: stats.compressionRatio,
            duration: timeTakenMs,
            compressedBase64,
            metadata: result.metadata,
            cpuPercent,
            memoryUsedBytes,
            status: "COMPLETED",
          }),
        }
      );

      if (!dbResponse.ok) {
        console.warn(
          "Failed to save job to database:",
          await dbResponse.text()
        );
      }
    } catch (dbError) {
      console.warn("Database save error:", dbError);
      // Don't fail the compression if database save fails
    }

    return res.json(response);
  } catch (err) {
    console.error("Compression error:", err);
    const errorMessage =
      err.message || err.toString() || "Unknown error occurred";
    try {
      await fetch(`${process.env.FRONTEND_URL}/api/compression-jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "compress",
          algorithm: req.body.algorithm,
          fileName: req.file?.originalname || "unknown",
          originalSize: req.file?.size || 0,
          status: "FAILED",
          errorMessage: err.message,
        }),
      });
    } catch (dbError) {
      console.warn("Failed to save error to database:", dbError);
    }

    return res.status(500).json({
      error: errorMessage,
      success: false,
      details: {
        algorithm: req.body.algorithm,
        fileName: req.file?.originalname || "unknown",
        timestamp: new Date().toISOString(),
      },
    });
  }
}
