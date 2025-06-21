import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Zap, Lightbulb, Play, Trophy, Brain, Sparkles, TrendingUp, Clock, Target } from "lucide-react";
import { EDUCATIONAL_RESOURCES } from '@/constants/educational-resources';
import { DID_YOU_KNOW_FACTS } from '@/constants/educational-resources';
import { INTERACTIVE_DEMOS } from '@/constants/educational-resources';
import { Button } from '@/components/ui/button';

const LearningResourcesTab = () => {
  const [currentFact, setCurrentFact] = useState(0);
  const [hoveredResource, setHoveredResource] = useState<number | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<number | null>(null);
  const [completedResources, setCompletedResources] = useState(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % DID_YOU_KNOW_FACTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleResourceCompletion = (index: any) => {
    const newCompleted = new Set(completedResources);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedResources(newCompleted);
  };

  const getProgressPercentage = () => {
    return Math.round((completedResources.size / EDUCATIONAL_RESOURCES.length) * 100);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <section className="relative bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-teal-900/30 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <BookOpen className="text-purple-400" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Master Data Compression
              </h2>
              <p className="text-slate-300 text-lg">From zero to compression hero with interactive learning</p>
            </div>
          </div>          
          <div className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Learning Progress</span>
              <span className="text-sm text-purple-400 font-semibold">{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-400">{completedResources.size} of {EDUCATIONAL_RESOURCES.length} resources completed</p>
              <div className="flex items-center gap-1 text-xs text-yellow-400">
                <Trophy size={12} />
                <span>Click trophy icons to mark complete</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-6 border border-yellow-600/30">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="text-yellow-400 animate-pulse" size={28} />
          <h3 className="text-xl font-semibold text-yellow-300">Did You Know?</h3>
        </div>
        
        <div className="relative h-20 overflow-hidden">
          {DID_YOU_KNOW_FACTS.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-500 flex items-center gap-4 ${
                index === currentFact 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-4'
              }`}
            >
              {item.icon}
              <div>
                <p className="text-slate-200 font-medium">{item.fact}</p>
                <span className="text-xs text-yellow-400 font-semibold">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-4 gap-2">
          {DID_YOU_KNOW_FACTS.map((_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentFact(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentFact ? 'bg-yellow-400' : 'bg-yellow-600/30'
              }`}
            />
          ))}
        </div>
      </section>
      <section className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Play className="text-green-400" size={28} />
          Interactive Learning Demos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INTERACTIVE_DEMOS.map((demo, index) => (
            <div
              key={index}
              className="bg-slate-700/50 rounded-lg p-5 border border-slate-600/50 hover:border-green-400/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-green-400/20"
              onClick={() => setSelectedDemo(selectedDemo === index ? null : index)}
            >
              <div className="flex items-center gap-3 mb-3">
                {demo.icon}
                <h4 className="font-semibold text-white">{demo.title}</h4>
              </div>
              <p className="text-slate-300 text-sm mb-4">{demo.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  demo.complexity === 'Beginner' ? 'bg-green-900/50 text-green-300' :
                  demo.complexity === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-300' :
                  'bg-blue-900/50 text-blue-300'
                }`}>
                  {demo.complexity}
                </span>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Clock size={12} />
                  {demo.estimatedTime}
                </div>
              </div>
              
              {selectedDemo === index && (
                <div className="mt-4 p-3 bg-slate-600/50 rounded-lg border border-green-400/30">
                  <p className="text-sm text-green-300 mb-2">🚀 Demo will launch here!</p>
                  <p className="text-xs text-slate-400">This would contain an interactive visualization of the {demo.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="text-purple-400" size={28} />
          Educational Resources & Documentation
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EDUCATIONAL_RESOURCES.map((resource, index) => (
            <div
              key={index}
              className={`bg-slate-700/50 rounded-lg p-6 transition-all duration-300 border cursor-pointer transform ${
                hoveredResource === index
                  ? 'bg-slate-700/70 border-slate-400/50 shadow-lg shadow-purple-500/20'
                  : 'border-slate-600/50 hover:border-slate-500/50'
              } ${
                completedResources.has(index) ? 'ring-2 ring-green-400/50' : ''
              }`}
              onMouseEnter={() => setHoveredResource(index)}
              onMouseLeave={() => setHoveredResource(null)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  resource.level === 'Beginner' ? 'bg-green-900/50 text-green-300' :
                  resource.level === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-300' :
                  resource.level === 'Advanced' ? 'bg-red-900/50 text-red-300' :
                  'bg-blue-900/50 text-blue-300'
                }`}>
                  {resource.level}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    resource.type === 'Course' ? 'bg-purple-900/50 text-purple-300' :
                    resource.type === 'Book' ? 'bg-orange-900/50 text-orange-300' :
                    resource.type === 'Tutorial' ? 'bg-teal-900/50 text-teal-300' :
                    'bg-gray-700/50 text-gray-300'
                  }`}>
                    {resource.type}
                  </div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleResourceCompletion(index);
                    }}
                    className={`group relative p-1 rounded-full transition-all duration-300 ${
                      completedResources.has(index)
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                        : 'bg-slate-600 text-slate-400 hover:bg-green-500/80 hover:text-white animate-pulse'
                    }`}
                    title={completedResources.has(index) ? "Mark as incomplete" : "Mark as completed"}
                  >
                    <Trophy size={14} />
                    {!completedResources.has(index) && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-yellow-400 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                        Click to complete!
                      </div>
                    )}
                  </Button>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-white mb-2">{resource.title}</h4>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">{resource.description}</p>
              
              <div className="flex items-center justify-between">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm"
                >
                  <ExternalLink size={16} />
                  Learn More
                </a>
                
                {hoveredResource === index && (
                  <div className="animate-pulse">
                    <Sparkles className="text-purple-400" size={16} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Target className="text-blue-400" size={24} />
          Your Personalized Learning Journey
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-xl p-6 hover:from-green-900/40 hover:to-emerald-900/40 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Target className="text-green-400" size={20} />
              </div>
              <h4 className="text-green-300 font-semibold text-lg">🎯 Foundation</h4>
            </div>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Start with Huffman Coding basics
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Understand entropy and information theory
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Practice with text compression
              </li>
            </ul>
            <div className="mt-4 text-xs text-green-400 font-medium">Est. Time: 2-3 weeks</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-700/50 rounded-xl p-6 hover:from-yellow-900/40 hover:to-orange-900/40 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Brain className="text-yellow-400" size={20} />
              </div>
              <h4 className="text-yellow-300 font-semibold text-lg">🚀 Expansion</h4>
            </div>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Learn LZ77/LZ78 algorithms
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Explore arithmetic coding
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Implement basic compressors
              </li>
            </ul>
            <div className="mt-4 text-xs text-yellow-400 font-medium">Est. Time: 4-6 weeks</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-700/50 rounded-xl p-6 hover:from-red-900/40 hover:to-pink-900/40 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Zap className="text-red-400" size={20} />
              </div>
              <h4 className="text-red-300 font-semibold text-lg">⚡ Mastery</h4>
            </div>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Study modern algorithms (Brotli, Zstd)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Optimize for specific use cases
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Research cutting-edge techniques
              </li>
            </ul>
            <div className="mt-4 text-xs text-red-400 font-medium">Est. Time: 8+ weeks</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningResourcesTab;