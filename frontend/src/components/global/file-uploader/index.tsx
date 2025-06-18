"use client";

import { CheckCircle, Upload } from "lucide-react";
import { useRef } from "react";

export default function FileUploader({ onFileSelect, file }: { onFileSelect: (file: File) => void, file: File | null }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-300 mb-3">
        Select File
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-blue-400 hover:bg-slate-800/50 group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
            <Upload className="w-8 h-8 text-blue-400" />
          </div>
          {file ? (
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{file.name}</span>
            </div>
          ) : (
            <>
              <p className="text-slate-300 font-medium">Drop your file here or click to browse</p>
              <p className="text-slate-500 text-sm">Supports all file types</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}