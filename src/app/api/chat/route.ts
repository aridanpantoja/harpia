import { openai } from '@ai-sdk/openai';
import { auth } from '@clerk/nextjs/server';
import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai';
import { SYSTEM_PROMPT } from '@/config/prompt';
import { hybridSearchTool } from '@/lib/ai/tools/hybrid-search';
import {
  convertToUIMessages,
  generateTitleFromUserMessage,
} from '@/lib/ai/utils';
import {
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import type { DBMessage } from '@/lib/db/schema';
import { generateUUID } from '@/lib/utils';

export const maxDuration = 30;

export const MAX_MESSAGES_PER_DAY = 50;

type PostRequestBody = {
  chatId: string;
  message: UIMessage;
};

export async function POST(req: Request) {
  const { message, chatId }: PostRequestBody = await req.json();

  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const [messageCount, chat] = await Promise.all([
    getMessageCountByUserId({ id: userId, differenceInHours: 24 }),
    getChatById({ id: chatId }),
  ]);

  if (messageCount > MAX_MESSAGES_PER_DAY) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  if (chat) {
    if (chat.userId !== userId) {
      return new Response('Forbidden', { status: 403 });
    }
  } else {
    const title = await generateTitleFromUserMessage({
      message: JSON.stringify(message),
    });

    await saveChat({
      id: chatId,
      title,
      userId,
    });
  }

  const userMessage = {
    id: message.id,
    chatId,
    parts: message.parts,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  } satisfies DBMessage;

  const messagesFromDb = await getMessagesByChatId({ id: chatId });
  const uiMessages = [...convertToUIMessages(messagesFromDb), message];

  saveMessages({ messages: [userMessage] }).catch();

  const stream = createUIMessageStream({
    execute: ({ writer: dataStream }) => {
      const result = streamText({
        model: openai('gpt-5-nano'),
        system: SYSTEM_PROMPT,
        messages: convertToModelMessages(uiMessages),
        stopWhen: stepCountIs(10),
        experimental_transform: smoothStream({ chunking: 'word' }),
        tools: {
          hybridSearchTool,
        },
      });

      result.consumeStream();

      dataStream.merge(
        result.toUIMessageStream({
          sendReasoning: true,
        })
      );
    },
    generateId: generateUUID,
    onFinish: async ({ responseMessage }) => {
      await saveMessages({
        messages: [
          {
            id: responseMessage.id,
            role: responseMessage.role,
            parts: responseMessage.parts,
            createdAt: new Date(),
            updatedAt: new Date(),
            chatId,
          },
        ],
      });
    },
    onError: () => {
      return 'Oops, an error occurred!';
    },
  });

  return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
}
