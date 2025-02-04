import { PrismaClient } from '@prisma/client';
import { addUser, fetchRetailerById, fetchSellerById } from '../services/userRegisterService';
import { sendSuccess, sendError } from '../utils/responseHandle';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import cloudinary from 'cloudinary';

const JWT_SECRET = "your_super_secret_key";

cloudinary.v2.config({
  cloud_name: 'dogsc8bt0',
  api_key: '338558281491174',
  api_secret: 'yJDW0DIvTrdmAxus4glabRqtuaw',
});


export const getUserById = async (req: any, res: any) => {
  try {
    const { 
      customId,
      userType
    } = req.body;

    // Validation
    if (!customId) {
      return res.status(400).json({ error: 'Invalid or missing user ID' });
    }

    if (!customId  ) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

      if (userType == 'Retailer') {
        const user = await fetchRetailerById(customId);

        if (!user) {
          return res.status(404).json({ error: 'Retailer not found' });
        }

        // Send success response
        sendSuccess(res, user, 'Retailer fetched successfully');
      }
      else if (userType == 'Supplier') {
        const user = await fetchSellerById(customId);

        if (!user) {
          return res.status(404).json({ error: 'Supplier not found' });
        }

        // Send success response
        sendSuccess(res, user, 'Supplier fetched successfully');
      }
   

  } catch (error) {
    console.error('Error fetching user by ID:', error);
    sendError(res, 'Error fetching user', error);
  }
};


// Function to upload image to Cloudinary
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

export const onBoardUser = async (req: any, res: any) => {
  try {
    const {
      userType,
      sellerId,
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
    } = req.body;

    // Validation for required fields
    if (!userType || !['Retailer', 'Supplier'].includes(userType)) {
      return res.status(400).json({ error: 'Invalid userType. Must be "Retailer" or "Supplier".' });
    }

    if (!businessName || !phone || !gstNumber || !pincode || !city || !state) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }


    // Handle file upload
    let filePath = '';
    if (req.file) {
      filePath = await uploadImage(req.file);
    }

    console.log("filePath",filePath)

    // Add user logic
    const newUser: any = await addUser({
      userType,
      sellerId, // Optional for Supplier but required for Retailer
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
      filePath,
    });

    if (!newUser) {
      return res.status(500).json({ error: 'Failed to create user.' });
    }

    const token = jwt.sign(
      { id: newUser.id, userType: newUser.userType },
      JWT_SECRET,
      { expiresIn: '9999 years' } // Lifetime validity
    );

    // Attach token to the response
    sendSuccess(res, { user: newUser, token }, 'User Registered Successfully');
  } catch (error) {
    console.error('Error onboarding user:', error);
    sendError(res, 'Error onboarding user', error);
  }
};


// export const onBoardUser = async (req: any, res: any) => {
//   try {
//     const {
//       userType,
//       sellerId,
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
//       filePath
//     } = req.body;

//     // Validation for required fields
//     if (!userType || !['Retailer', 'Supplier'].includes(userType)) {
//       return res.status(400).json({ error: 'Invalid userType. Must be "Retailer" or "Supplier".' });
//     }

//     if (!businessName || !phone || !gstNumber || !pincode || !city || !state) {
//       return res.status(400).json({ error: 'Missing required fields.' });
//     }


//     // Add user logic
//     const newUser:any = await addUser({
//       userType,
//       sellerId, // Optional for Supplier but required for Retailer
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
//       filePath
//     });

//     if (!newUser) {
//       return res.status(500).json({ error: 'Failed to create user.' });
//     }

//     const token = jwt.sign(
//       { id: newUser.id, userType: newUser.userType }, 
//       JWT_SECRET,
//       { expiresIn: '9999 years' } //  lifetime validity
//     );

//     // Attach token to the response
//     sendSuccess(res, { user: newUser, token }, "User Registered Successfully");

//     // Success response
//     // sendSuccess(res, newUser, "User Registered Successfully");
//   } catch (error) {
//     console.error('Error onboarding user:', error);
//     sendError(res, 'Error onboarding user', error);
//   }
// };


export const hello = async (req: any, res: any) => {
  try {
    sendSuccess(res, null, 'Hello')
  } catch (error) {
    console.error('Error creating user:', error);
    sendError(res, 'Error creating user', error)
  }
};