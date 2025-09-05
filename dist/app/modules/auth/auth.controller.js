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
exports.authController = void 0;
const async_handler_1 = require("../../middlewares/async.handler");
const auth_service_1 = require("./auth.service");
const sendResponse_1 = require("../../middlewares/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const userLogin = (0, async_handler_1.asyncHandller)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const credentials = req.body;
    const islogin = yield auth_service_1.authServices.user_login_service(credentials);
    console.log("Login Controller :", islogin);
    res.cookie("refreshToken", islogin.data.RefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.cookie("accessToken", islogin.data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: islogin.statusCode,
        status: islogin.status,
        message: islogin.message,
        data: islogin.data,
    });
}));
const logout = (0, async_handler_1.asyncHandller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: true,
        message: "User Logged Out Successfully",
        data: null,
    });
}));
const agentLogin = (0, async_handler_1.asyncHandller)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const credentials = req.body;
    const islogin = yield auth_service_1.authServices.agent_login_service(credentials);
    res.cookie("refreshToken", islogin.data.RefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.cookie("accessToken", islogin.data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: islogin.statusCode,
        status: islogin.status,
        message: islogin.message,
        data: islogin.data,
    });
}));
exports.authController = {
    agentLogin,
    userLogin,
    logout,
};
