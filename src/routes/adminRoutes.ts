import express from 'express';
import cors from 'cors';

import { getAllUsers, getDashboardCounts ,getAllProductList} from '../controllers/adminController';

const app = express();
app.use(cors());

app.post('/get-all-users', getAllUsers);
app.get('/get-dashboard-counts',getDashboardCounts);
app.post('/get-all-product-list',getAllProductList);


export default app;