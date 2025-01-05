import prisma from '../prisma/prismaClient';

// export const getUsers = async () => {
//   return await prisma.user.findMany();
// };

export const addUser = async (userData: any) => {
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
    } = userData;

    if (userType === 'Retailer') {
      if (!sellerId) {
          throw new Error('supplierId is required to map Retailer to a Supplier.');
      }
  
      // Check if Supplier exists
      const supplierExists = await prisma.seller.findUnique({
          where: { id: sellerId },
      });
  
      if (!supplierExists) {
          throw new Error(`Supplier with ID ${sellerId} does not exist.`);
      }
  
      // Create a dynamic retailer data object
      const retailerData: any = { sellerId };
  
      if (businessName) retailerData.businessName = businessName;
      if (businessOwner) retailerData.businessOwner = businessOwner;
      if (phone) retailerData.phone = phone;
      if (gstNumber) retailerData.gstNumber = gstNumber;
      if (shopMarka) retailerData.shopMarka = shopMarka;
      if (transport) retailerData.transport = transport;
      if (pincode) retailerData.pincode = pincode;
      if (city) retailerData.city = city;
      if (state) retailerData.state = state;
      if (qrCode) retailerData.qrCode = qrCode;
  
      const retailer = await prisma.retailer.create({
          data: retailerData,
      });
  
      return { message: 'Retailer added successfully', data: retailer };
  }
  

    // Handle Supplier case
    if (userType === 'Supplier') {
      const supplierData: any = {};

      // Add fields to the supplierData object only if they are defined
      if (businessName) supplierData.businessName = businessName;
      if (businessOwner) supplierData.businessOwner = businessOwner;
      if (phone) supplierData.phone = phone;
      if (gstNumber) supplierData.gstNumber = gstNumber;
      if (shopMarka) supplierData.shopMarka = shopMarka;
      if (transport) supplierData.transport = transport;
      if (pincode) supplierData.pincode = pincode;
      if (city) supplierData.city = city;
      if (state) supplierData.state = state;
      if (qrCode) supplierData.qrCode = qrCode;

      const supplier = await prisma.seller.create({
        data: supplierData,
      });
      return { message: 'Supplier added successfully', data: supplier };
    }

  } catch (error) {
    console.error('Error adding user to database:', error);
    throw new Error('Failed to add user');
  }
};

export const fetchRetailerById = async (id: number) => {
  try {
    const user = await prisma.retailer.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user');
  }
};

export const fetchSellerById = async (id: number) => {
  try {
    const user = await prisma.seller.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user');
  }
};
