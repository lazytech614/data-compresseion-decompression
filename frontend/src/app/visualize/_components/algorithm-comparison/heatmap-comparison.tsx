export const HeatmapComparison = ({normalizedData}: any) => {
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