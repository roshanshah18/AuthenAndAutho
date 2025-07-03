import { initContract } from '@ts-rest/core';
import {} from '../schemas/auth.schema';
import { ErrorSchema, SuccessSchema } from '../schemas/common.schema';
import { userSchema } from '../schemas/user.schema';

const c = initContract();

export const userContract = c.router({
  getUser: {
    method: 'GET',
    path: '/user/:id',
    responses: {
      200: SuccessSchema.extend({
        data: userSchema,
      }),
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get a user',
  },
});
