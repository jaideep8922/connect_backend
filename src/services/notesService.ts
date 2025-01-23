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
        const notesSaveObj:any = await prisma.notes.create({
            data: {
                retailerId: retailerId,
                sellerId: sellerId,
                notes,
            },
        });

        return { message: 'Notes added successfully', data: notesSaveObj };
    } catch (error) {
        console.error('Error adding Notes to the database:', error);
        throw new Error('Failed to add Notes. Please try again.');
    }
};

// export const getNotesList = async (notesObj: any) => {
//     try {
//         const { customId, userType } = notesObj;

//         let notesList = [];

//         if (userType === 'Retailer') {
//             notesList = await prisma.notes.findMany({
//                 where: { retailerId: customId },
//             });
//         } else if (userType === 'Supplier') {
//             notesList = await prisma.notes.findMany({
//                 where: { sellerId: customId },
//             });
//         } else {
//             throw new Error('Invalid userType. Must be either "Retailer" or "Supplier".');
//         }

//         return { message: 'Notes retrieved successfully', data: notesList };
//     } catch (error) {
//         console.error('Error retrieving Notes from the database:', error);
//         throw new Error('Failed to retrieve Notes. Please try again.');
//     }
// };

export const getNotesList = async (notesObj: any) => {
    try {
        const { customId } = notesObj;

        if (!customId) {
            throw new Error('customId is required.');
        }

        let notesList = [];
        const prefix = customId.split('-')[0].toUpperCase(); // Extract prefix before the hyphen

        if (prefix === 'RE') {
            // Retailer logic
            notesList = await prisma.notes.findMany({
                where: { retailerId: customId },
            });
        } else if (prefix === 'SU') {
            // Supplier logic
            notesList = await prisma.notes.findMany({
                where: { sellerId: customId },
            });
        } else {
            throw new Error('Invalid customId prefix. Must start with "RE" (Retailer) or "SE" (Supplier).');
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

        return { message: 'Notes deleted successfully', data: deletedNotesData };
    } catch (error) {
        console.error('Error retrieving Notes from the database:', error);
        throw new Error('Failed to retrieve Notes. Please try again.');
    }
};
