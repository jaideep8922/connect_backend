"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProductPagination = exports.getAllCounts = exports.getRetailerAndSellerList = void 0;
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const client_1 = require("@prisma/client"); // Import Prisma types
const getRetailerAndSellerList = (paginationReq) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageNumber, pageSize, searchValue, userType } = paginationReq;
        // Calculate offset for pagination
        const offset = (pageNumber - 1) * pageSize;
        // Define search conditions specific to each model
        const retailerSearchCondition = searchValue
            ? {
                OR: [
                    { businessName: { contains: searchValue, mode: client_1.Prisma.QueryMode.insensitive } },
                    { businessOwner: { contains: searchValue, mode: client_1.Prisma.QueryMode.insensitive } },
                    { phone: { contains: searchValue, mode: client_1.Prisma.QueryMode.insensitive } },
                    { city: { contains: searchValue, mode: client_1.Prisma.QueryMode.insensitive } },
                    { state: { contains: searchValue, mode: client_1.Prisma.QueryMode.insensitive } },
                ],
            }
            : {};
        const sellerSearchCondition = searchValue
            ? {
                OR: [
                    { businessName: { contains: searchValue, mode: client_1.Prisma.QueryMode.insensitive } },
                    { businessOwner: { contains: searchValue, mode: client_1.Prisma.QueryMode.insensitive } },
                    { phone: { contains: searchValue, mode: client_1.Prisma.QueryMode.insensitive } },
                    { city: { contains: searchValue, mode: client_1.Prisma.QueryMode.insensitive } },
                    { state: { contains: searchValue, mode: client_1.Prisma.QueryMode.insensitive } },
                ],
            }
            : {};
        let userList = {};
        if (userType === 'Retailer') {
            // Fetch retailer list
            const retailerList = yield prismaClient_1.default.retailer.findMany({
                where: retailerSearchCondition,
                skip: offset,
                take: pageSize,
            });
            userList = { retailerList };
        }
        else if (userType === 'Seller' || userType === 'Supplier') {
            // Fetch seller list
            const sellerList = yield prismaClient_1.default.seller.findMany({
                where: sellerSearchCondition,
                skip: offset,
                take: pageSize,
            });
            userList = { sellerList };
        }
        else {
            // Fetch both retailers and sellers if no userType is specified
            const [retailerList, sellerList] = yield Promise.all([
                prismaClient_1.default.retailer.findMany({
                    where: retailerSearchCondition,
                    skip: offset,
                    take: pageSize,
                }),
                prismaClient_1.default.seller.findMany({
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
    }
    catch (error) {
        console.error('Error getting user list from database:', error);
        throw new Error('Failed to get user list');
    }
});
exports.getRetailerAndSellerList = getRetailerAndSellerList;
const getAllCounts = () => __awaiter(void 0, void 0, void 0, function* () {
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
        const [supplierCount, retailerCount, activeSellerCount, activeRetailerCount, droppedSellerCount, droppedRetailerCount, enquiresCount, confirmedEnquiresCount, registeredProducts,] = yield Promise.all([
            prismaClient_1.default.seller.count(),
            prismaClient_1.default.retailer.count(),
            prismaClient_1.default.seller.count({ where: { dropped: false } }),
            prismaClient_1.default.retailer.count({ where: { dropped: false } }),
            prismaClient_1.default.seller.count({ where: { dropped: true } }),
            prismaClient_1.default.retailer.count({ where: { dropped: true } }),
            prismaClient_1.default.orderDetails.count(),
            prismaClient_1.default.orderDetails.count({ where: { statusId: 2 } }), // statusId 2 = Confirmed
            prismaClient_1.default.product.count(),
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
    }
    catch (error) {
        // Handle 'unknown' type error explicitly
        if (error instanceof Error) {
            console.error('Error retrieving dashboard counts:', error.message, error.stack);
        }
        else {
            console.error('Unknown error occurred:', error);
        }
        throw new Error('Failed to retrieve dashboard counts. Please try again later.');
    }
});
exports.getAllCounts = getAllCounts;
const getAllProductPagination = (paginationReq) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageNumber, pageSize, searchValue, priceSortBy } = paginationReq;
        // Calculate offset for pagination
        const offset = (pageNumber - 1) * pageSize;
        // Build the query conditions dynamically
        const whereCondition = searchValue
            ? { productName: { contains: searchValue, mode: client_1.Prisma.QueryMode.insensitive } } // Case-insensitive search
            : undefined;
        // Sort condition for priceSortBy
        const orderByCondition = priceSortBy
            ? { averagePrice: priceSortBy } // Accept "asc" or "desc"
            : undefined;
        // Fetch the product list with pagination, search, and sorting
        const productList = yield prismaClient_1.default.product.findMany({
            where: whereCondition,
            skip: offset,
            take: pageSize,
            orderBy: orderByCondition,
        });
        return {
            message: "Successfully retrieved product list",
            data: productList,
        };
    }
    catch (error) {
        // Handle the error with proper type checking
        if (error instanceof Error) {
            console.error("Error retrieving product list:", error.message);
        }
        else {
            console.error("Unknown error occurred:", error);
        }
        throw new Error("Failed to retrieve product list. Please try again later.");
    }
});
exports.getAllProductPagination = getAllProductPagination;
