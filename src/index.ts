import express from 'express';
import userRoutes from './routes/userRoutes';
import configRoutes from './routes/configRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import notesRoutes from './routes/notesRoutes';
import reviewRoutes from './routes/reviewRoutes';
import userList from './routes/userList'
import adminRoutes  from './routes/adminRoutes'
import {  adminLogin, adminRegister } from './controllers/getUserList';
import { addStatus } from './controllers/addStatusController';
import { getBannerImages, uploadBannerImage } from './controllers/bannerUpload';
import multer from 'multer';
import path from 'path';
import cors from 'cors'
import prisma from './prisma/prismaClient';

const app = express();

const corsOptions = {
  // origin: 'http://192.168.0.105:3000', 
  // origin:'https://connect-frontend-cpvu.vercel.app',
  origin: [
    'http://192.168.0.105:3000',  
    'https://connect-frontend-cpvu.vercel.app'  
  ],
  credentials: true, 
};
app.use(express.json());


app.use(cors(corsOptions));

const upload = multer({
  dest: 'uploads/', // Or specify Cloudinary or any cloud storage
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size per image
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname !== '.jpg' && extname !== '.jpeg' && extname !== '.png') {
      return cb(new Error('Only .jpg, .jpeg, and .png files are allowed.'));
    }
    cb(null, true);
  },
});

app.use('/users', userRoutes);
app.use('/config', configRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.use('/notes', notesRoutes);
app.use('/review', reviewRoutes);
app.use('/user', userList)
app.use('/admin', adminRoutes)
app.use('/register', adminRegister)
app.use('/login', adminLogin)
app.post('/addStatus', addStatus)
app.post('/upload-banner', upload.array('images', 5) ,uploadBannerImage)
app.get('/get-banner-image', getBannerImages)




app.post("/api/guests/create", async (req:any, res:any) => {
  const { phone , sellerId} = req.body;

  // Validate phone input
  if (!phone || !/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({ success: false, message: "Invalid phone number." });
  }

  try {
    // Check if the phone number already exists
    const existingGuest = await prisma.guest.findUnique({
      where: { phone },
    });

    if (existingGuest) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered.",
      });
    }

    // Generate customId with prefix "GUEST" followed by a random number
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
    const customId = `GUEST${randomNumber}`;

    // Create a new Guest record
    const newGuest = await prisma.guest.create({
      data: {
        phone,
        customId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Guest created successfully.",
      data: newGuest,
    });
  } catch (error) {
    console.error("Error creating guest:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the guest.",
    });
  }
});


app.get('/api/retailer/scan/:qrCode', async (req: any, res: any) => {
  try {
    const { qrCode } = req.params;
    console.log('Received QR Code:', qrCode);

    // Find retailer by QR code
    const retailer = await prisma.retailer.findUnique({
      where: { qrCode },
    });

    if (!retailer) {
      console.log('Retailer not found');
      return res.status(404).json({ message: 'Retailer not found' });
    }

    // const token = jwt.sign({ id: retailer.id }, JWT_SECRET, { expiresIn: '1d' });
    // res.cookie('token', token, { httpOnly: true });

    // Return retailer details without sensitive data
    res.status(200).json({
      id: retailer.id,
      businessName: retailer.businessName,
      qrCode: retailer.qrCode,
      sellerId: retailer.sellerId,
      phone: retailer.phone,
      // token:token
    });
  } catch (error: any) {
    console.error('Error fetching retailer:', error.message);
    res.status(500).json({ error: error.message });
  }
});




// app.post('/add-to-cart', createOrderProductDetails)


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
