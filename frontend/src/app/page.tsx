"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '../components/global/file-uploader';
import AlgorithmSelector from '../components/global/algorithm-selector';
import { postCompression, postDecompression, fetchAlgorithms } from '../../utils/api';

interface ApiResult {
  fileName: string;
  stats: {
    originalSize: number;
    newSize: number;
    compressionRatio: number;
    timeMs: number;
  };
  compressedBase64?: string;
  decompressedBase64?: string;
  metadata?: any;
  mode?: 'compress' | 'decompress';
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [algorithms, setAlgorithms] = useState<{ id: string; desc: string }[]>([]);
  const [selectedAlgo, setSelectedAlgo] = useState<string>('');
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [loading, setLoading] = useState(false);
  const [savedResults, setSavedResults] = useState<ApiResult[]>([]);
  const [selectedMetadataFile, setSelectedMetadataFile] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchAlgorithms()
      .then((resp) => {
        setAlgorithms(resp.data);
        if (resp.data.length > 0) {
          setSelectedAlgo(resp.data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('compressionResults');
    if (stored) {
      const parsed: ApiResult[] = JSON.parse(stored);
      setSavedResults(parsed);
      if (parsed.length > 0) {
        setSelectedMetadataFile(parsed[0].fileName);
      }
    }
  }, [mode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !selectedAlgo) {
      return alert('Choose a file and algorithm.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('algorithm', selectedAlgo);

    if (mode === 'decompress') {
      const selected = savedResults.find((r) => r.fileName === selectedMetadataFile);
      if (!selected || !selected.metadata) {
        return alert('No metadata found for selected file.');
      }
      formData.append('metadata', JSON.stringify(selected.metadata));
    }

    setLoading(true);
    try {
      const data: ApiResult =
        mode === 'compress'
          ? await postCompression(formData)
          : await postDecompression(formData);

      const previousResults = JSON.parse(localStorage.getItem('compressionResults') || '[]');
      previousResults.push({ mode, ...data });
      localStorage.setItem('compressionResults', JSON.stringify(previousResults));

      router.push('/result');
    } catch (err) {
      console.error(err);
      alert('Error while processing. See console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-3xl font-semibold mb-6">Data Compression & Decompression Portal</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="mode"
              value="compress"
              checked={mode === 'compress'}
              onChange={() => setMode('compress')}
              className="form-radio"
            />
            <span className="ml-2">Compress</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              name="mode"
              value="decompress"
              checked={mode === 'decompress'}
              onChange={() => setMode('decompress')}
              className="form-radio"
            />
            <span className="ml-2">Decompress</span>
          </label>
        </div>

        <FileUploader onFileSelect={(f: any) => setFile(f)} />

        {algorithms.length > 0 && (
          <AlgorithmSelector
            algorithms={algorithms}
            selected={selectedAlgo}
            onChange={setSelectedAlgo}
          />
        )}

        {mode === 'decompress' && savedResults.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Metadata File:
            </label>
            <select
              value={selectedMetadataFile}
              onChange={(e) => setSelectedMetadataFile(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            >
              {savedResults
                .filter((r) => r.mode === 'compress' && r.metadata)
                .map((r) => (
                  <option key={r.fileName} value={r.fileName}>
                    {r.fileName}
                  </option>
                ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading
            ? 'Processing...'
            : mode === 'compress'
            ? 'Compress File'
            : 'Decompress File'}
        </button>
      </form>
    </div>
  );
}
