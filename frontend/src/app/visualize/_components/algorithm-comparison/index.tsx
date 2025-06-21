import { useEffect, useState } from 'react';

import { SystemStats } from '@/types';
import { ComparisonTable } from './comparison-table';
import { MultiMetricBarChart } from './multi-matric-bar-chart';
import { ScatterPlotChart } from './scatter-plot-chart';
import { ScoreCards } from './score-cards';
import { HeatmapComparison } from './heatmap-comparison';

interface AlgorithmComparisonTabProps {
  stats: SystemStats[] | any;
}

const AlgorithmComparisonTab: React.FC<AlgorithmComparisonTabProps> = ({ stats }) => {
  const [algorithmData, setAlgorithmData] = useState<any[]>([]);

  const formatFileSize = (bytes : any) => {
    if (!bytes) return NaN;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatFileSizeRaw = (bytes : any) => {
    if (!bytes) return NaN;
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)));
  };

  function formatSpeed(bytesPerSec: any, decimals = 0) {
    if (bytesPerSec === 0) return '0 B/s';
    const k = 1024;
    const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
    const value = bytesPerSec / (k ** i);
    return value.toFixed(decimals);
  }

  const calculateSpeed = (bytes: any, time: any) => {
    if(time < 0) {
      return NaN;
    }

    const timeInSec = time / 1000;

    return formatSpeed(bytes / timeInSec);
  }

  useEffect(() => {
    if (stats && stats.length > 0) {
      const latestStats = stats[stats.length - 1];
      
      const algorithms = [
        {
          name: 'Huffman Coding',
          algorithm: 'Huffman',
          compressionRatio: latestStats.huffmanAvgRatio || 0,
          spaceSaved: (Math.abs((1 - (1 / latestStats.huffmanAvgRatio))) * 100),
          speed: calculateSpeed(latestStats.huffmanAvgMemoryUsage, latestStats.huffmanAvgDuration),
          rawMemomoryUsage: formatFileSizeRaw(latestStats.huffmanAvgMemoryUsage),
          memoryUsage: formatFileSize(latestStats.huffmanAvgMemoryUsage), 
          cpuUsage: latestStats.huffmanAvgCpuPercent,
          count: latestStats.huffmanCount || 0,
          color: '#3B82F6',
          complexity: 'O(n log n)',
          bestFor: 'Text files, frequency-based data'
        },
        {
          name: 'LZ77 Compression',
          algorithm: 'LZ77',
          compressionRatio: latestStats.lz77AvgRatio || 0,
          spaceSaved: (Math.abs((1 - (1 / latestStats.lz77AvgRatio))) * 100),
          speed: calculateSpeed(latestStats.lz77AvgMemoryUsage, latestStats.lz77AvgDuration),
          rawMemomoryUsage: formatFileSizeRaw(latestStats.lz77AvgMemoryUsage),
          memoryUsage: formatFileSize(latestStats.lz77AvgMemoryUsage),
          cpuUsage: latestStats.lz77AvgCpuPercent,
          count: latestStats.lz77Count || 0,
          color: '#10B981',
          complexity: 'O(n²)',
          bestFor: 'General purpose, sliding window'
        },
        {
          name: 'LZW Compression',
          algorithm: 'LZW',
          compressionRatio: latestStats.lzwAvgRatio || 0,
          spaceSaved: (Math.abs((1 - (1 / latestStats.lzwAvgRatio))) * 100),
          speed: calculateSpeed(latestStats.lzwAvgMemoryUsage, latestStats.lzwAvgDuration),
          rawMemomoryUsage: formatFileSizeRaw(latestStats.lzwAvgMemoryUsage),
          memoryUsage: formatFileSize(latestStats.lzwAvgMemoryUsage),
          cpuUsage: latestStats.lzwAvgCpuPercent,
          count: latestStats.lzwCount || 0,
          color: '#F59E0B',
          complexity: 'O(n)',
          bestFor: 'Images, GIF files'
        },
        {
          name: 'Run-Length Encoding (RLE)',
          algorithm: 'RLE',
          compressionRatio: latestStats.rleAvgRatio || 0,
          spaceSaved: (Math.abs((1 - (1 / latestStats.rleAvgRatio))) * 100),
          speed: calculateSpeed(latestStats.rleAvgMemoryUsage, latestStats.rleAvgDuration),
          rawMemomoryUsage: formatFileSizeRaw(latestStats.rleAvgMemoryUsage),
          memoryUsage: formatFileSize(latestStats.rleAvgMemoryUsage),
          cpuUsage: latestStats.rleAvgCpuPercent,
          count: latestStats.rleCount || 0,
          color: '#EF4444',
          complexity: 'O(n)',
          bestFor: 'High compression ratio needs'
        }
      ].filter(item => item.count > 0); 
      

      setAlgorithmData(algorithms);
    }
  }, [stats]);


  const normalizeData = (data: any) => {
    const maxSpeed = Math.max(...data.map((d: any) => d.speed));
    const maxCpu = Math.max(...data.map((d: any) => d.cpuUsage));
    const maxMemory = Math.max(...data.map((d: any) => d.rawMemomoryUsage));
    const maxSpaceSaved = Math.max(...data.map((d: any) => Math.abs(d.spaceSaved)));

    return data.map((item: any) => ({
      ...item,
      speedNorm: (item.speed / maxSpeed) * 100,
      cpuEfficiency: 100 - (item.cpuUsage / maxCpu) * 100, 
      memoryEfficiency: 100 - (item.rawMemomoryUsage / maxMemory) * 100,
      compressionScore: Math.max(0, (item.spaceSaved / maxSpaceSaved) * 100) 
    }));
  };

  const normalizedData = normalizeData(algorithmData);

  return (
    <div className="space-y-8">
      <ComparisonTable algorithmData={algorithmData} />
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Performance Score Cards</h2>
        <ScoreCards algorithmData={algorithmData} normalizedData={normalizedData} />
      </div>
      <MultiMetricBarChart normalizedData={normalizedData} />
      <ScatterPlotChart algorithmData={algorithmData} />
      <HeatmapComparison normalizedData={normalizedData} />
    </div>
  );
};

export default AlgorithmComparisonTab;