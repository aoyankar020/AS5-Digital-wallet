import mongoose, { Schema } from "mongoose";
import { IWallet, WSTATUS } from "./wallet.interface";

const walletSchema = new mongoose.Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 50,
    },
    status: {
      type: String,
      enum: Object.values(WSTATUS),
      default: WSTATUS.UNBLOCKE,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);
