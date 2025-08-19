import type { UIMessage } from 'ai';
import type { Vote } from '@/lib/db/schema';
import { CopyButton } from './copy-button';
import { DownvoteButton } from './downvote-button';
import { UpvoteButton } from './upvote-button';

type MessageActionsProps = {
  message: UIMessage;
  chatId: string;
  vote: Vote | undefined;
};

export function MessageActions({ message, chatId, vote }: MessageActionsProps) {
  if (message.role !== 'assistant') {
    return null;
  }

  return (
    <div className="flex justify-end gap-2">
      <CopyButton message={message} />
      <UpvoteButton chatId={chatId} messageId={message.id} vote={vote} />
      <DownvoteButton chatId={chatId} messageId={message.id} vote={vote} />
    </div>
  );
}
