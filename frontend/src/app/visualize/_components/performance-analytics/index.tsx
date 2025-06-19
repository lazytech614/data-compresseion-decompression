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

  useEffect(() => {
    if (stats && stats.length > 0) {
      // Get the latest stats
      const latestStats = stats[stats.length - 1];
      
      // Process algorithm data
      const algorithms = [
        {
          algorithm: 'Huffman',
          compressionRatio: latestStats.huffmanAvgRatio || 0,
          speed: latestStats.huffmanAvgDuration ? 1000 / latestStats.huffmanAvgDuration : 0, // Convert to operations per second
          cpuUsage: Math.random() * 80 + 20, // Mock CPU usage since not in data
          count: latestStats.huffmanCount || 0
        },
        {
          algorithm: 'LZ77',
          compressionRatio: latestStats.lz77AvgRatio || 0,
          speed: latestStats.lz77AvgDuration ? 1000 / latestStats.lz77AvgDuration : 0,
          cpuUsage: Math.random() * 80 + 20,
          count: latestStats.lz77Count || 0
        },
        {
          algorithm: 'LZW',
          compressionRatio: latestStats.lzwAvgRatio || 0,
          speed: latestStats.lzwAvgDuration ? 1000 / latestStats.lzwAvgDuration : 0,
          cpuUsage: Math.random() * 80 + 20,
          count: latestStats.lzwCount || 0
        },
        {
          algorithm: 'Arithmetic',
          compressionRatio: latestStats.arithmeticAvgRatio || 0,
          speed: latestStats.arithmeticAvgDuration ? 1000 / latestStats.arithmeticAvgDuration : 0,
          cpuUsage: Math.random() * 80 + 20,
          count: latestStats.arithmeticCount || 0
        }
      ].filter(item => item.count > 0); // Only show algorithms that have been used

      setAlgorithmData(algorithms);

      // Process file type data
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
      ].filter(item => item.count > 0); // Only show file types that have been processed

      const totalValue = fileTypes.reduce((total, fileType) => total + fileType.value, 0);
      fileTypes.forEach(fileType => {
        fileType.value = Math.round((fileType.value / totalValue) * 100);
      })
    
      setFileTypeData(fileTypes);
    }
  }, [stats]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compression Ratio Chart */}
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

        {/* Speed vs CPU Usage */}
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" size={24} />
            Speed vs CPU Usage
          </h3>
          {algorithmData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={algorithmData}>
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
                <Line type="monotone" dataKey="speed" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 6 }} />
                <Line type="monotone" dataKey="cpuUsage" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-400">
              No performance data available
            </div>
          )}
        </div>
      </div>

      {/* File Type Effectiveness */}
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
                    <span className="text-white font-semibold">{item.value}%</span>
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