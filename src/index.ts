import express from 'express';
import userRoutes from './routes/userRoutes';
import configRoutes from './routes/configRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import notesRoutes from './routes/notesRoutes';
import reviewRoutes from './routes/reviewRoutes';
import userList from './routes/userList'
import adminRoutes from './routes/adminRoutes'
import { adminLogin, adminRegister } from './controllers/getUserList';
import { addStatus } from './controllers/addStatusController';
import { getBannerImages, uploadBannerImage } from './controllers/bannerUpload';
import multer from 'multer';
import path from 'path';
import cors from 'cors'
import prisma from './prisma/prismaClient';
import { sendOtpController } from './controllers/otpVerification';
import { sendOtp, verifyOtp, verifyOtpForReloginRetailer, verifyOtpForReloginSeller } from './services/userRegisterService';
// import { sendOtpController, verifyOtpController } from './controllers/otpVerification';
import QRCode from 'qrcode';
import cloudinary from 'cloudinary';


const app = express();

const corsOptions = {
  origin:['https://connect-frontend-iu5s.vercel.app', 'https://conn-dashbaord.vercel.app', 'http://192.168.0.105:3000', 'http://192.168.0.105:3001', 'http://dashboard.badasauda.com', 'http://badasauda.com'],
  credentials: true,
};
app.use(express.json());


app.use(cors(corsOptions));

const upload = multer({
  dest: 'uploads/', // Or specify Cloudinary or
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size per image
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname !== '.jpg' && extname !== '.jpeg' && extname !== '.png') {
      return cb(new Error('Only .jpg, .jpeg, and .png files are allowed.'));
    }
    cb(null, true);
  },
});

cloudinary.v2.config({
  cloud_name: 'dogsc8bt0',
  api_key: '338558281491174',
  api_secret: 'yJDW0DIvTrdmAxus4glabRqtuaw',
});

const uploadImage = async (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(file.path, { resource_type: 'image' }, (error, result: any) => {
      if (error) {
        return reject(error);
      }
      resolve(result.secure_url as string);
    });
  });
};

// const baseUrl = 'http://192.168.0.105:3000/onboard';
const baseUrl = 'https://connect-frontend-iu5s.vercel.app/'

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
app.post('/upload-banner', upload.array('images', 5), uploadBannerImage)
app.get('/get-banner-image', getBannerImages)
app.post('/send-otp', sendOtp)
app.post('/verify-otp', verifyOtp)
app.post('/verify-otp-relogin-retailer', verifyOtpForReloginRetailer)
app.post('/verify-otp-relogin-supplier', verifyOtpForReloginSeller)


app.get("/api/products", async (req:any, res:any) => {
  try {
    const { productName } = req.query;

    if (!productName) {
      return res.status(400).json({ error: "Product name is required" });
    }

    const product = await prisma.product.findMany({
      where: {
        productName: {
          contains: productName, // Partial search
          mode: "insensitive", // Case insensitive
        },
      },
      include: {
        seller: true, // Include seller details if needed
      },
    });

    if (!product.length) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/get-users', async (req: any, res: any) => {
  try {
    const sellers = await prisma.seller.findMany({
      select: {
        id: true,
        customId: true,
        businessName: true,
        businessOwner: true,
        phone: true,
        gstNumber: true,
        city: true,
        state: true,
        pincode: true,
        createdAt: true,
      },
    });

    const retailers = await prisma.retailer.findMany({
      select: {
        id: true,
        customId: true,
        businessName: true,
        businessOwner: true,
        phone: true,
        gstNumber: true,
        city: true,
        state: true,
        pincode: true,
        sellerId: true, 
        createdAt: true,
      },
    });

    return res.status(200).json({ 
      success: true, 
      users: [...sellers.map(user => ({ ...user, type: "SELLER" })), 
              ...retailers.map(user => ({ ...user, type: "RETAILER" }))] 
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/generate-notification', async (req: any, res: any) => {
  const { message, recipients } = req.body;

  if (!message || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: "Message and at least one recipient are required" });
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        message,
        recipients: {
          create: recipients.map((recipient: string) => ({
            recipient, 
          })),
        },
      },
      include: { recipients: true }, 
    });

    return res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/get-all-notification', async (req: any, res: any) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        recipients: true, // Include recipient details
      },
    });

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// app.post('/generate-notification', async (req: any, res: any) => {
//   const { message, recipients } = req.body;

//   if (!message || !Array.isArray(recipients) || recipients.length === 0) {
//     return res.status(400).json({ error: "Message and at least one recipient are required" });
//   }

//   try {
//     const notification = await prisma.notification.create({
//       data: {
//         message,
//         recipients, 
//       },
//     });

//     return res.status(201).json({ success: true, notification });
//   } catch (error) {
//     console.error("Error creating notification:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get('/get-all-notification', async(req:any, res:any)=>{
//   try {
//     const notification = await prisma.notification.findMany({
//       orderBy: { createdAt: 'desc' }
//     });
//     return res.status(200).json({ success: true, notification });
//   } catch (error) {
//     console.error("Error creating notification:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// })

const generateCustomId = (userType: string): string => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const suffix = userType === "retailer" ? "RE" : userType === "seller" ? "SU" : null;

  if (!suffix) {
    throw new Error("Invalid userType for customId generation");
  }
  return `${suffix}-${randomNumber}`;
};

const generateAdminId = (): string => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
  return `ADM-${randomNumber}`;
};

app.post('/onboard-user-by-admin', upload.single('file'), async (req: any, res: any) => {
  const { userType, businessName, businessOwner, phone, gstNumber, shopMarka, transport,
    pincode, city, state, adminId } = req.body;

  const customId = generateCustomId(userType);

  const generatedAdminId = adminId || generateAdminId();

     // Handle file upload
     let filePath = '';
     if (req.file) {
       filePath = await uploadImage(req.file);
     }

  try {
    let registerUser;

    if (userType === 'seller') {
      const qrCodeSupplierUrl = `${baseUrl}?id=${customId}`;
      const qrCodeSupplier = await QRCode.toDataURL(qrCodeSupplierUrl);

      const qrCodeSupplierSelfUrl = `${baseUrl}?type=supplier&id=${customId}&timestamp=${Date.now()}`;
            const qrCodeSelfSupplier = await QRCode.toDataURL(qrCodeSupplierSelfUrl);

      registerUser = await prisma.seller.create({
        data: {
          customId,
          businessName,
          businessOwner,
          phone,
          gstNumber,
          shopMarka,
          transport,
          pincode,
          city,
          state,
          filePath,
          qrCode: qrCodeSupplier,
          qrCodeSelf : qrCodeSelfSupplier,
          adminId: generatedAdminId, 
        }
      });

      registerUser = await prisma.seller.findMany({
        orderBy: { createdAt: 'desc' } 
      });
    } else if (userType === 'retailer') {
      const qrCodeUrl = `${baseUrl}?type=retailer&id=${customId}&supplierId=${generatedAdminId}`;
      const qrCode = await QRCode.toDataURL(qrCodeUrl);

      registerUser = await prisma.retailer.create({
        data: {
          customId,
          businessName,
          businessOwner,
          phone,
          gstNumber,
          shopMarka,
          transport,
          pincode,
          city,
          state,
          filePath,
          qrCode: qrCode,
          adminId: generatedAdminId,  
        }
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid user type" });
    }

    console.log("registerUser", registerUser)
    return res.status(201).json({
      success: true,
      message: "User onboarded successfully.",
      data: registerUser,
    });
  } catch (error:any) {
    console.error("Error onboarding user:", error);
    return res.status(500).json({ success: false, message: "Error onboarding user", error: error.message });
    // return res.status(500).json({ success: false, message: "Error onboarding user", error });
  }
});



app.post("/api/guests/create", async (req: any, res: any) => {
  const { phone, sellerId } = req.body;

  // Validate phone input
  if (!phone || !/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({ success: false, message: "Invalid phone number." });
  }

  try {
    // Check if the phone number already exists
    const existingGuest = await prisma.guest.findUnique({
      where: { phone, sellerId },
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
        sellerId
      },

      
    });

    // { message: 'Retailer added successfully', data: newGuest }
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

    // Return retailer details without sensitive dat
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
