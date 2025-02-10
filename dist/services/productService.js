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
exports.getLowestPriceProductList = exports.updateProduct = exports.getProductList = exports.createProduct = void 0;
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const generateProductId = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const suffix = "PROD";
    return `${suffix}-${randomNumber}`;
};
const createProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productName, averagePrice, goodPrice, highPrice, description, sellerId, productImage, productVideo, tax, moq } = productData;
        const productId = generateProductId();
        // Check if Seller exists
        const supplierExists = yield prismaClient_1.default.seller.findUnique({
            where: { customId: sellerId },
        });
        if (!supplierExists) {
            throw new Error(`Supplier with ID ${sellerId} does not exist.`);
        }
        // Create product in database
        const product = yield prismaClient_1.default.product.create({
            data: {
                productId,
                productName,
                averagePrice: averagePrice || null,
                goodPrice: goodPrice || null,
                highPrice: highPrice || null,
                description,
                sellerId,
                tax,
                moq,
                productVideo,
                productImage
            },
        });
        return { message: 'Product added successfully', data: product };
    }
    catch (error) {
        console.error('Error adding product to database:', error);
        throw new Error('Failed to add product');
    }
});
exports.createProduct = createProduct;
const getProductList = (seller) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sellerId, } = seller;
        // Check if Supplier exists
        const supplierExists = yield prismaClient_1.default.seller.findUnique({
            // where: { id: sellerId },
            where: { customId: sellerId }, // Use customId instead of id
        });
        if (!supplierExists) {
            throw new Error(`Supplier with ID ${sellerId} does not exist.`);
        }
        const productList = yield prismaClient_1.default.product.findMany({
            where: { sellerId: sellerId },
        });
        return { message: 'Got Product List successfully', data: productList };
    }
    catch (error) {
        console.error('Error Getting Product List database:', error);
        throw new Error('Failed to get product List');
    }
});
exports.getProductList = getProductList;
const updateProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, productName, averagePrice, goodPrice, highPrice, description, } = productData;
        // Check if the product exists
        const productExists = yield prismaClient_1.default.product.findUnique({
            where: { productId: productId },
        });
        if (!productExists) {
            throw new Error(`Product with ID ${productId} does not exist.`);
        }
        // Update the product with the new data
        const updatedData = yield prismaClient_1.default.product.update({
            where: { productId: productId }, // Specify the product to be updated by its ID
            data: {
                productName,
                averagePrice,
                goodPrice,
                highPrice,
                description,
            },
        });
        return { message: 'Product updated successfully', data: updatedData };
    }
    catch (error) {
        console.error('Error updating product in database:', error);
        throw new Error('Failed to update product');
    }
});
exports.updateProduct = updateProduct;
const getLowestPriceProductList = (product) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productName } = product;
        if (!productName) {
            throw new Error('Product name is required.');
        }
        // Fetch the product list with a LIKE query and filter for lowest prices
        const productList = yield prismaClient_1.default.product.findMany({
            where: {
                productName: {
                    contains: productName, // Matches productName partially (LIKE '%productName%')
                    mode: 'insensitive', // Case-insensitive match
                },
            },
            orderBy: {
                goodPrice: 'asc', // Order by the lowest goodPrice first
            },
            take: 5, // Limit the results to 5 products
        });
        return { message: 'Got Product List successfully', data: productList };
    }
    catch (error) {
        console.error('Error Getting Product List from the database:', error);
        throw new Error('Failed to get product list.');
    }
});
exports.getLowestPriceProductList = getLowestPriceProductList;
