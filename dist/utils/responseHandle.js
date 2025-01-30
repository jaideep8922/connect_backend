"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        data,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, error = '', statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error: error instanceof Error ? error.message : error,
    });
};
exports.sendError = sendError;
