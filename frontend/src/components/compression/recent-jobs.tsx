import { CompressionJob } from "@/types";

interface RecentJobsProps {
  jobs: CompressionJob[];
}

export default function RecentJobs({ jobs }: RecentJobsProps) {
  if (jobs.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-white mb-6">Recent Jobs</h3>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
        <div className="space-y-4">
          {jobs.slice(0, 5).map((job) => (
            <div key={job.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div>
                <p className="text-white font-medium">
                  {job.type} - {job.outputFiles[0]?.originalName || job.inputFiles[0]?.originalName || 'Unknown'}
                </p>
                <p className="text-slate-400 text-sm">
                  {new Date(job.startTime).toLocaleString()} - {job.algorithm}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  job.status === 'COMPLETED' ? 'text-green-400' : 
                  job.status === 'FAILED' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {job.status}
                </p>
                {job.compressionRatio && (
                  <p className="text-slate-400 text-sm">
                    {(job.compressionRatio * 100).toFixed(1)}% ratio
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}