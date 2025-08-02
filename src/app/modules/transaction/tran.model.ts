import { model, Schema } from "mongoose";
import {
  ITransaction,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "./tran.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPE),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING,
    },
    senderWallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    receiverWallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model("Transaction", transactionSchema);
