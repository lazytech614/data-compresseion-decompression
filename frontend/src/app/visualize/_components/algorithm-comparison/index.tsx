import { 
    Tooltip, 
    ResponsiveContainer, 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    PolarRadiusAxis, 
    Radar 
} from 'recharts';

import { ALGORITHM_DETAILS } from "@/constants/algorithms";
import { PERFORMANCE_DATA } from "@/constants/performanec-data";

const AlgorithmComparisonTab = () => {
  const ComparisonTable = () => (
    <div className="bg-gray-800 rounded-xl p-6 overflow-x-auto">
      <h3 className="text-xl font-semibold text-white mb-4">Algorithm Comparison Matrix</h3>
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
          {ALGORITHM_DETAILS.map((algo, index) => (
            <tr key={index} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
              <td className="p-3 text-white font-medium">{algo.name}</td>
              <td className="p-3 text-center">
                <div className="flex items-center justify-center">
                  {PERFORMANCE_DATA.find(p => p.algorithm === algo.name.split(' ')[0])?.compressionRatio || 'N/A'}
                  <div className="ml-2 w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(PERFORMANCE_DATA.find(p => p.algorithm === algo.name.split(' ')[0])?.compressionRatio || 0) * 20}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="flex items-center justify-center">
                  {PERFORMANCE_DATA.find(p => p.algorithm === algo.name.split(' ')[0])?.speed || 'N/A'}
                  <div className="ml-2 w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${PERFORMANCE_DATA.find(p => p.algorithm === algo.name.split(' ')[0])?.speed || 0}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="flex items-center justify-center">
                  {PERFORMANCE_DATA.find(p => p.algorithm === algo.name.split(' ')[0])?.memoryUsage || 'N/A'}%
                  <div className="ml-2 w-16 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${PERFORMANCE_DATA.find(p => p.algorithm === algo.name.split(' ')[0])?.memoryUsage || 0}%` }}
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
    </div>
  );

  return (
    <div className="space-y-8">
      <ComparisonTable />
      
      {/* Radar Chart for Multi-dimensional Comparison */}
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4">Multi-dimensional Performance Radar</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={PERFORMANCE_DATA.map(item => ({
            algorithm: item.algorithm,
            'Compression Ratio': item.compressionRatio * 20,
            'Speed': item.speed,
            'CPU Efficiency': 100 - item.cpuUsage,
            'Memory Efficiency': 100 - item.memoryUsage
          }))}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="algorithm" tick={{ fill: '#9CA3AF' }} />
            <PolarRadiusAxis tick={{ fill: '#9CA3AF' }} />
            <Radar name="Performance" dataKey="Compression Ratio" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
            <Radar name="Speed" dataKey="Speed" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
            <Radar name="CPU Efficiency" dataKey="CPU Efficiency" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
            <Radar name="Memory Efficiency" dataKey="Memory Efficiency" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AlgorithmComparisonTab