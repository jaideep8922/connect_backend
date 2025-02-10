import express from 'express';
import cors from 'cors';
import prisma from '../prisma/prismaClient';
import cloudinary from 'cloudinary';

import { createOrder, getOrderStatusHistory, getOrderHistoryByRetailerId, updateOrderStatus, getOrderHistoryBySellerId } from '../controllers/orderController';
import multer from 'multer';
import path from 'path';

const app = express();
app.use(cors());

cloudinary.v2.config({
    cloud_name: 'dogsc8bt0',
    api_key: '338558281491174',
    api_secret: 'yJDW0DIvTrdmAxus4glabRqtuaw',
  });

const upload = multer({
  dest: 'file/', // Temporary folder before upload
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname !== '.jpg' && extname !== '.jpeg' && extname !== '.png' && extname !== '.mp4') {
      return cb(new Error('Only .jpg, .jpeg, .png, and .mp4 files are allowed.'));
    }
    cb(null, true);
  },
});



app.post('/create-order', createOrder);
app.post('/get-order-status-history', getOrderStatusHistory);
app.post('/get-order-history-by-retailer-id', getOrderHistoryByRetailerId);
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


app.put('/update-order-status', upload.single('file'), async (req: any, res: any) => {
  const { orderId, statusId } = req.body;
  const filePath = req.file ? req.file.path : null; // Get the file path from multer

  if (!orderId || !statusId) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
      let uploadedFileUrl = null;

      // Upload to Cloudinary only if a file is provided
      if (filePath) {
          const cloudinaryResponse = await cloudinary.v2.uploader.upload(filePath, {
              folder: 'orders/', // Specify a folder in Cloudinary
              resource_type: 'auto',
          });

          uploadedFileUrl = cloudinaryResponse.secure_url;
      }

      // Prepare the update object dynamically
      const updateData: any = {
          statusId: parseInt(statusId, 10),
      };

      if (uploadedFileUrl) {
          updateData.filePath = uploadedFileUrl;
      }

      // Update the order status in the database
      const updatedData = await prisma.orderDetails.update({
          where: { orderId },
          data: updateData,
      });

      // Create order status history
      await prisma.orderStatusHistory.create({
          data: {
              orderId,
              statusId: parseInt(statusId, 10),
          },
      });

      res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});



app.post('/get-order-history-by-supplier-id', getOrderHistoryBySellerId);

export default app;