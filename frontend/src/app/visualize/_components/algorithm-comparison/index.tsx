import { useEffect, useState } from 'react';
import { 
    Tooltip, 
    ResponsiveContainer, 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    PolarRadiusAxis, 
    Radar 
} from 'recharts';
import { SystemStats } from '@/types';

interface AlgorithmComparisonTabProps {
  stats: SystemStats[] | any;
}

const AlgorithmComparisonTab: React.FC<AlgorithmComparisonTabProps> = ({ stats }) => {
  const [algorithmData, setAlgorithmData] = useState<any[]>([]);

  useEffect(() => {
    if (stats && stats.length > 0) {
      // Get the latest stats
      const latestStats = stats[stats.length - 1];
      
      // Process algorithm data from real stats
      const algorithms = [
        {
          name: 'Huffman Coding',
          algorithm: 'Huffman',
          compressionRatio: latestStats.huffmanAvgRatio || 0,
          speed: latestStats.huffmanAvgDuration ? Math.min(100, 1000 / latestStats.huffmanAvgDuration) : 0,
          memoryUsage: Math.random() * 30 + 20, // Mock memory usage (20-50%)
          cpuUsage: Math.random() * 40 + 30, // Mock CPU usage (30-70%)
          count: latestStats.huffmanCount || 0,
          complexity: 'O(n log n)',
          bestFor: 'Text files, frequency-based data'
        },
        {
          name: 'LZ77 Compression',
          algorithm: 'LZ77',
          compressionRatio: latestStats.lz77AvgRatio || 0,
          speed: latestStats.lz77AvgDuration ? Math.min(100, 1000 / latestStats.lz77AvgDuration) : 0,
          memoryUsage: Math.random() * 25 + 25, // Mock memory usage (25-50%)
          cpuUsage: Math.random() * 35 + 35, // Mock CPU usage (35-70%)
          count: latestStats.lz77Count || 0,
          complexity: 'O(n²)',
          bestFor: 'General purpose, sliding window'
        },
        {
          name: 'LZW Compression',
          algorithm: 'LZW',
          compressionRatio: latestStats.lzwAvgRatio || 0,
          speed: latestStats.lzwAvgDuration ? Math.min(100, 1000 / latestStats.lzwAvgDuration) : 0,
          memoryUsage: Math.random() * 30 + 30, // Mock memory usage (30-60%)
          cpuUsage: Math.random() * 30 + 40, // Mock CPU usage (40-70%)
          count: latestStats.lzwCount || 0,
          complexity: 'O(n)',
          bestFor: 'Images, GIF files'
        },
        {
          name: 'Arithmetic Coding',
          algorithm: 'Arithmetic',
          compressionRatio: latestStats.arithmeticAvgRatio || 0,
          speed: latestStats.arithmeticAvgDuration ? Math.min(100, 1000 / latestStats.arithmeticAvgDuration) : 0,
          memoryUsage: Math.random() * 20 + 15, // Mock memory usage (15-35%)
          cpuUsage: Math.random() * 50 + 40, // Mock CPU usage (40-90%)
          count: latestStats.arithmeticCount || 0,
          complexity: 'O(n)',
          bestFor: 'High compression ratio needs'
        }
      ].filter(item => item.count > 0); // Only show algorithms that have been used

      setAlgorithmData(algorithms);
    }
  }, [stats]);

  const ComparisonTable = () => (
    <div className="bg-gray-800 rounded-xl p-6 overflow-x-auto">
      <h3 className="text-xl font-semibold text-white mb-4">Algorithm Comparison Matrix</h3>
      {algorithmData.length > 0 ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-3 text-gray-300">Algorithm</th>
              <th className="text-center p-3 text-gray-300">Compression Ratio</th>
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
                    {(algo.compressionRatio * 100).toFixed(1)}%
                    <div className="ml-2 w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, algo.compressionRatio * 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    {algo.speed.toFixed(1)}
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
                    {algo.memoryUsage.toFixed(1)}%
                    <div className="ml-2 w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${algo.memoryUsage}%` }}
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

  return (
    <div className="space-y-8">
      <ComparisonTable />
      
      {/* Radar Chart for Multi-dimensional Comparison */}
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4">Multi-dimensional Performance Radar</h3>
        {algorithmData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={algorithmData.map(item => ({
              algorithm: item.algorithm,
              'Compression Ratio': Math.min(100, item.compressionRatio * 100),
              'Speed': item.speed,
              'CPU Efficiency': Math.max(0, 100 - item.cpuUsage),
              'Memory Efficiency': Math.max(0, 100 - item.memoryUsage)
            }))}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="algorithm" tick={{ fill: '#9CA3AF' }} />
              <PolarRadiusAxis tick={{ fill: '#9CA3AF' }} />
              <Radar name="Compression Ratio" dataKey="Compression Ratio" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
              <Radar name="Speed" dataKey="Speed" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
              <Radar name="CPU Efficiency" dataKey="CPU Efficiency" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
              <Radar name="Memory Efficiency" dataKey="Memory Efficiency" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-slate-400">
            No performance data available for radar chart
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmComparisonTab;