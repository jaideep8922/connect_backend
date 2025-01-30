"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRegister_1 = require("../controllers/userRegister");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.post('/create', userRegister_1.onBoardUser);
app.post('/getUserById', userRegister_1.getUserById);
app.get('/hello', userRegister_1.hello);
exports.default = app;
