export const ComparisonTable = ({algorithmData}: any) => (
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
            {algorithmData.map((algo: any, index: any) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                <td className="p-3 text-white font-medium">{algo.name}</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    {(Math.abs((1 - (1 / algo.compressionRatio))) * 100).toFixed(1)}%
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    {algo.speed} MB/s
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    {algo.memoryUsage}
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