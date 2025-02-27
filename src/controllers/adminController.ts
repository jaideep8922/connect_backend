
import { sendSuccess, sendError } from '../utils/responseHandle';
import { getRetailerAndSellerList, getAllCounts, getAllProductPagination } from '../services/adminService';
import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma/prismaClient';
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

        const usersList = await getRetailerAndSellerList(paginationReq);

        res.status(200).json({ success: true, data: usersList, message: 'Users fetched successfully' });
    } catch (error) {
        console.error('Error fetching users:', error);
        next(error); // Pass the error to the next middleware
    }
};


export const updateUserDetails = async (req: any, res: any) => {
    try {
        const { id, userType, updatedData } = req.body;

        if (!id || !userType || !updatedData) {
            return res.status(400).json({ error: "Invalid request data" });
        }

        let updatedUser;

        if (userType === "Retailer") {
            updatedUser = await prisma.retailer.update({
                where: { id },
                data: updatedData,
            });
        } else if (userType === "Seller" || userType === "Supplier") {
            updatedUser = await prisma.seller.update({
                where: { id },
                data: updatedData,
            });
        } else {
            return res.status(400).json({ error: "Invalid user type" });
        }

        return res.status(200).json({ message: "User updated successfully", data: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Failed to update user" });
    }
};

export const deleteUserDetails = async (req: any, res: any) => {
    try {
        const { customId, userType } = req.body;

        if (!customId || !userType) {
            return res.status(400).json({ error: "customId and userType are required" });
        }

        let deletedUser;

        if (userType === "Retailer") {
            deletedUser = await prisma.retailer.delete({
                where: { customId },
            });
        } else if (userType === "Seller") {
            deletedUser = await prisma.seller.delete({
                where: { customId },
            });
        } else {
            return res.status(400).json({ error: "Invalid user type" });
        }

        console.log("deletedUser", deletedUser);

        return res.status(200).json({ message: "User deleted successfully", data: deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Failed to delete user" });
    }
}


export const getDashboardCounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const countsObj = await getAllCounts();

        // Send successful response
        sendSuccess(res, countsObj.data, countsObj.message);
    } catch (error) {
        console.error('Error fetching Counts:', error);
        sendError(res, 'Error fetching Counts');
    }
};

export const getAllProductList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            pageNumber,
            pageSize,
            searchValue,
            priceSortBy,
        } = req.body;

        // Validate required fields
        if (!pageNumber || !pageSize) {
            res.status(400).json({ error: 'Page Number and Page Size are required' });
        }

        // Initialize pagination request object
        const paginationReq = {
            pageNumber: parseInt(pageNumber, 10),
            pageSize: parseInt(pageSize, 10),
            searchValue: searchValue || '', // Assign default empty string if undefined
            priceSortBy: priceSortBy || '',       // Assign default empty string if undefined
        };

        // Fetch user list with pagination
        const productList = await getAllProductPagination(paginationReq);

        // Send successful response
        sendSuccess(res, productList, 'Product fetched successfully');
    } catch (error) {
        console.error('Error fetching users:', error);
        sendError(res, 'Error fetching users');
    }
};

