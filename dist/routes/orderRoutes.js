"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const orderController_1 = require("../controllers/orderController");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.post('/create-order', orderController_1.createOrder);
app.post('/get-order-status-history', orderController_1.getOrderStatusHistory);
app.post('/get-order-history-by-retailer-id', orderController_1.getOrderHistoryByRetailerId);
app.put('/update-order-status', orderController_1.updateOrderStatus);
app.post('/get-order-history-by-supplier-id', orderController_1.getOrderHistoryBySellerId);
exports.default = app;
