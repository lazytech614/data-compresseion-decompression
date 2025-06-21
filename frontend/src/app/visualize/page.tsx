"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Activity, Cpu } from 'lucide-react';
import PerformanceAnalyticsTab from './_components/performance-analytics';
import AlgorithmComparisonTab from './_components/algorithm-comparison';
import LearningResourcesTab from './_components/learning-resources';
import AlgorithmDetailsTab from './_components/algorithm-details';
import { SystemStats } from '@/types';

const CompressVisualizePortal = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [stats, setStats] = useState<SystemStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch system stats on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/system-stats');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: SystemStats[] = await res.json();
        setStats(data);
      } catch (err: any) {
        console.error('Failed to load system stats', err);
        setError(err.message || 'Error fetching system stats');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderTabContent = () => {
    if (loading) return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading your result...</p>
        </div>
      </div>
    );
    if (error) return <div className="text-red-400 p-4">Error: {error}</div>;

    switch (activeTab) {
      case 'performance':
        return <PerformanceAnalyticsTab stats={stats} />;
      case 'comparison':
        return <AlgorithmComparisonTab stats={stats} />;
      case 'learning':
        return <LearningResourcesTab />;
      case 'algorithms':
        return <AlgorithmDetailsTab />;
      default:
        return <PerformanceAnalyticsTab stats={stats} />;
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
