import { useState, useEffect } from 'react';
import { ALGORITHMS } from '@/constants/algorithms';

export const useCompressionForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [algorithms] = useState(ALGORITHMS);
  const [selectedAlgo, setSelectedAlgo] = useState<string>('huffman');
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  // Clear file selection when switching to decompress mode
  useEffect(() => {
    if (mode === 'decompress') {
      setFile(null);
      setSelectedJobId('');
    }
  }, [mode]);

  const isFormValid = () => {
    if (mode === 'compress') {
      return !!file && !!selectedAlgo;
    } else {
      return !!selectedJobId && !!selectedAlgo;
    }
  };

  return {
    file,
    setFile,
    algorithms,
    selectedAlgo,
    setSelectedAlgo,
    mode,
    setMode,
    selectedJobId,
    setSelectedJobId,
    processing,
    setProcessing,
    isFormValid
  };
};