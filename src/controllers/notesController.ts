import { sendSuccess, sendError } from '../utils/responseHandle';
import { createNotes, getNotesList ,deleteNotesData } from '../services/notesService';
import { Request, Response } from 'express';

export const saveNotesData = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            retailerId,
            sellerId,
            notes,
        } = req.body;

        // Validate that either retailerId or sellerId is present
        // if (!retailerId && !sellerId) {
        //     return sendError(res, 'Either retailerId or sellerId must be provided.');
        // }

        // Add order logic
        const saveNotesData = await createNotes({
            retailerId,
            notes,
            sellerId,
        });

        // Success response
        sendSuccess(res, saveNotesData.data, saveNotesData.message);
    } catch (error) {
        console.error('Error Adding Notes:', error);
        sendError(res, 'An error occurred while adding the Notes.');
    }
};


export const getNotesData = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            id,
            userType,
        } = req.body;

        // Validate that either retailerId or sellerId is present
        // if (!id && !userType) {
        //     return sendError(res, 'id and userType must be provided.');
        // }


        // Add order logic
        const getNotesDataList = await getNotesList({
            id,
            userType,
        });

        // Success response
        sendSuccess(res, getNotesDataList.data, getNotesDataList.message);
    } catch (error) {
        console.error('Error Adding Notes:', error);
        sendError(res, 'An error occurred while adding the Notes.');
    }
};

export const deleteNotes = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            id,
        } = req.body;

        // Add order logic
        const deletedNote = await deleteNotesData({
            id,
        });

        // Success response
        sendSuccess(res, deletedNote.data, deletedNote.message);
    } catch (error) {
        console.error('Error Adding Notes:', error);
        sendError(res, 'An error occurred while adding the Notes.');
    }
};