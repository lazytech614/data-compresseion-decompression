import { FileText } from "lucide-react";
import { CompressionJob } from "@/types";

interface DecompressFileSelectorProps {
  savedResults: CompressionJob[];
  selectedJobId: string;
  onJobSelect: (jobId: string) => void;
}

export default function DecompressFileSelector({ 
  savedResults, 
  selectedJobId, 
  onJobSelect 
}: DecompressFileSelectorProps) {
  const availableJobs = savedResults.filter(r => 
    r.type === 'COMPRESS' && 
    r.status === 'COMPLETED' && 
    r.compressedBase64 &&
    r.metadata
  );

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-3">
        Select Previously Compressed File
      </label>
      {availableJobs.length > 0 ? (
        <select
          value={selectedJobId}
          onChange={(e) => onJobSelect(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Select a compressed file to decompress</option>
          {availableJobs.map(r => (
            <option key={r.id} value={r.id}>
              {r.outputFiles[0]?.originalName
                || r.inputFiles[0]?.originalName
                || `Job ${r.id.slice(0, 8)}`} 
              ({new Date(r.startTime).toLocaleDateString()}) - {r.algorithm}
            </option>
          ))}
        </select>
      ) : (
        <div className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-8 text-center">
          <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No compressed files available for decompression</p>
          <p className="text-slate-500 text-sm mt-1">Compress some files first to see them here</p>
        </div>
      )}
    </div>
  );
}