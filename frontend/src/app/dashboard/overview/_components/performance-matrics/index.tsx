import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Cpu, Zap, Clock, Target, TrendingUp } from 'lucide-react';

const PerformanceMetrics = ({ jobs }: any) => {
  const completedJobs = jobs.filter((job: any) => job.status === 'COMPLETED');
  const failedJobs = jobs.filter((job: any) => job.status === 'FAILED');
  
  const avgCompressionRatio = completedJobs.length > 0 
    ? completedJobs.reduce((acc: number, job: any) => acc + (job.compressionRatio || 0), 0) / completedJobs.length * 100
    : 0;

  const avgCpuUsage = completedJobs.length > 0
    ? completedJobs.reduce((acc: number, job: any) => acc + (job.cpuPercent || 0), 0) / completedJobs.length
    : 0;

  const avgProcessingSpeed = completedJobs.length > 0
    ? completedJobs.reduce((acc: number, job: any) => {
        const size = Number(job.originalSize) / (1024 * 1024); // MB
        const duration = (job.duration || 1000) / 1000; // seconds
        return acc + (size / duration);
      }, 0) / completedJobs.length
    : 0;

  const reliabilityScore = jobs.length > 0 ? (completedJobs.length / jobs.length) * 100 : 0;
  const efficiencyScore = avgCompressionRatio;
  const performanceScore = Math.min(avgProcessingSpeed * 10, 100); // Scale to 100

  const radarData = [
    { subject: 'Reliability', A: reliabilityScore, fullMark: 100 },
    { subject: 'Efficiency', A: efficiencyScore, fullMark: 100 },
    { subject: 'Speed', A: performanceScore, fullMark: 100 },
    { subject: 'CPU Usage', A: 100 - avgCpuUsage, fullMark: 100 }, 
    { subject: 'Success Rate', A: reliabilityScore, fullMark: 100 },
  ];

  const performanceOverTime = jobs
    .filter((job: any) => job.status === 'COMPLETED' && job.startTime)
    .slice(-10) 
    .map((job: any, index: number) => ({
      job: `Job ${index + 1}`,
      efficiency: (job.compressionRatio || 0) * 100,
      speed: Math.min(((Number(job.originalSize) / (1024 * 1024)) / ((job.duration || 1000) / 1000)), 50), 
      cpuEfficiency: 100 - (job.cpuPercent || 0),
    }));

  const metrics = [
    {
      title: 'Avg Efficiency',
      value: `${avgCompressionRatio.toFixed(1)}%`,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      change: '+2.1%'
    },
    {
      title: 'Processing Speed',
      value: `${avgProcessingSpeed.toFixed(1)} MB/s`,
      icon: Zap,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      change: '+15%'
    },
    {
      title: 'CPU Usage',
      value: `${avgCpuUsage.toFixed(1)}%`,
      icon: Cpu,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      change: '-5%'
    },
    {
      title: 'Uptime',    //TODO: Mock data used
      value: '99.9%',
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      change: '+0.1%'
    }
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
          <p className="text-sm text-slate-400">System performance overview</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-4">Overall Performance</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis 
                  dataKey="subject"
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                />
                <Radar
                  name="Performance"
                  dataKey="A"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#D1D5DB' }}
                  labelStyle={{ color: '#0ABD50' }}
                  formatter={(value, name) => [`${Number(value).toFixed(1)} / 100`, name]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-4">Recent Performance Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="job"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name) => {
                    if (name === 'speed') {
                      return [`${Number(value).toFixed(2)} MB/s`, 'speed'];
                    }
                    if (typeof value === 'number') {
                      return [value.toFixed(2), name];
                    }
                    return [value, name];
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {metrics.map((metric, index) => (
          <div key={index} className={`${metric.bgColor} rounded-lg p-4 border border-slate-600/30`}>
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
              <span className="text-xs text-green-400 font-medium">{metric.change}</span>
            </div>
            <p className="text-lg font-bold text-white">{metric.value}</p>
            <p className="text-xs text-slate-400">{metric.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;