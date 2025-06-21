import { HardDrive, TrendingUp } from 'lucide-react';

const FileStorageOverview = ({ data }: any) => {
  const { original, compressed, saved, savingsPercentage } = data;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Storage Overview</h3>
          <p className="text-sm text-slate-400">Space optimization summary</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3">
          <HardDrive className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Storage Usage</span>
          <span className="text-sm font-medium text-green-400">
            -{savingsPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
            style={{ width: `${Math.min((compressed / original) * 100, 100)}%` }}
          ></div>
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 opacity-80"
            style={{ 
              width: `${Math.min((saved / original) * 100, 100)}%`,
              marginLeft: `${Math.min((compressed / original) * 100, 100)}%`
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-slate-500">0 GB</span>
          <span className="text-slate-500">{original.toFixed(1)} GB</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-slate-300">Original Size</span>
          </div>
          <span className="text-sm font-bold text-white">{original.toFixed(2)} GB</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-slate-300">Compressed</span>
          </div>
          <span className="text-sm font-bold text-white">{compressed.toFixed(2)} GB</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-300">Space Saved</span>
          </div>
          <span className="text-sm font-bold text-green-400">{saved.toFixed(2)} GB</span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-4 py-2">
          <TrendingUp className="h-4 w-4 text-white" />
          <span className="text-white font-bold">
            {savingsPercentage.toFixed(1)}% Efficiency
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileStorageOverview;