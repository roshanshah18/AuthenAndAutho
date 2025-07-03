import { createExpressEndpoints } from '@ts-rest/express';
import { userContract } from '@expense-tracker/contract/routers/user.contract';
import { userRouter } from '../modules/user/route/user.route';
import { authContract } from '@expense-tracker/contract/routers/auth.contract';
import { authRouter } from '../modules/auth/route/auth.route';

const routers = [
  {
    contract: userContract,
    router: userRouter,
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
