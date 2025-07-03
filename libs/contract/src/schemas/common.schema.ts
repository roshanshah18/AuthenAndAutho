import { z } from 'zod';

export const ErrorSchema = z.object({
  message: z.string(),
  isSuccess: z.boolean(),
});

export const SuccessSchema = z.object({
  message: z.string(),
  isSuccess: z.boolean(),
});
