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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const user_model_1 = require("../users/user/user.model");
const http_status_codes_1 = require("http-status-codes");
const isValidPass_util_1 = require("../../utils/isValidPass.util");
const agent_model_1 = require("../users/agent/agent.model");
const error_helper_1 = require("../../helper/error.helper");
const userToken_1 = require("../../utils/userToken");
const user_login_service = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email });
    if (!user) {
        throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_GATEWAY, "User not valid");
    }
    const isMatched = yield (0, isValidPass_util_1.matched)(payload.password, user);
    if (!isMatched) {
        throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_GATEWAY, "Passwort is not matched");
    }
    const userWithoutPassword = __rest(user.toObject(), []);
    const jwtPayload = Object.assign({}, userWithoutPassword);
    const tokens = yield (0, userToken_1.createUserTokens)(jwtPayload);
    if (!tokens.token) {
        throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Access Token is not Created Successfully");
    }
    if (!tokens.refreshToken) {
        throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Refresh Token is not Created Successfully");
    }
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: true,
        message: "login Successfully ",
        data: {
            accessToken: tokens.token,
            RefreshToken: tokens.refreshToken,
            data: userWithoutPassword,
        },
    };
});
const agent_login_service = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield agent_model_1.Agent.findOne({ email: payload.email });
    if (!user) {
        throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "User Not Valid");
    }
    const isMatched = yield (0, isValidPass_util_1.matched)(payload.password, user);
    console.log("Password ", isMatched);
    console.log("Password ", payload.password);
    if (!isMatched) {
        throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Password Not Matched");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
    const jwtPayload = Object.assign({}, userWithoutPassword);
    const tokens = yield (0, userToken_1.createAgentTokens)(jwtPayload);
    if (!tokens.token) {
        throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Access Token is not Created Successfully");
    }
    if (!tokens.refreshToken) {
        throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Refresh Token is not Created Successfully");
    }
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: true,
        message: "login Successfully ",
        data: {
            accessToken: tokens.token,
            RefreshToken: tokens.refreshToken,
            data: userWithoutPassword,
        },
    };
});
exports.authServices = {
    user_login_service,
    agent_login_service,
};
