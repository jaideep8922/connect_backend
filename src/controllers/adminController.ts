
import { sendSuccess, sendError } from '../utils/responseHandle';
import { getRetailerAndSellerList } from '../services/adminService';


export const getAllUsers = async (req: any, res: any) => {
    try {
        const {
            pageNumber,
            pageSize,
            searchValue,
            userType,
        } = req.body;

        // Validate required fields
        if (!pageNumber || !pageSize) {
            return sendError(res, 'Page Number and Page Size are required');
        }

        // Initialize pagination request object
        const paginationReq = {
            pageNumber: parseInt(pageNumber, 10),
            pageSize: parseInt(pageSize, 10),
            searchValue: searchValue || '', // Assign default empty string if undefined
            userType: userType || '',       // Assign default empty string if undefined
        };

        // Fetch user list with pagination
        const usersList = await getRetailerAndSellerList(paginationReq);

        // Send successful response
        sendSuccess(res, usersList, 'Users fetched successfully');
    } catch (error) {
        console.error('Error fetching users:', error);
        sendError(res, 'Error fetching users');
    }
};

