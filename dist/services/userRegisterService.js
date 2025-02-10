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
exports.fetchSellerById = exports.fetchRetailerById = exports.addUser = exports.verifyOtpForReloginRetailer = exports.verifyOtpForReloginSeller = exports.verifyOtp = exports.sendOtp = void 0;
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const qrcode_1 = __importDefault(require("qrcode"));
const twilio_1 = __importDefault(require("twilio"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const twilioClient = (0, twilio_1.default)(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes expiry
const otpStorage = new Map();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
// Helper function to generate JWT
const generateJWT = (userId, phone, customId) => {
    return jsonwebtoken_1.default.sign({ userId, phone, customId }, JWT_SECRET, { expiresIn: '1h' });
};
// Send OTP API
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone } = req.body;
        if (!phone)
            return res.status(400).json({ message: "Phone number is required" });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStorage.set(phone, { otp, expiresAt: Date.now() + OTP_EXPIRY });
        // Send OTP via Twilio
        yield twilioClient.messages.create({
            body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });
        res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});
exports.sendOtp = sendOtp;
const verifyOtp = (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ message: "Phone and OTP are required" });
        }
        const storedOtpData = otpStorage.get(phone);
        if (!storedOtpData) {
            return res.status(400).json({ message: "OTP not found. Request a new one." });
        }
        if (Date.now() > storedOtpData.expiresAt) {
            otpStorage.delete(phone); // Remove expired OTP
            return res.status(400).json({ message: "OTP expired. Request a new one." });
        }
        if (storedOtpData.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // OTP verified, delete from storage
        otpStorage.delete(phone);
        res.json({ message: "OTP verified successfully" });
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Failed to verify OTP" });
    }
};
exports.verifyOtp = verifyOtp;
const verifyOtpForReloginSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ message: "Phone and OTP are required" });
        }
        const storedOtpData = otpStorage.get(phone);
        if (!storedOtpData) {
            return res.status(400).json({ message: "OTP not found. Request a new one." });
        }
        if (Date.now() > storedOtpData.expiresAt) {
            otpStorage.delete(phone); // Remove expired OTP
            return res.status(400).json({ message: "OTP expired. Request a new one." });
        }
        if (storedOtpData.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // OTP verified, delete from storage
        otpStorage.delete(phone);
        const phoneWithoutCountryCode = phone.replace(/^(\+91)/, ''); // Remove the +91 country code
        let user = yield prismaClient_1.default.seller.findUnique({
            where: { phone: phoneWithoutCountryCode },
        });
        console.log("user", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Generate JWT after successful OTP verification
        const token = generateJWT(user.id, user.phone, user.customId);
        console.log("verify-otp-relogin", token);
        const userId = user.customId;
        res.status(200).json({ user: user, token });
        // res.status(200).json({
        //   message: "OTP verified successfully",
        //   token,
        //   userId,
        //   user,
        //   { user: user, token }
        // });
    }
    catch (error) {
        console.error("Error verifying OTP for relogin:", error);
        res.status(500).json({ message: "Failed to verify OTP" });
    }
});
exports.verifyOtpForReloginSeller = verifyOtpForReloginSeller;
const verifyOtpForReloginRetailer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ message: "Phone and OTP are required" });
        }
        const storedOtpData = otpStorage.get(phone);
        if (!storedOtpData) {
            return res.status(400).json({ message: "OTP not found. Request a new one." });
        }
        if (Date.now() > storedOtpData.expiresAt) {
            otpStorage.delete(phone); // Remove expired OTP
            return res.status(400).json({ message: "OTP expired. Request a new one." });
        }
        if (storedOtpData.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // OTP verified, delete from storage
        otpStorage.delete(phone);
        // Check if the phone exists in the Retailer model
        let user = yield prismaClient_1.default.retailer.findUnique({
            where: { phone },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Generate JWT after successful OTP verification
        const token = generateJWT(user.id, user.phone, user.customId);
        console.log("verify-otp-relogin", token);
        res.status(200).json({
            message: "OTP verified successfully",
            token,
        });
    }
    catch (error) {
        console.error("Error verifying OTP for relogin:", error);
        res.status(500).json({ message: "Failed to verify OTP" });
    }
});
exports.verifyOtpForReloginRetailer = verifyOtpForReloginRetailer;
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
        const { userType, sellerId, businessName, businessOwner, phone, gstNumber, shopMarka, transport, pincode, city, state, filePath, qrCodeSelf } = userData;
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
            const qrCodeSupplierUrl = `${baseUrl}?id=${customId}`;
            const qrCodeSupplier = yield qrcode_1.default.toDataURL(qrCodeSupplierUrl);
            // const qrCodeSupplierSelfUrl = `${baseUrl}?type=supplier&supplierId=${sellerId}`;
            const qrCodeSupplierSelfUrl = `${baseUrl}?type=supplier&customId=${customId}&timestamp=${Date.now()}`;
            const qrCodeSelfSupplier = yield qrcode_1.default.toDataURL(qrCodeSupplierSelfUrl);
            console.log("qrCodeSupplier", qrCodeSupplier);
            console.log("qrCodeSelfSupplier", qrCodeSelfSupplier);
            const supplierData = {
                customId,
                qrCode: qrCodeSupplier,
                qrCodeSelf: qrCodeSelfSupplier,
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
