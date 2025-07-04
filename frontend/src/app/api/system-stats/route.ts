import { NextResponse } from 'next/server';
import { client } from '@/lib/prisma';

export async function GET() {
  try {
    const rawStats = await client.systemStats.findMany({
      orderBy: { date: 'asc' },
    });

    // Convert BigInt fields to strings
    const stats = rawStats.map((s) => ({
      id: s.id,
      date: s.date?.toLocaleDateString(),

      // Daily metrics
      totalUsers: s.totalUsers,
      totalCompressions: s.totalCompressions,
      totalDataProcessed: s.totalDataProcessed.toString(),
      avgCompressionRatio: s.avgCompressionRatio,
      totalStorageUsed: s.totalStorageUsed.toString(),

      // Category‑wise stats
      photoCount: s.photoCount,
      photoAvgRatio: s.photoAvgRatio,
      photoAvgDuration: s.photoAvgDuration,

      videoCount: s.videoCount,
      videoAvgRatio: s.videoAvgRatio,
      videoAvgDuration: s.videoAvgDuration,

      documentCount: s.documentCount,
      documentAvgRatio: s.documentAvgRatio,
      documentAvgDuration: s.documentAvgDuration,

      audioCount: s.audioCount,
      audioAvgRatio: s.audioAvgRatio,
      audioAvgDuration: s.audioAvgDuration,

      textCount: s.textCount,
      textAvgRatio: s.textAvgRatio,
      textAvgDuration: s.textAvgDuration,

      unknownCount: s.unknownCount,
      unknownAvgRatio: s.unknownAvgRatio,
      unknownAvgDuration: s.unknownAvgDuration,

      // Algorithm‑wise stats
      huffmanCount: s.huffmanCount,
      huffmanAvgRatio: s.huffmanAvgRatio,
      huffmanAvgDuration: s.huffmanAvgDuration,
      huffmanAvgCpuPercent: s.huffmanAvgCpuPercent,
      huffmanAvgMemoryUsage: s.huffmanAvgMemoryUsage,

      lz77Count: s.lz77Count,
      lz77AvgRatio: s.lz77AvgRatio,
      lz77AvgDuration: s.lz77AvgDuration,
      lz77AvgCpuPercent: s.lz77AvgCpuPercent,
      lz77AvgMemoryUsage: s.lz77AvgMemoryUsage,

      lzwCount: s.lzwCount,
      lzwAvgRatio: s.lzwAvgRatio,
      lzwAvgDuration: s.lzwAvgDuration,
      lzwAvgCpuPercent: s.lzwAvgCpuPercent,
      lzwAvgMemoryUsage: s.lzwAvgMemoryUsage,

      rleCount: s.rleCount,
      rleAvgRatio: s.rleAvgRatio,
      rleAvgDuration: s.rleAvgDuration,
      rleAvgCpuPercent: s.rleAvgCpuPercent,
      rleAvgMemoryUsage: s.rleAvgMemoryUsage,
    }));

    if (!stats) {
        return NextResponse.json(
          { error: 'Failed to fetch system stats' },
          { status: 400 }
        );
    }

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('🔴 Failed to load system stats:', error);
    return NextResponse.json(
      { error: 'Could not fetch system stats' },
      { status: 500 }
    );
  }
}
