import prisma from '../prisma/prismaClient';

export const createNotes = async (notesDetails: any) => {
    try {
        const {
            retailerId,
            notes,
            sellerId,
        } = notesDetails;

        // Validate input: Ensure either retailerId or sellerId is provided along with notes
        if (!notes || (!retailerId && !sellerId)) {
            throw new Error('Either retailerId or sellerId must be provided along with notes.');
        }

        // Save the notes with the appropriate combination
        const notesSaveObj = await prisma.notes.create({
            data: {
                retailerId: retailerId || null,
                sellerId: sellerId || null,
                notes,
            },
        });

        return { message: 'Notes added successfully', data: notesSaveObj };
    } catch (error) {
        console.error('Error adding Notes to the database:', error);
        throw new Error('Failed to add Notes. Please try again.');
    }
};

export const getNotesList = async (notesObj: any) => {
    try {
        const { id, userType } = notesObj;

        let notesList = [];

        if (userType === 'Retailer') {
            notesList = await prisma.notes.findMany({
                where: { retailerId: id },
            });
        } else if (userType === 'Supplier') {
            notesList = await prisma.notes.findMany({
                where: { sellerId: id },
            });
        } else {
            throw new Error('Invalid userType. Must be either "Retailer" or "Supplier".');
        }

        return { message: 'Notes retrieved successfully', data: notesList };
    } catch (error) {
        console.error('Error retrieving Notes from the database:', error);
        throw new Error('Failed to retrieve Notes. Please try again.');
    }
};

export const deleteNotesData = async (notesObj: any) => {
    try {
        const { id } = notesObj;

        const deletedNotesData = await prisma.notes.delete({
            where: { id }
        });

        return { message: 'Notes retrieved successfully', data: deletedNotesData };
    } catch (error) {
        console.error('Error retrieving Notes from the database:', error);
        throw new Error('Failed to retrieve Notes. Please try again.');
    }
};

