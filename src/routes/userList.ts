import express from 'express';
import cors from 'cors';

import { getRetailersBySellerId } from '../controllers/getUserList';

const app = express();

app.use(cors());
app.get('/retailer-list', getRetailersBySellerId);

export default app;