import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/prisma'; 
import { currentUser } from '@clerk/nextjs/server'; 

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    const userRecord = await client.user.findUnique({
      where: { clerkId: user?.id },
      select: { id: true },
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      type,
      algorithm,
      originalSize,
      compressedSize,
      compressionRatio,
      duration,
      fileName,
      compressedBase64,
      decompressedBase64,
      metadata,
      mimeType,
      status = 'COMPLETED',
      inputFiles = [],
      outputFiles = [],
    } = await request.json();

    // 1. Create Job
    const job = await client.compressionJob.create({
      data: {
        userId: userRecord.id,
        type: type.toUpperCase(),
        status,
        originalSize: BigInt(originalSize),
        compressedSize: compressedSize ? BigInt(compressedSize) : null,
        compressionRatio,
        duration,
        endTime: new Date(),
        // Optionally save algorithm, metadata
        // algorithm,
        // metadata
      },
    });

    // 2. Create Input Files
    const inputFileCreates = inputFiles.map((f: any) =>
      client.file.create({
        data: {
          userId: userRecord.id,
          filename: f.filename,
          originalName: f.originalName,
          mimeType: f.mimeType,
          size: BigInt(f.size),
          path: f.path || '',
          checksum: '',
          isTemporary: true,
        },
      })
    );
    const createdInputFiles = await Promise.all(inputFileCreates);

    // 3. Create Output Files
    const outputFileCreates = outputFiles.map((f: any) =>
      client.file.create({
        data: {
          userId: userRecord.id,
          filename: f.filename,
          originalName: f.originalName,
          mimeType: f.mimeType,
          size: BigInt(f.size),
          path: f.path || '',
          checksum: '',
          isTemporary: true,
        },
      })
    );
    const createdOutputFiles = await Promise.all(outputFileCreates);

    // 4. Link Input/Output Files
    await client.compressionJob.update({
      where: { id: job.id },
      data: {
        inputFiles: {
          connect: createdInputFiles.map(f => ({ id: f.id })),
        },
        outputFiles: {
          connect: createdOutputFiles.map(f => ({ id: f.id })),
        },
      },
    });

    // 5. Optional: handle compressedBase64 / decompressedBase64 as virtual file
    if (fileName && (compressedBase64 || decompressedBase64)) {
      const virtualFile = await client.file.create({
        data: {
          userId: userRecord.id,
          filename: fileName,
          originalName: fileName,
          mimeType: mimeType || 'application/octet-stream',
          size: BigInt(compressedSize || originalSize),
          path: `/uploads/${fileName}`,
          checksum: '',
          isTemporary: true,
        },
      });

      await client.compressionJob.update({
        where: { id: job.id },
        data: {
          [type === 'compress' ? 'outputFiles' : 'inputFiles']: {
            connect: { id: virtualFile.id },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      jobId: job.id,
      job: {
        ...job,
        originalSize: job.originalSize.toString(),
        compressedSize: job.compressedSize?.toString(),
      },
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
      startTime:        job.startTime.toLocaleDateString(),
      endTime:          job.endTime?.toLocaleDateString() ?? null,
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
        expiresAt:    f.expiresAt?.toLocaleDateString() ?? null,
        createdAt:    f.createdAt.toLocaleDateString(),
        updatedAt:    f.updatedAt.toLocaleDateString(),
        lastAccessed: f.lastAccessed.toLocaleDateString(),
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
        expiresAt:    f.expiresAt?.toLocaleDateString() ?? null,
        createdAt:    f.createdAt.toLocaleDateString(),
        updatedAt:    f.updatedAt.toLocaleDateString(),
        lastAccessed: f.lastAccessed.toLocaleDateString(),
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
