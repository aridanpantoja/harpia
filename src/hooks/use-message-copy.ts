'use client';

import type { UIMessage } from 'ai';
import { useState } from 'react';

export function useMessageCopy() {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (message: UIMessage) => {
    if (message) {
      const text = message.parts
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('');
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return { handleCopy, isCopied };
}
