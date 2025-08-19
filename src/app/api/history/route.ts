import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { getChatsByUserId } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const limit = Number.parseInt(searchParams.get('limit') || '10', 10);

  const { userId } = await auth();

  if (!userId) {
    return new Error('unauthorized:history');
  }

  const chats = await getChatsByUserId({
    id: userId,
    limit,
  });

  return Response.json(chats);
}
