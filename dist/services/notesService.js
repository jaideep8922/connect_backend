"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotesData = exports.getNotesList = exports.createNotes = void 0;
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const createNotes = (notesDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { retailerId, notes, sellerId, } = notesDetails;
        // Validate input: Ensure either retailerId or sellerId is provided along with notes
        if (!notes || (!retailerId && !sellerId)) {
            throw new Error('Either retailerId or sellerId must be provided along with notes.');
        }
        // Save the notes with the appropriate combination
        const notesSaveObj = yield prismaClient_1.default.notes.create({
            data: {
                retailerId: retailerId,
                sellerId: sellerId,
                notes,
            },
        });
        return { message: 'Notes added successfully', data: notesSaveObj };
    }
    catch (error) {
        console.error('Error adding Notes to the database:', error);
        throw new Error('Failed to add Notes. Please try again.');
    }
});
exports.createNotes = createNotes;
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
const getNotesList = (notesObj) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customId } = notesObj;
        if (!customId) {
            throw new Error('customId is required.');
        }
        let notesList = [];
        const prefix = customId.split('-')[0].toUpperCase(); // Extract prefix before the hyphen
        if (prefix === 'RE') {
            // Retailer logic
            notesList = yield prismaClient_1.default.notes.findMany({
                where: { retailerId: customId },
            });
        }
        else if (prefix === 'SU') {
            // Supplier logic
            notesList = yield prismaClient_1.default.notes.findMany({
                where: { sellerId: customId },
            });
        }
        else {
            throw new Error('Invalid customId prefix. Must start with "RE" (Retailer) or "SE" (Supplier).');
        }
        return { message: 'Notes retrieved successfully', data: notesList };
    }
    catch (error) {
        console.error('Error retrieving Notes from the database:', error);
        throw new Error('Failed to retrieve Notes. Please try again.');
    }
});
exports.getNotesList = getNotesList;
const deleteNotesData = (notesObj) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = notesObj;
        const deletedNotesData = yield prismaClient_1.default.notes.delete({
            where: { id }
        });
        return { message: 'Notes deleted successfully', data: deletedNotesData };
    }
    catch (error) {
        console.error('Error retrieving Notes from the database:', error);
        throw new Error('Failed to retrieve Notes. Please try again.');
    }
});
exports.deleteNotesData = deleteNotesData;
