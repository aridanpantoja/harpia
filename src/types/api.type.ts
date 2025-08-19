import z from 'zod';

const textPartSchema = z.object({
  type: z.enum(['text']),
  text: z.string().min(1).max(2000),
});

export const postRequestBodySchema = z.object({
  chatId: z.uuid(),
  userId: z.uuid().nullable(),
  guestId: z.uuid().nullable(),
  message: z.object({
    id: z.string().uuid(),
    role: z.enum(['user']),
    parts: z.array(textPartSchema),
  }),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
