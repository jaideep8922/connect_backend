import prisma from '../prisma/prismaClient';

export const getStatusList = async () => {
    return await prisma.status.findMany();
  };