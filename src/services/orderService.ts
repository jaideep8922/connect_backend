import prisma from '../prisma/prismaClient';

export const addOrder = async (orderDetails: any) => {
    try {
        const {
            retailerId,
            statusId,
            totalItem,
            totalQuantity,
            notes,
            sellerId,
            orderProductDetails,
        } = orderDetails;

        // Check if Seller exists
        const sellerExists = await prisma.seller.findUnique({
            where: { id: sellerId },
        });

        if (!sellerExists) {
            throw new Error(`Seller with ID ${sellerId} does not exist.`);
        }

        // Generate a unique orderId
        const uniqueOrderId = await createUniqueOrderId();

        // Save the order details
        const orderSaveObj = await prisma.orderDetails.create({
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

        const orderId = orderSaveObj.id;

        await prisma.orderStatusHistory.create({
            data: {
                orderId,
                statusId,
            },
        });

        // Save order product details
        for (const product of orderProductDetails) {
            const { productId, quantity, price } = product;

            // Validate product details
            if (productId && quantity && price) {
                await prisma.orderProductDetails.create({
                    data: {
                        orderId,
                        productId,
                        quantity,
                        price,
                    },
                });
            } else {
                console.warn(
                    `Invalid product details skipped: ${JSON.stringify(product)}`
                );
            }
        }

        return { message: 'Order added successfully', data: orderSaveObj };
    } catch (error) {
        console.error('Error adding order to the database:', error);
        throw new Error('Failed to add order. Please try again.');
    }
};

// Function to generate a random alphanumeric order ID
function generateOrderId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function createUniqueOrderId(): Promise<string> {
    let orderId: string; // Declare orderId

    do {
        orderId = generateOrderId(); // Generate the orderId
        const existingOrder = await prisma.orderDetails.findUnique({
            where: { orderId },
        });
        if (!existingOrder) {
            return orderId; // Return if unique
        }
    } while (true); // Repeat until a unique ID is found
}


export const getAllOrderByRetailerId = async (retailer: any) => {
    try {
        const { retailerId, statusId } = retailer;

        // Check if Retailer exists
        const retailerExists = await prisma.retailer.findUnique({
            where: { id: retailerId },
        });

        if (!retailerExists) {
            throw new Error(`Retailer with ID ${retailerId} does not exist.`);
        }

        // Fetch order list
        const orderList = await prisma.orderDetails.findMany({
            where: {
                retailerId,
                ...(statusId && { statusId }), // Include statusId only if it's provided
            },
        });

        return { message: 'Got Order List successfully', data: orderList };
    } catch (error) {
        console.error('Error Getting Order List from database:', error);
        throw new Error('Failed to get Order List');
    }
};

export const getAllOrderBySuplierId = async (suplier: any) => {
    try {
        const { sellerId, statusId } = suplier;

        // Check if Retailer exists
        const retailerExists = await prisma.seller.findUnique({
            where: { id: sellerId },
        });

        if (!retailerExists) {
            throw new Error(`seller with ID ${sellerId} does not exist.`);
        }

        // Fetch order list
        const orderList = await prisma.orderDetails.findMany({
            where: {
                sellerId,
                ...(statusId && { statusId }), // Include statusId only if it's provided
            },
        });

        return { message: 'Got Order List successfully', data: orderList };
    } catch (error) {
        console.error('Error Getting Order List from database:', error);
        throw new Error('Failed to get Order List');
    }
};


export const getOrderStatusHistoryList = async (order: any) => {
    try {

        const {
            orderId,
        } = order;


        const orderStatusHistory = await prisma.orderStatusHistory.findMany({
            where: { orderId: orderId },
        });

        return { message: 'Got Order Status History List successfully', data: orderStatusHistory };

    } catch (error) {
        console.error('Error Getting Order Status History List database:', error);
        throw new Error('Failed to get Order Status History List');
    }
};

export const updateOrderStatusById = async (order: any) => {
    try {

        const {
            orderId, statusId,
        } = order;


        const checkExistOrNot = await prisma.orderDetails.findUnique({
            where: { id: orderId },
        });

        if (!checkExistOrNot) {
            throw new Error(`Order with ID ${orderId} does not exist.`);

        }

        const updatedData = await prisma.orderDetails.update({
            where: { id: orderId },  // Specify the product to be updated by its ID
            data: {
                statusId,
            },
        });

        await prisma.orderStatusHistory.create({
            data: {
                orderId,
                statusId,
            },
        });

        return { message: 'Update Order Status successfully', data: updatedData };

    } catch (error) {
        console.error('Error Updating Order Status:', error);
        throw new Error('Failed to Updating Order Status');
    }
};



