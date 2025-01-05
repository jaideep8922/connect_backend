import express from 'express';
import userRoutes from './routes/userRoutes';
import configRoutes from './routes/configRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import notesRoutes from './routes/notesRoutes';
import reviewRoutes from './routes/reviewRoutes';

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/config', configRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.use('/notes', notesRoutes);
app.use('/review', reviewRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
