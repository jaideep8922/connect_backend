import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import cloudinary from 'cloudinary';
import fs from 'fs';

// Initialize Prisma Client and Cloudinary
const prisma = new PrismaClient();
cloudinary.v2.config({
  cloud_name: 'dogsc8bt0',
  api_key: '338558281491174',
  api_secret: 'yJDW0DIvTrdmAxus4glabRqtuaw',
});



// API to upload 5 images to Cloudinary
export const uploadBannerImage = async (req: any, res: any) => {
  try {
    const { sellerId } = req.body; 
    if (!sellerId) {
      return res.status(400).json({ error: 'sellerId is required' });
    }

    const files = req.files as Express.Multer.File[];
    if (files.length === 0 || files.length > 5) {
      return res.status(400).json({ error: 'Please upload between 1 and 5 images.' });
    }

    const bannerImagesData = [];
    for (const file of files) {
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: 'banner_images/', 
        public_id: `banner_${Date.now()}`, 
      });

      fs.unlinkSync(file.path);

      bannerImagesData.push({
        imageLink: result.secure_url,
        sellerId,
      });
    }

    const createdBannerImages = await prisma.bannerImages.createMany({
      data: bannerImagesData,
    });

    res.status(200).json({
      message: 'Images uploaded successfully',
      data: createdBannerImages,
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
};


export const getBannerImages = async (req: any, res: any) => {
  try {
    const { sellerId } = req.query; // Get sellerId from query parameters

    if (!sellerId) {
      return res.status(400).json({ error: 'sellerId is required' });
    }

    // Query the database to get banner images by sellerId
    const bannerImages = await prisma.bannerImages.findMany({
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
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
};
