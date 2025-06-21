import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { FILE_TYPE_COLORS as typeColors } from '@/constants/pie-chart-colors';

const ProcessingTimeAnalysis = ({ data }: any) => {
  const avgThroughput = data.length > 0 
    ? data.reduce((acc: number, item: any) => acc + item.throughput, 0) / data.length 
    : 0;

  const fastestJob = data.length > 0 
    ? data.reduce((fastest: any, current: any) => 
        current.throughput > fastest.throughput ? current : fastest
      )
    : null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Processing Performance</h3>
          <p className="text-sm text-slate-400">File size vs processing time</p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              type="number" 
              dataKey="fileSize"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(0)}MB`}
              name="File Size"
            />
            <YAxis 
              type="number" 
              dataKey="duration"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(1)}s`}
              name="Duration"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#0ABD50'
              }}
              labelStyle={{ color: '#0ABD50' }}
              itemStyle={{ color: '#D1D5DB' }}
              formatter={(value, name) => {
                if (name === 'fileSize') return [`${value} MB`, 'File Size'];
                if (name === 'duration') return [`${value} s`, 'Duration'];
                if (name === 'throughput') return [`${value} MB/s`, 'Throughput'];
                return [value, name];
              }}
            />
            <Scatter dataKey="duration" fill="#3B82F6">
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={typeColors[entry.type] || '#6B7280'} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <p className="text-lg font-bold text-white">{avgThroughput.toFixed(1)} MB/s</p>
          <p className="text-xs text-slate-400">Avg Throughput</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
          <p className="text-lg font-bold text-green-400">
            {fastestJob ? fastestJob.throughput.toFixed(1) : 0} MB/s
          </p>
          <p className="text-xs text-slate-400">Peak Performance</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center space-x-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-xs text-slate-400">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingTimeAnalysis;