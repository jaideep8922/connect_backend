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
exports.getAllStatus = void 0;
const responseHandle_1 = require("../utils/responseHandle");
const configService_1 = require("../services/configService");
const getAllStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = yield (0, configService_1.getStatusList)();
        (0, responseHandle_1.sendSuccess)(res, status, 'Status Fetch Successfully');
    }
    catch (error) {
        console.error('Error fetching Status:', error);
        (0, responseHandle_1.sendError)(res, 'error');
    }
});
exports.getAllStatus = getAllStatus;
