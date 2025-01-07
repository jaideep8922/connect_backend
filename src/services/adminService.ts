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

export const getAllCounts = async () => {
    try {
        // Initialize response object fields
        const responseObj = {
            activeUsersCount: 0,
            droppedUsersCounts: 0,
            retailerCount: 0,
            supplierCount: 0,
            enquiresCount: 0,
            confirmedEnquiresCount: 0,
            registeredProducts: 0,
        };

        // Fetch counts from database
        const [
            supplierCount,
            retailerCount,
            activeSellerCount,
            activeRetailerCount,
            droppedSellerCount,
            droppedRetailerCount,
            enquiresCount,
            confirmedEnquiresCount,
            registeredProducts,
        ] = await Promise.all([
            prisma.seller.count(),
            prisma.retailer.count(),
            prisma.seller.count({ where: { dropped: false } }),
            prisma.retailer.count({ where: { dropped: false } }),
            prisma.seller.count({ where: { dropped: true } }),
            prisma.retailer.count({ where: { dropped: true } }),
            prisma.orderDetails.count(),
            prisma.orderDetails.count({ where: { statusId: 2 } }), // statusId 2 = Confirmed
            prisma.product.count(),
        ]);

        // Calculate totals
        responseObj.activeUsersCount = activeSellerCount + activeRetailerCount;
        responseObj.droppedUsersCounts = droppedSellerCount + droppedRetailerCount;
        responseObj.retailerCount = retailerCount;
        responseObj.supplierCount = supplierCount;
        responseObj.enquiresCount = enquiresCount;
        responseObj.confirmedEnquiresCount = confirmedEnquiresCount;
        responseObj.registeredProducts = registeredProducts;

        // Return the response object with a success message
        return { message: "Successfully retrieved all dashboard counts", data: responseObj };
    } catch (error) {
         // Handle 'unknown' type error explicitly
         if (error instanceof Error) {
            console.error('Error retrieving dashboard counts:', error.message, error.stack);
        } else {
            console.error('Unknown error occurred:', error);
        }
        throw new Error('Failed to retrieve dashboard counts. Please try again later.');
    }
};


export const getAllProductPagination = async (paginationReq: any) => {
    try {
        const { pageNumber, pageSize, searchValue, priceSortBy } = paginationReq;

        // Calculate offset for pagination
        const offset = (pageNumber - 1) * pageSize;

        // Build the query conditions dynamically
        const whereCondition = searchValue
            ? { productName: { contains: searchValue, mode: Prisma.QueryMode.insensitive } } // Case-insensitive search
            : undefined;

        // Sort condition for priceSortBy
        const orderByCondition = priceSortBy
            ? { averagePrice: priceSortBy } // Accept "asc" or "desc"
            : undefined;

        // Fetch the product list with pagination, search, and sorting
        const productList = await prisma.product.findMany({
            where: whereCondition,
            skip: offset,
            take: pageSize,
            orderBy: orderByCondition,
        });

        return {
            message: "Successfully retrieved product list",
            data: productList,
        };
    } catch (error) {
        // Handle the error with proper type checking
        if (error instanceof Error) {
            console.error("Error retrieving product list:", error.message);
        } else {
            console.error("Unknown error occurred:", error);
        }
        throw new Error("Failed to retrieve product list. Please try again later.");
    }
};


