"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Stats {
  originalSize: number;
  newSize: number;
  compressionRatio: number;
  timeMs: number;
}

interface StoredResult {
  mode: "compress" | "decompress";
  fileName: string;
  stats: Stats;
  compressedBase64?: string;
  decompressedBase64?: string;
  metadata?: any;
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<StoredResult | null>(null);

  useEffect(() => {
    try {
      const json = localStorage.getItem("compressionResults");
      if (!json) {
        router.replace("/");
        return;
      }
      const allResults: StoredResult[] = JSON.parse(json);
      const latestResult = allResults[allResults.length - 1];
      if (!latestResult) {
        router.replace("/");
        return;
      }
      setResult(latestResult);
      // Optionally clear it so reloading won't persist old data:
      // localStorage.removeItem("compressionResult");
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="p-8 text-center">
        <p>Loading results…</p>
      </div>
    );
  }

  const { mode, fileName, stats, compressedBase64, decompressedBase64 } = result;
  const payloadBase64 =
    mode === "compress" ? compressedBase64 : decompressedBase64;
  const downloadName = `${mode === "compress" ? "compressed" : "decompressed"}_${fileName}`;

  const handleDownload = () => {
    if (!payloadBase64) return;
    const link = document.createElement("a");
    link.href = `data:application/octet-stream;base64,${payloadBase64}`;
    link.download = downloadName;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 px-4 bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6">
        {mode === "compress" ? "Compression" : "Decompression"} Results
      </h2>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow mb-6">
        <table className="w-full text-left">
          <tbody>
            <tr>
              <td className="py-1">Original Size:</td>
              <td className="py-1 font-medium">{stats.originalSize} bytes</td>
            </tr>
            <tr>
              <td className="py-1">New Size:</td>
              <td className="py-1 font-medium">{stats.newSize} bytes</td>
            </tr>
            <tr>
              <td className="py-1">Compression Ratio:</td>
              <td className="py-1 font-medium">{stats.compressionRatio}</td>
            </tr>
            <tr>
              <td className="py-1">Time Taken:</td>
              <td className="py-1 font-medium">{stats.timeMs} ms</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        onClick={handleDownload}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Download {downloadName}
      </button>

      <button
        onClick={() => router.push("/")}
        className="mt-6 text-blue-600 underline"
      >
        &larr; Compress/Decompress Another File
      </button>
    </div>
  );
}
