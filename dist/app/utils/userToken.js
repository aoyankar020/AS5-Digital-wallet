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
exports.createAgentTokens = exports.createUserTokens = void 0;
const http_status_codes_1 = require("http-status-codes");
const env_config_1 = require("../config/env.config");
const jwt_util_1 = require("./jwt.util");
const error_helper_1 = require("../helper/error.helper");
const createUserTokens = (jwtPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield jwt_util_1.JWT.generateToken(jwtPayload, env_config_1.ENV.JWT_SECRET, env_config_1.ENV.JWT_EXPIRE);
    const refreshToken = yield jwt_util_1.JWT.generateToken(jwtPayload, env_config_1.ENV.JWT_REFRESH_SECRET, env_config_1.ENV.JWT_REFRESH_EXPIRE);
    if (!token) {
        throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Access Token is not Created Successfully");
    }
    if (!refreshToken) {
        throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Refresh Token is not Created Successfully");
    }
    return {
        token,
        refreshToken,
    };
});
exports.createUserTokens = createUserTokens;
const createAgentTokens = (jwtPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield jwt_util_1.JWT.generateToken(jwtPayload, env_config_1.ENV.JWT_SECRET, env_config_1.ENV.JWT_EXPIRE);
    const refreshToken = yield jwt_util_1.JWT.generateToken(jwtPayload, env_config_1.ENV.JWT_REFRESH_SECRET, env_config_1.ENV.JWT_REFRESH_EXPIRE);
    if (!token) {
        throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Access Token is not Created Successfully");
    }
    if (!refreshToken) {
        throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Refresh Token is not Created Successfully");
    }
    return {
        token,
        refreshToken,
    };
});
exports.createAgentTokens = createAgentTokens;
