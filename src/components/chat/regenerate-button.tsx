'use client';

import { RotateCcw } from 'lucide-react';
import { useMessageRegenerate } from '@/hooks/use-message-regenerate';
import { TooltipButton } from '../common/tooltip-button';

type RegenerateButtonProps = {
  messageId: string;
};

export function RegenerateButton({ messageId }: RegenerateButtonProps) {
  const { handleRegenerate } = useMessageRegenerate();

  return (
    <TooltipButton
      content="Refazer resposta"
      onClick={() => handleRegenerate(messageId)}
      size="icon"
      variant="outline"
    >
      <RotateCcw />
    </TooltipButton>
  );
}
