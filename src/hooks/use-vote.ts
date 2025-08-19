import { useMutation } from '@tanstack/react-query';
import { voteService } from '@/services/vote';

type useVoteProps = {
  chatId: string;
  messageId: string;
};

export function useVote({ chatId, messageId }: useVoteProps) {
  const voteMutation = useMutation({
    mutationFn: async ({ type }: { type: 'up' | 'down' }) =>
      voteService.vote({ chatId, messageId, type }),
  });

  return voteMutation;
}
