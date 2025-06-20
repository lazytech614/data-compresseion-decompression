import { BarChart3, Clock, Zap } from "lucide-react";

const PerformanceMetrics = ({ job }: any) => {
  const formatFileSize = (bytes : any) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  function formatSpeed(bytesPerSec: any, decimals = 0) {
    if (bytesPerSec === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
    const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
    const value = bytesPerSec / (k ** i);
    return `${value.toFixed(decimals)} ${sizes[i]}`;
  }

  const calculateSpeed = (bytes: any, time: any) => {
    if(time < 0) {
      return NaN;
    }

    const timeInSec = time / 1000;

    return formatSpeed(bytes / timeInSec);
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2" />
        Performance Metrics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{job.duration}ms</p>
          <p className="text-sm text-slate-400">Processing Time</p>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{calculateSpeed(job.inputFiles[0].size, job.duration)}</p>
          <p className="text-sm text-slate-400">Speed</p>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{formatFileSize(job.memoryUsage)}</p>
          <p className="text-sm text-slate-400">Memory Used</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;