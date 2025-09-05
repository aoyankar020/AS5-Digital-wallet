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
exports.agent_controller = void 0;
const async_handler_1 = require("../../../middlewares/async.handler");
const sendResponse_1 = require("../../../middlewares/sendResponse");
const agent_service_1 = require("./agent.service");
// Create New User
const createUser = (0, async_handler_1.asyncHandller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body; // Receiving data from client
    const isCreated = yield agent_service_1.agent_services.createAGENT_service(payload); // passing data to createUser_service
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
// Cash In
const cashIn = (0, async_handler_1.asyncHandller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, receiver, ammount } = req.body; // Receiving data from client
    console.log("Agent Number", phone);
    console.log("Receiver Number", receiver);
    const isCreated = yield agent_service_1.agent_services.cashIn_service({ phone }, receiver, ammount); // passing data to createUser_service
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
// Cash Out
const cashOut = (0, async_handler_1.asyncHandller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, sender, ammount } = req.body; // Receiving data from client
    const isCreated = yield agent_service_1.agent_services.cashOut_service({ phone }, sender, ammount); // passing data to createUser_service
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const getUsers = (0, async_handler_1.asyncHandller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isCreated = yield agent_service_1.agent_services.getUser_service();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const getPersonalWallet = (0, async_handler_1.asyncHandller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { wallet } = req.user;
    const isCreated = yield agent_service_1.agent_services.getPersonalWallet(wallet);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const getPersonalTransaction = (0, async_handler_1.asyncHandller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query || {};
    const user = req.user;
    const isCreated = yield agent_service_1.agent_services.getTranasaction_service(user.email, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
        meta: isCreated.meta,
    });
}));
const getAgentNewAccessToken = (0, async_handler_1.asyncHandller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const getNewAccessToken = yield agent_service_1.agent_services.getNewAgentAccessToken(refreshToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: getNewAccessToken.statusCode,
        status: getNewAccessToken.status,
        message: getNewAccessToken.message,
        data: getNewAccessToken.data.newToken,
    });
}));
const getMe = (0, async_handler_1.asyncHandller)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    console.log("decoded token", decodedToken._id);
    const isCreated = yield agent_service_1.agent_services.getMe(decodedToken._id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
const saveProfile = (0, async_handler_1.asyncHandller)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    console.log("Save Data Called");
    // Get update payload from request body
    const payload = req.body;
    const isCreated = yield agent_service_1.agent_services.updateProfile(decodedToken._id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: isCreated.statusCode,
        status: isCreated.status,
        message: isCreated.message,
        data: isCreated.data,
    });
}));
exports.agent_controller = {
    createUser,
    cashIn,
    cashOut,
    getUsers,
    getPersonalWallet,
    getPersonalTransaction,
    getAgentNewAccessToken,
    getMe,
    saveProfile,
};
