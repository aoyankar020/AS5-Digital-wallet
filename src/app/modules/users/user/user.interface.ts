import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}
export enum EISACTIVE {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}
export interface AUTH {
  provide: "google" | "credential";
  providerID: string;
  lastLogin: Date;
}
export interface IUSER {
  name: string;
  phone: string;
  email: string;
  address?: string;
  password: string;
  image?: string;
  wallet?: Types.ObjectId;
  isActive?: EISACTIVE;
  isVarified?: boolean;
  isApproved?: boolean;
  auth?: AUTH[];
  role?: Role;
}
