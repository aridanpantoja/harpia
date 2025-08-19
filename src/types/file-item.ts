import type { InferSelectModel } from 'drizzle-orm';
import type { file } from '@/lib/db/schema';

export type FileItem = InferSelectModel<typeof file> & {
  downloadUrl?: string;
};
