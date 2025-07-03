import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type TsignupSchema = z.infer<typeof signupSchema>;

export const verifyOtpSchema = z.object({
  email: z.string(),
  otp: z.string(),
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type TloginSchema = z.infer<typeof loginSchema>;

export const resendOtpSchema = z.object({
  email: z.string(),
});

export type TresendOtpSchema = z.infer<typeof resendOtpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string(),
});

export type TforgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.string(),
  token: z.string(),
  newPassword: z.string(),
});

export type TresetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const authMe = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  token: z.string(),
});

export type TauthMe = z.infer<typeof authMe>;
