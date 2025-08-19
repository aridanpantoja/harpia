import type { InferSelectModel } from 'drizzle-orm';
import type { message } from '@/lib/db/schema';

export type MessageWithVotes = InferSelectModel<typeof message> & {
  chatTitle: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasVote?: boolean;
  voteType?: 'up' | 'down' | null;
};
