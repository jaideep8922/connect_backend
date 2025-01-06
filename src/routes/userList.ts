import express from 'express';
import cors from 'cors';

import { onBoardUser, hello, getUserById } from '../controllers/userRegister';
import { getRetailersBySellerId } from '../controllers/getUserList';

const app = express();
app.use(cors());


app.get('/retailer-list', getRetailersBySellerId);

export default app;