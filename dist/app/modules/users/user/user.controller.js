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
exports.controller = void 0;
const async_handler_1 = require("../../../middlewares/async.handler");
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../../middlewares/sendResponse");
const http_status_codes_1 = require("http-status-codes");
// Create New User
const createUser = (0, async_handler_1.asyncHandller)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body; // Receiving data from client
    const isCreated = yield user_service_1.services.createUser_service(payload); // passing data to createUser_service
    if (!isCreated) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: false,
            message: "User not Created",
            data: null,
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const addMoney = (0, async_handler_1.asyncHandller)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.user;
    if (!data) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.NON_AUTHORITATIVE_INFORMATION,
            status: false,
            message: "Login First to get Services",
            data: null,
        });
    }
    const { ammount } = req.body;
    const payload = {
        phone: data.phone,
    };
    const isCreated = yield user_service_1.services.addMoney_service(payload, ammount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const withrowMoney = (0, async_handler_1.asyncHandller)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.user;
    const { ammount } = req.body;
    const payload = {
        phone: data.phone,
    };
    const isCreated = yield user_service_1.services.withrow_service(payload, ammount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const SendMoney = (0, async_handler_1.asyncHandller)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, receiverphone, ammount } = req.body;
    if (phone !== req.user.phone) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.FORBIDDEN,
            status: false,
            message: "Sender Phone Number is Not Valid",
            data: null,
        });
    }
    const isCreated = yield user_service_1.services.sendMoney_service({ phone }, ammount, receiverphone);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const getTransactions = (0, async_handler_1.asyncHandller)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const isCreated = yield user_service_1.services.getTranasaction_service(user.email);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const getPersonalWallet = (0, async_handler_1.asyncHandller)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { wallet } = req.user;
    const isCreated = yield user_service_1.services.getPersonalWallet(wallet);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const getUserNewAccessToken = (0, async_handler_1.asyncHandller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const getNewAccessToken = yield user_service_1.services.getNewAccessToken(refreshToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: getNewAccessToken.statusCode,
        status: getNewAccessToken.status,
        message: getNewAccessToken.message,
        data: getNewAccessToken.data.newToken,
    });
}));
// for admin
const getAllUsersTransactions = (0, async_handler_1.asyncHandller)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isCreated = yield user_service_1.services.getALLUsersTranasaction_service();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const getUsers = (0, async_handler_1.asyncHandller)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query || {};
    const isCreated = yield user_service_1.services.getUser_service(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const getWallets = (0, async_handler_1.asyncHandller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isCreated = yield user_service_1.services.getWallets_service();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const approveAgent = (0, async_handler_1.asyncHandller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, activeStatus, approveStatus, varifiedStatus } = req.body;
    const isCreated = yield user_service_1.services.approve_Agent({
        phone,
        activeStatus,
        approveStatus,
        varifiedStatus,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const blockWallet = (0, async_handler_1.asyncHandller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { wallet, status } = req.body;
    const isCreated = yield user_service_1.services.block_Wallet({ wallet, status });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
exports.controller = {
    createUser,
    getUsers,
    addMoney,
    SendMoney,
    withrowMoney,
    getTransactions,
    getAllUsersTransactions,
    getWallets,
    approveAgent,
    blockWallet,
    getPersonalWallet,
    getUserNewAccessToken,
};
