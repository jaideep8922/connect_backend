import express from 'express';
import cors from 'cors';

import { getRetailersBySellerId,adminRegister,adminLogin } from '../controllers/getUserList';

const app = express();

app.use(cors());
app.post('/retailer-list', getRetailersBySellerId);
app.post('/add-admin', adminRegister);
app.post('/admin-login', adminLogin);

export default app;