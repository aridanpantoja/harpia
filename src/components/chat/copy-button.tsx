'use client';

import type { UIMessage } from 'ai';
import { Check, Copy } from 'lucide-react';
import { useMessageCopy } from '@/hooks/use-message-copy';
import { TooltipButton } from '../common/tooltip-button';

type CopyButtonProps = {
  message: UIMessage;
};

export function CopyButton({ message }: CopyButtonProps) {
  const { handleCopy, isCopied } = useMessageCopy();

  return (
    <TooltipButton
      content={isCopied ? 'Copiado' : 'Copiar'}
      onClick={() => handleCopy(message)}
      size="icon"
      variant="outline"
    >
      {isCopied ? <Check /> : <Copy />}
    </TooltipButton>
  );
}
