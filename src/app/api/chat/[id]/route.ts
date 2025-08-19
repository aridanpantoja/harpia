import { auth } from '@clerk/nextjs/server';
import { deleteChat, getChatById } from '@/lib/db/queries';

type Params = Promise<{ id: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  const { id } = await params;

  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    return new Response('Chat not found', { status: 404 });
  }

  if (chat.userId !== userId) {
    return new Response('Forbidden', { status: 403 });
  }

  return Response.json(chat, { status: 200 });
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const { id } = await params;

  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    return new Response('Chat not found', { status: 404 });
  }

  if (userId !== chat.userId) {
    return new Response('Forbidden', { status: 403 });
  }

  await deleteChat({ id });

  return new Response('Chat deleted', { status: 200 });
}
