import { ThumbsUp } from 'lucide-react';
import { useVote } from '@/hooks/use-vote';
import type { Vote } from '@/lib/db/schema';
import { TooltipButton } from '../common/tooltip-button';

type UpvoteButtonProps = {
  chatId: string;
  messageId: string;
  vote: Vote | undefined;
};

export function UpvoteButton({ chatId, messageId, vote }: UpvoteButtonProps) {
  const { mutateAsync } = useVote({ chatId, messageId });

  return (
    <TooltipButton
      content="Curtir"
      disabled={vote?.isUpvoted === true}
      onClick={() => mutateAsync({ type: 'up' })}
      size="icon"
      variant="outline"
    >
      <ThumbsUp />
    </TooltipButton>
  );
}
