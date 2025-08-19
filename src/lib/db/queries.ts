import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  type InferSelectModel,
  lte,
  sql,
} from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chat, type DBMessage, file, message, vote } from './schema';

const client = postgres(process.env.DATABASE_URL as string);
const db = drizzle(client);

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      userId,
      title,
    });
  } catch {
    throw new Error('Failed to save chat');
  }
}

export async function getChatsByUserId({
  id,
  limit,
}: {
  id: string;
  limit: number;
}) {
  try {
    const query = limit
      ? db
          .select()
          .from(chat)
          .where(eq(chat.userId, id))
          .orderBy(desc(chat.createdAt))
          .limit(limit)
      : db
          .select()
          .from(chat)
          .where(eq(chat.userId, id))
          .orderBy(desc(chat.createdAt));

    const chats = await query;

    return chats;
  } catch {
    throw new Error('Failed to get chats by user id');
  }
}

export type Chat = InferSelectModel<typeof chat>;

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch {
    return null;
  }
}

export async function saveMessages({ messages }: { messages: DBMessage[] }) {
  try {
    return await db.insert(message).values(messages);
  } catch {
    throw new Error('Failed to save message');
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch {
    return [];
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === 'up' })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }

    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    });
  } catch {
    throw new Error('Failed to vote message');
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch {
    throw new Error('Failed to get votes by chat id');
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch {
    throw new Error('Failed to get message by id');
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - differenceInHours * 60 * 60 * 1000
    );

    const [stats] = await db
      .select({ count: count(message.id) })
      .from(message)
      .innerJoin(chat, eq(message.chatId, chat.id))
      .where(
        and(
          eq(chat.userId, id),
          gte(message.createdAt, twentyFourHoursAgo),
          eq(message.role, 'user')
        )
      )
      .execute();

    return stats?.count ?? 0;
  } catch {
    throw new Error('Failed to get message count by user id');
  }
}

export async function getFiles() {
  try {
    return await db.select().from(file);
  } catch {
    throw new Error('Failed to get files');
  }
}

// Admin queries
export async function getAllMessagesWithVotes() {
  try {
    return await db
      .select({
        id: message.id,
        chatId: message.chatId,
        parts: message.parts,
        role: message.role,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        chatTitle: chat.title,
        userId: chat.userId,
        upvotes: count(vote.isUpvoted),
        downvotes: count(vote.isUpvoted),
      })
      .from(message)
      .leftJoin(chat, eq(message.chatId, chat.id))
      .leftJoin(vote, eq(message.id, vote.messageId))
      .groupBy(message.id, chat.title, chat.userId)
      .orderBy(desc(message.createdAt));
  } catch {
    throw new Error('Failed to get all messages with votes');
  }
}

export async function getMessagesWithVotesByChatId({
  chatId,
}: {
  chatId: string;
}) {
  try {
    return await db
      .select({
        id: message.id,
        chatId: message.chatId,
        parts: message.parts,
        role: message.role,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        upvotes: count(vote.isUpvoted),
        downvotes: count(vote.isUpvoted),
      })
      .from(message)
      .leftJoin(vote, eq(message.id, vote.messageId))
      .where(eq(message.chatId, chatId))
      .groupBy(message.id)
      .orderBy(asc(message.createdAt));
  } catch {
    throw new Error('Failed to get messages with votes by chat id');
  }
}

export async function getAdminStats() {
  try {
    const [messageStats] = await db
      .select({ count: count(message.id) })
      .from(message)
      .execute();

    const [chatStats] = await db
      .select({ count: count(chat.id) })
      .from(chat)
      .execute();

    const [userStats] = await db
      .select({ count: count(sql`DISTINCT ${chat.userId}`) })
      .from(chat)
      .execute();

    const [fileStats] = await db
      .select({ count: count(file.id) })
      .from(file)
      .execute();

    return {
      totalMessages: messageStats?.count ?? 0,
      totalChats: chatStats?.count ?? 0,
      totalUsers: userStats?.count ?? 0,
      totalFiles: fileStats?.count ?? 0,
    };
  } catch {
    throw new Error('Failed to get admin stats');
  }
}

export async function getMessagesByDateRange({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  try {
    return await db
      .select({
        date: sql<string>`DATE(${message.createdAt})`,
        count: count(message.id),
      })
      .from(message)
      .where(
        and(gte(message.createdAt, startDate), lte(message.createdAt, endDate))
      )
      .groupBy(sql<string>`DATE(${message.createdAt})`)
      .orderBy(sql<string>`DATE(${message.createdAt})`);
  } catch {
    throw new Error('Failed to get messages by date range');
  }
}

export async function deleteChat({ id }: { id: string }) {
  try {
    return await db.delete(chat).where(eq(chat.id, id));
  } catch {
    throw new Error('Failed to delete chat');
  }
}
