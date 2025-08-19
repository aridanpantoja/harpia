import { useQuery } from '@tanstack/react-query';
import type { Vote } from '@/lib/db/schema';
import { voteService } from '@/services/vote';

type useVotesProps = {
  chatId: string;
};

export function useVotes({ chatId }: useVotesProps) {
  const voteQuery = useQuery<Vote[]>({
    queryKey: ['votes', chatId],
    queryFn: async () => voteService.getVotesByChatId({ chatId }),
  });

  return voteQuery;
}
