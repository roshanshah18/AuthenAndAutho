import { initServer } from '@ts-rest/express';
import { userContract } from '@expense-tracker/contract/routers/user.contract';
import { getUserByIdHandler } from '../controller/user.controller';
import { authenticateJWT } from '../../../middleware/auth.middleware';

const s = initServer();

export const userRouter = s.router(userContract, {
  getUser: {
    handler: getUserByIdHandler,
    middleware: [authenticateJWT],
  },
});
