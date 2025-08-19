import type { InferUITool, UIMessagePart } from 'ai';
import z from 'zod';
import type { hybridSearchTool } from '@/lib/ai/tools/hybrid-search';

export type DataPart = { type: 'append-message'; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type MessagePart = UIMessagePart<MessageMetadata, ChatTools>[];

type HybridSearchTool = InferUITool<typeof hybridSearchTool>;

export type ChatTools = {
  hybridSearch: HybridSearchTool;
};
