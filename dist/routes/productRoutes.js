"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const productController_1 = require("../controllers/productController");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Multer setup for file uploads
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
app.post('/add-product', upload.fields([{ name: 'productImage' }, { name: 'productVideo' }]), productController_1.addProduct); // Supports both image and video
app.get('/get-product-list', productController_1.getProductBySellerId);
app.put('/update-product', productController_1.updateProductData);
app.get('/search-product', productController_1.serachProductByLowestPrice);
exports.default = app;
