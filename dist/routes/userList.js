"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const getUserList_1 = require("../controllers/getUserList");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get('/retailer-list', getUserList_1.getRetailersBySellerId);
app.put('/update-retailer-list', getUserList_1.updateRetailerDroppedStatus);
app.post('/add-admin', getUserList_1.adminRegister);
app.post('/admin-login', getUserList_1.adminLogin);
app.post('/user-onboard', getUserList_1.adminUserLogin);
exports.default = app;
