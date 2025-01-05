import express from 'express';
import cors from 'cors';

import { addProduct, getProductBySellerId, updateProductData, serachProductByLowestPrice } from '../controllers/productController';

const app = express();
app.use(cors());


app.post('/add-product', addProduct);
app.post('/get-product-list', getProductBySellerId);
app.put('/update-product', updateProductData);
app.post('/search-product', serachProductByLowestPrice);

export default app;