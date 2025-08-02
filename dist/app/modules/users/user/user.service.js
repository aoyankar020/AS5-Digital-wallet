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
exports.services = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const wallet_service_1 = require("../../wallet/wallet.service");
const error_helper_1 = require("../../../helper/error.helper");
const wallet_model_1 = require("../../wallet/wallet.model");
const user_availableCheck_1 = require("../../../utils/user.availableCheck");
const tran_model_1 = require("../../transaction/tran.model");
const tran_interface_1 = require("../../transaction/tran.interface");
const agent_model_1 = require("../agent/agent.model");
const wallet_interface_1 = require("../../wallet/wallet.interface");
const search_constant_1 = require("./search.constant");
const global_constant_1 = require("../../../global.constant");
const jwt_util_1 = require("../../../utils/jwt.util");
const env_config_1 = require("../../../config/env.config");
// Create User and Wallet
const createUser_service = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Start Session on User Module
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const isExistemail = yield user_model_1.User.findOne({ email: payload.email }).session(session);
        const isExistPhone = yield user_model_1.User.findOne({ phone: payload.phone }).session(session);
        if (isExistPhone || isExistemail) {
            return {
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: false,
                message: `You have Already Regestered ! with this  Email : ${payload.email} or Phone: ${payload.phone}`,
                data: null,
            };
        }
        const auth = {
            provide: "credential",
            providerID: payload.email,
            lastLogin: new Date(),
        };
        const user = yield user_model_1.User.create([Object.assign({ auth }, payload)], { session });
        if (!user) {
            return {
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                status: false,
                message: "User not Created ",
                data: null,
            };
        }
        const Wallet = yield wallet_service_1.walletService.createDefaultWallet(user[0]._id, session);
        if (!Wallet) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_GATEWAY, "Wallet not Created");
        }
        yield user_model_1.User.findByIdAndUpdate({ _id: user[0]._id }, {
            wallet: Wallet[0]._id,
        }, { new: true, runValidators: true, session });
        yield session.commitTransaction(); // session transaction
        session.endSession();
        return {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            status: true,
            message: "User Created Successfully",
            data: { user },
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
// Add Money
const addMoney_service = (payload, ammount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield wallet_model_1.Wallet.startSession();
    session.startTransaction();
    try {
        // Try to find user by  email
        const user = yield user_model_1.User.findOne({ phone: payload.phone }).session(session);
        if (!user) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is not Valid to add money");
        }
        const walletInfo = yield wallet_model_1.Wallet.findById(user.wallet).session(session);
        if (!walletInfo) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Wallet is not Valid to add money");
        }
        if (walletInfo.status === wallet_interface_1.WSTATUS.BLOCKED) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Wallet is Blocked To Transfer");
        }
        if (ammount <= 0) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, "Your Transaction Ammount Can't be empty or Negetive Value");
        }
        walletInfo.balance = walletInfo.balance + ammount; // ✅ Add the amount correctly
        const transaction = yield tran_model_1.Transaction.create([
            {
                amount: ammount,
                initiatedBy: user._id,
                receiverWallet: walletInfo._id,
                senderWallet: walletInfo._id,
                status: tran_interface_1.TRANSACTION_STATUS.SUCCESS,
                type: tran_interface_1.TRANSACTION_TYPE.ADD_MONEY,
            },
        ], { session });
        // Populate the `initiatedBy` field (adjust fields as necessary)
        const populatedTransaction = yield tran_model_1.Transaction.findById(transaction[0]._id)
            .session(session)
            .select("amount type status initiatedBy")
            .populate("initiatedBy", "name -_id");
        yield walletInfo.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            status: true,
            message: "Added Money Successfully",
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
const getNewAccessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isVarifiedToken = (0, jwt_util_1.verifyToken)(token, env_config_1.ENV.JWT_REFRESH_SECRET);
        const user = yield user_model_1.User.find({
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
// Withdraw Money
const withrow_service = (payload, withdraw_ammount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield wallet_model_1.Wallet.startSession();
    session.startTransaction();
    try {
        // Try to find user by  email
        const user = yield user_model_1.User.findOne({ phone: payload.phone }).session(session);
        if (!user) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is not Valid to add money");
        }
        const walletInfo = yield wallet_model_1.Wallet.findById(user.wallet).session(session);
        if (!walletInfo) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Wallet is not Valid to add money");
        }
        if (walletInfo.status === wallet_interface_1.WSTATUS.BLOCKED) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Wallet is Blocked To Transfer");
        }
        if (walletInfo.balance < withdraw_ammount) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Sufficient Fund is Available");
        }
        if (withdraw_ammount <= 0) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Your Transactional Ammount Can't be empty or Negetive Value");
        }
        walletInfo.balance = walletInfo.balance - withdraw_ammount; // ✅ withdraw_ammount the amount correctly
        const transaction = yield tran_model_1.Transaction.create([
            {
                amount: withdraw_ammount,
                initiatedBy: user._id,
                receiverWallet: walletInfo._id,
                senderWallet: walletInfo._id,
                status: tran_interface_1.TRANSACTION_STATUS.SUCCESS,
                type: tran_interface_1.TRANSACTION_TYPE.WITHDRAW,
            },
        ], { session });
        // Populate the `initiatedBy` field (adjust fields as necessary)
        const populatedTransaction = yield tran_model_1.Transaction.findById(transaction[0]._id)
            .session(session)
            .select("amount type status initiatedBy")
            .populate("initiatedBy", "name -_id");
        yield walletInfo.save({ session }); // ✅ Save to persist change
        yield session.commitTransaction();
        session.endSession();
        return {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            status: true,
            message: "Withdrawed Successfully",
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
// Send Money
const sendMoney_service = (payload, transfer_ammount, receiver_phone) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield wallet_model_1.Wallet.startSession();
    session.startTransaction();
    try {
        const { phone } = payload;
        const senderPhone = phone;
        // Try to find user by  email
        const user = yield user_model_1.User.findOne({ phone: senderPhone }).session(session);
        if (!user) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is not Valid to Transfer Money");
        }
        const senderWallet = yield wallet_model_1.Wallet.findById(user.wallet).session(session);
        if (!senderWallet) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Sender Wallet is not Found to send money");
        }
        if (senderWallet.status === wallet_interface_1.WSTATUS.BLOCKED) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Sender Wallet Is Blocked To Transaction");
        }
        if (senderWallet.balance < transfer_ammount) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "You have not  sufficient fund  to transfer");
        }
        if (receiver_phone === senderPhone) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Sender Phone Number Can't be same as Receiver Phone Number");
        }
        const receiverWallet = yield (0, user_availableCheck_1.isValidUser)(receiver_phone, session); // userwallet
        if (!receiverWallet) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, " Receiver Wallet is not  Found");
        }
        if (receiverWallet.status === wallet_interface_1.WSTATUS.BLOCKED) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, " Receiver Wallet Is Blocked To Transaction");
        }
        if (transfer_ammount <= 0) {
            throw new error_helper_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, " Your Transactional Ammount Can't be empty or Negetive Value");
        }
        senderWallet.balance = senderWallet.balance - transfer_ammount; // ✅ withdraw_ammount the amount correctly
        receiverWallet.balance = receiverWallet.balance + transfer_ammount;
        yield senderWallet.save({ session }); // ✅ Save to persist change
        yield receiverWallet.save({ session }); // ✅ Save to persist change
        const transaction = yield tran_model_1.Transaction.create([
            {
                amount: transfer_ammount,
                initiatedBy: user._id,
                receiverWallet: receiverWallet._id,
                senderWallet: senderWallet._id,
                status: tran_interface_1.TRANSACTION_STATUS.SUCCESS,
                type: tran_interface_1.TRANSACTION_TYPE.SEND_MONEY,
            },
        ], { session });
        // Populate the `initiatedBy` field (adjust fields as necessary)
        const populatedTransaction = yield tran_model_1.Transaction.findById(transaction[0]._id)
            .session(session)
            .select("amount type status initiatedBy")
            .populate("initiatedBy", "name -_id");
        yield session.commitTransaction();
        session.endSession();
        return {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            status: true,
            message: `${transfer_ammount} TK transfered Successfully to ${receiver_phone}`,
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
// Get Single user Transactions
const getTranasaction_service = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
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
        message: `ALL Transaction History`,
        data: transactions,
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
// ========== Routes for Admin ==============
// Gell all Users
const getUser_service = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const filter = query;
    const searchTerm = filter.searchTerm || "";
    const sort = filter.sort || "-createdAt";
    const fields = ((_a = filter.fields) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "";
    const page = Number(filter.page) || 1;
    const limit = Number(filter.limit) || 5;
    const skip = (page - 1) * limit;
    for (const field of global_constant_1.excludeItems) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete filter[field];
    }
    const searchQuery = {
        $or: search_constant_1.searchParams.map((item) => ({
            [item]: { $regex: searchTerm, $options: "i" },
        })),
    };
    const users = yield user_model_1.User.find(searchQuery)
        .find(filter)
        .sort(sort)
        .select(fields)
        .limit(limit)
        .skip(skip);
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
//  Get All Users Wallet
const getWallets_service = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_model_1.Wallet.find({});
    if (!wallets) {
        return {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            status: false,
            message: `Wallet Finding Problem`,
            data: null,
        };
    }
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: true,
        message: `Users Fetched Successfully`,
        data: wallets,
    };
});
// Get All Users Transaction
const getALLUsersTranasaction_service = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield tran_model_1.Transaction.find({});
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: true,
        message: `ALL Users Transaction History`,
        data: transactions,
    };
});
// Approve Agent
const approve_Agent = (_a) => __awaiter(void 0, [_a], void 0, function* ({ phone, activeStatus, approveStatus, varifiedStatus, }) {
    const agent = yield agent_model_1.Agent.findOne({ phone });
    if (!agent) {
        throw new Error("Agent not found");
    }
    if (activeStatus !== user_interface_1.EISACTIVE.BLOCKED) {
        if (!(agent === null || agent === void 0 ? void 0 : agent.isApproved) && approveStatus !== undefined) {
            agent.isApproved = approveStatus;
            yield agent.save();
        }
        if (!(agent === null || agent === void 0 ? void 0 : agent.isVarified) && varifiedStatus !== undefined) {
            agent.isVarified = varifiedStatus;
            yield agent.save();
        }
    }
    else {
        agent.isApproved = false;
        agent.isVarified = false;
        agent.isActive = activeStatus;
    }
    yield agent.save();
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: true,
        message: `Agent is ${activeStatus}  Successfully`,
        data: agent,
    };
});
//  Block Wallet
const block_Wallet = (_a) => __awaiter(void 0, [_a], void 0, function* ({ wallet, status }) {
    const walet = yield wallet_model_1.Wallet.findByIdAndUpdate(wallet, // ID as string
    { status }, // update object
    { new: true, runValidators: true } // return the updated document
    );
    if (!walet) {
        throw new Error("Wallet Address not Valid");
    }
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        status: true,
        message: `Agent is Approved Successfully`,
        data: walet,
    };
});
exports.services = {
    createUser_service,
    addMoney_service,
    withrow_service,
    sendMoney_service,
    getUser_service,
    getTranasaction_service,
    getALLUsersTranasaction_service,
    getWallets_service,
    approve_Agent,
    block_Wallet,
    getPersonalWallet,
    getNewAccessToken,
};
