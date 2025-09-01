import { model, Schema } from "mongoose";
import { AUTH, EISACTIVE, IUSER, Role } from "./user.interface";
import bcrypt from "bcryptjs";
import { ENV } from "../../../config/env.config";

const authSchema = new Schema<AUTH>(
  {
    provide: { type: String, required: true },
    providerID: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now() },
  },
  { timestamps: false, versionKey: false, _id: false }
);
const userSchema = new Schema<IUSER>(
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
    // isActive: { type: Object.values(EISACTIVE), default: EISACTIVE.ACTIVE },
    isVarified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    auth: [authSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
userSchema.pre("save", async function (next) {
  const password = this.password;
  // Only hash the password if it has been modified or is new
  if (!this.isModified("password")) return next();
  const hashedPass = await bcrypt.hash(password, ENV.SALT_ROUND);
  this.password = hashedPass;

  next();
});

export const User = model<IUSER>("User", userSchema);
