import { AlertCircle, CheckCircle, Loader, XCircle } from "lucide-react";

const RecentJobs = ({ jobs }: any) => {
  const getStatusIcon = (status: any) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'PROCESSING':
        return <Loader className="h-5 w-5 text-blue-400 animate-spin" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-400 bg-green-400/10';
      case 'PROCESSING':
        return 'text-blue-400 bg-blue-400/10';
      case 'FAILED':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  const formatFileSize = (bytes: any) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Jobs</h3>
      </div>
      <div className="space-y-4">
        {jobs.slice(0, 10).map((job: any) => (
          <div key={job.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center space-x-4">
              {getStatusIcon(job.status)}
              <div>
                <p className="text-white font-medium">
                  {job.inputFiles[0]?.originalName || 'Unknown File'}
                </p>
                <p className="text-slate-400 text-sm">
                  {job.type === 'COMPRESS' ? 'Compression' : 'Decompression'} 
                  &nbsp;•&nbsp;{new Date(job.startTime).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
              {job.compressionRatio && (
                <p className="text-slate-400 text-sm mt-1">
                  {(job.compressionRatio * 100).toFixed(1)}% saved
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentJobs;