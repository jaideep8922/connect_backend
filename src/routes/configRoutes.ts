import express from 'express';
import cors from 'cors';

import { getAllStatus } from '../controllers/configController';

const app = express();
app.use(cors());

app.get('/get-status-list', getAllStatus);


export default app;