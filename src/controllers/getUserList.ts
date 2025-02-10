import { PrismaClient } from "@prisma/client";
import { sendSuccess } from "../utils/responseHandle";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
const prisma = new PrismaClient();
const JWT_SECRET = 'your_secret_key_here';



export const getRetailersBySellerId = async (req: any, res: any) => {
  try {
    const { sellerId } = req.query;
    // Validation
    if (!sellerId) {
      return res.status(400).json({ error: "Missing seller ID" });
    }
    const retailers = await prisma.retailer.findMany({
      where: { sellerId },
      select: {
        id: true,
        businessName: true,
        businessOwner: true,
        phone: true,
        gstNumber: true,
        shopMarka: true,
        transport: true,
        pincode: true,
        city: true,
        state: true,
        createdAt: true,
        updatedAt: true,
        dropped:true,
        customId:true
      },
    });
    if (!retailers || retailers.length === 0) {
      return res.status(404).json({ error: "No retailers found for the given seller ID" });
    }
    sendSuccess(res, retailers, 'Retailers fetched successfully');
  } catch (error) {
    console.error("Error fetching retailers by seller ID:", error);
    return res.status(500).json({ error: "Error fetching retailers" });
  }
};

export const updateRetailerDroppedStatus = async (req: any, res: any) => {
  try {
    const { customId, dropped } = req.body; // Assuming customId and dropped are sent in the body

    // Validation
    if (!customId || dropped === undefined) {
      return res.status(400).json({ error: "Missing customId or dropped value" });
    }

    if (typeof dropped !== "boolean") {
      return res.status(400).json({ error: "Dropped value must be a boolean" });
    }

    // Find retailer by customId
    const retailer = await prisma.retailer.findUnique({
      where: { customId },
    });

    if (!retailer) {
      return res.status(404).json({ error: "Retailer not found for the given customId" });
    }

    // Update the dropped value
    const updatedRetailer = await prisma.retailer.update({
      where: { customId },
      data: { dropped },
    });

    return res.status(200).json({
      message: `Retailer's dropped status updated successfully`,
      retailer: updatedRetailer,
    });
  } catch (error) {
    console.error("Error updating retailer dropped status:", error);
    return res.status(500).json({ error: "Error updating retailer dropped status" });
  }
};


export const adminRegister = async (req: any, res: any) => {
  try {
    const { email, password, name, phone }: any = req.body;

    if (!email || !password || !name || !phone) {
      return res.status(400).json({ error: 'Email, password, name, and phone are required' });
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email: email },
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
      },
    });

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: '9999 years',
    });
    sendSuccess(res, token, 'Registration successful');


  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const adminLogin = async (req: any, res: any) => {
  try {
    const { email, password }: any = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
    if (!admin) {
      return res.status(404).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: '9999 years',
    });
    sendSuccess(res, { user: admin, token }, 'Login successful');

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// export const adminUserLogin = async (req: any, res: any) => {
//   try {
//     const {
//       userType, // "Retailer" or "Seller"
//       businessName,
//       businessOwner,
//       phone,
//       gstNumber,
//       shopMarka,
//       transport,
//       pincode,
//       city,
//       state,
//       qrCode,
//       adminId, // Admin's ID (mandatory)
//     } = req.body;

//     // Validate userType
//     if (!userType || !['Retailer', 'Seller'].includes(userType)) {
//       return res.status(400).json({ error: 'Invalid userType. Must be "Retailer" or "Seller".' });
//     }

//     // Validate adminId
//     if (!adminId) {
//       return res.status(400).json({ error: 'adminId is required for onboarding.' });
//     }

//     // Validate required fields
//     if (!businessName || !phone || !gstNumber || !pincode || !city || !state) {
//       return res.status(400).json({ error: 'Missing required fields.' });
//     }

//     let newUser;

//     if (userType === 'Seller') {
//       // Onboard a Seller
//       newUser = await prisma.seller.create({
//         data: {
//           businessName,
//           businessOwner,
//           phone,
//           gstNumber,
//           shopMarka,
//           transport,
//           pincode,
//           city,
//           state,
//           qrCode,
//           adminId,
//           customId: 'some_custom_id', 
//         },
//       });
//     } else if (userType === 'Retailer') {
//       // Onboard a Retailer
//       newUser = await prisma.retailer.create({
//         data: {
//           businessName,
//           businessOwner,
//           phone,
//           gstNumber,
//           shopMarka,
//           transport,
//           pincode,
//           city,
//           state,
//           qrCode,
//           adminId,
//           customId: 'some_custom_id', // Add a valid customId value here
//           seller: { connect: { id: req.body.sellerId } }, // Add a valid seller ID here
//         },
//       });
//     }

//     if (!newUser) {
//       return res.status(500).json({ error: 'Failed to onboard user.' });
//     }

//     // Generate JWT token for the onboarded user
//     const token = jwt.sign(
//       { id: newUser.id, userType },
//       JWT_SECRET,
//       { expiresIn: '9999 years' } // Lifetime validity
//     );

//     // Send success response with the onboarded user details and token
//     sendSuccess(res, { user: newUser, token }, `${userType} onboarded successfully by Admin.`);
//   } catch (error) {
//     console.error('Error onboarding user by Admin:', error);
//   }

// }

const generateCustomId = (userType: string): string => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); 
  const suffix = userType === "Retailer" ? "RE" : userType === "Seller" ? "SU" : null;

  if (!suffix) {
    throw new Error("Invalid userType for customId generation");
  }

  return `${suffix}-${randomNumber}`; 
};


export const adminUserLogin = async (req: any, res: any) => {
  try {
    const {
      userType, // "Retailer" or "Seller"
      businessName,
      businessOwner,
      phone,
      gstNumber,
      shopMarka,
      transport,
      pincode,
      city,
      state,
      qrCode,
      adminId, // Admin's ID (mandatory)
      // sellerId, // Seller's customId (mandatory for Retailer)
    } = req.body;

    // Validate userType
    if (!userType || !['Retailer', 'Seller'].includes(userType)) {
      return res.status(400).json({ error: 'Invalid userType. Must be "Retailer" or "Seller".' });
    }

    // Validate required fields for both user types
    if (!businessName || !phone || !gstNumber || !pincode || !city || !state) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Validate adminId
    if (!adminId) {
      return res.status(400).json({ error: 'adminId is required for onboarding.' });
    }

    let newUser;

    if (userType === 'Seller') {
      // Onboard a Seller
      const customId = generateCustomId("Seller"); // Generate customId for Seller

      newUser = await prisma.seller.create({
        data: {
          businessName,
          businessOwner,
          phone,
          gstNumber,
          shopMarka,
          transport,
          pincode,
          city,
          state,
          qrCode,
          adminId,
          customId 
        },
      });
    } else if (userType === 'Retailer') {
      const customId = generateCustomId("Retailer");

      // Validate sellerId for Retailer
      // if (!sellerId) {
      //   return res.status(400).json({ error: 'sellerId is required for Retailer onboarding.' });
      // }

      // Onboard a Retailer
      newUser = await prisma.retailer.create({
        data: {
          businessName,
          businessOwner,
          phone,
          gstNumber,
          shopMarka,
          transport,
          pincode,
          city,
          state,
          qrCode,
          adminId,
          // seller: { connect: { customId: sellerId } }, // Link to the Seller via customId
          customId,
        },
      });
    }

    if (!newUser) {
      return res.status(500).json({ error: 'Failed to onboard user.' });
    }

    // Generate JWT token for the onboarded user
    const token = jwt.sign(
      { id: newUser.id, userType },
      JWT_SECRET,
      { expiresIn: '9999 years' } // Lifetime validity
    );

    // Send success response with the onboarded user details and token
    sendSuccess(res, { user: newUser, token }, `${userType} onboarded successfully by Admin.`);
  } catch (error) {
    console.error('Error onboarding user by Admin:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};



