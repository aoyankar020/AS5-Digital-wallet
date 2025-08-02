"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandller = void 0;
const asyncHandller = (fun) => (req, res, next) => {
    Promise.resolve(fun(req, res, next)).catch((error) => {
        next(error);
    });
};
exports.asyncHandller = asyncHandller;
