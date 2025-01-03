const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); // Import CORS

const app = express();
const prisma = new PrismaClient();

const corsOptions = {
  origin: 'http://localhost:3001', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());

// Environment variables
const JWT_SECRET = 'your_secret_key'; // Replace with your secret key

// Route: Create a Seller
app.post('/api/seller', async (req:any, res:any) => {
  try {
    const { name } = req.body;

    // Generate a unique QR code for the seller
    const sellerId = `seller-${new Date().getTime()}`;
    const qrCode = await QRCode.toDataURL(sellerId);

    // Save the seller in the database
    const seller = await prisma.seller.create({
      data: { name, qrCode: sellerId },
    });

    res.status(201).json({ seller, qrCode });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Onboard a Retailer
// app.post('/api/retailer/onboard', async (req:any, res:any) => {
//   try {
//     const { retailerName, sellerQrCode } = req.body;

//     // Validate seller by QR code
//     const seller = await prisma.seller.findUnique({
//       where: { qrCode: sellerQrCode },
//     });

//     if (!seller) {
//       return res.status(404).json({ message: 'Seller not found' });
//     }

//     // Generate a unique QR code for the retailer
//     const retailerQrCode = `retailer-${new Date().getTime()}`;
//     const qrCode = await QRCode.toDataURL(retailerQrCode);

//     // Save the retailer in the database and associate with the seller
//     const retailer = await prisma.retailer.create({
//       data: {
//         name: retailerName,
//         qrCode: retailerQrCode,
//         sellerId: seller.id, // Link to seller
//       },
//     });

//     res.status(201).json({ retailer, qrCode });
//   } catch (error:any) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/retailer/profile', async (req:any, res:any) => {
//   try {
//     const retailer = req.retailer;

//     res.status(200).json({
//       id: retailer.id,
//       name: retailer.name,
//       qrCode: retailer.qrCode,
//       createdAt: retailer.createdAt,
//       updatedAt: retailer.updatedAt,
//     });
//   } catch (error:any) {
//     console.error('Error fetching profile:', error.message);
//     res.status(500).json({ error: 'Failed to fetch profile' });
//   }
// });

app.get('/api/retailer/profile', async (req: any, res: any) => {
  try {
    const retailerId = req.query.retailerId;

    if (!retailerId) {
      return res.status(400).json({ error: 'Retailer ID is required' });
    }

    console.log("**************", retailerId);

    const retailer = await prisma.retailer.findUnique({
      where: { qrCode: retailerId },
    });

    console.log("retailer", retailer);

    if (!retailer) {
      return res.status(404).json({ error: 'Retailer not found' });
    }

    // Return the retailer's profile with qrCode
    res.status(200).json({
      id: retailer.id,
      name: retailer.name,
      qrCode: retailer.qrCode, // Ensure QR code is returned in response
      createdAt: retailer.createdAt,
      updatedAt: retailer.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});



// app.get('/api/retailer/profile', async (req:any, res:any) => {
//   try {
//     const retailer = req.retailer;

//     // Return the retailer's profile with qrCode
//     res.status(200).json({
//       id: retailer.id,
//       name: retailer.name,
//       qrCode: retailer.qrCode, // Ensure QR code is returned in response
//       createdAt: retailer.createdAt,
//       updatedAt: retailer.updatedAt,
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch profile' });
//   }
// });


app.post('/api/retailer/onboard', async (req:any, res:any) => {
  try {
    const { retailerName, sellerQrCode } = req.body;
    console.log('Received Data:', { retailerName, sellerQrCode });

    // Find seller by QR code
    const seller = await prisma.seller.findUnique({
      where: { qrCode: sellerQrCode },
    });

    if (!seller) {
      console.log('Seller not found:', sellerQrCode);
      return res.status(404).json({ message: 'Seller not found' });
    }

    console.log('Seller Found:', seller);

    // Generate a unique QR code for the retailer
    const retailerQrCode = `retailer-${new Date().getTime()}`;
    const qrCode = await QRCode.toDataURL(retailerQrCode);

    // Save retailer in the database
    const retailer = await prisma.retailer.create({
      data: {
        name: retailerName,
        qrCode: retailerQrCode,
        sellerId: seller.id,
      },
    });

    console.log('Retailer Created:', retailer);
    res.status(201).json({ retailer, qrCode });
  } catch (error:any) {
    console.error('Error in Retailer Onboarding:', error.message);
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/retailer/scan/:qrCode', async (req: any, res: any) => {
  try {
    const { qrCode } = req.params;
    console.log('Received QR Code:', qrCode); // Log the QR code received

    // Find retailer by QR code
    const retailer = await prisma.retailer.findUnique({
      where: { qrCode },
    });

    if (!retailer) {
      console.log('Retailer not found');
      return res.status(404).json({ message: 'Retailer not found' });
    }

    const token = jwt.sign({ id: retailer.id }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true });

    // Return retailer details without sensitive data
    res.status(200).json({
      id: retailer.id,
      name: retailer.name,
      qrCode: retailer.qrCode,
      token:token
    });
  } catch (error: any) {
    console.error('Error fetching retailer:', error.message);
    res.status(500).json({ error: error.message });
  }
});



// app.get('/api/retailer/scan/:qrCode', async (req:any, res:any) => {
//   try {
//     const { qrCode } = req.params;

//     // Find retailer by QR code
//     const retailer = await prisma.retailer.findUnique({
//       where: { qrCode },
//     });

//     if (!retailer) {
//       return res.status(404).json({ message: 'Retailer not found' });
//     }

//     // Return retailer details without sensitive data
//     res.status(200).json({
//       id: retailer.id,
//       name: retailer.name,
//       qrCode: retailer.qrCode,
//     });
//   } catch (error:any) {
//     console.error('Error fetching retailer:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });



// Route: Retailer Login
app.post('/api/retailer/login', async (req:any, res:any) => {
  try {
    const { qrCode } = req.body;

    // Validate retailer by QR code
    const retailer = await prisma.retailer.findUnique({
      where: { qrCode },
      include: { seller: true }, // Include associated seller data
    });

    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    // Generate a JWT for authentication
    const token = jwt.sign({ id: retailer.id }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true });

    res.status(200).json({
      message: 'Login successful',
      retailer: {
        id: retailer.id,
        name: retailer.name,
        seller: retailer.seller, // Seller details
      },
    });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware: Protected Route
const authenticate = (req:any, res:any, next:any) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.retailer = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Example Protected Route
app.get('/api/protected', authenticate, (req:any, res:any) => {
  res.status(200).json({ message: 'Welcome to the protected route!' });
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
