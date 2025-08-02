"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnv = () => {
    const ENVS = [
        "DB_URL",
        "SERVER_PORT",
        "NODE_ENV",
        "JWT_SECRET",
        "SALT_ROUND",
        "JWT_EXPIRE",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "ADMIN_PHONE",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRE",
    ];
    ENVS.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing Required Environment Variable: ${key}`);
        }
    });
    return {
        DB_URL: process.env.DB_URL,
        SERVER_PORT: process.env.SERVER_PORT,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRE: process.env.JWT_EXPIRE,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        ADMIN_PHONE: process.env.ADMIN_PHONE,
        SALT_ROUND: Number(process.env.SALT_ROUND),
        NODE_ENV: process.env.NODE_ENV,
    };
};
exports.ENV = loadEnv();
