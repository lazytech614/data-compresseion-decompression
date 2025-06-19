import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

const StatusCard = ({ job }: any) => {
  const isSuccess = job.status === 'COMPLETED';
  const isFailed = job.status === 'FAILED';
  
  return (
    <div className={`bg-slate-800 rounded-xl p-6 border-2 ${
      isSuccess ? 'border-green-500/20 bg-green-500/5' : 
      isFailed ? 'border-red-500/20 bg-red-500/5' : 
      'border-slate-700'
    }`}>
      <div className="flex items-center space-x-4">
        {isSuccess ? (
          <CheckCircle className="h-12 w-12 text-green-400" />
        ) : isFailed ? (
          <XCircle className="h-12 w-12 text-red-400" />
        ) : (
          <AlertCircle className="h-12 w-12 text-yellow-400" />
        )}
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-1">
            {
              isSuccess ? 
              job.type === 'COMPRESS' ? 'Compressed' : 'Decompressed' : 
              job.type === 'COMPRESS' ? 'Compression Failed' : 'Decompression Failed'
            }
          </h2>
          <p className="text-slate-400">
            {job.type === 'COMPRESS' ? 'File compressed successfully' : 'File decompressed successfully'} 
            &nbsp;using {job.algorithm} algorithm
          </p>
        </div>
        
        {isSuccess && (
          <div className="text-right">
            <p className="text-3xl font-bold text-green-400">
              {(job.compressionRatio * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-slate-400">space saved</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCard;