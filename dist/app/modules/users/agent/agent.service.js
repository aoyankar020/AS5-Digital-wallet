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
exports.agent_services = void 0;
const http_status_codes_1 = require("http-status-codes");
const wallet_service_1 = require("../../wallet/wallet.service");
const error_helper_1 = require("../../../helper/error.helper");
const wallet_model_1 = require("../../wallet/wallet.model");
const agent_model_1 = require("./agent.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const tran_model_1 = require("../../transaction/tran.model");
const tran_interface_1 = require("../../transaction/tran.interface");
const wallet_interface_1 = require("../../wallet/wallet.interface");
const jwt_util_1 = require("../../../utils/jwt.util");
const env_config_1 = require("../../../config/env.config");
// Create User and Wallet
const createAGENT_service = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield agent_model_1.Agent.startSession();
    session.startTransaction();
    try {
        const isExistemail = yield agent_model_1.Agent.findOne({ email: payload.email }).session(session);
        const isExistPhone = yield agent_model_1.Agent.findOne({ phone: payload.phone }).session(session);
        if (isExistPhone || isExistemail) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, `You have Already Regestered ! with this  Email : ${payload.email} or Phone: ${payload.phone}`);
        }
        const auth = {
            provide: "credential",
            providerID: payload.email,
            lastLogin: new Date(),
        };
        const agent = yield agent_model_1.Agent.create([Object.assign({ auth }, payload)], { session });
        if (!agent) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Agent not Created");
        }
        const Wallet = yield wallet_service_1.walletService.createDefaultWallet(agent[0]._id, session);
        yield agent_model_1.Agent.findByIdAndUpdate({ _id: agent[0]._id }, {
            wallet: Wallet[0]._id,
        }, { new: true, runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            status: true,
            message: "Agent Created Successfully",
            data: { agent },
        };
    }
    catch (error) {
        if (session.inTransaction()) {
            yield session.abortTransaction();
        }
        session.endSession();
        throw error;
    }
});
// // CASH IN
const cashIn_service = (payload, receiver, ammount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield wallet_model_1.Wallet.startSession();
    session.startTransaction();
    try {
        // Try to find user by  email
        const agent = yield agent_model_1.Agent.findOne({ phone: payload.phone }).session(session);
        const recever = yield user_model_1.User.findOne({ phone: receiver }).session(session);
        if (!agent) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Agent Phone Number is not valid");
        }
        if (!recever) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Receiver Phone Number is not valid");
        }
        const agentwalletInfo = yield wallet_model_1.Wallet.findById(agent.wallet)
            .select("balance ")
            .session(session);
        const receverWalletInfo = yield wallet_model_1.Wallet.findById(recever.wallet)
            .select("balance ")
            .session(session);
        if (!agentwalletInfo) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Agent Wallet is found");
        }
        if (!receverWalletInfo) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Receiver Wallet is found");
        }
        if (agentwalletInfo.status === wallet_interface_1.WSTATUS.BLOCKED) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Agent Wallet Is Blocked To Transaction");
        }
        if (receverWalletInfo.status === wallet_interface_1.WSTATUS.BLOCKED) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Receiver Wallet Is Blocked To Transaction");
        }
        if ((agent === null || agent === void 0 ? void 0 : agent.isActive) === user_interface_1.EISACTIVE.BLOCKED) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Receiver Account Is Blocked To Transaction");
        }
        if ((recever === null || recever === void 0 ? void 0 : recever.isActive) === user_interface_1.EISACTIVE.BLOCKED) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Receiver Account Is Blocked To Transaction");
        }
        if (ammount <= 0) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Your Transactional Ammount Can't be empty or Negetive Value");
        }
        if (agentwalletInfo.balance < ammount) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Not Sufficient Money To Transfer");
        }
        agentwalletInfo.balance = agentwalletInfo.balance - ammount; // ✅ Add the amount correctly
        receverWalletInfo.balance = receverWalletInfo.balance + ammount; // ✅ Add the amount correctly
        const transaction = yield tran_model_1.Transaction.create([
            {
                amount: ammount,
                initiatedBy: agent._id,
                receiverWallet: receverWalletInfo._id, // user
                senderWallet: agentwalletInfo._id, //  agent
                status: tran_interface_1.TRANSACTION_STATUS.SUCCESS,
                type: tran_interface_1.TRANSACTION_TYPE.CASH_IN,
            },
        ], { session });
        // Populate the `initiatedBy` field (adjust fields as necessary)
        const populatedTransaction = yield tran_model_1.Transaction.findById(transaction[0]._id)
            .select("amount type status initiatedBy")
            .populate("initiatedBy", "name -_id")
            .session(session);
        yield agentwalletInfo.save({ session }); // ✅ Save to persist change
        yield receverWalletInfo.save({ session }); // ✅ Save to persist change
        yield session.commitTransaction();
        session.endSession();
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            status: true,
            message: `Credited ${ammount}Tk in acoount ${receiver} is Successfull `,
            data: populatedTransaction,
        };
    }
    catch (error) {
        if (session.inTransaction()) {
            yield session.abortTransaction();
        }
        session.endSession();
        throw error;
    }
});
// CASH OUT
const cashOut_service = (payload, sender, ammount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield agent_model_1.Agent.startSession();
    session.startTransaction();
    try {
        // Try to find user by  email
        const agent = yield agent_model_1.Agent.findOne({ phone: payload.phone }).session(session);
        const Sender = yield user_model_1.User.findOne({ phone: sender }).session(session);
        if (!agent) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Agent Phone Number is not valid");
        }
        if (!Sender) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "sender Phone Number is not valid");
        }
        const agentwalletInfo = yield wallet_model_1.Wallet.findById(agent.wallet)
            .select("balance _id")
            .session(session);
        const senderWalletInfo = yield wallet_model_1.Wallet.findById(Sender.wallet)
            .select("balance _id")
            .session(session);
        if (!agentwalletInfo) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Agent Wallet is found");
        }
        if (!senderWalletInfo) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Receiver Wallet is found");
        }
        if (agentwalletInfo.status === wallet_interface_1.WSTATUS.BLOCKED) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Agent Wallet Is Blocked To Transaction");
        }
        if (senderWalletInfo.status === wallet_interface_1.WSTATUS.BLOCKED) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Sender Wallet Is Blocked To Transaction");
        }
        if ((agent === null || agent === void 0 ? void 0 : agent.isActive) === user_interface_1.EISACTIVE.BLOCKED) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Agent Account Is Blocked To Transaction");
        }
        if ((Sender === null || Sender === void 0 ? void 0 : Sender.isActive) === user_interface_1.EISACTIVE.BLOCKED) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Receiver Account Is Blocked To Transaction");
        }
        if (ammount <= 0) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Your Transactional Ammount Can't be empty or Negetive Value");
        }
        if (senderWalletInfo.balance < ammount) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Sender Have not Sufficient Money to Cash out");
        }
        agentwalletInfo.balance = agentwalletInfo.balance + ammount; // ✅ Add the amount correctly
        senderWalletInfo.balance = senderWalletInfo.balance - ammount; // ✅ Add the amount correctly
        const transaction = yield tran_model_1.Transaction.create([
            {
                amount: ammount,
                initiatedBy: agent._id,
                receiverWallet: agentwalletInfo._id, // user
                senderWallet: senderWalletInfo._id, //  agent
                status: tran_interface_1.TRANSACTION_STATUS.SUCCESS,
                type: tran_interface_1.TRANSACTION_TYPE.CASH_OUT,
            },
        ], { session });
        // Populate the `initiatedBy` field (adjust fields as necessary)
        const populatedTransaction = yield tran_model_1.Transaction.findById(transaction[0]._id)
            .session(session)
            .select("amount type status initiatedBy")
            .populate("initiatedBy", "name -_id");
        yield agentwalletInfo.save({ session }); // ✅ Save to persist change
        yield senderWalletInfo.save({ session }); // ✅ Save to persist change
        yield session.commitTransaction();
        session.endSession();
        return {
            statusCode: http_status_codes_1.StatusCodes.OK,
            status: true,
            message: `Debited ${ammount}Tk in acoount ${sender} is Successfull `,
            data: populatedTransaction,
        };
    }
    catch (error) {
        if (session.inTransaction()) {
            yield session.abortTransaction();
        }
        session.endSession();
        throw error;
    }
});
// Gell all Users
const getUser_service = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield agent_model_1.Agent.find({});
    if (!users) {
        return {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: false,
            message: `No Users Found`,
            data: null,
        };
    }
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: true,
        message: `Users Fetched Successfully`,
        data: users,
    };
});
// Gell User Personal Wallet
const getPersonalWallet = (walletID) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findById(walletID);
    if (!wallet) {
        return {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: false,
            message: `No Wallet is  Found`,
            data: null,
        };
    }
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: true,
        message: `Successfully Fetched Your Wallet`,
        data: wallet,
    };
});
// Get Agent Personal Transaction
const getTranasaction_service = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield agent_model_1.Agent.findOne({ email });
    if (!user) {
        return {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: false,
            message: `No Users Found`,
            data: null,
        };
    }
    const transactions = yield tran_model_1.Transaction.find({ initiatedBy: user._id });
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: true,
        message: `Your Transaction History`,
        data: transactions,
    };
});
const getNewAgentAccessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isVarifiedToken = (0, jwt_util_1.verifyToken)(token, env_config_1.ENV.JWT_REFRESH_SECRET);
        const user = yield agent_model_1.Agent.find({
            email: isVarifiedToken === null || isVarifiedToken === void 0 ? void 0 : isVarifiedToken.email,
        });
        if (!user) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Valid User");
        }
        if (!isVarifiedToken) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Varid Refresh token");
        }
        const newToken = (0, jwt_util_1.generateToken)({ user }, env_config_1.ENV.JWT_SECRET, env_config_1.ENV.JWT_EXPIRE);
        // Populate the `initiatedBy` field (adjust fields as necessary)
        return {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            status: true,
            message: "New Token Created",
            data: { newToken },
        };
    }
    catch (error) {
        throw error;
    }
});
exports.agent_services = {
    getPersonalWallet,
    createAGENT_service,
    cashIn_service,
    cashOut_service,
    getUser_service,
    getTranasaction_service,
    getNewAgentAccessToken,
};
