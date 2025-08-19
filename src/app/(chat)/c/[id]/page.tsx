import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { Chat } from '@/components/chat/chat';
import { convertToUIMessages } from '@/lib/ai/utils';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  if (userId !== chat.userId) {
    return notFound();
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const uiMessages = convertToUIMessages(messagesFromDb);

  return <Chat chatId={id} initialMessages={uiMessages} userId={userId} />;
}
