// /app/api/sync-user/route.ts
import { currentUser } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  const user = await currentUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  await connectDB();

  // Check if user exists
  const existing = await User.findOne({ clerkId: user.id });
  if (!existing) {
    await User.create({
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.firstName + ' ' + user.lastName,
    });
  }

  return new Response('User synced', { status: 200 });
}
