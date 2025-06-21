import { AlertTriangle, FileText } from "lucide-react";
import { CompressionJob } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DecompressFileSelectorProps {
  savedResults: CompressionJob[];
  selectedJobId: string;
  onJobSelect: (jobId: string) => void;
  loading: boolean;
}

export default function DecompressFileSelector({ 
  savedResults, 
  selectedJobId, 
  onJobSelect,
  loading
}: DecompressFileSelectorProps) {
  const availableJobs = savedResults.filter(r => 
    r.type === 'COMPRESS' && 
    r.status === 'COMPLETED' && 
    r.compressedBase64 &&
    r.metadata
  );

  if(loading) {
    return (
      <div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading previously compressed files...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-300 font-medium text-sm mb-1">Important Note</h4>
            <p className="text-amber-200/90 text-sm leading-relaxed">
              To decompress a file using the <strong>Huffman algorithm</strong>, please select a file that was previously compressed using the <strong>Huffman algorithm</strong>. Files compressed with other algorithms cannot be decompressed using Huffman.
            </p>
          </div>
        </div>
      </div>
      <label className="block text-sm font-semibold text-slate-300 mb-3">
        Select Previously Compressed File
      </label>
      {availableJobs.length > 0 ? (
        <Select value={selectedJobId} onValueChange={onJobSelect}>
          <SelectTrigger className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
            <SelectValue placeholder="Select a compressed file to decompress" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border border-slate-600 rounded-lg">
            <SelectItem value="Select a compressed file to decompress" className="text-slate-400 italic cursor-default" disabled>
              Select a compressed file to decompress
            </SelectItem>
            {availableJobs.map(r => (
              <SelectItem key={r.id} value={r.id} className="text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer">
                {r.outputFiles[0]?.originalName || r.inputFiles[0]?.originalName || `Job ${r.id.slice(0, 8)}`} - {r.algorithm}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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