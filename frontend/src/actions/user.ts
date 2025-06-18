"use server"

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { startOfToday } from 'date-fns';

const incrementUserCountInSystemStats = async () => {
  const today = startOfToday();

  await client.systemStats.upsert({
    where: { date: today },
    update: {
      totalUsers: { increment: 1 }
    },
    create: {
      date: today,
      totalUsers: 1
    }
  });
};

export const onAuthenticateUser = async () => {
    try{
        const user = await currentUser()
        if(!user) {
            console.log("🔴No user found in the onAuthenticateUser server action");
            return { status: 401, message: "Unauthorized", data: null }
        }

        const userExists = await client.user.findUnique({
            where: {
                clerkId: user.id
            },
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
                        size: true,
                        checksum: true,
                        isTemporary: true,
                        isPublic: true
                    }
                },
                compressionJobs: {
                    select: {
                        id: true,
                        status: true,
                        type: true,
                        originalSize: true,
                        compressedSize: true,
                        compressionRatio: true,
                        startTime: true,
                        endTime: true,
                        duration: true
                    }
                }
            }
        })

        if(userExists) {
            console.log("🟢User exists", userExists);
            return { status: 200, message: "User exists", data: userExists }
        }

        const newUser = await client.user.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0]?.emailAddress,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.imageUrl
            }
        })

        if(newUser) {
            console.log("🟢User created", newUser);
            await incrementUserCountInSystemStats();
            return { status: 201, message: "User created", data: newUser }
        }

        console.log("🔴Error in the onAuthenticateUser server action");
        return { status: 400, message: "Error in the onAuthenticateUser server action", data: null }
    }catch(err) {
        console.log("🔴Error in the onAuthenticateUser server action", err);
        return { status: 500, message: "Error in the onAuthenticateUser server action", data: null }
    }
}