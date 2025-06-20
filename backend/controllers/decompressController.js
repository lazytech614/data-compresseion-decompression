import fs from "fs";
import os from "os";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { performance } from "perf_hooks";

import { decompress as huffmanDecompress } from "../algorithms/huffman.js";
import { decompress as rleDecompress } from "../algorithms/rle.js";
import { decompress as lz77Decompress } from "../algorithms/lz77.js";
import { decompress as lzwDecompress } from "../algorithms/lzw.js";
import { decompress as arithmeticCodingDecompress } from "../algorithms/arithmeticCoding.js";

import { calculateStats } from "../utils/statsCalculator.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function handleDecompression(req, res) {
  try {
    if (!req.file) {
      console.log("🔴 No file uploaded");
      return res.status(400).json({ error: "No file uploaded." });
    }

    const algorithm = req.body.algorithm;
    let metadata = {};
    if (req.body.metadata) {
      try {
        metadata =
          typeof req.body.metadata === "string"
            ? JSON.parse(req.body.metadata)
            : req.body.metadata;
      } catch (e) {
        console.warn("Failed to parse metadata JSON:", e);
        metadata = {};
      }
    }

    // Read compressed file from disk
    const compressedBuffer = fs.readFileSync(req.file.path);
    const compressedSize = compressedBuffer.length;

    // Perform decompression
    const start = performance.now();

    // CPU usage measurment
    const startCPU = process.cpuUsage();

    //RAM usage
    const startMem = process.memoryUsage();

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
      case "lzw":
        result = lzwDecompress(compressedBuffer);
        break;
      case "arithmetic":
        result = arithmeticCodingDecompress(compressedBuffer, metadata);
        break;
      default:
        console.log("🔴 Unsupported algorithm");
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

    const decompressedBuffer = result.decompressedBuffer;
    const decompressedSize = decompressedBuffer.length;

    const originalFilename =
      req.file.originalname || req.file.filename || "file";
    const safeBaseName = path.parse(originalFilename).name.replace(/\W+/g, "_");
    const decompressedFilename = `${safeBaseName}_${algorithm}_decompressed.bin`;
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

    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn("Failed to delete temp compressed file:", e);
    }

    const responsePayload = {
      fileName: decompressedFilename,
      decompressedBase64,
      stats: {
        originalSize: compressedSize,
        newSize: decompressedSize,
        compressionRatio: stats.compressionRatio,
        timeMs: timeTakenMs,
        cpuPercent,
        memoryUsedBytes,
      },
      metadataUsed: metadata, // echo back the metadata used for decompression
      algorithm,
      success: true,
    };

    (async () => {
      // Build the DB record payload. Adjust field names to what your API expects.
      const jobRecord = {
        type: "decompress",
        algorithm,
        fileName: decompressedFilename,
        // originalSize in DB = compressed input size
        originalSize: compressedSize,
        // compressedSize in DB = decompressed size
        compressedSize: decompressedSize,
        // We store the computed ratio as compressionRatio (though >1 for decompress)
        compressionRatio: stats.compressionRatio,
        duration: timeTakenMs,
        // Include decompressedBase64 and maybe metadata in the record:
        compressedBase64: null, // for decompress job, we typically don't re-store compressedBase64
        decompressedBase64, // store decompressed base64 if desired
        metadata, // store the metadata used for decompress (e.g. Huffman freqTable)
        status: "COMPLETED",
      };

      try {
        const dbResponse = await fetch(
          `${process.env.FRONTEND_URL}/api/compression-jobs`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // add auth headers if needed
            },
            body: JSON.stringify(jobRecord),
          }
        );
        if (!dbResponse.ok) {
          const text = await dbResponse.text();
          console.warn("Failed to save decompression job to database:", text);
        }
      } catch (dbErr) {
        console.warn("Database save error for decompression job:", dbErr);
      }
    })();

    return res.json(responsePayload);
  } catch (err) {
    console.error("🔴🔴 Internal server error in decompression:", err);

    try {
      const algorithm = req.body.algorithm;
      const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};
      const originalFilename =
        req.file?.originalname || req.file?.filename || "unknown";
      const compressedBuffer = req.file ? fs.readFileSync(req.file.path) : null;
      const compressedSize = compressedBuffer ? compressedBuffer.length : 0;
      // Build minimal failed job
      const failedRecord = {
        type: "decompress",
        algorithm,
        fileName: originalFilename,
        originalSize: compressedSize,
        compressedSize: null,
        compressionRatio: null,
        duration: null,
        decompressedBase64: null,
        metadata,
        status: "FAILED",
        errorMessage: err.message,
      };
      // Fire-and-forget
      fetch(`${process.env.FRONTEND_URL}/api/compression-jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(failedRecord),
      }).catch((e) =>
        console.warn("Failed to save failed decompression job:", e)
      );
    } catch (e) {
      console.warn("Error recording failed decompression job:", e);
    }

    return res
      .status(500)
      .json({ error: "Server error during decompression." });
  }
}
