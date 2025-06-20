const CompressionStats = ({ job }: any) => {
  const formatFileSize = (bytes : any) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Job Information</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Job ID:</span>
          <span className="text-white font-mono text-sm">{job.id}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Algorithm:</span>
          <span className="text-white">{job.algorithm}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Started:</span>
          <span className="text-white">{new Date(job.startTime).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Completed:</span>
          <span className="text-white">{new Date(job.endTime).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-400">CPU Usage:</span>
          <span className="text-white">{Math.round(job.cpuPercent)}%</span>
        </div>
      </div>
    </div>
  );
};

export default CompressionStats;