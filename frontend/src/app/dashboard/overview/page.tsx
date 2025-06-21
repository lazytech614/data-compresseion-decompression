"use client";

import { useEffect, useState, useMemo } from "react";
import StatsCards from "./_components/stats-card";
import UsageChart from "./_components/usage-chart";
import RecentJobs from "./_components/recent-jobs";
import CompressionTypesChart from "./_components/compression-types-chart";
import QuickActions from "./_components/quick-actions";
import CompressionEfficiencyChart from "./_components/compression-efficiency-chart";
import ProcessingTimeAnalysis from "./_components/processing-time-analysis";
import FileStorageOverview from "./_components/file-storage-overview";
import PerformanceMetrics from "./_components/performance-matrics";
import HeatmapActivity from "./_components/heatmap-activity";
import { FILE_TYPE_COLORS } from "@/constants/pie-chart-colors";
import { JobRecord, TypePoint } from "@/types";
import Link from "next/link";
import { ZapOff } from "lucide-react";

export default function DashboardOverview() {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/compression-jobs");
        const { jobs: fetchedJobs } = await res.json();
        setJobs(fetchedJobs);
      } catch (err) {
        console.error("Error loading compression jobs:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // if(!jobs || jobs.length == 0) return (
  //   <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      
  //   </div>
  // )

  function toISODateFromDMY(input: string): string | null {
    const parts = input.split('/');
    if (parts.length !== 3) {
      console.warn('Unexpected date format (not D/M/YYYY):', input);
      return null;
    }
    let [d, m, y] = parts;
    d = d.trim();
    m = m.trim();
    y = y.trim();

    if (y.length === 2) {
      console.warn('Two-digit year? Unexpected:', input);
    }
    const dayNum = parseInt(d, 10);
    const monthNum = parseInt(m, 10);
    const yearNum = parseInt(y, 10);
    if (
      isNaN(dayNum) ||
      isNaN(monthNum) ||
      isNaN(yearNum) ||
      monthNum < 1 ||
      monthNum > 12 ||
      dayNum < 1 ||
      dayNum > 31
    ) {
      console.warn('Invalid numeric date parts:', input);
      return null;
    }
    const dd = String(dayNum).padStart(2, '0');
    const mm = String(monthNum).padStart(2, '0');
    const yyyy = String(yearNum).padStart(4, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  const usageData = useMemo(() => {
    const bucket: Record<string, { date: string; compressions: number; bytesProcessed: number }> = {};

    jobs.forEach(j => {
      const raw = j.startTime;
      const day = toISODateFromDMY(raw);
      if (!day) {
        return;
      }
      if (!bucket[day]) {
        bucket[day] = { date: day, compressions: 0, bytesProcessed: 0 };
      }
      bucket[day].compressions++;
      bucket[day].bytesProcessed += Number(j.originalSize);
    });

    return Object.values(bucket)
      .sort((a,b) => a.date.localeCompare(b.date))
      .map(d => ({
        date: d.date,
        compressions:  d.compressions,
        dataProcessed: +(d.bytesProcessed / (1024*1024)).toFixed(1),
      }));
  }, [jobs]);

  function categorizeMime(mime: string | undefined): string {
    if (!mime) return "Unknown";
    if (mime.startsWith("image/"))       return "Photo";
    if (mime.startsWith("video/"))       return "Video";
    if (
      mime === "application/pdf" ||
      mime.startsWith("application/msword") ||
      mime.startsWith(
        "application/vnd.openxmlformats-officedocument"
      )
    ) return "Document";
    if (mime.startsWith("text/"))         return "Text";
    if (mime.startsWith("audio/"))        return "Audio";
    return "Other";
  }
  
  const compressionTypeData: TypePoint[] = useMemo(() => {
    const counts: Record<string, number> = {};

    jobs?.forEach((j) => {
      const mime = j.inputFiles[0]?.mimeType;
      const category = categorizeMime(mime);
      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: FILE_TYPE_COLORS[name] || "#D1D5DB",
    }));
  }, [jobs]);

  const compressionEfficiencyData = useMemo(() => {
    return jobs!
      .filter(j => j.compressionRatio && j.status === 'COMPLETED')
      .map(j => ({
        name: j.inputFiles[0]?.originalName?.substring(0, 15) + '...' || 'Unknown',
        originalSize: Number(j.originalSize) / (1024*1024), // MB
        compressedSize: Number(j.compressedSize) / (1024*1024), // MB
        compressionRatio: j.compressionRatio! * 100,
        savings: ((Number(j.originalSize) - Number(j.compressedSize)) / (1024*1024)),
      }))
      .slice(0, 10);
  }, [jobs]);

  const processingTimeData = useMemo(() => {
    return jobs!
      .filter(j => j.duration && j.status === 'COMPLETED')
      .map(j => {
        const fileSize = Number(j.originalSize) / (1024*1024); 
        const duration = j.duration! / 1000; 
        return {
          fileSize: fileSize,
          duration: duration,
          throughput: fileSize / duration, 
          type: categorizeMime(j.inputFiles[0]?.mimeType),
        };
      });
  }, [jobs]);

  const storageData = useMemo(() => {
    const totalOriginal = jobs?.reduce((acc, j) => acc + Number(j.originalSize || 0), 0);
    const totalCompressed = jobs?.reduce((acc, j) => acc + Number(j.compressedSize || 0), 0);
    const totalSaved = totalOriginal - totalCompressed;

    return {
      original: totalOriginal / (1024*1024),
      compressed: totalCompressed / (1024*1024),
      saved: totalSaved / (1024*1024),
      savingsPercentage: totalOriginal > 0 ? (totalSaved / totalOriginal) * 100 : 0,
    };
  }, [jobs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-center text-slate-300 space-y-4">
        <ZapOff className="w-12 h-12" />
        <h2 className="text-xl font-semibold">No Data Found</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          You haven't run any compression tasks yet. <Link className="underline text-blue-500" href={'/'}>Upload a file or start a job to see analytics here.</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Compression Dashboard</h1>
          <p className="text-slate-400">Monitor your file compression analytics and performance</p>
        </div>
        <StatsCards jobs={jobs} usageData={usageData} storageData={storageData} />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
          <div className="xl:col-span-8">
            <UsageChart data={usageData} />
          </div>
          <div className="xl:col-span-4">
            <CompressionTypesChart data={compressionTypeData} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          <CompressionEfficiencyChart data={compressionEfficiencyData} />
          <ProcessingTimeAnalysis data={processingTimeData} />
          <FileStorageOverview data={storageData} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mb-8">
          <div className="xl:col-span-5">
            <PerformanceMetrics jobs={jobs} />
          </div>
          {/* <div className="xl:col-span-2">
            <HeatmapActivity jobs={jobs} />
          </div> */}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <RecentJobs jobs={jobs} />
          </div>
          <div className="xl:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}