import prisma from '../prisma/prismaClient';

import { Prisma } from '@prisma/client'; // Import Prisma types

export const getRetailerAndSellerList = async (paginationReq: any) => {
    try {
        const { pageNumber, pageSize, searchValue, userType } = paginationReq;

        // Calculate offset for pagination
        const offset = (pageNumber - 1) * pageSize;

        // Define search conditions specific to each model
        const retailerSearchCondition: Prisma.RetailerWhereInput = searchValue
            ? {
                  OR: [
                      { businessName: { contains: searchValue, mode: Prisma.QueryMode.insensitive } },
                      { businessOwner: { contains: searchValue, mode: Prisma.QueryMode.insensitive } },
                      { phone: { contains: searchValue, mode: Prisma.QueryMode.insensitive } },
                      { city: { contains: searchValue, mode: Prisma.QueryMode.insensitive } },
                      { state: { contains: searchValue, mode: Prisma.QueryMode.insensitive } },
                  ],
              }
            : {};

        const sellerSearchCondition: Prisma.SellerWhereInput = searchValue
            ? {
                  OR: [
                    { businessName: { contains: searchValue, mode: Prisma.QueryMode.insensitive } },
                    { businessOwner: { contains: searchValue, mode: Prisma.QueryMode.insensitive } },
                    { phone: { contains: searchValue, mode: Prisma.QueryMode.insensitive } },
                    { city: { contains: searchValue, mode: Prisma.QueryMode.insensitive } },
                    { state: { contains: searchValue, mode: Prisma.QueryMode.insensitive } },
                  ],
              }
            : {};

        let userList = {};

        if (userType === 'Retailer') {
            // Fetch retailer list
            const retailerList = await prisma.retailer.findMany({
                where: retailerSearchCondition,
                skip: offset,
                take: pageSize,
            });

            userList = { retailerList };
        } else if (userType === 'Seller' || userType === 'Supplier') {
            // Fetch seller list
            const sellerList = await prisma.seller.findMany({
                where: sellerSearchCondition,
                skip: offset,
                take: pageSize,
            });

            userList = { sellerList };
        } else {
            // Fetch both retailers and sellers if no userType is specified
            const [retailerList, sellerList] = await Promise.all([
                prisma.retailer.findMany({
                    where: retailerSearchCondition,
                    skip: offset,
                    take: pageSize,
                }),
                prisma.seller.findMany({
                    where: sellerSearchCondition,
                    skip: offset,
                    take: pageSize,
                }),
            ]);

            userList = {
                retailerList,
                sellerList,
            };
        }

        return { message: 'Got Users List successfully', data: userList };
    } catch (error) {
        console.error('Error getting user list from database:', error);
        throw new Error('Failed to get user list');
    }
};
