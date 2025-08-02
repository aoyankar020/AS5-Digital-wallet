"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, info) => {
    res.status(info.statusCode).json({
        statusCode: info.statusCode,
        success: info.status,
        message: info.message,
        data: info.data,
        error: info.error,
        meta: info.meta,
    });
};
exports.sendResponse = sendResponse;
