"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import StatsDisplay from '../../components/global/stats-display';
import DownloadButton from '../../components/global/download-button';

export default function Result() {
  const router = useRouter();
  const params = useSearchParams();

  // read each param as a string (or null)
  const mode = params.get('mode') ?? '';
  const algorithm = params.get('algorithm') ?? '';
  const fileName = params.get('fileName') ?? '';
  const statsParam = params.get('stats') ?? '';
  const base64 = params.get('base64') ?? '';
  const metadata = params.get('metadata') ?? '';

  const [parsedStats, setParsedStats] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (statsParam) {
      try {
        setParsedStats(JSON.parse(statsParam));
      } catch (e) {
        console.error('Failed to parse stats JSON:', e);
      }
    }
  }, [statsParam]);

  if (!parsedStats || !base64) {
    return <p className="text-center p-8">Loading results...</p>;
  }

  const downloadFileName = `${mode === 'compress' ? 'compressed' : 'decompressed'}_${fileName}`;

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 px-4 bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6">
        {mode === 'compress' ? 'Compression' : 'Decompression'} Results
      </h2>

      <StatsDisplay stats={parsedStats} />

      <DownloadButton
        base64={base64}
        fileName={downloadFileName}
      />

      <div className="mt-8">
        <button
          className="text-blue-600 underline"
          onClick={() => router.push('/')}
        >
          &larr; Compress/Decompress Another File
        </button>
      </div>
    </div>
  );
}
