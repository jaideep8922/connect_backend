import { sendSuccess, sendError } from '../utils/responseHandle';
import { createProduct, getProductList, updateProduct ,getLowestPriceProductList } from '../services/productService';
import { Request, Response } from 'express';

import cloudinary from 'cloudinary';

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: 'dogsc8bt0',
  api_key: '338558281491174',
  api_secret: 'yJDW0DIvTrdmAxus4glabRqtuaw',
});

// Function to upload media (both image and video)
const uploadMedia = async (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(file.path, { resource_type: 'auto' }, (error, result: any) => {
      if (error) {
        return reject(error);
      }
      resolve(result.secure_url as string); // Returns URL of the uploaded file
    });
  });
};

interface CustomRequest extends Request {
  files?: {
    productImage?: Express.Multer.File[];
    productVideo?: Express.Multer.File[];
  };
}

export const addProduct = async (req: any, res: any) => {
  try {
    const {
      productName,
      averagePrice,
      goodPrice,
      highPrice,
      description,
      sellerId,
      tax,
      moq
    } = req.body;

    if (!productName || !sellerId || !description) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Upload product image if exists
    let imageUrl: string | null = null;
    if (req.files?.productImage) {
      imageUrl = await uploadMedia(req.files.productImage[0]); 
    }

    // Upload product video if exists
    let videoUrl: string | null = null;
    if (req.files?.productVideo) {
      videoUrl = await uploadMedia(req.files.productVideo[0]);
    }

    // Add product logic
    const productData = await createProduct({
      productName,
      averagePrice,
      goodPrice,
      highPrice,
      description,
      sellerId,
      tax,
      moq,
      productImage: imageUrl, 
      productVideo: videoUrl, 
    });

    sendSuccess(res, productData.data, productData.message); 
  } catch (error) {
    console.error('Error adding product:', error);
    sendError(res, 'Error adding product', error);
  }
};

export const getProductBySellerId = async (req: any, res: any) => {
    try {
        const { sellerId } = req.query;

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
            const { productId, productName, averagePrice, goodPrice, highPrice, description } = product;

            if (!productId) {
                res.status(400).json({ error: `Product ID is missing for one of the entries.` });
                return;
            }

            // Update product data
            const updatedData = await updateProduct({
                productId,
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
        const { productName } = req.query;

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