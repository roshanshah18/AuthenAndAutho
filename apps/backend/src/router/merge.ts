import { createExpressEndpoints } from '@ts-rest/express';
import { userContract } from '@expense-tracker/contract/routers/user.contract';
import { userRouter } from '../modules/user/route/user.route';
import { sendEmailContract } from '@expense-tracker/contract/routers/sendEmail.contract';
import { emailRouter } from '../modules/email/routes/email.route';
import { authContract } from '@expense-tracker/contract/routers/auth.contract';
import { authRouter } from '../modules/auth/route/auth.route';

const routers = [
  {
    contract: userContract,
    router: userRouter,
  },
  {
    contract: sendEmailContract,
    router: emailRouter,
  },
  {
    contract: authContract,
    router: authRouter,
  },
];

export function generateEndPoints(app: any) {
  return routers.map(({ contract, router }) => {
    createExpressEndpoints(contract, router, app, {
      logInitialization: true,
      requestValidationErrorHandler(err, req, res, next) {
        res.status(400).json({
          error: 'Request validation error',
          isSuccess: false,
          fieldErrors: err.body?.flatten().fieldErrors,
        });
      },
    });
  });
}
