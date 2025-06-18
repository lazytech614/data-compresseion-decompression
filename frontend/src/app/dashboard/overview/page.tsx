"use client";

import { useEffect, useState, useMemo } from "react";
import StatsCards             from "./_components/stats-card";
import UsageChart            from "./_components/usage-chart";
import RecentJobs            from "./_components/recent-jobs";
import CompressionTypesChart from "./_components/compression-types-chart";
import QuickActions           from "./_components/quick-actions";

interface JobRecord {
  id: string;
  status: string;
  type: string;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
  startTime: string;
  endTime?: string;
  duration?: number;
}

interface UsagePoint {
  date: string;
  compressions: number;
  dataProcessed: number;  // in MB
}

interface TypePoint {
  name: string;
  value: number;
  // you can drop color here if your chart assigns it
  color?: string;
}

export default function DashboardOverview() {
  const [jobs, setJobs]       = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 1) Fetch user & jobs
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // a) we don't actually use /api/user for stats, so skip
        //    fetch("/api/user");

        // b) fetch all compression jobs
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

  // 2) Derive usageData from jobs
  const usageData: UsagePoint[] = useMemo(() => {
    const bucket: Record<string, UsagePoint> = {};

    jobs.forEach((j) => {
      const day = j.startTime.slice(0, 10); // "YYYY-MM-DD"
      if (!bucket[day]) {
        bucket[day] = { date: day, compressions: 0, dataProcessed: 0 };
      }
      bucket[day].compressions++;
      bucket[day].dataProcessed += j.originalSize;
    });

    return Object.values(bucket)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((p) => ({
        date:           p.date,
        compressions:   p.compressions,
        dataProcessed:  Math.round(p.dataProcessed / (1024 * 1024)), // to MB
      }));
  }, [jobs]);

  // 3) Derive compressionTypeData from jobs
  const compressionTypeData: TypePoint[] = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((j) => {
      counts[j.type] = (counts[j.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [jobs]);

  if (loading) {
    return <div className="p-8 text-white">Loading your dashboard…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* StatsCards can still take jobs if you want them */}
        <StatsCards jobs={jobs} usageData={usageData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <UsageChart data={usageData} />
            <RecentJobs jobs={jobs} />
          </div>

          <div className="space-y-8">
            <CompressionTypesChart data={compressionTypeData} />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
