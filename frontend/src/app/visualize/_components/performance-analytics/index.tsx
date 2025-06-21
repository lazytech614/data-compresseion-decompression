"use client";

import { useEffect, useState } from "react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    LineChart, 
    Line, 
    PieChart, 
    Pie, 
    Cell 
} from 'recharts';
import { FileText, Zap, HardDrive } from 'lucide-react';
import { SystemStats } from '@/types';

interface PerformanceAnalyticsTabProps {
  stats: SystemStats[] | any;
}

const PerformanceAnalyticsTab: React.FC<PerformanceAnalyticsTabProps> = ({ stats }) => {
  const [algorithmData, setAlgorithmData] = useState<any[]>([]);
  const [fileTypeData, setFileTypeData] = useState<any[]>([]);

  const formatFileSize = (bytes : any) => {
    if (!bytes) return NaN;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  useEffect(() => {
    if (stats && stats.length > 0) {
      const latestStats = stats[stats.length - 1];
      
      const algorithms = [
        {
          algorithm: 'Huffman',
          compressionRatio: latestStats.huffmanAvgRatio || 0,
          speed: latestStats.huffmanAvgDuration, 
          memoryUsageRaw: latestStats.huffmanAvgMemoryUsage 
            ? latestStats.huffmanAvgMemoryUsage / 1024 / 1024 
            : 0,
          memoryUsage: formatFileSize(latestStats.huffmanAvgMemoryUsage) || 0,
          count: latestStats.huffmanCount || 0
        },
        {
          algorithm: 'LZ77',
          compressionRatio: latestStats.lz77AvgRatio || 0,
          speed: latestStats.lz77AvgDuration,
          memoryUsageRaw: latestStats.lz77AvgMemoryUsage 
            ? latestStats.lz77AvgMemoryUsage / 1024 / 1024 
            : 0,
          memoryUsage: formatFileSize(latestStats.lz77AvgMemoryUsage) || 0,
          count: latestStats.lz77Count || 0
        },
        {
          algorithm: 'LZW',
          compressionRatio: latestStats.lzwAvgRatio || 0,
          speed: latestStats.lzwAvgDuration,
          memoryUsageRaw: latestStats.lzwAvgMemoryUsage 
            ? latestStats.lzwAvgMemoryUsage / 1024 / 1024 
            : 0,
          memoryUsage: formatFileSize(latestStats.lzwAvgMemoryUsage) || 0,
          count: latestStats.lzwCount || 0
        },
        {
          algorithm: 'RLE',
          compressionRatio: latestStats.rleAvgRatio || 0,
          speed: latestStats.rleAvgDuration,
          memoryUsageRaw: latestStats.rleAvgMemoryUsage 
            ? latestStats.rleAvgMemoryUsage / 1024 / 1024 
            : 0,
          memoryUsage: formatFileSize(latestStats.rleAvgMemoryUsage) || 0,
          count: latestStats.rleCount || 0
        }
      ].filter(item => item.count > 0);

      setAlgorithmData(algorithms);

      const fileTypes = [
        {
          name: 'Documents',
          value: Math.round((latestStats.documentAvgRatio || 0) * 100),
          count: latestStats.documentCount || 0,
          color: '#3B82F6'
        },
        {
          name: 'Text',
          value: Math.round((latestStats.textAvgRatio || 0) * 100),
          count: latestStats.textCount || 0,
          color: '#10B981'
        },
        {
          name: 'Photos',
          value: Math.round((latestStats.photoAvgRatio || 0) * 100),
          count: latestStats.photoCount || 0,
          color: '#F59E0B'
        },
        {
          name: 'Videos',
          value: Math.round((latestStats.videoAvgRatio || 0) * 100),
          count: latestStats.videoCount || 0,
          color: '#EF4444'
        },
        {
          name: 'Audio',
          value: Math.round((latestStats.audioAvgRatio || 0) * 100),
          count: latestStats.audioCount || 0,
          color: '#8B5CF6'
        },
        {
          name: 'Unknown',
          value: Math.round((latestStats.unknownAvgRatio || 0) * 100),
          count: latestStats.unknownCount || 0,
          color: '#6B7280'
        }
      ].filter(item => item.count > 0);
    
      setFileTypeData(fileTypes);
    }
  }, [stats]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HardDrive className="text-blue-400" size={24} />
            Compression Ratios by Algorithm
          </h3>
          {algorithmData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={algorithmData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="algorithm" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="compressionRatio" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1E40AF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-400">
              No compression data available
            </div>
          )}
        </div>
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" size={24} />
            Speed vs Memory Usage
          </h3>
          {algorithmData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={algorithmData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="algorithm" stroke="#9CA3AF" />
                <YAxis
                  yAxisId="left"
                  stroke="#10B981"
                  tickFormatter={v => `${Math.round(v)} ms`} 
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#F59E0B"
                  tickFormatter={v => `${Math.round(v)} MB`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value, name) => {
                    if (name === 'speed')       return [`${(value as number).toFixed(1)} ms`, 'Speed'];
                    if (name === 'memoryUsageRaw') return [`${(value as number).toFixed(1)} MB`, 'Memory'];
                    return [value, name];
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="speed"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#10B981' }}
                  name="speed"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="memoryUsageRaw"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#F59E0B' }}
                  name="memoryUsageRaw"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-400">
              No performance data available
            </div>
          )}
        </div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="text-green-400" size={24} />
          Compression Effectiveness by File Type
        </h3>
        {fileTypeData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fileTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {fileTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center space-y-4">
              {fileTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-200">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold">{item.value / 100}</span>
                    <div className="text-xs text-slate-400">compression ratio</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-slate-400">
            No file type data available
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAnalyticsTab;