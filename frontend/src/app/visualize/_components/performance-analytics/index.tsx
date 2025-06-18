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

import { PERFORMANCE_DATA } from "@/constants/performanec-data";
import { FILE_TYPE_DATA } from "@/constants/file-type-data";

const PerformanceAnalyticsTab = () => {
  const [animatedData, setAnimatedData] = useState(PERFORMANCE_DATA);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedData(prev => {
        const newData = PERFORMANCE_DATA.map(item => ({
          ...item,
          compressionRatio: item.compressionRatio + (Math.random() - 0.5) * 0.2,
          speed: item.speed + (Math.random() - 0.5) * 10
        }));
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compression Ratio Chart */}
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HardDrive className="text-blue-400" size={24} />
            Compression Ratios by Algorithm
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={animatedData}>
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
        </div>

        {/* Speed vs CPU Usage */}
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" size={24} />
            Speed vs CPU Usage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={animatedData}>
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
        </div>
      </div>

      {/* File Type Effectiveness */}
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="text-green-400" size={24} />
          Compression Effectiveness by File Type
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={FILE_TYPE_DATA}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {FILE_TYPE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="flex flex-col justify-center space-y-4">
            {FILE_TYPE_DATA.map((item, index) => (
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
      </div>
    </div>
  );
};

export default PerformanceAnalyticsTab;