"use client";

import { useRef } from 'react';

export default function FileUploader({ onFileSelect }: any) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: any) => {
    if (e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[var(--text-light)] mb-1">Select File:</label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-2 py-1"
      />
    </div>
  );
}
