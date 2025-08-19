import { useQuery } from '@tanstack/react-query';
import type { Chat } from '@/lib/db/queries';
import { historyService } from '@/services/history';

export function useHistory() {
  const query = useQuery<Chat[]>({
    queryKey: ['history'],
    queryFn: async () => await historyService.getHistory(),
  });

  return query;
}
