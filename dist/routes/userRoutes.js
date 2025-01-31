"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRegister_1 = require("../controllers/userRegister");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const upload = (0, multer_1.default)({
    dest: 'file/', // Temporary folder before upload
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size
    fileFilter: (req, file, cb) => {
        const extname = path_1.default.extname(file.originalname).toLowerCase();
        if (extname !== '.jpg' && extname !== '.jpeg' && extname !== '.png' && extname !== '.mp4') {
            return cb(new Error('Only .jpg, .jpeg, .png, and .mp4 files are allowed.'));
        }
        cb(null, true);
    },
});
// app.post('/create', onBoardUser);
app.post('/create', upload.single('file'), userRegister_1.onBoardUser);
app.post('/getUserById', userRegister_1.getUserById);
app.get('/hello', userRegister_1.hello);
exports.default = app;
