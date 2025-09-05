"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentUpdateSchema = exports.agentValidationSchema = void 0;
const z = __importStar(require("zod"));
const user_interface_1 = require("../user/user.interface");
// Import or define EISACTIVE enum
exports.agentValidationSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z
        .string()
        .min(8)
        .regex(/[A-Z]/, "Must include uppercase letter")
        .regex(/[a-z]/, "Must include lowercase letter")
        .regex(/\d/, "Must include a number"),
    phone: z
        .string()
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
    address: z
        .string()
        .min(200, "Minimum length would be 200 character")
        .optional(),
    image: z.string().optional(),
});
exports.agentUpdateSchema = z.object({
    isApproved: z.boolean().optional(),
    isActive: z.enum(Object.values(user_interface_1.EISACTIVE)).optional(),
    isVerified: z
        .boolean({ error: "isVerified must be true or false" })
        .optional(),
    role: z.enum(Object.values(user_interface_1.Role)).optional(),
});
