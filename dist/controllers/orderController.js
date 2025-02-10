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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrderStatusHistory = exports.getOrderHistoryBySellerId = exports.getOrderHistoryByRetailerId = exports.createOrder = void 0;
const responseHandle_1 = require("../utils/responseHandle");
const orderService_1 = require("../services/orderService");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { retailerId, statusId, totalItem, totalQuantity, notes, sellerId, orderProductDetails, } = req.body;
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
        const orderDetails = yield (0, orderService_1.addOrder)({
            retailerId,
            statusId,
            totalItem,
            totalQuantity,
            notes,
            sellerId,
            orderProductDetails,
        });
        // Include orderProductDetails in the response
        (0, responseHandle_1.sendSuccess)(res, Object.assign(Object.assign({}, orderDetails.data), { orderProductDetails }), orderDetails.message);
    }
    catch (error) {
        console.error('Error Adding Order:', error);
        (0, responseHandle_1.sendError)(res, 'An error occurred while adding the order.');
    }
});
exports.createOrder = createOrder;
// export const createOrder = async (req: any, res: any) => {
//     try {
//         const {
//             retailerId,
//             statusId,
//             totalItem,
//             totalQuantity,
//             notes,
//             sellerId,
//             orderProductDetails,
//         } = req.body;
//         // Validate required fields
//         if (!retailerId || !statusId || !totalItem || !totalQuantity || !sellerId || !orderProductDetails) {
//             return res.status(400).json({ error: 'Missing required fields.' });
//         }
//         // Validate orderProductDetails
//         if (!Array.isArray(orderProductDetails) || orderProductDetails.length === 0) {
//             return res.status(400).json({ error: 'Invalid or missing orderProductDetails.' });
//         }
//         for (const product of orderProductDetails) {
//             const { productId, quantity, price } = product;
//             if (!productId || !quantity || !price) {
//                 return res.status(400).json({ error: 'Each product must include productId, quantity, and price.' });
//             }
//         }
//         // Add order logic
//         const orderDetails = await addOrder({
//             retailerId,
//             statusId,
//             totalItem,
//             totalQuantity,
//             notes,
//             sellerId,
//             orderProductDetails,
//         });
//         // Success response
//         sendSuccess(res, orderDetails.data, orderDetails.message,);
//     } catch (error) {
//         console.error('Error Adding Order:', error);
//         sendError(res, 'An error occurred while adding the order.');
//     }
// };
const getOrderHistoryByRetailerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customId, statusId } = req.body; // Changed to customId
        if (!customId) {
            return res.status(400).json({ error: 'CustomId is missing.' }); // Updated error message
        }
        // Prepare query parameters
        const queryParams = { customId }; // Use customId here
        if (statusId) {
            queryParams.statusId = statusId; // Include statusId only if provided
        }
        // Fetch order list
        const orderList = yield (0, orderService_1.getAllOrderByRetailerId)(queryParams);
        (0, responseHandle_1.sendSuccess)(res, orderList.data, orderList.message);
    }
    catch (error) {
        console.error('Error fetching order history:', error);
        (0, responseHandle_1.sendError)(res, 'Error fetching order history.');
    }
});
exports.getOrderHistoryByRetailerId = getOrderHistoryByRetailerId;
const getOrderHistoryBySellerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customId, statusId } = req.body;
        if (!customId) {
            return res.status(400).json({ error: 'sellerId is missing.' });
        }
        // Prepare query parameters
        const queryParams = { customId };
        if (statusId) {
            queryParams.statusId = statusId; // Only include statusId if provided
        }
        // Fetch order list
        const orderList = yield (0, orderService_1.getAllOrderBySuplierId)(queryParams);
        (0, responseHandle_1.sendSuccess)(res, orderList.data, orderList.message);
    }
    catch (error) {
        console.error('Error fetching order history:', error);
        (0, responseHandle_1.sendError)(res, 'Error fetching order history.');
    }
});
exports.getOrderHistoryBySellerId = getOrderHistoryBySellerId;
const getOrderStatusHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        console.log("orderId", orderId);
        if (!orderId) {
            return res.status(400).json({ error: 'orderId is Missing.' });
        }
        const orderIdStr = String(orderId);
        const orderStatusHistory = yield (0, orderService_1.getOrderStatusHistoryList)({
            orderId: orderIdStr,
        });
        (0, responseHandle_1.sendSuccess)(res, orderStatusHistory.data, orderStatusHistory.message);
    }
    catch (error) {
        console.error('Error fetching Status History List:', error);
        (0, responseHandle_1.sendError)(res, 'Error fetching  Status History List:');
    }
});
exports.getOrderStatusHistory = getOrderStatusHistory;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, statusId, filePath } = req.body;
        console.log("filePathfilePathfilePath", filePath);
        if (!orderId) {
            return res.status(400).json({ error: 'orderId is Missing.' });
        }
        const updatedRecord = yield (0, orderService_1.updateOrderStatusById)({
            orderId, statusId, filePath
        });
        (0, responseHandle_1.sendSuccess)(res, updatedRecord.data, updatedRecord.message);
    }
    catch (error) {
        console.error('Error fetching Status History List:', error);
        (0, responseHandle_1.sendError)(res, 'Error fetching  Status History List:');
    }
});
exports.updateOrderStatus = updateOrderStatus;
