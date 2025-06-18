import { EDUCATIONAL_RESOURCES } from "@/constants/educational-resources";
import { BookOpen, ExternalLink } from "lucide-react";

const LearningResourcesTab = () => {
  return (
    <div className="space-y-8">
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="text-purple-400" size={28} />
          Educational Resources & Documentation
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EDUCATIONAL_RESOURCES.map((resource, index) => (
            <div key={index} className="bg-slate-700/50 rounded-lg p-6 hover:bg-slate-700/70 transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50">
              <div className="flex items-start justify-between mb-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  resource.level === 'Beginner' ? 'bg-green-900/50 text-green-300' :
                  resource.level === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-300' :
                  resource.level === 'Advanced' ? 'bg-red-900/50 text-red-300' :
                  'bg-blue-900/50 text-blue-300'
                }`}>
                  {resource.level}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  resource.type === 'Course' ? 'bg-purple-900/50 text-purple-300' :
                  resource.type === 'Book' ? 'bg-orange-900/50 text-orange-300' :
                  resource.type === 'Tutorial' ? 'bg-teal-900/50 text-teal-300' :
                  'bg-gray-700/50 text-gray-300'
                }`}>
                  {resource.type}
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-white mb-2">{resource.title}</h4>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">{resource.description}</p>
              
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm"
              >
                <ExternalLink size={16} />
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Learning Path */}
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4">Recommended Learning Path</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
            <h4 className="text-green-300 font-semibold mb-2">🎯 Beginner</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Start with Huffman Coding basics</li>
              <li>• Understand entropy and information theory</li>
              <li>• Practice with text compression</li>
            </ul>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
            <h4 className="text-yellow-300 font-semibold mb-2">🚀 Intermediate</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Learn LZ77/LZ78 algorithms</li>
              <li>• Explore arithmetic coding</li>
              <li>• Implement basic compressors</li>
            </ul>
          </div>
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
            <h4 className="text-red-300 font-semibold mb-2">⚡ Advanced</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Study modern algorithms (Brotli, Zstd)</li>
              <li>• Optimize for specific use cases</li>
              <li>• Research cutting-edge techniques</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningResourcesTab