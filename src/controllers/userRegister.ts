import { addUser, fetchRetailerById, fetchSellerById } from '../services/userRegisterService';
import { sendSuccess, sendError } from '../utils/responseHandle';

// export const getAllUsers = async (req: any, res: any) => {
//   try {
//     const users = await getUsers();
//     sendSuccess(res, users, 'User Fetch Successfully')
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     sendError(res, 'error')
//   }
// };

export const getUserById = async (req: any, res: any) => {
  try {
    const { 
      id,
      userType,
    } = req.body;

    // Validation
    if (!id) {
      return res.status(400).json({ error: 'Invalid or missing user ID' });
    }

    if (!id || !userType ) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

      if (userType == 'Retailer') {
        const user = await fetchRetailerById(id);

        if (!user) {
          return res.status(404).json({ error: 'Retailer not found' });
        }

        // Send success response
        sendSuccess(res, user, 'Retailer fetched successfully');
      }
      else if (userType == 'Supplier') {
        const user = await fetchSellerById(id);

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

    // Add user logic
    const newUser = await addUser({
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
    });

    // Success response
    sendSuccess(res, newUser, "User Registered Successfully");
  } catch (error) {
    console.error('Error onboarding user:', error);
    sendError(res, 'Error onboarding user', error);
  }
};


export const hello = async (req: any, res: any) => {
  try {
    sendSuccess(res, null, 'Hello')
  } catch (error) {
    console.error('Error creating user:', error);
    sendError(res, 'Error creating user', error)
  }
};


