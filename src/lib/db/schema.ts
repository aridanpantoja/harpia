import { type InferSelectModel, type SQL, sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  customType,
  index,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  vector,
} from 'drizzle-orm/pg-core';

export const tsvector = customType<{
  data: string;
}>({
  dataType() {
    return 'tsvector';
  },
});

export const file = pgTable('file', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: text('url').notNull().unique(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  filename: text('filename').notNull().unique(),
  pages: bigint('pages', { mode: 'number' }).notNull(),
  metadata: jsonb('metadata').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const fileChunk = pgTable(
  'file_chunk',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    content: text('content').notNull(),
    metadata: jsonb('metadata').notNull(),
    fts: tsvector('fts')
      .notNull()
      .generatedAlwaysAs(
        (): SQL => sql`to_tsvector('portuguese', ${fileChunk.content})`
      ),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    fileId: uuid('file_id')
      .references(() => file.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_file_chunks_fts').using('gin', table.fts),
    index('idx_file_chunks_embedding').using(
      'hnsw',
      table.embedding.op('vector_ip_ops')
    ),
  ]
);

export const chat = pgTable('chat', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const message = pgTable('message', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id')
    .references(() => chat.id)
    .notNull(),
  parts: jsonb('parts').notNull(),
  role: text('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

export const vote = pgTable(
  'vote',
  {
    chatId: uuid('chat_id')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('message_id')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('is_upvoted').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.chatId, table.messageId] })]
);

export type Vote = InferSelectModel<typeof vote>;
