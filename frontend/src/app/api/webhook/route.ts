import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { buffer } from 'micro';

import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const payload = await req.text();
  const headerList = await headers();
  const svixHeaders = Object.fromEntries(headerList.entries());

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: any;

  try {
    evt = wh.verify(payload, svixHeaders);
  } catch (err) {
    console.error('❌ Webhook verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data;

  if (eventType === 'user.created') {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } = data;

    const email = email_addresses?.[0]?.email_address || '';

    await User.create({
      clerkId: id,
      email,
      name: `${first_name ?? ''} ${last_name ?? ''}`.trim(),
    //   userName: 
      imageUrl: image_url,
    });

    console.log(`User ${email} saved to DB.`);
  }

  return NextResponse.json({ status: 'success' }, { status: 200 });
}
