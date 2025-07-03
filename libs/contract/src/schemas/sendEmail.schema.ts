import { z } from 'zod';

export const sendEmailSchema = z.object({
  to: z.string(),
  subject: z.string(),
  html: z.string(),
});

export type TsendEmailSchema = z.infer<typeof sendEmailSchema>;
