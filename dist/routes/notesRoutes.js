"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notesController_1 = require("../controllers/notesController");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.post('/save-notes', notesController_1.saveNotesData);
app.post('/get-notes-list', notesController_1.getNotesData);
app.post('/delete-notes', notesController_1.deleteNotes);
exports.default = app;
