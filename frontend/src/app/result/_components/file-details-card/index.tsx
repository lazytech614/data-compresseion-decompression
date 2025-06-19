import { FileText } from "lucide-react";

const FileDetailsCard = ({ job }: any) => {
  const inputFile = job.inputFiles[0];
  const outputFile = job.outputFiles[0];
  
  const formatFileSize = (bytes : any) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };
  
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <FileText className="h-5 w-5 mr-2" />
        File Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input File */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Original File</h4>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="font-medium text-white mb-2">{inputFile.originalName}</p>
            <div className="space-y-1 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Size:</span>
                <span>{formatFileSize(inputFile.size)}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span>{inputFile.mimeType}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Output File */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wide">{job.type === 'COMPRESS' ? 'Compressed' : 'Decompressed'} File</h4>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="font-medium text-white mb-2">{outputFile.name}</p>
            <div className="space-y-1 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Size:</span>
                <span>{formatFileSize(outputFile.size)}</span>
              </div>
              {job.type === 'COMPRESS' && (
                <div className="flex justify-between">
                  <span>Reduction:</span>
                  <span className="text-green-400 font-medium">
                    -{formatFileSize(inputFile.size - outputFile.size)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailsCard;