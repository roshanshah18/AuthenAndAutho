import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  updateUserPassword,
  updateUserToActive,
} from '../../user/model/user.model';
import { hash } from 'bcrypt';
import {
  createOtp,
  createPasswordReset,
  deleteOtpRecord,
  saveTokeninDB,
  verifyResetToken,
} from '../model/auth.model';
import { sendEmailByNodemailer } from '../../../utils/mailer';
import { otpService } from '../../user/services/otplib.service';
import { getOtp, markOtpAsVerified, updateOtp } from '../model/auth.model';
import jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { enviroment } from '../../../config/enviroment';
import ms from 'ms';

const JWT_SECRET = enviroment.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');

export async function signupService({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const passwordHash = await hash(password, 10);
  const user = await createUser(email, passwordHash, name);

  const otp = otpService.generateOtp(email);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await createOtp(user.id, otp, expiresAt);

  const emailResult = await sendEmailByNodemailer({
    to: email,
    subject: 'Your OTP',
    html: `<h1>OTP: ${otp}</h1>`,
  });

  if (!emailResult.success) {
    await deleteOtpRecord(user.id);
    await deleteUser(user.id);

    throw new Error('Registration failed: could not send confirmation email');
  }

  return { message: 'User created. OTP sent for verification.' };
}

export async function verifyOtpService({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('User not found');

  const otpRecord = await getOtp(user.id);

  if (!otpRecord) throw new Error('OTP expired or not found');

  const isValid = otpService.verifyOtp(otp, email);
  if (!isValid) throw new Error('Invalid OTP');

  await updateUserToActive(user.id);

  await markOtpAsVerified(otpRecord.id);

  return { message: 'OTP verified successfully' };
}

export async function resendOtpService(email: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  const otp = otpService.generateOtp(email);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await updateOtp(user.id, otp, expiresAt);

  sendEmailByNodemailer({
    to: email,
    subject: `Your resent OTP`,
    html: `<H1>${otp}<H1>`,
  });

  return {
    message: 'OTP Resend Successfully',
  };
}

export async function forgotPassword(email: string) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('User not found');

  const token = otpService.generateOtp(email);
  await createPasswordReset({
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  sendEmailByNodemailer({
    to: email,
    subject: `Your password reset token`,
    html: `<H1>${token}<H1>`,
  });

  return { message: 'Password reset token sent' };
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string
) {
  const record = await verifyResetToken(email, otp);
  if (!record) throw new Error('Invalid or expired token');

  const passwordHash = await hash(newPassword, 10);
  await updateUserPassword(record.userId, passwordHash);
  return { message: 'Password has been reset' };
}

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: enviroment.JWT_ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, enviroment.JWT_SECRET, {
    expiresIn: enviroment.JWT_REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export async function loginService(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const payload = { id: user.id, email: user.email, name: user.name };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date(
    Date.now() + ms(enviroment.JWT_REFRESH_TOKEN_EXPIRES_IN)
  );
  await saveTokeninDB(`Bearer ${refreshToken}`, user.id, expiresAt);

  return {
    accessToken,
    refreshToken,
    user,
  };
}
