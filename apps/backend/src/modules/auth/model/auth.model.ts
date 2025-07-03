import { prisma } from '@expense-tracker/database/client';

export function createOtp(userId: number, otp: string, expiresAt: Date) {
  return prisma.oTPVerification.create({
    data: {
      userId,
      otp,
      expiresAt,
    },
  });
}

export function updateOtp(userId: number, otp: string, expiresAt: Date) {
  return prisma.oTPVerification.update({
    where: {
      userId,
    },
    data: {
      otp,
      expiresAt,
    },
  });
}

export function getOtp(userId: number) {
  return prisma.oTPVerification.findFirst({
    where: {
      userId,
      expiresAt: { gt: new Date() },
    },
  });
}

export function findOtpRecord(userId: number) {
  return prisma.oTPVerification.findFirst({
    where: {
      userId,
    },
  });
}

export function deleteOtpRecord(userId: number) {
  return prisma.oTPVerification.deleteMany({
    where: {
      userId,
    },
  });
}

export function markOtpAsVerified(id: number) {
  return prisma.oTPVerification.update({
    where: { id },
    data: { verifiedAt: new Date() },
  });
}

export function createPasswordReset(data: any) {
  return prisma.passwordReset.create({
    data,
  });
}

export function verifyResetToken(email: string, token: string) {
  return prisma.passwordReset.findFirst({
    where: {
      user: { email },
      token,
      expiresAt: { gt: new Date() },
    },

    include: {
      user: true,
    },
  });
}

export async function saveTokeninDB(
  token: string,
  userId: number,
  expiresAt: Date
) {
  return await prisma.token.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
}

export async function deleteTokenFromDB(token: string, userId: number) {
  return await prisma.token.deleteMany({
    where: {
      token,
      userId,
    },
  });
}

export async function getTokenFromDB(token: string) {
  return await prisma.token.findFirst({
    where: {
      token,
    },
  });
}
