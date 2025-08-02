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
exports.checkAuthandAuthorization = void 0;
const http_status_codes_1 = require("http-status-codes");
const error_helper_1 = require("../helper/error.helper");
const env_config_1 = require("../config/env.config");
const jwt_util_1 = require("../utils/jwt.util");
const checkAuthandAuthorization = (...roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const isValid = yield jwt_util_1.JWT.verifyToken(token, env_config_1.ENV.JWT_SECRET);
        if (!isValid) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Token is not Valid");
        }
        const decoded = isValid;
        if (!roles.includes(decoded.role)) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are Not Authorized for this route");
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuthandAuthorization = checkAuthandAuthorization;
