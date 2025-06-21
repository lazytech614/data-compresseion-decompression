
import { Calendar, Activity } from 'lucide-react';

const HeatmapActivity = ({ jobs }: any) => {
  const generateLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = generateLast7Days();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const activityData = days.map(day => {
    const dayStr = `${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()}`;
    const dayJobs = jobs.filter((job: any) => job.startTime === dayStr);

    return hours.map(hour => {
      // Filter jobs that match this hour exactly
      const jobsInHour = dayJobs.filter((job: any) => {
        const jobTime = new Date(job.startTime + ' ' + job.endTime); // You may need job.timestamp
        return jobTime.getHours() === hour;
      });

      return {
        day: day.getDay(),           // 0 = Sunday
        hour,                        // 0 - 23
        activity: jobsInHour.length, // Only real job count
        jobs: jobsInHour,
        date: day.toISOString().split('T')[0]
      };
    });
  }).flat();


  const getActivityColor = (level: any) => {
    const colors = [
      'bg-slate-700/20', // No activity
      'bg-blue-500/30',  // Low
      'bg-blue-500/50',  // Medium-low
      'bg-blue-500/70',  // Medium
      'bg-blue-500/90',  // High
      'bg-blue-500'      // Very high
    ];
    return colors[level] || colors[0];
  };

  const totalActivity = jobs.length;
  const completedJobs = jobs.filter((job: any) => job.status === 'COMPLETED').length;
  const failedJobs = jobs.filter((job: any) => job.status === 'FAILED').length;
  
  const todayActivity = jobs.filter((job: any) => {
    const today = new Date();
    const todayStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    return job.startTime === todayStr;
  }).length;

  const peakHour = activityData.reduce((peak, current) => 
    current.activity > peak.activity ? current : peak, 
    { hour: 0, activity: 0 }
  );

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Activity Heatmap</h3>
          <p className="text-sm text-slate-400">Compression activity patterns</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
          <Activity className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="mb-6 overflow-x-auto">
        {/* Hour labels */}
        <div className="flex mb-2">
          <div className="w-12 flex-shrink-0"></div>
          <div className="flex">
            {[0, 3, 6, 9, 12, 15, 18, 21].map(hour => (
              <div key={hour} className="text-xs text-slate-400 text-center w-9">
                {hour}:00
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap grid */}
        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="flex mb-1">
            {/* Day label */}
            <div className="w-12 flex-shrink-0 text-xs text-slate-400 flex items-center justify-end pr-2">
              {dayNames[day.getDay()]}
            </div>
            
            {/* Activity cells for each hour */}
            <div className="flex">
              {hours.map(hour => {
                const cellData = activityData.find(
                  d => d.day === day.getDay() && d.hour === hour && 
                  d.date === day.toISOString().split('T')[0]
                );
                return (
                  <div
                    key={`${dayIndex}-${hour}`}
                    className={`w-3 h-3 rounded-sm mr-1 ${getActivityColor(cellData?.activity || 0)} hover:scale-125 transition-all duration-200 cursor-pointer border border-slate-600/30`}
                    title={`${dayNames[day.getDay()]} ${hour}:00 - ${cellData?.activity || 0} activities`}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Legend */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getActivityColor(level)} border border-slate-600/30`}
            ></div>
          ))}
          <span className="text-xs text-slate-400">More</span>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-green-400">Total</span>
          </div>
          <p className="text-lg font-bold text-white mt-1">{totalActivity}</p>
          <p className="text-xs text-slate-400">All Jobs</p>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <Activity className="h-4 w-4 text-green-400" />
            <span className="text-xs text-green-400">{completedJobs}</span>
          </div>
          <p className="text-lg font-bold text-white mt-1">{((completedJobs / totalActivity) * 100).toFixed(1)}%</p>
          <p className="text-xs text-slate-400">Success Rate</p>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <Activity className="h-4 w-4 text-red-400" />
            <span className="text-xs text-red-400">{failedJobs}</span>
          </div>
          <p className="text-lg font-bold text-white mt-1">{failedJobs}</p>
          <p className="text-xs text-slate-400">Failed Jobs</p>
        </div>
      </div>

      {/* Peak Time Indicator */}
      <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Peak Activity Time</span>
          <span className="text-sm font-bold text-blue-400">
            {peakHour.hour}:00 - {peakHour.hour + 1}:00
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeatmapActivity;