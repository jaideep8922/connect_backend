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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const adminController_1 = require("../controllers/adminController");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.post('/get-all-users', adminController_1.getAllUsers);
app.get('/get-dashboard-counts', adminController_1.getDashboardCounts);
app.post('/get-all-product-list', adminController_1.getAllProductList);
app.post('/update-user-details', adminController_1.updateUserDetails);
app.delete('/delete-user-details', adminController_1.deleteUserDetails);
app.get('/get-product-single', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.query;
        console.log("customId", productId);
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'productId  is required.',
            });
        }
        const product = yield prismaClient_1.default.product.findFirst({
            where: {
                productId
            },
            include: {
                seller: true,
                OrderProductDetails: true
            }
        });
        // Return the response with user data
        return res.status(200).json({
            success: true,
            message: "User fetched successfully.",
            data: product,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
}));
app.get('/get-user-single', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            supplierExists = yield prismaClient_1.default.seller.findUnique({
                where: {
                    customId: customId
                },
                include: {
                    Product: true,
                    OrderDetails: true,
                    retailers: true
                }
            });
        }
        else {
            supplierExists = yield prismaClient_1.default.retailer.findUnique({
                where: { customId: customId },
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
}));
exports.default = app;
