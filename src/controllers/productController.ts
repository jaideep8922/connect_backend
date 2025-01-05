import { sendSuccess, sendError } from '../utils/responseHandle';
import { createProduct, getProductList, updateProduct ,getLowestPriceProductList } from '../services/productService';
import { Request, Response } from 'express';

export const addProduct = async (req: any, res: any) => {
    try {
        const {
            productName,
            averagePrice,
            goodPrice,
            highPrice,
            description,
            sellerId,
        } = req.body;

        if (!productName || !sellerId || !averagePrice || !goodPrice || !highPrice || !description) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Add user logic
        const productData = await createProduct({
            productName,
            averagePrice,
            goodPrice,
            highPrice,
            description,
            sellerId,
        });

        // Success response
        sendSuccess(res, productData.data, productData.message);
    } catch (error) {
        console.error('Error onboarding user:', error);
        sendError(res, 'Error onboarding user', error);
    }
};

export const getProductBySellerId = async (req: any, res: any) => {
    try {
        const { sellerId, } = req.body;

        if (!sellerId) {
            return res.status(400).json({ error: 'Seller Id Missing.' });
        }

        const productList = await getProductList({
            sellerId,
        });
        sendSuccess(res, productList.data, productList.message)
    } catch (error) {
        console.error('Error fetching Product List:', error);
        sendError(res, 'Error fetching Product List:')
    }
};

export const updateProductData = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = req.body; // Expecting an array of product objects

        if (!Array.isArray(products) || products.length === 0) {
            res.status(400).json({ error: 'No product data provided for update.' });
            return;
        }

        const updatedProducts = [];
        for (const product of products) {
            const { id, productName, averagePrice, goodPrice, highPrice, description } = product;

            if (!id) {
                res.status(400).json({ error: `Product ID is missing for one of the entries.` });
                return;
            }

            // Update product data
            const updatedData = await updateProduct({
                id,
                productName,
                averagePrice,
                goodPrice,
                highPrice,
                description,
            });

            updatedProducts.push(updatedData); // Collect updated data
        }

        // Send success response with updated product data
        sendSuccess(res, updatedProducts, 'Product data updated successfully.');
    } catch (error) {
        console.error('Error updating product data:', error);
        sendError(res, 'An error occurred while updating product data.');
    }
};

export const serachProductByLowestPrice = async (req: any, res: any) => {
    try {
        const { productName, } = req.body;

        if (!productName) {
            return res.status(400).json({ error: 'product Name Missing.' });
        }

        const productList = await getLowestPriceProductList({
            productName,
        });
        sendSuccess(res, productList.data, productList.message)
    } catch (error) {
        console.error('Error fetching Product List:', error);
        sendError(res, 'Error fetching Product List:')
    }
};