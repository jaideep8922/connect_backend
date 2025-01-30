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
exports.updateOrderStatusById = exports.getOrderStatusHistoryList = exports.getAllOrderBySuplierId = exports.getAllOrderByRetailerId = exports.addOrder = void 0;
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const addOrder = (orderDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { retailerId, statusId, totalItem, totalQuantity, notes, sellerId, orderProductDetails, } = orderDetails;
        // const statusExists = await prisma.status.findUnique({
        //     where: { id: 1 },
        // });
        // console.log("-----------",statusExists);
        // Check if Seller exists
        const sellerExists = yield prismaClient_1.default.seller.findUnique({
            where: { customId: sellerId },
        });
        if (!sellerExists) {
            throw new Error(`Seller with ID ${sellerId} does not exist.`);
        }
        // Generate a unique orderId
        const uniqueOrderId = yield createUniqueOrderId(retailerId);
        console.log("uniqueOrderId", uniqueOrderId);
        // Save the order details
        const orderSaveObj = yield prismaClient_1.default.orderDetails.create({
            data: {
                orderId: uniqueOrderId, // Assign the unique orderId
                sellerId,
                retailerId,
                statusId,
                totalItem,
                totalQuantity,
                notes,
            },
        });
        const orderId = orderSaveObj.orderId;
        // const orderIdString = orderSaveObj.orderIdString;
        yield prismaClient_1.default.orderStatusHistory.create({
            data: {
                orderId: uniqueOrderId,
                statusId,
            },
        });
        // Save order product details
        for (const product of orderProductDetails) {
            const { productId, quantity, price } = product;
            // Validate product details
            if (productId && quantity && price) {
                yield prismaClient_1.default.orderProductDetails.create({
                    data: {
                        orderId: orderId.toString(),
                        productId,
                        quantity,
                        price,
                    },
                });
            }
            else {
                console.warn(`Invalid product details skipped: ${JSON.stringify(product)}`);
            }
        }
        return { message: 'Order added successfully', data: orderSaveObj };
    }
    catch (error) {
        console.error('Error adding order to the database:', error);
        throw new Error('Failed to add order. Please try again.');
    }
});
exports.addOrder = addOrder;
// Function to generate a random alphanumeric order ID
function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function createUniqueOrderId(retailerId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch the city of the retailer
            const retailer = yield prismaClient_1.default.retailer.findUnique({
                where: { customId: retailerId },
                select: { city: true },
            });
            if (!retailer || !retailer.city) {
                throw new Error(`Retailer with ID ${retailerId} does not exist or has no city specified.`);
            }
            // Use the first three uppercase letters of the city as the prefix
            const cityPrefix = retailer.city.slice(0, 3).toUpperCase();
            let orderId;
            do {
                // Generate a random 4-digit number
                const randomNumber = Math.floor(1000 + Math.random() * 9000); // Ensures 4 digits
                orderId = `${cityPrefix}${randomNumber}`;
                // Check if the order ID is unique
                const existingOrder = yield prismaClient_1.default.orderDetails.findUnique({
                    where: { orderId },
                });
                if (!existingOrder) {
                    return orderId; // Return if unique
                }
            } while (true);
        }
        catch (error) {
            console.error('Error generating unique order ID:', error);
            throw new Error('Failed to generate a unique order ID.');
        }
    });
}
const getAllOrderByRetailerId = (retailer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customId, statusId } = retailer;
        // Check if Retailer exists
        const retailerExists = yield prismaClient_1.default.retailer.findUnique({
            where: { customId },
            // include: {
            //     OrderDetails: {
            //       include: {
            //         OrderProductDetails: true, 
            //       },
            //     },
            //   },
        });
        if (!retailerExists) {
            throw new Error(`Retailer with ID ${customId} does not exist.`);
        }
        // Fetch order list
        // const orderList = await prisma.orderDetails.findMany({
        //     where: {
        //         customId,
        //         ...(statusId && { statusId }), // Include statusId only if it's provided
        //     },
        // });
        const orderList = yield prismaClient_1.default.orderDetails.findMany({
            where: Object.assign({ retailerId: customId }, (statusId && { statusId })),
        });
        return { message: 'Got Order List successfully', data: orderList };
    }
    catch (error) {
        console.error('Error Getting Order List from database:', error);
        throw new Error('Failed to get Order List');
    }
});
exports.getAllOrderByRetailerId = getAllOrderByRetailerId;
const getAllOrderBySuplierId = (suplier) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customId, statusId } = suplier;
        // Check if Retailer exists
        const retailerExists = yield prismaClient_1.default.seller.findUnique({
            where: { customId },
        });
        if (!retailerExists) {
            throw new Error(`Seller with ID ${customId} does not exist.`);
        }
        // Fetch order list along with orderProductDetails
        const orderList = yield prismaClient_1.default.orderDetails.findMany({
            where: Object.assign({ sellerId: customId }, (statusId && { statusId })),
            include: {
                OrderProductDetails: {
                    include: {
                        product: true,
                    },
                }
            },
        });
        return { message: 'Got Order List successfully', data: orderList };
    }
    catch (error) {
        console.error('Error Getting Order List from database:', error);
        throw new Error('Failed to get Order List');
    }
});
exports.getAllOrderBySuplierId = getAllOrderBySuplierId;
// export const getAllOrderBySuplierId = async (suplier: any) => {
//     try {
//         const { customId, statusId } = suplier;
//         // Check if Retailer exists
//         const retailerExists = await prisma.seller.findUnique({
//             where: { customId },
//         });
//         if (!retailerExists) {
//             throw new Error(`seller with ID ${customId} does not exist.`);
//         }
//         // Fetch order list
//         // const orderList = await prisma.orderDetails.findMany({
//         //     where: {
//         //         customId,
//         //         ...(statusId && { statusId }), // Include statusId only if it's provided
//         //     },
//         // });
//         const orderList = await prisma.orderDetails.findMany({
//             where: {
//                 sellerId: customId, 
//                 ...(statusId && { statusId }),
//             },
//         });
//         return { message: 'Got Order List successfully', data: orderList };
//     } catch (error) {
//         console.error('Error Getting Order List from database:', error);
//         throw new Error('Failed to get Order List');
//     }
// };
const getOrderStatusHistoryList = (order) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = order;
        // Validate that orderId is a non-empty string
        if (!orderId || typeof orderId !== 'string') {
            throw new Error('Invalid orderId format.');
        }
        // Fetch the order status history using the string orderId
        const orderStatusHistory = yield prismaClient_1.default.orderStatusHistory.findMany({
            where: { orderId },
        });
        console.log("Order Status History:", orderStatusHistory);
        return { message: 'Got Order Status History List successfully', data: orderStatusHistory };
    }
    catch (error) {
        console.error('Error Getting Order Status History List database:', error);
        throw new Error('Failed to get Order Status History List');
    }
});
exports.getOrderStatusHistoryList = getOrderStatusHistoryList;
const updateOrderStatusById = (order) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, statusId, } = order;
        const checkExistOrNot = yield prismaClient_1.default.orderDetails.findUnique({
            where: { orderId },
        });
        if (!checkExistOrNot) {
            throw new Error(`Order with ID ${orderId} does not exist.`);
        }
        const updatedData = yield prismaClient_1.default.orderDetails.update({
            where: { orderId }, // Specify the product to be updated by its ID
            data: {
                statusId,
            },
        });
        yield prismaClient_1.default.orderStatusHistory.create({
            data: {
                orderId,
                statusId,
            },
        });
        return { message: 'Update Order Status successfully', data: updatedData };
    }
    catch (error) {
        console.error('Error Updating Order Status:', error);
        throw new Error('Failed to Updating Order Status');
    }
});
exports.updateOrderStatusById = updateOrderStatusById;
