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
exports.adminUserLogin = exports.adminLogin = exports.adminRegister = exports.getRetailersBySellerId = void 0;
const client_1 = require("@prisma/client");
const responseHandle_1 = require("../utils/responseHandle");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = 'your_secret_key_here';
const getRetailersBySellerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sellerId } = req.query;
        // Validation
        if (!sellerId) {
            return res.status(400).json({ error: "Missing seller ID" });
        }
        const retailers = yield prisma.retailer.findMany({
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
            },
        });
        if (!retailers || retailers.length === 0) {
            return res.status(404).json({ error: "No retailers found for the given seller ID" });
        }
        (0, responseHandle_1.sendSuccess)(res, retailers, 'Retailers fetched successfully');
    }
    catch (error) {
        console.error("Error fetching retailers by seller ID:", error);
        return res.status(500).json({ error: "Error fetching retailers" });
    }
});
exports.getRetailersBySellerId = getRetailersBySellerId;
const adminRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, phone } = req.body;
        if (!email || !password || !name || !phone) {
            return res.status(400).json({ error: 'Email, password, name, and phone are required' });
        }
        const existingAdmin = yield prisma.admin.findUnique({
            where: { email: email },
        });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin with this email already exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const admin = yield prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
            expiresIn: '9999 years',
        });
        (0, responseHandle_1.sendSuccess)(res, token, 'Registration successful');
    }
    catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.adminRegister = adminRegister;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const admin = yield prisma.admin.findUnique({
            where: { email },
        });
        if (!admin) {
            return res.status(404).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
            expiresIn: '9999 years',
        });
        (0, responseHandle_1.sendSuccess)(res, { user: admin, token }, 'Login successful');
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.adminLogin = adminLogin;
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
const generateCustomId = (userType) => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const suffix = userType === "Retailer" ? "RE" : userType === "Seller" ? "SU" : null;
    if (!suffix) {
        throw new Error("Invalid userType for customId generation");
    }
    return `${suffix}-${randomNumber}`;
};
const adminUserLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userType, // "Retailer" or "Seller"
        businessName, businessOwner, phone, gstNumber, shopMarka, transport, pincode, city, state, qrCode, adminId, // Admin's ID (mandatory)
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
            newUser = yield prisma.seller.create({
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
        }
        else if (userType === 'Retailer') {
            const customId = generateCustomId("Retailer");
            // Validate sellerId for Retailer
            // if (!sellerId) {
            //   return res.status(400).json({ error: 'sellerId is required for Retailer onboarding.' });
            // }
            // Onboard a Retailer
            newUser = yield prisma.retailer.create({
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
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, userType }, JWT_SECRET, { expiresIn: '9999 years' } // Lifetime validity
        );
        // Send success response with the onboarded user details and token
        (0, responseHandle_1.sendSuccess)(res, { user: newUser, token }, `${userType} onboarded successfully by Admin.`);
    }
    catch (error) {
        console.error('Error onboarding user by Admin:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.adminUserLogin = adminUserLogin;
