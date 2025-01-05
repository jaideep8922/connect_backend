import express from 'express';
import cors from 'cors';

import { addReviewAndRating, getReviewList } from '../controllers/reviewAndRatingController';

const app = express();
app.use(cors());


app.post('/add-review', addReviewAndRating);
app.post('/get-review', getReviewList);


export default app;