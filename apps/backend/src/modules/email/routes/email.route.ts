import { initServer } from '@ts-rest/express';
import { sendEmailContract } from '@expense-tracker/contract/routers/sendEmail.contract';
import { sendEmailToUserHandler } from '../controllers/email.controller';

const s = initServer();

export const emailRouter = s.router(sendEmailContract, {
  sendEmailToUser: sendEmailToUserHandler,
});
