import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/prisma'; 
import { currentUser } from '@clerk/nextjs/server'; 
import { startOfToday } from 'date-fns';
import { metadata } from '@/app/layout';

type AlgoKey = 'huffman' | 'lz77' | 'lzw' | 'arithmetic';

// Helper function to sanitize strings and remove null bytes
function sanitizeString(str: string | null | undefined): string | null {
  if (!str) return null;
  if (typeof str !== 'string') return String(str);
  
  // More aggressive null byte removal
  const cleaned = str
    .replace(/\u0000/g, '') // Remove null bytes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\uFFFD/g, '') // Remove replacement characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove additional control chars
    .replace(/\0/g, '') // Remove literal null characters
    .replace(/\\u0000/g, '') // Remove escaped null sequences
    .replace(/\\0/g, ''); // Remove other null representations
  
  // If string becomes empty after cleaning, return null
  return cleaned.trim() || null;
}

// Helper function to sanitize objects recursively with thorough null byte removal
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) return null;
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (typeof obj === 'number') {
    return isNaN(obj) || !isFinite(obj) ? 0 : obj;
  }
  
  if (typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)).filter(item => item !== null);
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Sanitize the key itself
      let sanitizedKey: string;
      if (typeof key === 'string' && /^\d+$/.test(key)) {
        // For numeric string keys, still sanitize them
        const cleanKey = sanitizeString(key);
        if (!cleanKey) continue;
        sanitizedKey = cleanKey;
      } else {
        const cleanKey = sanitizeString(key);
        if (!cleanKey) continue;
        sanitizedKey = cleanKey;
      }
      
      const sanitizedValue = sanitizeObject(value);
      
      if (sanitizedValue !== null && sanitizedValue !== undefined) {
        sanitized[sanitizedKey] = sanitizedValue;
      }
    }
    return Object.keys(sanitized).length > 0 ? sanitized : null;
  }
  
  return obj;
}

// More thorough metadata sanitization
function sanitizeMetadata(metadata: any): any {
  if (!metadata || typeof metadata !== 'object') {
    // If it's a string, sanitize it
    if (typeof metadata === 'string') {
      return sanitizeString(metadata);
    }
    return metadata;
  }
  
  // Deep clean function that handles all data types
  function deepClean(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'string') {
      // Aggressive string cleaning
      return obj
        .replace(/\u0000/g, '')
        .replace(/\0/g, '')
        .replace(/\\u0000/g, '')
        .replace(/\\0/g, '')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    }
    
    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(deepClean);
    }
    
    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Clean the key
        const cleanKey = typeof key === 'string' 
          ? key.replace(/\u0000/g, '').replace(/\0/g, '').replace(/\\u0000/g, '')
          : key;
        
        if (cleanKey) {
          cleaned[cleanKey] = deepClean(value);
        }
      }
      return cleaned;
    }
    
    return obj;
  }
  
  return deepClean(metadata);
}

// Additional function to validate that no null bytes remain
function validateNoNullBytes(obj: any, path: string = 'root'): boolean {
  if (obj === null || obj === undefined) return true;
  
  if (typeof obj === 'string') {
    if (obj.includes('\u0000') || obj.includes('\0')) {
      console.error(`Null byte found in string at path: ${path}`, obj);
      return false;
    }
    return true;
  }
  
  if (Array.isArray(obj)) {
    return obj.every((item, index) => 
      validateNoNullBytes(item, `${path}[${index}]`)
    );
  }
  
  if (typeof obj === 'object') {
    return Object.entries(obj).every(([key, value]) => {
      if (key.includes('\u0000') || key.includes('\0')) {
        console.error(`Null byte found in key at path: ${path}.${key}`);
        return false;
      }
      return validateNoNullBytes(value, `${path}.${key}`);
    });
  }
  
  return true;
}

async function updateGlobalStats({
  bytesProcessed,
  compressionRatio,
  storageUsed,
}: {
  bytesProcessed: number;
  compressionRatio: number;
  storageUsed?: number;
}) {
  const GLOBAL_STATS_ID = "global";

  // Recalculate avgCompressionRatio as running average
  const existing = await client.systemStats.findUnique({ where: { id: GLOBAL_STATS_ID } });
  let newAvgRatio = compressionRatio;
  if (existing && existing.totalCompressions > 0) {
    newAvgRatio =
      ((existing?.avgCompressionRatio ?? 0) * existing.totalCompressions + compressionRatio) /
      (existing.totalCompressions + 1);
  }

  await client.systemStats.upsert({
    where: { id: GLOBAL_STATS_ID },
    update: {
      totalCompressions: { increment: 1 },
      totalDataProcessed: { increment: BigInt(bytesProcessed) },
      totalStorageUsed: storageUsed ? { increment: BigInt(storageUsed) } : undefined,
      avgCompressionRatio: newAvgRatio,
      lastUpdated: new Date(),
    },
    create: {
      id: GLOBAL_STATS_ID,
      firstEntryDate: new Date(),
      lastUpdated: new Date(),
      totalUsers: 1,
      totalCompressions: 1,
      totalDataProcessed: BigInt(bytesProcessed),
      totalStorageUsed: BigInt(storageUsed || 0),
      avgCompressionRatio: compressionRatio,
    },
  });
}

async function updateCategoryStats({
  category,
  ratio,
  duration,
}: {
  category: string;
  ratio: number;
  duration: number;
}) {
  const GLOBAL_STATS_ID = "global";
  const field = (x: string) => x.toLowerCase().replace(/[^a-z]/g, '');

  const countField = `${field(category)}Count` as keyof typeof client.systemStats;
  const ratioField = `${field(category)}AvgRatio` as keyof typeof client.systemStats;
  const durField = `${field(category)}AvgDuration` as keyof typeof client.systemStats;

  const existing = await client.systemStats.findUnique({ where: { id: GLOBAL_STATS_ID } });
  if (!existing) {
    // If stats row didn't exist, create with just this category
    return client.systemStats.create({
      data: {
        id: GLOBAL_STATS_ID,
        totalUsers: 1,
        totalCompressions: 0,
        totalDataProcessed: BigInt(0),
        totalStorageUsed: BigInt(0),
        avgCompressionRatio: 0,
        [countField]: 1,
        [ratioField]: ratio,
        [durField]: duration,
      } as any,
    });
  }

  const prevCount = (existing as any)[countField] || 0;
  const prevAvgRatio = (existing as any)[ratioField] || 0;
  const prevAvgDur = (existing as any)[durField] || 0;

  const newAvgRatio = ((prevAvgRatio * prevCount) + ratio) / (prevCount + 1);
  const newAvgDuration = ((prevAvgDur * prevCount) + duration) / (prevCount + 1);

  return client.systemStats.update({
    where: { id: GLOBAL_STATS_ID },
    data: {
      [countField]: { increment: 1 },
      [ratioField]: newAvgRatio,
      [durField]: newAvgDuration,
    } as any,
  });
}

async function updateAlgorithmStats({
  algorithm,
  ratio,
  duration,
}: {
  algorithm: AlgoKey;
  ratio: number;
  duration: number;
}) {
  const GLOBAL_STATS_ID = "global";
  const countField = `${algorithm}Count` as keyof typeof client.systemStats;
  const ratioField = `${algorithm}AvgRatio` as keyof typeof client.systemStats;
  const durField = `${algorithm}AvgDuration` as keyof typeof client.systemStats;

  const existing = await client.systemStats.findUnique({ where: { id: GLOBAL_STATS_ID } });
  if (!existing) {
    return client.systemStats.create({
      data: {
        id: GLOBAL_STATS_ID,
        totalUsers: 1,
        totalCompressions: 0,
        totalDataProcessed: BigInt(0),
        totalStorageUsed: BigInt(0),
        avgCompressionRatio: 0,
        [countField]: 1,
        [ratioField]: ratio,
        [durField]: duration,
      } as any,
    });
  }

  const prevCount = (existing as any)[countField] || 0;
  const prevAvgRatio = (existing as any)[ratioField] || 0;
  const prevAvgDur = (existing as any)[durField] || 0;
  const newCount = prevCount + 1;
  const newAvgRatio = ((prevAvgRatio * prevCount) + ratio) / newCount;
  const newAvgDuration = ((prevAvgDur * prevCount) + duration) / newCount;

  return client.systemStats.update({
    where: { id: GLOBAL_STATS_ID },
    data: {
      [countField]: { increment: 1 },
      [ratioField]: newAvgRatio,
      [durField]: newAvgDuration,
    } as any,
  });
}

function categorizeMime(mime?: string | null): string {
  if (!mime) return 'Unknown';
  if (mime.startsWith('image/')) return 'Photo';
  if (mime.startsWith('video/')) return 'Video';
  if (
    mime === 'application/pdf' ||
    mime.startsWith('application/msword') ||
    mime.startsWith(
      'application/vnd.openxmlformats-officedocument'
    )
  ) return 'Document';
  if (mime.startsWith('text/')) return 'Text';
  if (mime.startsWith('audio/')) return 'Audio';
  return 'Unknown';
}

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

    // Parse the request body
    const rawData = await request.json();
    
    // Extract metadata before general sanitization
    const rawMetadata = rawData.metadata;
    
    // Sanitize everything except metadata
    const { metadata: _, ...dataWithoutMetadata } = rawData;
    const sanitizedData = sanitizeObject(dataWithoutMetadata);
    
    // Handle metadata separately to preserve its structure
    const sanitizedMetadata = rawMetadata ? sanitizeMetadata(rawMetadata) : null;
    
    // Validate that no null bytes remain in the sanitized data
    if (!validateNoNullBytes(sanitizedData, 'sanitizedData')) {
      console.error('Null bytes found in sanitized data!');
      return NextResponse.json(
        { error: 'Data contains invalid characters' },
        { status: 400 }
      );
    }
    
    if (sanitizedMetadata && !validateNoNullBytes(sanitizedMetadata, 'sanitizedMetadata')) {
      console.error('Null bytes found in sanitized metadata!');
      return NextResponse.json(
        { error: 'Metadata contains invalid characters' },
        { status: 400 }
      );
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
      mimeType,
      status = 'COMPLETED',
      inputFiles = [],
      outputFiles = [],
    } = sanitizedData || {};

    // Additional validation for critical fields
    if (!type || !algorithm) {
      return NextResponse.json(
        { error: 'Missing required fields: type and algorithm' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const validOriginalSize = Math.max(0, parseInt(originalSize) || 0);
    if (isNaN(validOriginalSize) || validOriginalSize < 0) {
      return NextResponse.json(
        { error: 'Invalid originalSize value' },
        { status: 400 }
      );
    }

    // Sanitize critical string fields again for extra safety
    const safeType = sanitizeString(type) || 'UNKNOWN';
    const safeAlgorithm = sanitizeString(algorithm) || 'UNKNOWN';
    const safeStatus = sanitizeString(status) || 'COMPLETED';

    // 1. Create Job with sanitized data and preserved metadata
    const job = await client.compressionJob.create({
      data: {
        userId: userRecord.id,
        type: type.toUpperCase(), // Use sanitized values
        status: status,
        originalSize: BigInt(validOriginalSize),
        compressedSize: compressedSize ? BigInt(Math.max(0, parseInt(compressedSize) || 0)) : null,
        compressionRatio: parseFloat(compressionRatio) || 0,
        compressedBase64,
        decompressedBase64,
        duration: parseFloat(duration) || 0,
        endTime: new Date(),
        algorithm: algorithm.toUpperCase(), // Use sanitized values
        metadata: sanitizedMetadata, // Use the specially handled metadata
      },
    });

    // 2. Create Input Files with sanitized data
    const inputFileCreates = (inputFiles || []).map((f: any) => {
      const sanitizedFile = sanitizeObject(f);
      if (!sanitizedFile) return null;
      
      // Validate file data doesn't contain null bytes
      if (!validateNoNullBytes(sanitizedFile, 'inputFile')) {
        console.error('Null bytes found in input file data');
        return null;
      }
      
      return client.file.create({
        data: {
          userId: userRecord.id,
          filename: sanitizeString(sanitizedFile.filename) || 'unknown',
          originalName: sanitizeString(sanitizedFile.originalName || sanitizedFile.filename) || 'unknown',
          mimeType: sanitizeString(sanitizedFile.mimeType) || 'application/octet-stream',
          size: BigInt(Math.max(0, parseInt(sanitizedFile.size) || 0)),
          path: sanitizeString(sanitizedFile.path) || '',
          checksum: sanitizeString(sanitizedFile.checksum) || '',
          isTemporary: Boolean(sanitizedFile.isTemporary ?? true),
        },
      });
    }).filter(Boolean);
    
    const createdInputFiles = inputFileCreates.length > 0 ? await Promise.all(inputFileCreates) : [];

    // 3. Create Output Files with sanitized data
    const outputFileCreates = (outputFiles || []).map((f: any) => {
      const sanitizedFile = sanitizeObject(f);
      if (!sanitizedFile) return null;
      
      // Validate file data doesn't contain null bytes
      if (!validateNoNullBytes(sanitizedFile, 'outputFile')) {
        console.error('Null bytes found in output file data');
        return null;
      }
      
      return client.file.create({
        data: {
          userId: userRecord.id,
          filename: sanitizeString(sanitizedFile.filename) || 'unknown',
          originalName: sanitizeString(sanitizedFile.originalName || sanitizedFile.filename) || 'unknown',
          mimeType: sanitizeString(sanitizedFile.mimeType) || 'application/octet-stream',
          size: BigInt(Math.max(0, parseInt(sanitizedFile.size) || 0)),
          path: sanitizeString(sanitizedFile.path) || '',
          checksum: sanitizeString(sanitizedFile.checksum) || '',
          isTemporary: Boolean(sanitizedFile.isTemporary ?? true),
        },
      });
    }).filter(Boolean);
    
    const createdOutputFiles = outputFileCreates.length > 0 ? await Promise.all(outputFileCreates) : [];

    // 4. Link Input/Output Files
    if (createdInputFiles.length > 0 || createdOutputFiles.length > 0) {
      const updateData: any = {};
      
      if (createdInputFiles.length > 0) {
        updateData.inputFiles = {
          connect: createdInputFiles.map(f => ({ id: f.id })),
        };
      }
      
      if (createdOutputFiles.length > 0) {
        updateData.outputFiles = {
          connect: createdOutputFiles.map(f => ({ id: f.id })),
        };
      }

      await client.compressionJob.update({
        where: { id: job.id },
        data: updateData,
      });
    }

    // 5. Optional: handle compressedBase64 / decompressedBase64 as virtual file
    if (fileName && (compressedBase64 || decompressedBase64)) {
      const sanitizedFileName = sanitizeString(fileName) || 'compressed_file';
      const sanitizedMimeType = sanitizeString(mimeType) || 'application/octet-stream';
      
      const virtualFile = await client.file.create({
        data: {
          userId: userRecord.id,
          filename: sanitizedFileName,
          originalName: sanitizedFileName,
          mimeType: sanitizedMimeType,
          size: BigInt(Math.max(0, parseInt(compressedSize || originalSize) || 0)),
          path: `/uploads/${sanitizedFileName}`,
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

    // Update statistics with validated data
    const validCompressionRatio = parseFloat(compressionRatio) || 0;
    const validDuration = parseFloat(duration) || 0;
    const validCompressedSize = compressedSize ? Math.max(0, parseInt(compressedSize) || 0) : undefined;

    // a) global stats
    await updateGlobalStats({
      bytesProcessed: validOriginalSize,
      compressionRatio: validCompressionRatio,
      storageUsed: validCompressedSize,
    });

    // b) category‐wise (assume first input file's mimeType)
    const mime = (inputFiles && inputFiles[0]?.mimeType) || mimeType;
    const category = categorizeMime(sanitizeString(mime));
    await updateCategoryStats({
      category,
      ratio: validCompressionRatio,
      duration: validDuration,
    });

    //c) algorithm‐wise
    const cleanAlgorithm = safeAlgorithm.toLowerCase();
    const validAlgorithms: AlgoKey[] = ['huffman', 'lz77', 'lzw', 'arithmetic'];
    const algorithmKey = validAlgorithms.includes(cleanAlgorithm as AlgoKey) 
      ? cleanAlgorithm as AlgoKey 
      : 'huffman'; // default fallback
      
    await updateAlgorithmStats({
      algorithm: algorithmKey,
      ratio: validCompressionRatio,
      duration: validDuration,
    });

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
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Failed to save compression job', details: error instanceof Error ? error.message : 'Unknown error' },
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
      metadata:         job.metadata ?? null,
      compressedBase64: job.compressedBase64 ?? null,     
      decompressedBase64: job.decompressedBase64 ?? null, 

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
