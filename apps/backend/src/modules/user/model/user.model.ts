import { prisma } from '@expense-tracker/libs/database';
import { Prisma } from '@prisma/client';

export const findUserById = (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export function createUser(email: string, passwordHash: string, name: string) {
  return prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });
}

export function updateUser(input: Prisma.UserUpdateInput, userId: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...input,
    },
  });
}

export function deleteUser(userId: number) {
  return prisma.user.delete({
    where: { id: userId },
  });
}

export function updateUserToActive(userId: number) {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: true },
  });
}

export function updateUserPassword(userId: number, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}
