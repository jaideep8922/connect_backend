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

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
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



// app.post('/add-to-cart', createOrderProductDetails)


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
