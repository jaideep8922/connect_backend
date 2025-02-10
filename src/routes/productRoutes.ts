import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { addProduct, getProductBySellerId, updateProductData, serachProductByLowestPrice } from '../controllers/productController';

const app = express();
app.use(cors());

// Multer setup for file uploads
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

app.post('/add-product', upload.fields([{ name: 'productImage' }, { name: 'productVideo' }]), addProduct); 
app.get('/get-product-list', getProductBySellerId);
app.put('/update-product', updateProductData);

app.get('/search-product', serachProductByLowestPrice);

export default app;
