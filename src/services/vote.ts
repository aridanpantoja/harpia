import axios from 'axios';
import type { Vote } from '@/lib/db/schema';

type VoteData = {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
};

async function vote({ chatId, messageId, type }: VoteData) {
  const response = await axios.patch('/api/vote', {
    chatId,
    messageId,
    type,
  });
  return response.data;
}

async function getVotesByChatId({ chatId }: { chatId: string }) {
  const response = await axios.get<Vote[]>(`/api/vote?chatId=${chatId}`);
  return response.data;
}

export const voteService = {
  vote,
  getVotesByChatId,
};
