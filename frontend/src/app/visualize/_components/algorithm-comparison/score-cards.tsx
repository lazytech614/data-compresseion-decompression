export const ScoreCards = ({algorithmData, normalizedData}: any) => {
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
        {algorithmData.map((algo: any, index: number) => {
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
                  <span className="text-sm text-white font-medium">{algo.memoryUsage}</span>
                </div>
              </div>
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