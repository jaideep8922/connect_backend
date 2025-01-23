import express from 'express';
import cors from 'cors';

import { getRetailersBySellerId,adminRegister,adminLogin, adminUserLogin } from '../controllers/getUserList';

const app = express();

app.use(cors());
app.get('/retailer-list', getRetailersBySellerId);
app.post('/add-admin', adminRegister);
app.post('/admin-login', adminLogin);
app.post('/user-onboard', adminUserLogin)

export default app;