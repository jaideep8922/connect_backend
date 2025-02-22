import express from 'express';
import cors from 'cors';
import prisma from '../prisma/prismaClient';

import { getAllUsers, getDashboardCounts, getAllProductList } from '../controllers/adminController';

const app = express();
app.use(cors());

app.post('/get-all-users', getAllUsers);
app.get('/get-dashboard-counts', getDashboardCounts);
app.post('/get-all-product-list', getAllProductList);


app.get('/get-product-single', async (req: any, res: any) => {
    try {
        const { productId } = req.query;
        console.log("customId", productId);

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'productId  is required.',
            });
        }

        const product = await prisma.product.findFirst({
            where: {
                productId
            },
            include:{
                seller:true,
                OrderProductDetails:true
            }
        })

        // Return the response with user data
        return res.status(200).json({
            success: true,
            message: "User fetched successfully.",
            data: product,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
});

app.get('/get-user-single', async (req: any, res: any) => {
    try {
        const { customId } = req.query;
        console.log("customId", customId);

        if (!customId) {
            return res.status(400).json({
                success: false,
                message: 'Custom ID is required.',
            });
        }

        let supplierExists;

        // Check if customId includes "SU" and query accordingly
        if (customId.includes("SU")) {
            supplierExists = await prisma.seller.findUnique({
                where:
                {
                    customId: customId
                },
                include: {
                    Product: true,
                    OrderDetails: true,
                    retailers: true
                }
            });
        } else {
            supplierExists = await prisma.retailer.findUnique({
                where: { customId: customId as string },
                include: {
                    OrderDetails: true,
                    seller: true
                }
            });
        }

        // If no supplier exists, return 404
        if (!supplierExists) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        // Return the response with user data
        return res.status(200).json({
            success: true,
            message: "User fetched successfully.",
            data: supplierExists,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
});



export default app;