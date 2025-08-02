import { Types } from "mongoose";
export enum WSTATUS {
  BLOCKED = "BLOCKED",
  UNBLOCKE = "UNBLOCK",
}
export interface blockWalletOptions {
  wallet: Types.ObjectId;
  status: WSTATUS;
}
export interface IWallet {
  user: Types.ObjectId;
  balance: number;
  status: WSTATUS;
}
