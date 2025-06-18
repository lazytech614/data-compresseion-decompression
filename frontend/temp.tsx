"use client";

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { FileText, Zap, HardDrive } from 'lucide-react';

// Shape of system stats passed in
export interface SystemStats {
  date: string;
  totalDataProcessed: number;
  totalCompressions: number;
  // ... include any extra fields you need
}

interface PerformanceAnalyticsTabProps {
  stats: SystemStats[];
}

const PerformanceAnalyticsTab: React.FC<PerformanceAnalyticsTabProps> = ({ stats }) => {
  // transform stats to chart data
  const data = stats.map(s => ({
    date: new Date(s.date).toLocaleDateString(),
    dataProcessedMB: +(s.totalDataProcessed / (1024 * 1024)).toFixed(1),
    compressions: s.totalCompressions,
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Data Processed Over Time */}
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HardDrive className="text-blue-400" size={24} />
            Data Processed (MB)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => `${value} MB`}
              />
              <Line
                type="monotone"
                dataKey="dataProcessedMB"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Compressions Over Time */}
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" size={24} />
            Compressions Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="compressions"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsTab;
