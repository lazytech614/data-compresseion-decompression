import { Button } from "@/components/ui/button";
import { Copy, Download, FileText, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const QuickActions = ({ job }: any) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const formatFileSize = (bytes : any) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };
  
  const copyJobId = () => {
    navigator.clipboard.writeText(job.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = async () => {
    try {
      setDownloading(true);
      
      // Determine which base64 data to use based on job type
      const base64Data = job.type === 'COMPRESS' ? job.compressedBase64 : job.decompressedBase64;
      
      if (!base64Data) {
        toast.error('No file data available for download');
        return;
      }

      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      // Create blob with appropriate MIME type
      const blob = new Blob([byteArray], { 
        type: 'application/octet-stream' 
      });

      // Generate filename
      const originalName = job.inputFiles?.[0]?.originalName || 'file';
      const baseName = originalName.split('.')[0];
      const extension = originalName.split('.').pop();
      
      let filename;
      if (job.type === 'COMPRESS') {
        filename = `${baseName}_compressed_${job.algorithm.toLowerCase()}.${extension}`;
      } else {
        filename = `${baseName}_decompressed.${extension}`;
      }

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download file. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Check if download is available
  const canDownload = job.status === 'COMPLETED' && 
    (job.compressedBase64 || job.decompressedBase64);
  
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      
      <div className="space-y-3">
        <Button 
          onClick={downloadFile}
          disabled={!canDownload || downloading}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            canDownload && !downloading
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-600 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Download className={`h-4 w-4 ${downloading ? 'animate-bounce' : ''}`} />
          <span>
            {downloading 
              ? 'Downloading...' 
              : job.type === 'COMPRESS' 
                ? 'Download Compressed File' 
                : 'Download Decompressed File'
            }
          </span>
        </Button>

        {!canDownload && job.status !== 'COMPLETED' && (
          <div className="flex items-center space-x-2 text-yellow-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Download available after completion</span>
          </div>
        )}
        
        <Button 
          onClick={copyJobId}
          className="w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
        >
          <Copy className="h-4 w-4" />
          <span>{copied ? 'Copied!' : 'Copy Job ID'}</span>
        </Button>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-slate-600">
        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>File Size:</span>
            <span>
              {
                formatFileSize(job.compressedSize)
              }
            </span>
          </div>
          {job.compressionRatio && (
            <div className="flex justify-between">
              <span>Compression Ratio:</span>
              <span className="text-green-400">{(job.compressionRatio).toFixed(1)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>{job.duration} ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;