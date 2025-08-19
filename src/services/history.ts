import axios from 'axios';
import type { Chat } from '@/lib/db/queries';

async function getHistory() {
  const response = await axios.get<Chat[]>('/api/history');
  return response.data;
}

export const historyService = { getHistory };
