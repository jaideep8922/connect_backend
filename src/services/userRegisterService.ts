import prisma from '../prisma/prismaClient';

export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const addUser = async (userData:any) => {
  return await prisma.user.create({
    data: userData,
  });
};
