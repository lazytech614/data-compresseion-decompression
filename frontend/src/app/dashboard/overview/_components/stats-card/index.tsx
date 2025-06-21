import { Activity, CheckCircle, HardDrive, TrendingUp } from "lucide-react";

const StatsCards = ({ jobs, usageData }: any) => {
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter((job: any) => job.status === 'COMPLETED').length;
  const avgCompressionRatio = jobs
    .filter((job: any) => job.compressionRatio)
    .reduce((acc: any, job: any, _: any, arr: any) => acc + job.compressionRatio / arr.length, 0);

  const totalCompression = usageData.reduce((acc: any, job: any) => acc + job.compressions, 0);
  const totalDataProcessed = usageData.reduce((acc: any, job: any) => acc + job.dataProcessed, 0);

  const stats = [
    {
      title: 'Total Compressions',
      value: totalCompression.toString(),
      icon: Activity,
    },
    {
      title: 'Data Processed',
      value: `${totalDataProcessed} MB`,
      icon: HardDrive,
    },
    {
      title: 'Avg Compression',
      value: `${(avgCompressionRatio * 100).toFixed(1)}%`,
      icon: TrendingUp,
    },
    {
      title: 'Success Rate',
      value: `${((completedJobs / totalJobs) * 100).toFixed(1)}%`,
      icon: CheckCircle,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <stat.icon className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;