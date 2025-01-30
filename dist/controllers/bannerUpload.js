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
exports.getBannerImages = exports.uploadBannerImage = void 0;
const client_1 = require("@prisma/client");
const cloudinary_1 = __importDefault(require("cloudinary"));
const fs_1 = __importDefault(require("fs"));
// Initialize Prisma Client and Cloudinary
const prisma = new client_1.PrismaClient();
cloudinary_1.default.v2.config({
    cloud_name: 'dogsc8bt0',
    api_key: '338558281491174',
    api_secret: 'yJDW0DIvTrdmAxus4glabRqtuaw',
});
// API to upload 5 images to Cloudinary
const uploadBannerImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sellerId } = req.body;
        if (!sellerId) {
            return res.status(400).json({ error: 'sellerId is required' });
        }
        const files = req.files;
        if (files.length === 0 || files.length > 5) {
            return res.status(400).json({ error: 'Please upload between 1 and 5 images.' });
        }
        const bannerImagesData = [];
        for (const file of files) {
            const result = yield cloudinary_1.default.v2.uploader.upload(file.path, {
                folder: 'banner_images/',
                public_id: `banner_${Date.now()}`,
            });
            fs_1.default.unlinkSync(file.path);
            bannerImagesData.push({
                imageLink: result.secure_url,
                sellerId,
            });
        }
        const createdBannerImages = yield prisma.bannerImages.createMany({
            data: bannerImagesData,
        });
        res.status(200).json({
            message: 'Images uploaded successfully',
            data: createdBannerImages,
        });
    }
    catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
});
exports.uploadBannerImage = uploadBannerImage;
const getBannerImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sellerId } = req.query; // Get sellerId from query parameters
        if (!sellerId) {
            return res.status(400).json({ error: 'sellerId is required' });
        }
        // Query the database to get banner images by sellerId
        const bannerImages = yield prisma.bannerImages.findMany({
            where: {
                sellerId,
            },
        });
        if (bannerImages.length === 0) {
            return res.status(404).json({ error: 'No images found for this sellerId' });
        }
        res.status(200).json({
            message: 'Images retrieved successfully',
            data: bannerImages,
        });
    }
    catch (error) {
        console.error('Error retrieving images:', error);
        res.status(500).json({ error: 'Failed to retrieve images' });
    }
});
exports.getBannerImages = getBannerImages;
