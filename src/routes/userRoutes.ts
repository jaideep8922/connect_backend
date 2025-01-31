import express from 'express';
import cors from 'cors';

import { onBoardUser, hello, getUserById } from '../controllers/userRegister';
import prisma from '../prisma/prismaClient';
import multer from 'multer';
import path from 'path';

const app = express();
app.use(cors());

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

// app.post('/create', onBoardUser);
app.post('/create', upload.single('file'), onBoardUser);

app.post('/getUserById', getUserById);
app.get('/hello', hello);



  


export default app;