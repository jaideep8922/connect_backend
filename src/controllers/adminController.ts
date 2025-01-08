
import { sendSuccess, sendError } from '../utils/responseHandle';
import { getRetailerAndSellerList, getAllCounts ,getAllProductPagination} from '../services/adminService';
import { NextFunction, Request, Response } from 'express';

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

