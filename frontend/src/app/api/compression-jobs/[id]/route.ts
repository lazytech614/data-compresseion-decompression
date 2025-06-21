import { NextResponse } from 'next/server'
import { client } from '@/lib/prisma' 

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const job = await client.compressionJob.findUnique({
      where: { id },
      include: {
        inputFiles: true,
        outputFiles: true,
      },
    })
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    const serialized = {
      id: job.id,
      userId: job.userId,
      status: job.status,
      type: job.type,
      quality: job.quality,
      algorithm: job.algorithm,
      originalSize: job.originalSize.toString(),
      compressedSize: job.compressedSize?.toString() ?? null,
      compressionRatio: job.compressionRatio,
      startTime: job.startTime.toLocaleDateString(),
      endTime: job.endTime?.toLocaleDateString() ?? null,
      duration: job.duration,
      errorMessage: job.errorMessage,
      batchId: job.batchId,
      priority: job.priority,
      metadata: job.metadata ?? null,
      compressedBase64: job.compressedBase64 ?? null,
      decompressedBase64: job.decompressedBase64 ?? null,
      cpuPercent: job.cpuPercent,
      memoryUsage: job.memoryUsage,
      
      inputFiles: job.inputFiles.map(f => ({
        id: f.id,
        filename: f.filename,
        originalName: f.originalName,
        mimeType: f.mimeType,
        size: f.size.toString(),
        path: f.path,
        url: f.url,
        checksum: f.checksum,
        isTemporary: f.isTemporary,
        isPublic: f.isPublic,
        expiresAt: f.expiresAt?.toLocaleDateString() ?? null,
        createdAt: f.createdAt.toLocaleDateString(),
        updatedAt: f.updatedAt.toLocaleDateString(),
        lastAccessed: f.lastAccessed?.toLocaleDateString() ?? null,
      })),
      outputFiles: job.outputFiles.map(f => ({
        id: f.id,
        filename: f.filename,
        originalName: f.originalName,
        mimeType: f.mimeType,
        size: f.size.toString(),
        path: f.path,
        url: f.url,
        checksum: f.checksum,
        isTemporary: f.isTemporary,
        isPublic: f.isPublic,
        expiresAt: f.expiresAt?.toLocaleDateString() ?? null,
        createdAt: f.createdAt.toLocaleDateString(),
        updatedAt: f.updatedAt.toLocaleDateString(),
        lastAccessed: f.lastAccessed?.toLocaleDateString() ?? null,
      })),
    }

    return NextResponse.json({ job: serialized })
  } catch (err) {
    console.error('Error fetching job by ID:', err)
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}
