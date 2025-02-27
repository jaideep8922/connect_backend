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
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const configRoutes_1 = __importDefault(require("./routes/configRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const notesRoutes_1 = __importDefault(require("./routes/notesRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const userList_1 = __importDefault(require("./routes/userList"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const getUserList_1 = require("./controllers/getUserList");
const addStatusController_1 = require("./controllers/addStatusController");
const bannerUpload_1 = require("./controllers/bannerUpload");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const prismaClient_1 = __importDefault(require("./prisma/prismaClient"));
const userRegisterService_1 = require("./services/userRegisterService");
// import { sendOtpController, verifyOtpController } from './controllers/otpVerification';
const qrcode_1 = __importDefault(require("qrcode"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const app = (0, express_1.default)();
const corsOptions = {
    // origin: ['http://192.168.0.105:3000','http://192.168.0.105:3001'],
    origin: ['https://connect-frontend-iu5s.vercel.app', 'https://conn-dashbaord.vercel.app', 'http://192.168.0.105:3000', 'http://192.168.0.105:3001'],
    // origin: [
    //   'http://192.168.0.105:3000',  
    // ],
    credentials: true,
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
const upload = (0, multer_1.default)({
    dest: 'uploads/', // Or specify Cloudinary or any cloud sto
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size per image
    fileFilter: (req, file, cb) => {
        const extname = path_1.default.extname(file.originalname).toLowerCase();
        if (extname !== '.jpg' && extname !== '.jpeg' && extname !== '.png') {
            return cb(new Error('Only .jpg, .jpeg, and .png files are allowed.'));
        }
        cb(null, true);
    },
});
cloudinary_1.default.v2.config({
    cloud_name: 'dogsc8bt0',
    api_key: '338558281491174',
    api_secret: 'yJDW0DIvTrdmAxus4glabRqtuaw',
});
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
// const baseUrl = 'http://192.168.0.105:3000/onboard';
const baseUrl = 'https://connect-frontend-iu5s.vercel.app/';
app.use('/users', userRoutes_1.default);
app.use('/config', configRoutes_1.default);
app.use('/product', productRoutes_1.default);
app.use('/order', orderRoutes_1.default);
app.use('/notes', notesRoutes_1.default);
app.use('/review', reviewRoutes_1.default);
app.use('/user', userList_1.default);
app.use('/admin', adminRoutes_1.default);
app.use('/register', getUserList_1.adminRegister);
app.use('/login', getUserList_1.adminLogin);
app.post('/addStatus', addStatusController_1.addStatus);
app.post('/upload-banner', upload.array('images', 5), bannerUpload_1.uploadBannerImage);
app.get('/get-banner-image', bannerUpload_1.getBannerImages);
app.post('/send-otp', userRegisterService_1.sendOtp);
app.post('/verify-otp', userRegisterService_1.verifyOtp);
app.post('/verify-otp-relogin-retailer', userRegisterService_1.verifyOtpForReloginRetailer);
app.post('/verify-otp-relogin-supplier', userRegisterService_1.verifyOtpForReloginSeller);
app.get("/api/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productName } = req.query;
        if (!productName) {
            return res.status(400).json({ error: "Product name is required" });
        }
        const product = yield prismaClient_1.default.product.findMany({
            where: {
                productName: {
                    contains: productName, // Partial search
                    mode: "insensitive", // Case insensitive
                },
            },
            include: {
                seller: true, // Include seller details if needed
            },
        });
        if (!product.length) {
            return res.status(404).json({ message: "No products found" });
        }
        res.json(product);
    }
    catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.get('/get-users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellers = yield prismaClient_1.default.seller.findMany({
            select: {
                id: true,
                customId: true,
                businessName: true,
                businessOwner: true,
                phone: true,
                gstNumber: true,
                city: true,
                state: true,
                pincode: true,
                createdAt: true,
            },
        });
        const retailers = yield prismaClient_1.default.retailer.findMany({
            select: {
                id: true,
                customId: true,
                businessName: true,
                businessOwner: true,
                phone: true,
                gstNumber: true,
                city: true,
                state: true,
                pincode: true,
                sellerId: true,
                createdAt: true,
            },
        });
        return res.status(200).json({
            success: true,
            users: [...sellers.map(user => (Object.assign(Object.assign({}, user), { type: "SELLER" }))),
                ...retailers.map(user => (Object.assign(Object.assign({}, user), { type: "RETAILER" })))]
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.post('/generate-notification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, recipients } = req.body;
    if (!message || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: "Message and at least one recipient are required" });
    }
    try {
        const notification = yield prismaClient_1.default.notification.create({
            data: {
                message,
                recipients,
            },
        });
        return res.status(201).json({ success: true, notification });
    }
    catch (error) {
        console.error("Error creating notification:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.get('/get-all-notification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield prismaClient_1.default.notification.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json({ success: true, notification });
    }
    catch (error) {
        console.error("Error creating notification:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
const generateCustomId = (userType) => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const suffix = userType === "retailer" ? "RE" : userType === "seller" ? "SU" : null;
    if (!suffix) {
        throw new Error("Invalid userType for customId generation");
    }
    return `${suffix}-${randomNumber}`;
};
const generateAdminId = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
    return `ADM-${randomNumber}`;
};
app.post('/onboard-user-by-admin', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userType, businessName, businessOwner, phone, gstNumber, shopMarka, transport, pincode, city, state, adminId } = req.body;
    const customId = generateCustomId(userType);
    const generatedAdminId = adminId || generateAdminId();
    // Handle file upload
    let filePath = '';
    if (req.file) {
        filePath = yield uploadImage(req.file);
    }
    try {
        let registerUser;
        if (userType === 'seller') {
            const qrCodeSupplierUrl = `${baseUrl}?id=${customId}`;
            const qrCodeSupplier = yield qrcode_1.default.toDataURL(qrCodeSupplierUrl);
            const qrCodeSupplierSelfUrl = `${baseUrl}?type=supplier&id=${customId}&timestamp=${Date.now()}`;
            const qrCodeSelfSupplier = yield qrcode_1.default.toDataURL(qrCodeSupplierSelfUrl);
            registerUser = yield prismaClient_1.default.seller.create({
                data: {
                    customId,
                    businessName,
                    businessOwner,
                    phone,
                    gstNumber,
                    shopMarka,
                    transport,
                    pincode,
                    city,
                    state,
                    filePath,
                    qrCode: qrCodeSupplier,
                    qrCodeSelf: qrCodeSelfSupplier,
                    adminId: generatedAdminId,
                }
            });
            registerUser = yield prismaClient_1.default.seller.findMany({
                orderBy: { createdAt: 'desc' }
            });
        }
        else if (userType === 'retailer') {
            const qrCodeUrl = `${baseUrl}?type=retailer&id=${customId}&supplierId=${generatedAdminId}`;
            const qrCode = yield qrcode_1.default.toDataURL(qrCodeUrl);
            registerUser = yield prismaClient_1.default.retailer.create({
                data: {
                    customId,
                    businessName,
                    businessOwner,
                    phone,
                    gstNumber,
                    shopMarka,
                    transport,
                    pincode,
                    city,
                    state,
                    filePath,
                    qrCode: qrCode,
                    adminId: generatedAdminId,
                }
            });
        }
        else {
            return res.status(400).json({ success: false, message: "Invalid user type" });
        }
        console.log("registerUser", registerUser);
        return res.status(201).json({
            success: true,
            message: "User onboarded successfully.",
            data: registerUser,
        });
    }
    catch (error) {
        console.error("Error onboarding user:", error);
        return res.status(500).json({ success: false, message: "Error onboarding user", error: error.message });
        // return res.status(500).json({ success: false, message: "Error onboarding user", error });
    }
}));
app.post("/api/guests/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, sellerId } = req.body;
    // Validate phone input
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
        return res.status(400).json({ success: false, message: "Invalid phone number." });
    }
    try {
        // Check if the phone number already exists
        const existingGuest = yield prismaClient_1.default.guest.findUnique({
            where: { phone, sellerId },
        });
        if (existingGuest) {
            return res.status(409).json({
                success: false,
                message: "Phone number already registered.",
            });
        }
        // Generate customId with prefix "GUEST" followed by a random number
        const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
        const customId = `GUEST${randomNumber}`;
        // Create a new Guest record
        const newGuest = yield prismaClient_1.default.guest.create({
            data: {
                phone,
                customId,
                sellerId
            },
        });
        // { message: 'Retailer added successfully', data: newGuest }
        return res.status(201).json({
            success: true,
            message: "Guest created successfully.",
            data: newGuest,
        });
    }
    catch (error) {
        console.error("Error creating guest:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the guest.",
        });
    }
}));
app.get('/api/retailer/scan/:qrCode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { qrCode } = req.params;
        console.log('Received QR Code:', qrCode);
        // Find retailer by QR code
        const retailer = yield prismaClient_1.default.retailer.findUnique({
            where: { qrCode },
        });
        if (!retailer) {
            console.log('Retailer not found');
            return res.status(404).json({ message: 'Retailer not found' });
        }
        // const token = jwt.sign({ id: retailer.id }, JWT_SECRET, { expiresIn: '1d' });
        // res.cookie('token', token, { httpOnly: true });
        // Return retailer details without sensitive dat
        res.status(200).json({
            id: retailer.id,
            businessName: retailer.businessName,
            qrCode: retailer.qrCode,
            sellerId: retailer.sellerId,
            phone: retailer.phone,
            // token:token
        });
    }
    catch (error) {
        console.error('Error fetching retailer:', error.message);
        res.status(500).json({ error: error.message });
    }
}));
// app.post('/add-to-cart', createOrderProductDetails)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
