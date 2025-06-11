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
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [algorithms, setAlgorithms] = useState<{ id: string; desc: string }[]>([]);
  const [selectedAlgo, setSelectedAlgo] = useState<string>('');
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !selectedAlgo) {
      return alert('Choose a file and algorithm.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('algorithm', selectedAlgo);

    if (mode === 'decompress') {
      const stored = localStorage.getItem('compressionResult');
      if (!stored) {
        return alert('No metadata found in localStorage.');
      }
      const parsed = JSON.parse(stored);
      if (!parsed.metadata) {
        return alert('No metadata available in stored result.');
      }
      formData.append('metadata', JSON.stringify(parsed.metadata));
    }

    setLoading(true);
    try {
      const data: ApiResult =
        mode === 'compress'
          ? await postCompression(formData)
          : await postDecompression(formData);

      localStorage.setItem('compressionResult', JSON.stringify({ 
        mode, 
        ...data 
      }));

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
