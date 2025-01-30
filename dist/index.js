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
const app = (0, express_1.default)();
const corsOptions = {
    origin: 'http://192.168.0.105:3000',
    credentials: true,
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
const upload = (0, multer_1.default)({
    dest: 'uploads/', // Or specify Cloudinary or any cloud storage
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size per image
    fileFilter: (req, file, cb) => {
        const extname = path_1.default.extname(file.originalname).toLowerCase();
        if (extname !== '.jpg' && extname !== '.jpeg' && extname !== '.png') {
            return cb(new Error('Only .jpg, .jpeg, and .png files are allowed.'));
        }
        cb(null, true);
    },
});
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
app.post("/api/guests/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, sellerId } = req.body;
    // Validate phone input
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
        return res.status(400).json({ success: false, message: "Invalid phone number." });
    }
    try {
        // Check if the phone number already exists
        const existingGuest = yield prismaClient_1.default.guest.findUnique({
            where: { phone },
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
            },
        });
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
        // Return retailer details without sensitive data
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
