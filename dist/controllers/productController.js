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
exports.serachProductByLowestPrice = exports.updateProductData = exports.getProductBySellerId = exports.addProduct = void 0;
const responseHandle_1 = require("../utils/responseHandle");
const productService_1 = require("../services/productService");
const cloudinary_1 = __importDefault(require("cloudinary"));
// Cloudinary configuration
cloudinary_1.default.v2.config({
    cloud_name: 'dogsc8bt0',
    api_key: '338558281491174',
    api_secret: 'yJDW0DIvTrdmAxus4glabRqtuaw',
});
// Function to upload media (both image and video)
const uploadMedia = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinary_1.default.v2.uploader.upload(file.path, { resource_type: 'auto' }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result.secure_url); // Returns URL of the uploaded file
        });
    });
});
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { productName, averagePrice, goodPrice, highPrice, description, sellerId, tax, moq } = req.body;
        if (!productName || !sellerId || !description) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        // Upload product image if exists
        let imageUrl = null;
        if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.productImage) {
            imageUrl = yield uploadMedia(req.files.productImage[0]);
        }
        // Upload product video if exists
        let videoUrl = null;
        if ((_b = req.files) === null || _b === void 0 ? void 0 : _b.productVideo) {
            videoUrl = yield uploadMedia(req.files.productVideo[0]);
        }
        // Add product logic
        const productData = yield (0, productService_1.createProduct)({
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
        (0, responseHandle_1.sendSuccess)(res, productData.data, productData.message);
    }
    catch (error) {
        console.error('Error adding product:', error);
        (0, responseHandle_1.sendError)(res, 'Error adding product', error);
    }
});
exports.addProduct = addProduct;
const getProductBySellerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sellerId } = req.query;
        if (!sellerId) {
            return res.status(400).json({ error: 'Seller Id Missing.' });
        }
        const productList = yield (0, productService_1.getProductList)({
            sellerId,
        });
        (0, responseHandle_1.sendSuccess)(res, productList.data, productList.message);
    }
    catch (error) {
        console.error('Error fetching Product List:', error);
        (0, responseHandle_1.sendError)(res, 'Error fetching Product List:');
    }
});
exports.getProductBySellerId = getProductBySellerId;
const updateProductData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const updatedData = yield (0, productService_1.updateProduct)({
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
        (0, responseHandle_1.sendSuccess)(res, updatedProducts, 'Product data updated successfully.');
    }
    catch (error) {
        console.error('Error updating product data:', error);
        (0, responseHandle_1.sendError)(res, 'An error occurred while updating product data.');
    }
});
exports.updateProductData = updateProductData;
const serachProductByLowestPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productName } = req.query;
        if (!productName) {
            return res.status(400).json({ error: 'product Name Missing.' });
        }
        const productList = yield (0, productService_1.getLowestPriceProductList)({
            productName,
        });
        (0, responseHandle_1.sendSuccess)(res, productList.data, productList.message);
    }
    catch (error) {
        console.error('Error fetching Product List:', error);
        (0, responseHandle_1.sendError)(res, 'Error fetching Product List:');
    }
});
exports.serachProductByLowestPrice = serachProductByLowestPrice;
