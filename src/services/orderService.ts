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

        // const statusExists = await prisma.status.findUnique({
        //     where: { id: 1 },
        // });
        // console.log("-----------",statusExists);
        

        // Check if Seller exists
        const sellerExists = await prisma.seller.findUnique({
            where: { customId: sellerId },
        });

        if (!sellerExists) {
            throw new Error(`Seller with ID ${sellerId} does not exist.`);
        }

        // Generate a unique orderId
        const uniqueOrderId:any = await createUniqueOrderId(retailerId);

        console.log("uniqueOrderId", uniqueOrderId)

        // Save the order details
        const orderSaveObj:any = await prisma.orderDetails.create({
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

        const orderId:any = orderSaveObj.orderId;

        // const orderIdString = orderSaveObj.orderIdString;


        await prisma.orderStatusHistory.create({
            data: {
                orderId:uniqueOrderId,
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
                        orderId: orderId.toString(),
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

async function createUniqueOrderId(retailerId: string): Promise<string> {
    try {
        // Fetch the city of the retailer
        const retailer = await prisma.retailer.findUnique({
            where: { customId: retailerId },
            select: { city: true },
        });

        if (!retailer || !retailer.city) {
            throw new Error(`Retailer with ID ${retailerId} does not exist or has no city specified.`);
        }

        // Use the first three uppercase letters of the city as the prefix
        const cityPrefix = retailer.city.slice(0, 3).toUpperCase();

        let orderId: string;

        do {
            // Generate a random 4-digit number
            const randomNumber = Math.floor(1000 + Math.random() * 9000); // Ensures 4 digits
            orderId = `${cityPrefix}${randomNumber}`;

            // Check if the order ID is unique
            const existingOrder = await prisma.orderDetails.findUnique({
                where: { orderId },
            });

            if (!existingOrder) {
                return orderId; // Return if unique
            }
        } while (true);
    } catch (error) {
        console.error('Error generating unique order ID:', error);
        throw new Error('Failed to generate a unique order ID.');
    }
}

export const getAllOrderByRetailerId = async (retailer: any) => {
    try {
        const { customId, statusId } = retailer;

        // Check if Retailer exists
        const retailerExists = await prisma.retailer.findUnique({
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

        const orderList = await prisma.orderDetails.findMany({
            where: {
                retailerId: customId, 
                ...(statusId && { statusId }),
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
        const { customId, statusId } = suplier;

        // Check if Retailer exists
        const retailerExists = await prisma.seller.findUnique({
            where: { customId },
        });

        if (!retailerExists) {
            throw new Error(`Seller with ID ${customId} does not exist.`);
        }

        // Fetch order list along with orderProductDetails
        const orderList = await prisma.orderDetails.findMany({
            where: {
                sellerId: customId,
                ...(statusId && { statusId }),
            },
            include: {
                OrderProductDetails : {
                    include: {
                        product: true, 
                    },
                }
            },
        });

        return { message: 'Got Order List successfully', data: orderList };
    } catch (error) {
        console.error('Error Getting Order List from database:', error);
        throw new Error('Failed to get Order List');
    }
};


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

export const getOrderStatusHistoryList = async (order: any) => {
    try {
        const { orderId } = order;

        // Validate that orderId is a non-empty string
        if (!orderId || typeof orderId !== 'string') {
            throw new Error('Invalid orderId format.');
        }

        // Fetch the order status history using the string orderId
        const orderStatusHistory = await prisma.orderStatusHistory.findMany({
            where: { orderId }, 
        });

        console.log("Order Status History:", orderStatusHistory);

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
            where: { orderId },
        });

        if (!checkExistOrNot) {
            throw new Error(`Order with ID ${orderId} does not exist.`);

        }

        const updatedData = await prisma.orderDetails.update({
            where: { orderId },  // Specify the product to be updated by its ID
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



