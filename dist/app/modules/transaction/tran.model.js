"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const tran_interface_1 = require("./tran.interface");
const transactionSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: Object.values(tran_interface_1.TRANSACTION_TYPE),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(tran_interface_1.TRANSACTION_STATUS),
        default: tran_interface_1.TRANSACTION_STATUS.PENDING,
    },
    senderWallet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
    },
    receiverWallet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
    },
    initiatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
