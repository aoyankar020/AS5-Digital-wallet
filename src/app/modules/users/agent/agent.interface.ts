import { Types } from "mongoose";
import { AUTH, EISACTIVE, ROLE } from "../user/user.interface";
export interface ApproveAgentOptions {
  phone: string;
  approveStatus?: boolean;
  activeStatus: EISACTIVE;
  varifiedStatus?: boolean;
}
export interface IAGENT {
  name: string;
  phone: string;
  email: string;
  address?: string;
  password: string;
  image?: string;
  wallet?: Types.ObjectId;
  isApproved?: boolean;
  isActive?: EISACTIVE;
  isVarified?: boolean;
  auth?: AUTH[];
  role?: ROLE;
}
