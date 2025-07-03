import { initContract } from '@ts-rest/core';
import {
  authMe,
  forgotPasswordSchema,
  loginSchema,
  resendOtpSchema,
  resetPasswordSchema,
  signupSchema,
  verifyOtpSchema,
} from '../schemas/auth.schema';
import { ErrorSchema, SuccessSchema } from '../schemas/common.schema';
import { z } from 'zod';

const c = initContract();

export const authContract = c.router({
  signup: {
    method: 'POST',
    path: '/signup',
    body: signupSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Sign up',
  },
  verifyOtp: {
    method: 'POST',
    path: '/verify-otp',
    body: verifyOtpSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Verify OTP',
  },
  resendOtp: {
    method: 'POST',
    path: '/resend-otp',
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    body: resendOtpSchema,
    summary: 'Resend OTP',
  },
  login: {
    method: 'POST',
    path: '/login',
    body: loginSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
  },
  forgotPassword: {
    method: 'POST',
    path: '/forgot-password',
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    body: forgotPasswordSchema,
    summary: 'Forgot Password',
  },
  resetPassword: {
    method: 'POST',
    path: '/reset-password',
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    body: resetPasswordSchema,
    summary: 'Reset Password',
  },
  authMe: {
    method: 'GET',
    path: '/me',
    responses: {
      200: SuccessSchema.extend({
        data: authMe,
      }),
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Auth Me',
  },
  logout: {
    method: 'POST',
    path: '/logout',
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Logout',
  },
  refresh: {
    method: 'POST',
    path: '/refresh-token',
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      401: ErrorSchema,
      403: ErrorSchema,
    },
    summary: 'Refresh Access Token',
  },
});
