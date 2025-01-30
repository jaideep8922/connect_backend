"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const adminController_1 = require("../controllers/adminController");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.post('/get-all-users', adminController_1.getAllUsers);
app.get('/get-dashboard-counts', adminController_1.getDashboardCounts);
app.post('/get-all-product-list', adminController_1.getAllProductList);
exports.default = app;
