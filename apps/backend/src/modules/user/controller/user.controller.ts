import { AppRouteQueryImplementation } from '@ts-rest/express/src/lib/types';
import { getUserById } from '../services/user.service';
import { userContract } from '@expense-tracker/contract/routers/user.contract';

export const getUserByIdHandler: AppRouteQueryImplementation<
  typeof userContract.getUser
> = async ({ req }) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId) || userId <= 0) {
      return {
        status: 400,
        body: {
          isSuccess: false,
          message: 'Invalid UserId',
        },
      };
    }

    if (!userId) {
      return {
        status: 400,
        body: {
          isSuccess: false,
          message: 'User Id is required',
        },
      };
    }
    const user = await getUserById(userId);
    return {
      status: 200,
      body: {
        isSuccess: true,
        message: 'User Found Successfully',
        data: user,
      },
    };
  } catch (error) {
    return {
      status: 404,
      body: { message: error.message },
    };
  }
};
