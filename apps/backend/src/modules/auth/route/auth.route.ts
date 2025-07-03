import { initServer } from '@ts-rest/express';
import {
  authMeHandler,
  forgetPasswordHandler,
  loginUserHandler,
  logoutUserHandler,
  refreshTokenHandler,
  resendOtpHandler,
  resetPasswordHandler,
  signupUserHandler,
  verifyOtpHandler,
} from '../controller/auth.controller';
import { authContract } from '@expense-tracker/contract/routers/auth.contract';
import { authenticateJWT } from '../../../middleware/auth.middleware';

const s = initServer();

export const authRouter = s.router(authContract, {
  signup: signupUserHandler,
  login: loginUserHandler,
  verifyOtp: verifyOtpHandler,
  resendOtp: resendOtpHandler,
  forgotPassword: forgetPasswordHandler,
  resetPassword: resetPasswordHandler,
  authMe: {
    handler: authMeHandler,
    middleware: [authenticateJWT],
  },
  logout: {
    handler: logoutUserHandler,
    middleware: [authenticateJWT],
  },
  refresh: refreshTokenHandler,
});
