"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '../components/global/file-uploader';
import AlgorithmSelector from '../components/global/algorithm-selector';
import { postCompression, postDecompression, fetchAlgorithms } from '../../utils/api';

export default function Home() {
  const [file, setFile] = useState(null);
  const [algorithms, setAlgorithms] = useState([]);
  const [selectedAlgo, setSelectedAlgo] = useState('');
  const [mode, setMode] = useState('compress'); // or "decompress"
  const [metadataInput, setMetadataInput] = useState(''); // for Huffman metadata (stringified JSON)
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch algorithm list (with descriptions)
    fetchAlgorithms()
      .then((list) => {
        setAlgorithms(list);
        if (list.length > 0) setSelectedAlgo(list[0].id);
      })
      .catch((err) => console.error(err));
  }, []);

  //TODO: update the type
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file || !selectedAlgo) return alert('Choose a file and algorithm.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('algorithm', selectedAlgo);
    if (mode === 'decompress' && metadataInput) {
      formData.append('metadata', metadataInput);
    }

    setLoading(true);
    try {
      let data;
      if (mode === 'compress') {
        data = await postCompression(formData);
      } else {
        data = await postDecompression(formData);
      }
      setLoading(false);

      const params = new URLSearchParams({
        mode,
        algorithm: selectedAlgo,
        fileName: data.fileName,
        stats: JSON.stringify(data.stats),
        base64: data[
          mode === 'compress' ? 'compressedBase64' : 'decompressedBase64'
        ],
        metadata: data.metadata ? JSON.stringify(data.metadata) : '',
      });

      // Navigate to result page, passing data as query or via state
      router.push(`/result?${params.toString()}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Error while processing. See console.');
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
              className="form-radio"
              name="mode"
              value="compress"
              checked={mode === 'compress'}
              onChange={() => setMode('compress')}
            />
            <span className="ml-2">Compress</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              className="form-radio"
              name="mode"
              value="decompress"
              checked={mode === 'decompress'}
              onChange={() => setMode('decompress')}
            />
            <span className="ml-2">Decompress</span>
          </label>
        </div>

        {/* TODO: update the type */}
        <FileUploader onFileSelect={(f: any) => setFile(f)} />

        <AlgorithmSelector
          algorithms={algorithms}
          selected={selectedAlgo}
          onChange={setSelectedAlgo}
        />

        {mode === 'decompress' && selectedAlgo === 'huffman' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Huffman Metadata (JSON):
            </label>
            <textarea
              className="w-full border border-gray-300 rounded px-2 py-1"
              rows={3}
              value={metadataInput}
              onChange={(e) => setMetadataInput(e.target.value)}
              placeholder='eg: {"freqTable": {"a":5,"b":3,…}}'
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Processing...' : mode === 'compress' ? 'Compress File' : 'Decompress File'}
        </button>
      </form>
    </div>
  );
}
