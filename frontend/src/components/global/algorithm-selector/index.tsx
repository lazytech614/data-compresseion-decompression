import { ALGORITHMS } from "@/constants/algorithms";
import { Settings } from "lucide-react";

export default function AlgorithmSelector({ algorithms, selected, onChange }: { 
  algorithms: typeof ALGORITHMS, 
  selected: string, 
  onChange: (value: string) => void 
}) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-300 mb-3">
        Choose Algorithm
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {algorithms.map((algo: any) => (
          <div
            key={algo.id}
            onClick={() => onChange(algo.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selected === algo.id
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selected === algo.id ? 'bg-blue-500/20' : 'bg-slate-700'
              }`}>
                <Settings className={`w-4 h-4 ${
                  selected === algo.id ? 'text-blue-400' : 'text-slate-400'
                }`} />
              </div>
              <div>
                <h3 className={`font-medium ${
                  selected === algo.id ? 'text-blue-300' : 'text-slate-300'
                }`}>
                  {algo.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{algo.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}