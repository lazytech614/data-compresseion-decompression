import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const CompressionEfficiencyChart = ({ data }: any) => {
  const getBarColor = (ratio: any) => {
    if (ratio >= 70) return '#10B981'; 
    if (ratio >= 50) return '#F59E0B'; 
    if (ratio >= 30) return '#EF4444'; 
    return '#6B7280'; 
  };

  const chartData = data ;
  
  const maxRatio = Math.max(...chartData.map((item: any) => item.compressionRatio));
  const xAxisMax = Math.ceil(maxRatio / 50) * 50; 

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Compression Efficiency</h3>
          <p className="text-sm text-slate-400">Top performing files</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-400">High (70%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-slate-400">Medium (50%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-400">Low (30%+)</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              type="number"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, xAxisMax]}
            />
            <YAxis 
              type="category"
              dataKey="name"
              stroke="#9CA3AF"
              tick={{ fontSize: 10 }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              labelStyle={{ color: '#0ABD50' }} 
              itemStyle={{ color: '#D1D5DB' }}
              formatter={(value, name) => {
                if (name === 'compressionRatio') {
                  return [`${Number(value).toFixed(1)}%`, 'Compression Rate'];
                }
                return [value, name];
              }}
            />
            <Bar dataKey="compressionRatio" radius={[0, 4, 4, 0]} minPointSize={2}>
              {chartData.map((entry: any, index: any) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.compressionRatio)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">
            {chartData.length > 0 ? (chartData.reduce((acc: any, item: any) => acc + item.compressionRatio, 0) / chartData.length).toFixed(1) : 0}%
          </p>
          <p className="text-xs text-slate-400">Avg Compression</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">
            {chartData.length > 0 ? Math.abs(chartData.reduce((acc: any, item: any) => acc + item.savings, 0)).toFixed(1) : 0} MB
          </p>
          <p className="text-xs text-slate-400">Total Saved</p>
        </div>
      </div>
    </div>
  );
};

export default CompressionEfficiencyChart;