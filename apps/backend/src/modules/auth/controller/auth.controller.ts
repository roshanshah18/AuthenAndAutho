import {
  AppRouteMutationImplementation,
  AppRouteQueryImplementation,
} from '@ts-rest/express/src/lib/types';
import {
  forgotPassword,
  generateAccessToken,
  loginService,
  resendOtpService,
  resetPassword,
  signupService,
  verifyOtpService,
  verifyToken,
} from '../service/auth.service';
import { authContract } from '@expense-tracker/contract/routers/auth.contract';
import { findUserByEmail } from '../../user/model/user.model';
import { enviroment } from '../../../config/enviroment';
import ms from 'ms';
import { deleteTokenFromDB, getTokenFromDB } from '../model/auth.model';

export const signupUserHandler: AppRouteMutationImplementation<
  typeof authContract.signup
> = async ({ req }) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return {
        status: 400,
        body: {
          isSuccess: false,
          message: 'All fields are required',
        },
      };
    }
    const user = await signupService({ email, password, name });

    return {
      status: 200,
      body: {
        isSuccess: true,
        message: 'User Created Successfully',
        data: user,
      },
    };
  } catch (error) {
    console.log('signup error:', error);
    return {
      status: 500,
      body: { message: error.message },
    };
  }
};

export const verifyOtpHandler: AppRouteMutationImplementation<
  typeof authContract.verifyOtp
> = async ({ req }) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return {
        status: 400,
        body: {
          isSuccess: false,
          message: 'All fields are required',
        },
      };
    }
    const user = await verifyOtpService({ email, otp });

    return {
      status: 200,
      body: {
        isSuccess: true,
        message: 'User verified Successfully',
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

export const resendOtpHandler: AppRouteMutationImplementation<
  typeof authContract.resendOtp
> = async ({ req }) => {
  try {
    const { email } = req.body;

    if (!email) {
      return {
        status: 400,
        body: {
          isSuccess: false,
          message: 'Email is required',
        },
      };
    }

    await resendOtpService(email);

    return {
      status: 200,
      body: {
        isSuccess: true,
        message: 'OTP resend Successfully',
      },
    };
  } catch (error) {
    return {
      status: 404,
      body: { message: error.message },
    };
  }
};

export const forgetPasswordHandler: AppRouteMutationImplementation<
  typeof authContract.forgotPassword
> = async ({ req }) => {
  try {
    const { email } = req.body;

    if (!email) {
      return {
        status: 400,
        body: {
          isSuccess: false,
          message: 'Email is required',
        },
      };
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return {
        status: 404,
        body: {
          isSuccess: false,
          message: 'User not found',
        },
      };
    }

    const resetPassword = await forgotPassword(email);
    if (!resetPassword) {
      return {
        status: 500,
        body: {
          isSuccess: false,
          message: 'Failed to initiate password reset',
        },
      };
    }

    return {
      status: 200,
      body: {
        isSuccess: true,
        message: 'Password reset email sent successfully',
      },
    };
  } catch (error) {
    console.error('ForgetPasswordHandlerError:', error);
    return {
      status: 500,
      body: {
        isSuccess: false,
        message: error.message,
      },
    };
  }
};

export const resetPasswordHandler: AppRouteMutationImplementation<
  typeof authContract.resetPassword
> = async ({ req }) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return {
        status: 400,
        body: {
          isSuccess: false,
          message: 'All fields are required',
        },
      };
    }
    const passwordReset = await resetPassword(email, token, newPassword);

    if (!passwordReset) {
      return {
        status: 404,
        body: {
          isSuccess: false,
          message: 'Failed to Reset Password',
        },
      };
    }

    return {
      status: 200,
      body: {
        isSuccess: true,
        message: 'Password Reset Successfully',
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        isSuccess: false,
        message: error.message,
      },
    };
  }
};

export const loginUserHandler: AppRouteMutationImplementation<
  typeof authContract.login
> = async ({ req, res }) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return {
        status: 400,
        body: {
          isSuccess: false,
          message: 'All fields are required',
        },
      };
    }

    const { accessToken, refreshToken, user } = await loginService(
      email,
      password
    );

    res.cookie('authorization', `Bearer ${accessToken}`, {
      httpOnly: true,
      secure: enviroment.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(
        Date.now() + ms(enviroment.JWT_ACCESS_TOKEN_EXPIRES_IN)
      ),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: enviroment.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(
        Date.now() + ms(enviroment.JWT_REFRESH_TOKEN_EXPIRES_IN)
      ),
    });

    return {
      status: 200,
      body: {
        isSuccess: true,
        message: 'Login Successfully',
        data: user,
      },
    };
  } catch (error) {
    console.error('LoginUserHandlerError:', error);
    return {
      status: 500,
      body: {
        isSuccess: false,
        message: error.message,
      },
    };
  }
};

export const authMeHandler: AppRouteQueryImplementation<
  typeof authContract.authMe
> = async ({ req }) => {
  try {
    if (!req.user) {
      return {
        status: 401,
        body: {
          isSuccess: false,
          message: 'Unauthorized',
        },
      };
    }

    const user = await findUserByEmail(req.user.email);
    if (!user.email) {
      return {
        status: 404,
        body: {
          isSuccess: false,
          message: 'User not found',
        },
      };
    }

    return {
      status: 200,
      body: {
        isSuccess: true,
        message: 'Auth Me Successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    };
  } catch (error) {
    console.error('AuthMeHandlerError:', error);
    return {
      status: 500,
      body: {
        isSuccess: false,
        message: error.message,
      },
    };
  }
};

export const logoutUserHandler: AppRouteMutationImplementation<
  typeof authContract.logout
> = async ({ req, res }) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      deleteTokenFromDB(refreshToken, req.user.id);
    }

    res.clearCookie('authorization', {
      path: '/',
      httpOnly: true,
      secure: enviroment.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.clearCookie('refreshToken', {
      path: '/',
      httpOnly: true,
      secure: enviroment.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      status: 200,
      body: {
        isSuccess: true,
        message: 'Logout Successfully',
      },
    };
  } catch (error) {
    console.error('LogoutUserHandlerError:', error);
    return {
      status: 500,
      body: {
        isSuccess: false,
        message: error.message,
      },
    };
  }
};

export const refreshTokenHandler: AppRouteMutationImplementation<
  typeof authContract.refresh
> = async ({ req, res }) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const bearerToken = `Bearer ${refreshToken}`;

    if (!refreshToken) {
      return {
        status: 401,
        body: {
          isSuccess: false,
          message: 'Refresh token missing',
        },
      };
    }

    const decoded = verifyToken(refreshToken) as {
      id: number;
      email?: string;
      name?: string;
      exp?: number;
      iat?: number;
    };

    const { exp, iat, ...cleanPayload } = decoded;

    const tokenInDb = await getTokenFromDB(bearerToken);
    if (!tokenInDb) {
      return {
        status: 403,
        body: {
          isSuccess: false,
          message: 'Invalid or expired refresh token',
        },
      };
    }

    const newAccessToken = generateAccessToken(cleanPayload);

    res.cookie('authorization', `Bearer ${newAccessToken}`, {
      httpOnly: true,
      secure: enviroment.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(
        Date.now() + ms(enviroment.JWT_ACCESS_TOKEN_EXPIRES_IN)
      ),
    });

    return {
      status: 200,
      body: {
        isSuccess: true,
        message: 'Access token refreshed successfully',
      },
    };
  } catch (error) {
    console.error('RefreshTokenHandlerError:', error);
    return {
      status: 403,
      body: {
        isSuccess: false,
        message: 'Refresh failed: ' + error.message,
      },
    };
  }
};
