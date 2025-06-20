"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import StatusCard from './_components/status-card';
import FileDetailsCard from './_components/file-details-card';
import PerformanceMetrics from './_components/performance-matrics';
import QuickActions from './_components/quick-actions';
import CompressionStats from './_components/compression-stats';
import { useRouter, useSearchParams } from 'next/navigation';
import { JobDetails } from '@/types';

// Loading component for Suspense fallback
const ResultPageLoading = () => (
  <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
    <p className="text-white">Loading...</p>
  </div>
);

// Main component that uses useSearchParams
const ResultPageContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const jobId = searchParams.get('jobId')
  const [job, setJob] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!jobId) {
      router.replace('/')
      return
    }
    // Fetch the job
    ;(async () => {
      try {
        const res = await fetch(`/api/compression-jobs/${jobId}`)
        if (!res.ok) {
          const errJson = await res.json().catch(() => null)
          throw new Error(errJson?.error || 'Failed to fetch job')
        }
        const json = await res.json()
        setJob(json.job)
      } catch (e: any) {
        console.error(e)
        setError(e.message || 'Error loading job')
      } finally {
        setLoading(false)
      }
    })()
  }, [jobId, router])

  console.log("Job: ", job);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading result…</p>
      </div>
    )
  }
  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-red-400 mb-4">{error || 'Job not found'}</p>
        <button
          onClick={() => router.push('/')}
          className="text-blue-400 underline"
        >
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.push('/')} className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            <div className="h-6 w-px bg-slate-600" />
            <h1 className="text-xl font-semibold">{job.type === 'DECOMPRESS' ? 'Decompression' : 'Compression'} Result</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <StatusCard job={job} />
            <FileDetailsCard job={job} />
            <PerformanceMetrics job={job} />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions job={job} />
            <CompressionStats job={job} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main exported component with Suspense wrapper
const ResultPage = () => {
  return (
    <Suspense fallback={<ResultPageLoading />}>
      <ResultPageContent />
    </Suspense>
  );
};

export default ResultPage;