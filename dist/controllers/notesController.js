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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotes = exports.getNotesData = exports.saveNotesData = void 0;
const responseHandle_1 = require("../utils/responseHandle");
const notesService_1 = require("../services/notesService");
const saveNotesData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { retailerId, sellerId, notes, } = req.body;
        // Add order logic
        const saveNotesData = yield (0, notesService_1.createNotes)({
            retailerId,
            notes,
            sellerId,
        });
        // Success response
        (0, responseHandle_1.sendSuccess)(res, saveNotesData.data, saveNotesData.message);
    }
    catch (error) {
        console.error('Error Adding Notes:', error);
        (0, responseHandle_1.sendError)(res, 'An error occurred while adding the Notes.');
    }
});
exports.saveNotesData = saveNotesData;
const getNotesData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customId } = req.body;
        // Validate that either retailerId or sellerId is present
        // if (!id && !userType) {
        //     return sendError(res, 'id and userType must be provided.');
        // }
        // Add order logic
        const getNotesDataList = yield (0, notesService_1.getNotesList)({
            customId
        });
        // Success response
        (0, responseHandle_1.sendSuccess)(res, getNotesDataList.data, getNotesDataList.message);
    }
    catch (error) {
        console.error('Error Adding Notes:', error);
        (0, responseHandle_1.sendError)(res, 'An error occurred while fetching the Notes.');
    }
});
exports.getNotesData = getNotesData;
const deleteNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, } = req.body;
        // Add order logic
        const deletedNote = yield (0, notesService_1.deleteNotesData)({
            id,
        });
        // Success response
        (0, responseHandle_1.sendSuccess)(res, deletedNote.data, deletedNote.message);
    }
    catch (error) {
        console.error('Error Adding Notes:', error);
        (0, responseHandle_1.sendError)(res, 'An error occurred while adding the Notes.');
    }
});
exports.deleteNotes = deleteNotes;
