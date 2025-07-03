import { initContract } from '@ts-rest/core';
import { ErrorSchema, SuccessSchema } from '../schemas/common.schema';
import { sendEmailSchema } from '../schemas/sendEmail.schema';

const c = initContract();

export const sendEmailContract = c.router({
  sendEmailToUser: {
    method: 'POST',
    path: '/user/sendEmail',
    body: sendEmailSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Send Email to User',
  },
});
