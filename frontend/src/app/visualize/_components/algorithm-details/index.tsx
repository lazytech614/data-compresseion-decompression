import { ALGORITHM_DETAILS } from "@/constants/algorithms";
import { ExternalLink } from "lucide-react";

const AlgorithmDetailsTab = () => {
  return (
    <div className="space-y-6">
      {ALGORITHM_DETAILS.map((algo, index) => (
        <div key={index} className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">{algo.name}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">{algo.type}</span>
                <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">{algo.complexity}</span>
              </div>
            </div>
            <a 
              href={algo.learnMore} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <ExternalLink size={16} />
              Learn More
            </a>
          </div>
          
          <p className="text-slate-300 mb-4 leading-relaxed">{algo.description}</p>
          <div className="mb-4">
            <strong className="text-white">Best for:</strong> <span className="text-slate-300">{algo.bestFor}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                ✅ Advantages
              </h4>
              <ul className="text-slate-300 space-y-1">
                {algo.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                ⚠️ Limitations
              </h4>
              <ul className="text-slate-300 space-y-1">
                {algo.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlgorithmDetailsTab