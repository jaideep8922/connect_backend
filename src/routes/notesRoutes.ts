import express from 'express';
import cors from 'cors';

import { deleteNotes, getNotesData, saveNotesData } from '../controllers/notesController';

const app = express();
app.use(cors());


app.post('/save-notes', saveNotesData);
app.post('/get-notes-list', getNotesData);
app.post('/delete-notes', deleteNotes);


export default app;