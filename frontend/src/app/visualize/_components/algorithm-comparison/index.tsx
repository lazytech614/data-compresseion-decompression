import { useEffect, useState } from 'react';
import { 
    Tooltip, 
    ResponsiveContainer, 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    PolarRadiusAxis, 
    Radar, 
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Legend,
    Bar,
    ScatterChart,
    Scatter,
    Cell
} from 'recharts';
import { SystemStats } from '@/types';

interface AlgorithmComparisonTabProps {
  stats: SystemStats[] | any;
}

const AlgorithmComparisonTab: React.FC<AlgorithmComparisonTabProps> = ({ stats }) => {
  const [algorithmData, setAlgorithmData] = useState<any[]>([]);

  const formatFileSize = (bytes : any) => {
    if (!bytes) return NaN;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatFileSizeRaw = (bytes : any) => {
    if (!bytes) return NaN;
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)));
  };

  function formatSpeed(bytesPerSec: any, decimals = 0) {
    if (bytesPerSec === 0) return '0 B/s';
    const k = 1024;
    const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
    const value = bytesPerSec / (k ** i);
    return value.toFixed(decimals);
  }

  const calculateSpeed = (bytes: any, time: any) => {
    if(time < 0) {
      return NaN;
    }

    const timeInSec = time / 1000;

    return formatSpeed(bytes / timeInSec);
  }

  useEffect(() => {
    if (stats && stats.length > 0) {
      const latestStats = stats[stats.length - 1];
      
      const algorithms = [
        {
          name: 'Huffman Coding',
          algorithm: 'Huffman',
          compressionRatio: latestStats.huffmanAvgRatio || 0,
          spaceSaved: (Math.abs((1 - (1 / latestStats.huffmanAvgRatio))) * 100),
          speed: calculateSpeed(latestStats.huffmanAvgMemoryUsage, latestStats.huffmanAvgDuration),
          rawMemomoryUsage: formatFileSizeRaw(latestStats.huffmanAvgMemoryUsage),
          memoryUsage: formatFileSize(latestStats.huffmanAvgMemoryUsage), 
          cpuUsage: latestStats.huffmanAvgCpuPercent,
          count: latestStats.huffmanCount || 0,
          color: '#3B82F6',
          complexity: 'O(n log n)',
          bestFor: 'Text files, frequency-based data'
        },
        {
          name: 'LZ77 Compression',
          algorithm: 'LZ77',
          compressionRatio: latestStats.lz77AvgRatio || 0,
          spaceSaved: (Math.abs((1 - (1 / latestStats.lz77AvgRatio))) * 100),
          speed: calculateSpeed(latestStats.lz77AvgMemoryUsage, latestStats.lz77AvgDuration),
          rawMemomoryUsage: formatFileSizeRaw(latestStats.lz77AvgMemoryUsage),
          memoryUsage: formatFileSize(latestStats.lz77AvgMemoryUsage),
          cpuUsage: latestStats.lz77AvgCpuPercent,
          count: latestStats.lz77Count || 0,
          color: '#10B981',
          complexity: 'O(n²)',
          bestFor: 'General purpose, sliding window'
        },
        {
          name: 'LZW Compression',
          algorithm: 'LZW',
          compressionRatio: latestStats.lzwAvgRatio || 0,
          spaceSaved: (Math.abs((1 - (1 / latestStats.lzwAvgRatio))) * 100),
          speed: calculateSpeed(latestStats.lzwAvgMemoryUsage, latestStats.lzwAvgDuration),
          rawMemomoryUsage: formatFileSizeRaw(latestStats.lzwAvgMemoryUsage),
          memoryUsage: formatFileSize(latestStats.lzwAvgMemoryUsage),
          cpuUsage: latestStats.lzwAvgCpuPercent,
          count: latestStats.lzwCount || 0,
          color: '#F59E0B',
          complexity: 'O(n)',
          bestFor: 'Images, GIF files'
        },
        {
          name: 'Run-Length Encoding (RLE)',
          algorithm: 'RLE',
          compressionRatio: latestStats.rleAvgRatio || 0,
          spaceSaved: (Math.abs((1 - (1 / latestStats.rleAvgRatio))) * 100),
          speed: calculateSpeed(latestStats.rleAvgMemoryUsage, latestStats.rleAvgDuration),
          rawMemomoryUsage: formatFileSizeRaw(latestStats.rleAvgMemoryUsage),
          memoryUsage: formatFileSize(latestStats.rleAvgMemoryUsage),
          cpuUsage: latestStats.rleAvgCpuPercent,
          count: latestStats.rleCount || 0,
          color: '#EF4444',
          complexity: 'O(n)',
          bestFor: 'High compression ratio needs'
        }
      ].filter(item => item.count > 0); 

      setAlgorithmData(algorithms);
    }
  }, [stats]);

  const normalizeData = (data: any) => {
    const maxSpeed = Math.max(...data.map((d: any) => d.speed));
    const maxCpu = Math.max(...data.map((d: any) => d.cpuUsage));
    const maxMemory = Math.max(...data.map((d: any) => d.rawMemomoryUsage));
    const maxSpaceSaved = Math.max(...data.map((d: any) => Math.abs(d.spaceSaved)));

    return data.map((item: any) => ({
      ...item,
      speedNorm: (item.speed / maxSpeed) * 100,
      cpuEfficiency: 100 - (item.cpuUsage / maxCpu) * 100, 
      memoryEfficiency: 100 - (item.rawMemomoryUsage / maxMemory) * 100,
      compressionScore: Math.max(0, (item.spaceSaved / maxSpaceSaved) * 100) 
    }));
  };

  const normalizedData = normalizeData(algorithmData);

  const ComparisonTable = () => (
    <div className="bg-gray-800 rounded-xl p-6 overflow-x-auto">
      <h3 className="text-xl font-semibold text-white mb-4">Algorithm Comparison Matrix</h3>
      {algorithmData.length > 0 ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 capitalize">
              <th className="text-left p-3 text-gray-300">Algorithm</th>
              <th className="text-center p-3 text-gray-300">Space saved</th>
              <th className="text-center p-3 text-gray-300">Speed</th>
              <th className="text-center p-3 text-gray-300">Memory Usage</th>
              <th className="text-center p-3 text-gray-300">Complexity</th>
              <th className="text-center p-3 text-gray-300">Best Use Case</th>
            </tr>
          </thead>
          <tbody>
            {algorithmData.map((algo, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                <td className="p-3 text-white font-medium">{algo.name}</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    {(Math.abs((1 - (1 / algo.compressionRatio))) * 100).toFixed(1)}%
                    <div className="ml-2 w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round(Math.abs((1 - (1 / algo.compressionRatio))) * 100))}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    {algo.speed} MB/s
                    <div className="ml-2 w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${algo.speed}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    {algo.memoryUsage}
                    <div className="ml-2 w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${algo.rawMemomoryUsage}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-3 text-center text-gray-300">{algo.complexity}</td>
                <td className="p-3 text-center text-gray-300">{algo.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex items-center justify-center h-32 text-gray-400">
          No algorithm data available
        </div>
      )}
    </div>
  );

  const MultiMetricBarChart = () => (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics Comparison</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={normalizedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="algorithm" tick={{ fill: '#9CA3AF' }} />
          <YAxis tick={{ fill: '#9CA3AF' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151', 
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value, name) => [`${value}%`, name]}
          />
          <Legend />
          <Bar dataKey="compressionScore" fill="#3B82F6" name="Compression Efficiency" />
          <Bar dataKey="speedNorm" fill="#10B981" name="Speed" />
          <Bar dataKey="cpuEfficiency" fill="#F59E0B" name="CPU Efficiency" />
          <Bar dataKey="memoryEfficiency" fill="#EF4444" name="Memory Efficiency" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const ScatterPlotChart = () => (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Speed vs Compression Efficiency</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type="number" 
            dataKey="speed" 
            name="Speed (MB/s)"
            tick={{ fill: '#9CA3AF' }}
            label={{ value: 'Processing Speed (MB/s)', position: 'insideBottom', offset: -10, fill: '#9CA3AF' }}
          />
          <YAxis 
            type="number" 
            dataKey="spaceSaved" 
            name="Space Saved (%)"
            tick={{ fill: '#9CA3AF' }}
            label={{ value: 'Space Saved (%)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151', 
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value, name, props) => [
              name === 'Speed (MB/s)' ? `${value} MB/s` : `${value}%`,
              name
            ]}
            labelFormatter={(label) => algorithmData.find(d => d.speed === label)?.name || ''}
          />
          <Scatter data={algorithmData} fill="#8884d8">
            {algorithmData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );

  const ScoreCards = () => {
    const calculateOverallScore = (item: any) => {
      const weights = {
        compression: 0.3,
        speed: 0.25,
        cpu: 0.25,
        memory: 0.2
      };
      
      const normalized = normalizedData.find((d: any) => d.algorithm === item.algorithm);
      return (
        normalized.compressionScore * weights.compression +
        normalized.speedNorm * weights.speed +
        normalized.cpuEfficiency * weights.cpu +
        normalized.memoryEfficiency * weights.memory
      );
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {algorithmData.map((algo, index) => {
          const overallScore = Math.round(calculateOverallScore(algo));
          return (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border-l-4" style={{ borderColor: algo.color }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">{algo.algorithm}</h4>
                <div className="text-2xl font-bold" style={{ color: algo.color }}>
                  {overallScore.toFixed(0)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Space Saved</span>
                  <span className="text-sm text-white font-medium">
                    {algo.spaceSaved > 0 ? `${algo.spaceSaved.toFixed(1)}%` : 'Expansion'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Speed</span>
                  <span className="text-sm text-white font-medium">{algo.speed} MB/s</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">CPU Usage</span>
                  <span className="text-sm text-white font-medium">{algo.cpuUsage.toFixed(1)}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Memory</span>
                  <span className="text-sm text-white font-medium">{algo.memoryUsage} MB</span>
                </div>
              </div>
              
              {/* Overall score bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Overall Score</span>
                  <span>{overallScore.toFixed(0)}/100</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${overallScore}%`, 
                      backgroundColor: algo.color 
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const HeatmapComparison = () => {
    const metrics = [
      { key: 'compressionScore', name: 'Compression', color: '#3B82F6' },
      { key: 'speedNorm', name: 'Speed', color: '#10B981' },
      { key: 'cpuEfficiency', name: 'CPU Efficiency', color: '#F59E0B' },
      { key: 'memoryEfficiency', name: 'Memory Efficiency', color: '#EF4444' }
    ];

    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Performance Heatmap</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 text-gray-300">Algorithm</th>
                {metrics.map(metric => (
                  <th key={metric.key} className="text-center p-3 text-gray-300">{metric.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {normalizedData.map((algo: any, index: any) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-3 text-white font-medium">{algo.name}</td>
                  {metrics.map(metric => {
                    const value = algo[metric.key];
                    const intensity = value / 100;
                    return (
                      <td key={metric.key} className="p-3 text-center">
                        <div 
                          className="w-full h-8 rounded flex items-center justify-center text-white font-medium text-sm"
                          style={{ 
                            backgroundColor: `${metric.color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`,
                            border: `1px solid ${metric.color}`
                          }}
                        >
                          {value.toFixed(0)}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <ComparisonTable />
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Performance Score Cards</h2>
        <ScoreCards />
      </div>
      <MultiMetricBarChart />
      <ScatterPlotChart />
      <HeatmapComparison />
    </div>
  );
};

export default AlgorithmComparisonTab;