import { sendSuccess, sendError } from '../utils/responseHandle';
import { addOrder, getAllOrderByRetailerId,getOrderStatusHistoryList,updateOrderStatusById,getAllOrderBySuplierId } from '../services/orderService';

export const createOrder = async (req: any, res: any) => {
    try {
        const {
            retailerId,
            statusId,
            totalItem,
            totalQuantity,
            notes,
            sellerId,
            orderProductDetails,
        } = req.body;

        // Validate required fields
        if (!retailerId || !statusId || !totalItem || !totalQuantity || !sellerId || !orderProductDetails) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Validate orderProductDetails
        if (!Array.isArray(orderProductDetails) || orderProductDetails.length === 0) {
            return res.status(400).json({ error: 'Invalid or missing orderProductDetails.' });
        }

        for (const product of orderProductDetails) {
            const { productId, quantity, price } = product;
            if (!productId || !quantity || !price) {
                return res.status(400).json({ error: 'Each product must include productId, quantity, and price.' });
            }
        }

        // Add order logic
        const orderDetails = await addOrder({
            retailerId,
            statusId,
            totalItem,
            totalQuantity,
            notes,
            sellerId,
            orderProductDetails,
        });

        // Success response
        sendSuccess(res, orderDetails.data, orderDetails.message);
    } catch (error) {
        console.error('Error Adding Order:', error);
        sendError(res, 'An error occurred while adding the order.');
    }


};


export const getOrderHistoryByRetailerId = async (req: any, res: any) => {
    try {
        const { retailerId, statusId } = req.body;

        if (!retailerId) {
            return res.status(400).json({ error: 'RetailerId is missing.' });
        }

        // Prepare query parameters
        const queryParams: any = { retailerId };
        if (statusId) {
            queryParams.statusId = statusId; // Only include statusId if provided
        }

        // Fetch order list
        const orderList = await getAllOrderByRetailerId(queryParams);

        sendSuccess(res, orderList.data, orderList.message);
    } catch (error) {
        console.error('Error fetching order history:', error);
        sendError(res, 'Error fetching order history.');
    }
};

export const getOrderHistoryBySellerId = async (req: any, res: any) => {
    try {
        const { sellerId, statusId } = req.body;

        if (!sellerId) {
            return res.status(400).json({ error: 'sellerId is missing.' });
        }

        // Prepare query parameters
        const queryParams: any = { sellerId };
        if (statusId) {
            queryParams.statusId = statusId; // Only include statusId if provided
        }

        // Fetch order list
        const orderList = await getAllOrderBySuplierId(queryParams);

        sendSuccess(res, orderList.data, orderList.message);
    } catch (error) {
        console.error('Error fetching order history:', error);
        sendError(res, 'Error fetching order history.');
    }
};


export const getOrderStatusHistory = async (req: any, res: any) => {
    try {
        const { orderId, } = req.body;

        if (!orderId) {
            return res.status(400).json({ error: 'orderId is Missing.' });
        }

        const orderStatusHistory = await getOrderStatusHistoryList({
            orderId,
        });
        sendSuccess(res, orderStatusHistory.data, orderStatusHistory.message)
    } catch (error) {
        console.error('Error fetching Status History List:', error);
        sendError(res, 'Error fetching  Status History List:')
    }
};

export const updateOrderStatus = async (req: any, res: any) => {
    try {
        const { orderId,statusId } = req.body;

        if (!orderId) {
            return res.status(400).json({ error: 'orderId is Missing.' });
        }

        const updatedRecord = await updateOrderStatusById({
            orderId,statusId,
        });
        sendSuccess(res, updatedRecord.data, updatedRecord.message)
    } catch (error) {
        console.error('Error fetching Status History List:', error);
        sendError(res, 'Error fetching  Status History List:')
    }
};


