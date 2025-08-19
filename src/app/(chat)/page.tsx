import { auth } from '@clerk/nextjs/server';
import { Chat } from '@/components/chat/chat';
import { generateUUID } from '@/lib/utils';

export default async function ChatPage() {
  const id = generateUUID();
  const { userId } = await auth();

  return <Chat chatId={id} initialMessages={[]} userId={userId} />;
}
