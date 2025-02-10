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
const cloudinary_1 = __importDefault(require("cloudinary"));
const orderController_1 = require("../controllers/orderController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
cloudinary_1.default.v2.config({
    cloud_name: 'dogsc8bt0',
    api_key: '338558281491174',
    api_secret: 'yJDW0DIvTrdmAxus4glabRqtuaw',
});
const upload = (0, multer_1.default)({
    dest: 'file/', // Temporary folder before upload
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size
    fileFilter: (req, file, cb) => {
        const extname = path_1.default.extname(file.originalname).toLowerCase();
        if (extname !== '.jpg' && extname !== '.jpeg' && extname !== '.png' && extname !== '.mp4') {
            return cb(new Error('Only .jpg, .jpeg, .png, and .mp4 files are allowed.'));
        }
        cb(null, true);
    },
});
app.post('/create-order', orderController_1.createOrder);
app.post('/get-order-status-history', orderController_1.getOrderStatusHistory);
app.post('/get-order-history-by-retailer-id', orderController_1.getOrderHistoryByRetailerId);
// app.put('/update-order-status', upload.single('file'), updateOrderStatus);
// app.put('/update-order-status', upload.single('file'), async (req:any, res:any) => {
//     const { orderId, statusId } = req.body;
//     const filePath = req.file ? req.file.path : null; // Get the file path from multer
//     if (!orderId || !statusId || !filePath) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }
//     try {
//       // Upload the file to Cloudinary
//       const cloudinaryResponse = await cloudinary.v2.uploader.upload(filePath, {
//         folder: 'orders/', // You can specify a folder name in Cloudinary
//         resource_type: 'auto', // Automatically determine the resource type (e.g., image or video)
//       });
//       const uploadedFileUrl = cloudinaryResponse.secure_url; // Get the URL of the uploaded file
//       // Update the order status in your database with the Cloudinary URL
//       const updatedData = await prisma.orderDetails.update({
//         where: { orderId },
//         data: {
//           statusId: parseInt(statusId, 10),
//           filePath: uploadedFileUrl, // Save the Cloudinary URL
//         },
//       });
//       // Create order status history
//       await prisma.orderStatusHistory.create({
//         data: {
//           orderId,
//           statusId: parseInt(statusId, 10),
//         },
//       });
//       res.json({ success: true, message: 'Order status updated successfully' });
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       res.status(500).json({ success: false, message: 'Failed to update order status' });
//     }
//   });
app.put('/update-order-status', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, statusId } = req.body;
    const filePath = req.file ? req.file.path : null; // Get the file path from multer
    if (!orderId || !statusId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        let uploadedFileUrl = null;
        // Upload to Cloudinary only if a file is provided
        if (filePath) {
            const cloudinaryResponse = yield cloudinary_1.default.v2.uploader.upload(filePath, {
                folder: 'orders/', // Specify a folder in Cloud
                resource_type: 'auto',
            });
            uploadedFileUrl = cloudinaryResponse.secure_url;
        }
        // Prepare the update object dynamically
        const updateData = {
            statusId: parseInt(statusId, 10),
        };
        if (uploadedFileUrl) {
            updateData.filePath = uploadedFileUrl;
        }
        // Update the order status in the database
        const updatedData = yield prismaClient_1.default.orderDetails.update({
            where: { orderId },
            data: updateData,
        });
        // Create order status history
        yield prismaClient_1.default.orderStatusHistory.create({
            data: {
                orderId,
                statusId: parseInt(statusId, 10),
            },
        });
        res.json({ success: true, message: 'Order status updated successfully' });
    }
    catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
}));
app.post('/get-order-history-by-supplier-id', orderController_1.getOrderHistoryBySellerId);
exports.default = app;
