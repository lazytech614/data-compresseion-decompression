"use client";

import { useEffect, useState, useMemo } from "react";
import StatsCards             from "./_components/stats-card";
import UsageChart            from "./_components/usage-chart";
import RecentJobs            from "./_components/recent-jobs";
import CompressionTypesChart from "./_components/compression-types-chart";
import QuickActions           from "./_components/quick-actions";
import { FILE_TYPE_COLORS } from "@/constants/pie-chart-colors";
import { JobRecord, TypePoint } from "@/types";

export default function DashboardOverview() {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 1) Fetch user & jobs
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/compression-jobs");
        console.log("Response:", await res.json());
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
        // skip or handle invalid date
        return;
      }
      if (!bucket[day]) {
        bucket[day] = { date: day, compressions: 0, bytesProcessed: 0 };
      }
      bucket[day].compressions++;
      // ⬇️ cast to number here!
      bucket[day].bytesProcessed += Number(j.originalSize);
    });

    return Object.values(bucket)
      .sort((a,b) => a.date.localeCompare(b.date))
      .map(d => ({
        date: d.date,
        compressions:  d.compressions,
        // Convert bytes → MB so your chart works in reasonable units
        dataProcessed: +(d.bytesProcessed / (1024*1024)).toFixed(1),
      }));
  }, [jobs]);

  // 3) Derive compressionTypeData from jobs
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

    jobs.forEach((j) => {
      // grab the first input file's mimeType
      const mime = j.inputFiles[0]?.mimeType;
      const category = categorizeMime(mime);

      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: FILE_TYPE_COLORS[name] || "#D1D5DB", // Fallback gray if unknown
    }));
  }, [jobs]);

  if (loading) {
    return <div className="p-8 text-white">Loading your dashboard…</div>;
  }

  console.log("jobs", jobs);
  console.log("usageData", usageData);
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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
