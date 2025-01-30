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
exports.addStatus = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Function to add a new status
const addStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statuses = [
            { id: 1, status: 1 },
            { id: 2, status: 2 },
            { id: 3, status: 3 },
            { id: 4, status: 4 },
        ];
        // Using upsert to create or update statuses
        const createdStatuses = yield Promise.all(statuses.map(({ id, status }) => prisma.status.upsert({
            where: { id },
            update: {},
            create: { id, status }
        })));
        res.json({
            message: 'Statuses added or updated successfully',
            statuses: createdStatuses
        });
    }
    catch (error) {
        console.error('Error adding or updating statuses:', error);
        res.status(500).json({ error: 'An error occurred while adding or updating statuses' });
    }
});
exports.addStatus = addStatus;
