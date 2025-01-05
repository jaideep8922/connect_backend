import express from 'express';
import cors from 'cors';

import { onBoardUser, hello, getUserById } from '../controllers/userRegister';

const app = express();
app.use(cors());


app.post('/create', onBoardUser);
app.post('/getUserById', getUserById);
app.get('/hello', hello);

export default app;