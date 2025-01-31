import prisma from '../prisma/prismaClient';
import QRCode from 'qrcode';

const generateCustomId = (userType: string): string => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const suffix = userType === "Retailer" ? "RE" : userType === "Supplier" ? "SU" : null;

  if (!suffix) {
    throw new Error("Invalid userType for customId generation");
  }

  return `${suffix}-${randomNumber}`;
};

// const baseUrl = 'http://192.168.0.105:3000/onboard';
const baseUrl = 'https://connect-frontend-cpvu.vercel.app/onboard'

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
      filePath
    } = userData;

    const customId = generateCustomId(userType);

    if (userType === 'Retailer') {
      if (!sellerId) {
        throw new Error('sellerId is required to map Retailer to a Supplier.');
      }

      const supplierExists = await prisma.seller.findUnique({
        where: { customId: sellerId },
      });

      if (!supplierExists) {
        throw new Error(`Supplier with ID ${sellerId} does not exist.`);
      }

      // Include the supplier's customId in the QR code payload
      const qrCodeUrl = `${baseUrl}?type=retailer&id=${customId}&supplierId=${sellerId}`;
      const qrCode = await QRCode.toDataURL(qrCodeUrl);

      const retailerData = {
        sellerId,
        customId,
        qrCode,
        businessName,
        businessOwner,
        phone,
        gstNumber,
        shopMarka,
        transport,
        pincode,
        city,
        state,
        filePath
      };

      const retailer = await prisma.retailer.create({
        data: retailerData,
      });

      return { message: 'Retailer added successfully', data: retailer };
    }

    if (userType === 'Supplier') {
      const qrCodeSupplierUrl = `${baseUrl}?id=${customId}`;
      const qrCodeSupplier = await QRCode.toDataURL(qrCodeSupplierUrl);

      const supplierData = {
        customId,
        qrCode: qrCodeSupplier,
        businessName,
        businessOwner,
        phone,
        gstNumber,
        shopMarka,
        transport,
        pincode,
        city,
        state,
        filePath
      };

      const supplier = await prisma.seller.create({
        data: supplierData,
      });

      return { message: 'Supplier added successfully', data: supplier };
    }

    throw new Error('Invalid userType');
  } catch (error) {
    console.error('Error adding user to database:', error);
    throw new Error('Failed to add user');
  }
};


// const generateCustomId = (userType: string): string => {
//   const randomNumber = Math.floor(1000 + Math.random() * 9000);
//   const suffix = userType === "Retailer" ? "RE" : userType === "Supplier" ? "SU" : null;

//   if (!suffix) {
//     throw new Error("Invalid userType for customId generation");
//   }

//   return `${suffix}-${randomNumber}`;
// };

// const baseUrl = 'http://localhost:3000/onboard';

// export const addUser = async (userData: any) => {
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
//     } = userData;

//     // Generate a unique retailer ID and QR Code
//     const uniqueRetailerId = `r-${new Date().getTime()}`;
//     // const qrCode = await QRCode.toDataURL(uniqueRetailerId);

//     const qrCodeUrl = `${baseUrl}?type=retailer&id=${uniqueRetailerId}`;
//     const qrCode = await QRCode.toDataURL(qrCodeUrl);

//     const customId = generateCustomId(userType);


//     if (userType === 'Retailer') {
//       if (!sellerId) {
//         throw new Error('supplierId is required to map Retailer to a Supplier.');
//       }

//       // Check if Supplier exists
//       const supplierExists = await prisma.seller.findUnique({
//         where: { customId: sellerId },


//       });

//       if (!supplierExists) {
//         throw new Error(`Supplier with ID ${sellerId} does not exist.`);
//       }

//       // Create a dynamic retailer data object
//       const retailerData: any = { sellerId };

//       if (businessName) retailerData.businessName = businessName;
//       if (businessOwner) retailerData.businessOwner = businessOwner;
//       if (phone) retailerData.phone = phone;
//       if (gstNumber) retailerData.gstNumber = gstNumber;
//       if (shopMarka) retailerData.shopMarka = shopMarka;
//       if (transport) retailerData.transport = transport;
//       if (pincode) retailerData.pincode = pincode;
//       if (city) retailerData.city = city;
//       if (state) retailerData.state = state;
//       retailerData.qrCode = qrCode;
//       retailerData.customId = customId

//       const retailer = await prisma.retailer.create({
//         data: retailerData,
//         // include: {
//         //   seller: true, 
//         // },
//       });

//       return { message: 'Retailer added successfully', data: retailer };
//     }

//     // Generate a unique retailer ID and QR Code
//     const uniqueSupplierId = `s-${new Date().getTime()}`;
//     const qrCodeSupplier = await QRCode.toDataURL(uniqueSupplierId);

//     // Handle Supplier case
//     if (userType === 'Supplier') {
//       const supplierData: any = {};

//       // Add fields to the supplierData object only if they are defined
//       if (businessName) supplierData.businessName = businessName;
//       if (businessOwner) supplierData.businessOwner = businessOwner;
//       if (phone) supplierData.phone = phone;
//       if (gstNumber) supplierData.gstNumber = gstNumber;
//       if (shopMarka) supplierData.shopMarka = shopMarka;
//       if (transport) supplierData.transport = transport;
//       if (pincode) supplierData.pincode = pincode;
//       if (city) supplierData.city = city;
//       if (state) supplierData.state = state;
//       supplierData.qrCode = qrCodeSupplier;
//       supplierData.customId = customId

//       const supplier = await prisma.seller.create({
//         data: supplierData,
//       });
//       return { message: 'Supplier added successfully', data: supplier };
//     }

//   } catch (error) {
//     console.error('Error adding user to database:', error);
//     throw new Error('Failed to add user');
//   }
// };

export const fetchRetailerById = async (customId: string) => {
  try {
    const user = await prisma.retailer.findUnique({
      where: { customId },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user');
  }
};

export const fetchSellerById = async (customId: string) => {
  try {
    const user = await prisma.seller.findUnique({
      where: { customId },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user');
  }
};
