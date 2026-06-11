import { z } from "zod";

export const aiChatSchema = z.object({
  body: z.object({
    message: z.string().min(2).max(1000)
  })
});

export const recommendSchema = z.object({
  body: z.object({
    query: z.string().min(2).max(200)
  })
});
