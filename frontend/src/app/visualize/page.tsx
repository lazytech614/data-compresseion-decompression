"use client";

import React, { useState } from 'react';
import { BookOpen, TrendingUp, Activity, Cpu } from 'lucide-react';
import PerformanceAnalyticsTab from './_components/performance-analytics';
import AlgorithmComparisonTab from './_components/algorithm-comparison';
import LearningResourcesTab from './_components/learning-resources';
import AlgorithmDetailsTab from './_components/algorithm-details';

const CompressVisualizePortal = () => {
  const [activeTab, setActiveTab] = useState('performance');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'performance':
        return <PerformanceAnalyticsTab />;
      case 'comparison':
        return <AlgorithmComparisonTab />;
      case 'learning':
        return <LearningResourcesTab />;
      case 'algorithms':
        return <AlgorithmDetailsTab />;
      default:
        return <PerformanceAnalyticsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-800/50 rounded-xl p-2">
          {[
            { id: 'performance', label: 'Performance Analytics', icon: TrendingUp },
            { id: 'comparison', label: 'Algorithm Comparison', icon: Activity },
            { id: 'learning', label: 'Learning Resources', icon: BookOpen },
            { id: 'algorithms', label: 'Algorithm Details', icon: Cpu }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CompressVisualizePortal;