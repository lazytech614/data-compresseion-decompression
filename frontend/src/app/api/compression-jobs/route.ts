// force this API route to be runtime‑only
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/prisma'; 
import { currentUser } from '@clerk/nextjs/server'; 

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    const userId = await client.user.findUnique({
      where: { clerkId: user?.id },
      select: { id: true }
    })

    if (!userId) {
      console.log("🔴No user found in the onAuthenticateUser server action");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      type, // 'compress' or 'decompress'
      algorithm,
      originalSize,
      compressedSize,
      compressionRatio,
      duration,
      fileName,
      compressedBase64,
      decompressedBase64,
      metadata,
      status = 'COMPLETED'
    } = body;

    // Create compression job record
    const job = await client.compressionJob.create({
      data: {
        userId: userId.id,
        type: type.toUpperCase() as any, // Ensure it matches your enum
        status: status as any,
        originalSize: BigInt(originalSize),
        compressedSize: compressedSize ? BigInt(compressedSize) : null,
        compressionRatio,
        duration,
        endTime: new Date(),
        // Add other fields as needed
      }
    });

    // Create file records if needed
    if (fileName && (compressedBase64 || decompressedBase64)) {
      const fileData = {
        userId: userId.id,
        filename: fileName,
        originalName: fileName,
        mimeType: 'application/octet-stream', // Adjust as needed
        size: BigInt(compressedSize || originalSize),
        path: `/uploads/${fileName}`, // Adjust path as needed
        checksum: '', // You might want to calculate this
        isTemporary: true,
        // Store the base64 data or file path
      };

      const file = await client.file.create({
        data: fileData
      });

      // Link file to job
      await client.compressionJob.update({
        where: { id: job.id },
        data: {
          [type === 'compress' ? 'outputFiles' : 'inputFiles']: {
            connect: { id: file.id }
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      jobId: job.id,
      job: {
        ...job,
        originalSize: job.originalSize.toString(),
        compressedSize: job.compressedSize?.toString(),
      }
    });

  } catch (error) {
    console.error('Error saving compression job:', error);
    return NextResponse.json(
      { error: 'Failed to save compression job' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    const userId = await client.user.findUnique({
      where: { clerkId: user?.id },
      select: { id: true }
    })

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobs = await client.compressionJob.findMany({
      where: { userId: userId.id },
      include: {
        inputFiles:  true,
        outputFiles: true,
      },
      orderBy: { startTime: 'desc' }
    });

    const serializedJobs = jobs.map((job: any) => ({
      id:               job.id,
      status:           job.status,
      type:             job.type,
      quality:          job.quality,
      originalSize:     job.originalSize.toString(),
      compressedSize:   job.compressedSize?.toString() ?? null,
      compressionRatio: job.compressionRatio,
      startTime:        job.startTime.toISOString(),
      endTime:          job.endTime?.toISOString() ?? null,
      duration:         job.duration,
      errorMessage:     job.errorMessage,
      batchId:          job.batchId,
      priority:         job.priority,

      inputFiles:  job.inputFiles.map((f: any) => ({
        id:           f.id,
        filename:     f.filename,
        originalName: f.originalName,
        mimeType:     f.mimeType,
        size:         f.size.toString(),
        path:         f.path,
        url:          f.url,
        checksum:     f.checksum,
        isTemporary:  f.isTemporary,
        isPublic:     f.isPublic,
        expiresAt:    f.expiresAt?.toISOString() ?? null,
        createdAt:    f.createdAt.toISOString(),
        updatedAt:    f.updatedAt.toISOString(),
        lastAccessed: f.lastAccessed.toISOString(),
      })),

      outputFiles: job.outputFiles.map((f: any) => ({
        id:           f.id,
        filename:     f.filename,
        originalName: f.originalName,
        mimeType:     f.mimeType,
        size:         f.size.toString(),
        path:         f.path,
        url:          f.url,
        checksum:     f.checksum,
        isTemporary:  f.isTemporary,
        isPublic:     f.isPublic,
        expiresAt:    f.expiresAt?.toISOString() ?? null,
        createdAt:    f.createdAt.toISOString(),
        updatedAt:    f.updatedAt.toISOString(),
        lastAccessed: f.lastAccessed.toISOString(),
      })),
    }));

    return NextResponse.json({ jobs: serializedJobs });

  } catch (error) {
    console.error('🔴 Error fetching compression jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compression jobs' },
      { status: 500 }
    );
  }
}
