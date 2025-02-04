"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSellerById = exports.fetchRetailerById = exports.addUser = void 0;
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const qrcode_1 = __importDefault(require("qrcode"));
const generateCustomId = (userType) => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const suffix = userType === "Retailer" ? "RE" : userType === "Supplier" ? "SU" : null;
    if (!suffix) {
        throw new Error("Invalid userType for customId generation");
    }
    return `${suffix}-${randomNumber}`;
};
const baseUrl = 'http://192.168.0.105:3000/onboard';
// const baseUrl = 'https://connect-frontend-cpvu.vercel.app/onboard'
const addUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userType, sellerId, businessName, businessOwner, phone, gstNumber, shopMarka, transport, pincode, city, state, filePath } = userData;
        const customId = generateCustomId(userType);
        if (userType === 'Retailer') {
            if (!sellerId) {
                throw new Error('sellerId is required to map Retailer to a Supplier.');
            }
            const supplierExists = yield prismaClient_1.default.seller.findUnique({
                where: { customId: sellerId },
            });
            if (!supplierExists) {
                throw new Error(`Supplier with ID ${sellerId} does not exist.`);
            }
            // Include the supplier's customId in the QR code payload
            const qrCodeUrl = `${baseUrl}?type=retailer&id=${customId}&supplierId=${sellerId}`;
            const qrCode = yield qrcode_1.default.toDataURL(qrCodeUrl);
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
            const retailer = yield prismaClient_1.default.retailer.create({
                data: retailerData,
            });
            return { message: 'Retailer added successfully', data: retailer };
        }
        if (userType === 'Supplier') {
            const customId = generateCustomId(userType);
            const qrCodeSupplierUrl = `${baseUrl}?id=${customId}`;
            const qrCodeSupplier = yield qrcode_1.default.toDataURL(qrCodeSupplierUrl);
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
            const supplier = yield prismaClient_1.default.seller.create({
                data: supplierData,
            });
            return { message: 'Supplier added successfully', data: supplier };
        }
        throw new Error('Invalid userType');
    }
    catch (error) {
        console.error('Error adding user to database:', error);
        throw new Error('Failed to add user');
    }
});
exports.addUser = addUser;
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
const fetchRetailerById = (customId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prismaClient_1.default.retailer.findUnique({
            where: { customId },
        });
        return user;
    }
    catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('Failed to fetch user');
    }
});
exports.fetchRetailerById = fetchRetailerById;
const fetchSellerById = (customId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prismaClient_1.default.seller.findUnique({
            where: { customId },
        });
        return user;
    }
    catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('Failed to fetch user');
    }
});
exports.fetchSellerById = fetchSellerById;
