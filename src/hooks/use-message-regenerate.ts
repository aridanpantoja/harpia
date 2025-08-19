import { useChat } from '@ai-sdk/react';

export function useMessageRegenerate() {
  const { regenerate } = useChat();

  const handleRegenerate = (messageId: string) => {
    regenerate({
      messageId,
    });
  };

  return { handleRegenerate };
}
