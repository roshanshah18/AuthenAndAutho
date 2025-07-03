import { deleteUser, findUserById, updateUser } from '../model/user.model';

export const getUserById = async (id: number) => {
  const user = await findUserById(id);
  if (!user) throw new Error('User not found');
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export async function updateUserService(userId: number, { input }) {
  const updatedUser = await updateUser(input, userId);
  return updatedUser;
}

export async function deleteUserService(userId: number) {
  const deletedUser = await deleteUser(userId);
  return deletedUser;
}
