import { 
  Activity, 
  CheckCircle, 
  HardDrive, 
  TrendingUp, 
  Zap, 
  Clock, 
  Database, 
  Target 
} from "lucide-react";

const StatsCards = ({ jobs, usageData, storageData }: any) => {
  console.log("jobs", jobs);
  console.log("usageData", usageData);
  console.log("storageData", storageData);
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter((job: any) => job.status === 'COMPLETED').length;
  const avgCompressionRatio = jobs
    .filter((job: any) => job.compressionRatio)
    .reduce((acc: any, job: any, _: any, arr: any) => acc + job.compressionRatio / arr.length, 0);

  const totalCompression = usageData.reduce((acc: any, job: any) => acc + job.compressions, 0);
  const totalDataProcessed = usageData.reduce((acc: any, job: any) => acc + job.dataProcessed, 0);
  
  const avgProcessingTime = jobs
    .filter((job: any) => job.duration && job.status === 'COMPLETED')
    .reduce((acc: any, job: any, _: any, arr: any) => acc + (job.duration / 1000) / arr.length, 0);

  const stats = [
    {
      title: 'Total Compressions',
      value: totalCompression,
      icon: Activity,
      gradient: 'from-blue-500 to-blue-600',
      trend: '+12%',    //TODO: Mock data used
      description: 'vs last month'
    },
    {
      title: 'Data Processed',
      value: `${totalDataProcessed} MB`,
      icon: HardDrive,
      gradient: 'from-green-500 to-green-600',
      trend: '+23%',    //TODO: Mock data used
      description: 'total processed'
    },
    {
      title: 'Avg Compression',
      value: `${(avgCompressionRatio * 100).toFixed(1)}%`,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      trend: '+5%',     //TODO: Mock data used
      description: 'efficiency rate'
    },
    {
      title: 'Success Rate',
      value: `${((completedJobs / totalJobs) * 100).toFixed(1)}%`,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-emerald-600',
      trend: '99.2%',   //TODO: Mock data used
      description: 'reliability'
    },
    {
      title: 'Storage Saved',
      value: `${storageData.saved.toFixed(2)} GB`,
      icon: Database,
      gradient: 'from-orange-500 to-orange-600',
      trend: `${storageData.savingsPercentage.toFixed(1)}%`,
      description: 'space optimized'
    },
    {
      title: 'Avg Process Time',
      value: `${avgProcessingTime.toFixed(1)}s`,
      icon: Clock,
      gradient: 'from-cyan-500 to-cyan-600',
      trend: '-15%',      //TODO: Mock data used
      description: 'faster processing'
    },
    {
      title: 'Active Jobs',
      value: jobs.filter((job: any) => job.status === 'PROCESSING').length.toString(),
      icon: Zap,
      gradient: 'from-yellow-500 to-yellow-600',
      trend: 'Live',
      description: 'currently running'
    },
    {
      title: 'Quality Score',
      value: '94.5',
      icon: Target,
      gradient: 'from-pink-500 to-pink-600',
      trend: '+2.1',      //TODO: Mock data used
      description: 'performance index'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-2xl`}></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-3 shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.description}</p>
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;