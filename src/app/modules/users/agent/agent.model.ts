import { model, Schema } from "mongoose";

import bcrypt from "bcryptjs";
import { ENV } from "../../../config/env.config";
import { AUTH, EISACTIVE, Role } from "../user/user.interface";
import { IAGENT } from "./agent.interface";

const authSchema = new Schema<AUTH>(
  {
    provide: { type: String, required: true },
    providerID: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now() },
  },
  { timestamps: false, versionKey: false, _id: false }
);
const agentSchema = new Schema<IAGENT>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String },
    image: { type: String },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    isActive: {
      type: String,
      enum: Object.values(EISACTIVE),
      default: EISACTIVE.ACTIVE,
    },
    isVarified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), default: Role.AGENT },
    auth: [authSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
agentSchema.pre("save", async function (next) {
  const password = this.password;
  // Only hash the password if it has been modified or is new
  if (!this.isModified("password")) return next();
  const hashedPass = await bcrypt.hash(password, ENV.SALT_ROUND);
  this.password = hashedPass;

  next();
});

export const Agent = model<IAGENT>("Agent", agentSchema);
