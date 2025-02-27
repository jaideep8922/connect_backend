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
exports.getAllProductList = exports.getDashboardCounts = exports.deleteUserDetails = exports.updateUserDetails = exports.getAllUsers = void 0;
const responseHandle_1 = require("../utils/responseHandle");
const adminService_1 = require("../services/adminService");
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageNumber, pageSize, searchValue, userType } = req.body;
        if (!pageNumber || !pageSize) {
            res.status(400).json({ error: 'Page Number and Page Size are required' });
        }
        const paginationReq = {
            pageNumber: parseInt(pageNumber, 10),
            pageSize: parseInt(pageSize, 10),
            searchValue: searchValue || '',
            userType: userType || '',
        };
        const usersList = yield (0, adminService_1.getRetailerAndSellerList)(paginationReq);
        res.status(200).json({ success: true, data: usersList, message: 'Users fetched successfully' });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        next(error); // Pass the error to the next middleware
    }
});
exports.getAllUsers = getAllUsers;
const updateUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userType, updatedData } = req.body;
        if (!id || !userType || !updatedData) {
            return res.status(400).json({ error: "Invalid request data" });
        }
        let updatedUser;
        if (userType === "Retailer") {
            updatedUser = yield prismaClient_1.default.retailer.update({
                where: { id },
                data: updatedData,
            });
        }
        else if (userType === "Seller" || userType === "Supplier") {
            updatedUser = yield prismaClient_1.default.seller.update({
                where: { id },
                data: updatedData,
            });
        }
        else {
            return res.status(400).json({ error: "Invalid user type" });
        }
        return res.status(200).json({ message: "User updated successfully", data: updatedUser });
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Failed to update user" });
    }
});
exports.updateUserDetails = updateUserDetails;
const deleteUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customId, userType } = req.body;
        if (!customId || !userType) {
            return res.status(400).json({ error: "customId and userType are required" });
        }
        let deletedUser;
        if (userType === "Retailer") {
            deletedUser = yield prismaClient_1.default.retailer.delete({
                where: { customId },
            });
        }
        else if (userType === "Seller") {
            deletedUser = yield prismaClient_1.default.seller.delete({
                where: { customId },
            });
        }
        else {
            return res.status(400).json({ error: "Invalid user type" });
        }
        console.log("deletedUser", deletedUser);
        return res.status(200).json({ message: "User deleted successfully", data: deletedUser });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Failed to delete user" });
    }
});
exports.deleteUserDetails = deleteUserDetails;
const getDashboardCounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countsObj = yield (0, adminService_1.getAllCounts)();
        // Send successful response
        (0, responseHandle_1.sendSuccess)(res, countsObj.data, countsObj.message);
    }
    catch (error) {
        console.error('Error fetching Counts:', error);
        (0, responseHandle_1.sendError)(res, 'Error fetching Counts');
    }
});
exports.getDashboardCounts = getDashboardCounts;
const getAllProductList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageNumber, pageSize, searchValue, priceSortBy, } = req.body;
        // Validate required fields
        if (!pageNumber || !pageSize) {
            res.status(400).json({ error: 'Page Number and Page Size are required' });
        }
        // Initialize pagination request object
        const paginationReq = {
            pageNumber: parseInt(pageNumber, 10),
            pageSize: parseInt(pageSize, 10),
            searchValue: searchValue || '', // Assign default empty string if undefined
            priceSortBy: priceSortBy || '', // Assign default empty string if undefined
        };
        // Fetch user list with pagination
        const productList = yield (0, adminService_1.getAllProductPagination)(paginationReq);
        // Send successful response
        (0, responseHandle_1.sendSuccess)(res, productList, 'Product fetched successfully');
    }
    catch (error) {
        console.error('Error fetching users:', error);
        (0, responseHandle_1.sendError)(res, 'Error fetching users');
    }
});
exports.getAllProductList = getAllProductList;
