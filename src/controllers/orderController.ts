import { sendSuccess, sendError } from '../utils/responseHandle';
import { addOrder, getAllOrderByRetailerId,getOrderStatusHistoryList,updateOrderStatusById,getAllOrderBySuplierId } from '../services/orderService';
import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma/prismaClient';

// async function createUniqueOrderId(retailerId: string): Promise<string> {
//     try {
//         if (!retailerId) {
//             throw new Error("Retailer ID is missing or invalid.");
//         }

//         console.log("Retailer ID:", retailerId);

//         const retailer = await prisma.retailer.findUnique({
//             where: { customId: retailerId },
//             select: { city: true },
//         });

//         if (!retailer || !retailer.city) {
//             throw new Error(`Retailer with ID ${retailerId} does not exist or has no city specified.`);
//         }

//         const cityPrefix = retailer.city.slice(0, 3).toUpperCase();
//         let orderId: string;

//         do {
//             const randomNumber = Math.floor(1000 + Math.random() * 9000);
//             orderId = `${cityPrefix}${randomNumber}`;

//             const existingOrder = await prisma.orderDetails.findUnique({
//                 where: { orderId },
//             });

//             if (!existingOrder) {
//                 return orderId;
//             }
//         } while (true);
//     } catch (error) {
//         console.error("Error generating unique order ID:", error);
//         throw new Error("Failed to generate a unique order ID.");
//     }
// }


// export const createOrderProductDetails = async (req: any, res: any) => {
//     if (req.method === 'POST') {
//         // Generate a unique orderId

//       const {retailerId, productId, quantity, price } = req.body;
//       const uniqueOrderId:any = await createUniqueOrderId(retailerId);
//       console.log("uniqueOrderId", uniqueOrderId)

  
//       try {
//         const newOrderProductDetails = await prisma.orderProductDetails.create({
//           data: {
//             orderId:uniqueOrderId,
//             productId,
//             quantity,
//             price,
//           },
//         });
//         res.status(201).json(newOrderProductDetails);
//       } catch (error) {
//         res.status(500).json({ error: 'Error creating order product details' });
//       }
//     } else {
//       res.status(405).json({ error: 'Method Not Allowed' });
//     }
//   };

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

        // Include orderProductDetails in the response
        sendSuccess(res, { ...orderDetails.data, orderProductDetails }, orderDetails.message);
    } catch (error) {
        console.error('Error Adding Order:', error);
        sendError(res, 'An error occurred while adding the order.');
    }
};


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

export const getOrderHistoryByRetailerId = async (req: any, res: any) => {
    try {
        const { customId, statusId } = req.body; // Changed to customId

        if (!customId) {
            return res.status(400).json({ error: 'CustomId is missing.' }); // Updated error message
        }

        // Prepare query parameters
        const queryParams: any = { customId }; // Use customId here
        if (statusId) {
            queryParams.statusId = statusId; // Include statusId only if provided
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
        const { customId, statusId } = req.body;

        if (!customId) {
            return res.status(400).json({ error: 'sellerId is missing.' });
        }

        // Prepare query parameters
        const queryParams: any = { customId };
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
        const { orderId } = req.body;

        console.log("orderId", orderId)

        if (!orderId) {
            return res.status(400).json({ error: 'orderId is Missing.' });
        }

        const orderIdStr = String(orderId);


        const orderStatusHistory = await getOrderStatusHistoryList({
            orderId:orderIdStr,
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


