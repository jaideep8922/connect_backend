import express from 'express';
import cors from 'cors';

import { createOrder, getOrderStatusHistory, getOrderHistoryByRetailerId, updateOrderStatus, getOrderHistoryBySellerId } from '../controllers/orderController';

const app = express();
app.use(cors());


app.post('/create-order', createOrder);
app.post('/get-order-status-history', getOrderStatusHistory);
app.post('/get-order-history-by-retailer-id', getOrderHistoryByRetailerId);
app.put('/update-order-status', updateOrderStatus);
app.post('/get-order-history-by-supplier-id', getOrderHistoryBySellerId);

export default app;