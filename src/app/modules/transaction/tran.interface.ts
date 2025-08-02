import { Types } from "mongoose";

export enum TRANSACTION_TYPE {
  SEND_MONEY = "SEND_MONEY",
  ADD_MONEY = "ADD_MONEY",
  CASH_OUT = "CASH_OUT",
  PAYMENT = "PAYMENT",
  RECEIVE_MONEY = "RECEIVE_MONEY",
  WITHDRAW = "WITHDRAW",
  CASH_IN = "CASH_IN",
  //   cashin
}

export enum TRANSACTION_STATUS {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "Reversed",
}

export interface ITransaction {
  amount: number;
  type: TRANSACTION_TYPE;
  status: TRANSACTION_STATUS;
  senderWallet: Types.ObjectId;
  receiverWallet: Types.ObjectId; // Wallet ID of receiver
  initiatedBy: Types.ObjectId; // Role-based info
}
