import { authContract } from './auth.contract';
import { sendEmailContract } from './sendEmail.contract';
import { userContract } from './user.contract';

export const contract = {
  userContract,
  sendEmailContract,
  authContract,
};

export type Contract = typeof contract;
