import { useState } from 'react';
import { ExternalLink, Clock, Zap, FileText, Image, Music, Video, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { ALGORITHM_DETAILS } from '@/constants/algorithms';
import { CATEGORIES } from '@/constants/algorithms';
import { Button } from '@/components/ui/button';

const AlgorithmDetailsTab = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const filteredAlgorithms = ALGORITHM_DETAILS.filter(algo => {
    const matchesCategory = selectedCategory === 'All' || algo.category === selectedCategory;
    const matchesSearch = algo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         algo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         algo.bestFor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTypeColor = (type: any) => {
    return type === 'Lossless' 
      ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50' 
      : 'bg-orange-900/50 text-orange-300 border-orange-700/50';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Statistical': '📊',
      'Dictionary': '📚',
      'Basic': '🔧',
      'Hybrid': '🎯',
      'Transform': '⚡',
      'Perceptual': '👁️',
      'Video': '🎬',
      'Modern': '🚀'
    };
    return icons[category] || '📋';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Compression Algorithms
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore the fascinating world of data compression algorithms, from classic techniques to modern innovations
          </p>
        </div>
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 z-[10]" size={20} />
            <input
              type="text"
              placeholder="Search algorithms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-700/50'
                }`}
              >
                {category !== 'All' && getCategoryIcon(category)} {category}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredAlgorithms.map((algo, index) => (
            <div 
              key={index} 
              className="group bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20"
            >
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{algo.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {algo.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm border ${getTypeColor(algo.type)}`}>
                          {algo.type}
                        </span>
                        <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm border border-purple-700/50">
                          {algo.complexity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all"
                  >
                    {expandedCard === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </Button>
                </div>
                <p className="text-slate-300 mb-4 leading-relaxed">{algo.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-400" />
                    <span className="text-slate-400">Best for:</span>
                    <span className="text-slate-200">{algo.bestFor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-yellow-400" />
                    <span className="text-slate-400">Compression:</span>
                    <span className="text-slate-200">{algo.compressionRatio}</span>
                  </div>
                </div>
              </div>
              {expandedCard === index && (
                <div className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-green-400 font-semibold flex items-center gap-2">
                        ✅ Advantages
                      </h4>
                      <ul className="space-y-2">
                        {algo.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-300">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-red-400 font-semibold flex items-center gap-2">
                        ⚠️ Limitations
                      </h4>
                      <ul className="space-y-2">
                        {algo.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-300">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
                    <h4 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                      🌍 Real-world Applications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {algo.realWorldUse.map((use, i) => (
                        <span key={i} className="px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded-lg text-sm border border-cyan-700/30">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <a 
                      href={algo.learnMore} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <ExternalLink size={18} />
                      Learn More
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {filteredAlgorithms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No algorithms found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmDetailsTab;