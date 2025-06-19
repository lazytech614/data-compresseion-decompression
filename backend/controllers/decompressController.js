// decompress controller: handleDecompression.js

import fs from "fs";
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
    // For Huffman, we also need metadata (freq table). Suppose client sends metadata in body:
    // It may come as JSON string or object:
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
      case "arithmetic-coding":
        result = arithmeticCodingDecompress(compressedBuffer, metadata);
        break;
      default:
        console.log("🔴 Unsupported algorithm");
        return res.status(400).json({ error: "Unsupported algorithm." });
    }
    const end = performance.now();
    const timeTakenMs = end - start;

    // result should contain decompressedBuffer; adjust if your decompress returns differently
    const decompressedBuffer = result.decompressedBuffer;
    const decompressedSize = decompressedBuffer.length;

    // Write decompressed file to disk (optional; you may stream instead)
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

    // Compute stats.
    // Note: calculateStats(originalSize, newSize, timeMs, true) in your code for decompress:
    // Your calculateStats signature: (decompressedSize, compressedSize, timeTakenMs, true)
    // Let's call:
    const stats = calculateStats(
      decompressedSize,
      compressedSize,
      timeTakenMs,
      true
    );
    // Assume stats.compressionRatio is meaningful (e.g., decompressedSize / compressedSize).

    // Convert decompressed to base64 if you need to return it:
    const decompressedBase64 = decompressedBuffer.toString("base64");

    // Clean up compressed file if desired
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn("Failed to delete temp compressed file:", e);
    }

    // Prepare response to client
    const responsePayload = {
      fileName: decompressedFilename,
      decompressedBase64,
      stats: {
        originalSize: compressedSize,
        newSize: decompressedSize,
        compressionRatio: stats.compressionRatio,
        timeMs: timeTakenMs,
      },
      metadataUsed: metadata, // echo back the metadata used for decompression
      algorithm,
      success: true,
    };

    // Asynchronously save job to DB via your frontend API
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

    // Finally, send response to client
    return res.json(responsePayload);
  } catch (err) {
    console.error("🔴🔴 Internal server error in decompression:", err);

    // Optionally: try to record a FAILED decompression job
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
