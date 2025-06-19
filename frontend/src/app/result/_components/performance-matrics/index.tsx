import { BarChart3, Clock, Zap } from "lucide-react";

const PerformanceMetrics = ({ job }: any) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2" />
        Performance Metrics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{job.duration}ms</p>
          <p className="text-sm text-slate-400">Processing Time</p>
        </div>
        
        {/* TODO: Mock data will update later */}
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{100} mb/s</p>
          <p className="text-sm text-slate-400">Speed</p>
        </div>
        
        {/* TODO: Mock data will update later */}
        <div className="bg-slate-700/50 rounded-lg p-4 text-center">
          <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{12} mb</p>
          <p className="text-sm text-slate-400">Memory Used</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;