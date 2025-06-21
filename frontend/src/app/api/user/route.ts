// app/api/user/route.ts
import { NextResponse } from "next/server";
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ status: 401, data: null }, { status: 401 });
  }

  const raw = await client.user.findUnique({
    where: { clerkId: user.id },
    select: {
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      files: {
        select: {
          id: true,
          filename: true,
          originalName: true,
          mimeType: true,
          size: true,      // BigInt
          checksum: true,
          isTemporary: true,
          isPublic: true,
        },
      },
      compressionJobs: {
        select: {
          id: true,
          status: true,
          type: true,
          originalSize: true,     // BigInt
          compressedSize: true,   // BigInt?
          compressionRatio: true,
          startTime: true,
          endTime: true,
          duration: true,
          inputFiles: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              size: true,      // BigInt
            },
          },
          outputFiles: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              size: true,      // BigInt
            },
          },
        },
      },
    },
  });

  if (!raw) {
    return NextResponse.json({ status: 404, data: null }, { status: 404 });
  }

  // Convert BigInts to strings — including nested file arrays
  const data = {
    email: raw.email,
    username: raw.username,
    firstName: raw.firstName,
    lastName: raw.lastName,
    avatar: raw.avatar,
    files: raw.files.map(f => ({
      ...f,
      size: f.size.toString(),
    })),
    compressionJobs: raw.compressionJobs.map(j => ({
      id:               j.id,
      status:           j.status,
      type:             j.type,
      originalSize:     j.originalSize.toString(),
      compressedSize:   j.compressedSize?.toString() ?? null,
      compressionRatio: j.compressionRatio,
      startTime:        j.startTime.toLocaleDateString(),
      endTime:          j.endTime?.toLocaleDateString() ?? null,
      duration:         j.duration,
      inputFiles: j.inputFiles.map(f => ({
        id:           f.id,
        filename:     f.filename,
        originalName: f.originalName,
        size:         f.size.toString(),
      })),
      outputFiles: j.outputFiles.map(f => ({
        id:           f.id,
        filename:     f.filename,
        originalName: f.originalName,
        size:         f.size.toString(),
      })),
    })),
  };

  return NextResponse.json({ status: 200, data }, { status: 200 });
}
