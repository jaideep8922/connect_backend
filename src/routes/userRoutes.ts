import express from 'express';
import cors from 'cors';

import { getAllUsers, createUser } from '../controllers/userRegister';

// middleware
const app = express();
app.use(cors());


app.get('/getAll', getAllUsers);
app.post('/create', createUser);

export default app;