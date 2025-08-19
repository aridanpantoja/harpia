import { openai } from '@ai-sdk/openai';
import { generateText, type UIMessage, type UIMessagePart } from 'ai';
import type { DBMessage } from '@/lib/db/schema';
import type { ChatTools, MessageMetadata } from '@/types/ai.type';

export async function generateTitleFromUserMessage({
  message,
}: {
  message: string;
}) {
  const { text } = await generateText({
    model: openai('gpt-5-nano'),
    prompt: `
      Você é um assistente útil que gera um título para um chat com base na mensagem do usuário.  
      O título deve ser uma única frase que capture a ideia principal do chat.  
      O título deve ter no máximo 10 palavras.  

      Mensagem do usuário: ${message}
    `,
  });

  return text;
}

export function convertToUIMessages(messages: DBMessage[]): UIMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role as 'user' | 'assistant' | 'system',
    parts: message.parts as UIMessagePart<MessageMetadata, ChatTools>[],
    metadata: {
      createdAt: message.createdAt.toISOString(),
    },
  }));
}
