import { authenticator } from 'otplib';

authenticator.options = { step: 60, window: 1 };
export function generateOtp(secret: string) {
  const otp = authenticator.generate(secret);
  return otp;
}

function verifyOtp(otp: string, secret: string): boolean {
  try {
    const isValid = authenticator.check(otp, secret);
    return isValid;
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return false;
  }
}

export const otpService = {
  generateOtp,
  verifyOtp,
};
