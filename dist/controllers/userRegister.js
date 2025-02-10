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
exports.hello = exports.onBoardUser = exports.getUserById = void 0;
const userRegisterService_1 = require("../services/userRegisterService");
const responseHandle_1 = require("../utils/responseHandle");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const JWT_SECRET = "your_super_secret_key";
cloudinary_1.default.v2.config({
    cloud_name: 'dogsc8bt0',
    api_key: '338558281491174',
    api_secret: 'yJDW0DIvTrdmAxus4glabRqtuaw',
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customId, userType } = req.body;
        // Validation
        if (!customId) {
            return res.status(400).json({ error: 'Invalid or missing user ID' });
        }
        if (!customId) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        if (userType == 'Retailer') {
            const user = yield (0, userRegisterService_1.fetchRetailerById)(customId);
            if (!user) {
                return res.status(404).json({ error: 'Retailer not found' });
            }
            // Send success response
            (0, responseHandle_1.sendSuccess)(res, user, 'Retailer fetched successfully');
        }
        else if (userType == 'Supplier') {
            const user = yield (0, userRegisterService_1.fetchSellerById)(customId);
            if (!user) {
                return res.status(404).json({ error: 'Supplier not found' });
            }
            // Send success response
            (0, responseHandle_1.sendSuccess)(res, user, 'Supplier fetched successfully');
        }
    }
    catch (error) {
        console.error('Error fetching user by ID:', error);
        (0, responseHandle_1.sendError)(res, 'Error fetching user', error);
    }
});
exports.getUserById = getUserById;
// Function to upload image to Cloudinary
const uploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinary_1.default.v2.uploader.upload(file.path, { resource_type: 'image' }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result.secure_url);
        });
    });
});
const onBoardUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userType, sellerId, businessName, businessOwner, phone, gstNumber, shopMarka, transport, pincode, city, state, qrCode, qrCodeSelf } = req.body;
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
            filePath = yield uploadImage(req.file);
        }
        console.log("filePath", filePath);
        // Add user logic
        const newUser = yield (0, userRegisterService_1.addUser)({
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
            qrCodeSelf
        });
        if (!newUser) {
            return res.status(500).json({ error: 'Failed to create user.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, userType: newUser.userType }, JWT_SECRET, { expiresIn: '9999 years' } // Lifetime validity
        );
        // Attach token to the response
        (0, responseHandle_1.sendSuccess)(res, { user: newUser, token }, 'User Registered Successfully');
    }
    catch (error) {
        console.error('Error onboarding user:', error);
        (0, responseHandle_1.sendError)(res, 'Error onboarding user', error);
    }
});
exports.onBoardUser = onBoardUser;
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
const hello = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, responseHandle_1.sendSuccess)(res, null, 'Hello');
    }
    catch (error) {
        console.error('Error creating user:', error);
        (0, responseHandle_1.sendError)(res, 'Error creating user', error);
    }
});
exports.hello = hello;
