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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_config_1 = require("../../../config/env.config");
const user_interface_1 = require("../user/user.interface");
const authSchema = new mongoose_1.Schema({
    provide: { type: String, required: true },
    providerID: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now() },
}, { timestamps: false, versionKey: false, _id: false });
const agentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String },
    image: { type: String },
    wallet: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet" },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.EISACTIVE),
        default: user_interface_1.EISACTIVE.ACTIVE,
    },
    isVarified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(user_interface_1.ROLE), default: user_interface_1.ROLE.AGENT },
    auth: [authSchema],
}, {
    timestamps: true,
    versionKey: false,
});
agentSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const password = this.password;
        // Only hash the password if it has been modified or is new
        if (!this.isModified("password"))
            return next();
        const hashedPass = yield bcryptjs_1.default.hash(password, env_config_1.ENV.SALT_ROUND);
        this.password = hashedPass;
        next();
    });
});
exports.Agent = (0, mongoose_1.model)("Agent", agentSchema);
