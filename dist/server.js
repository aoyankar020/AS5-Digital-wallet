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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const env_config_1 = require("./app/config/env.config");
const superAdmin_1 = require("./app/utils/superAdmin");
let server;
// ✅  Monitor Mongoose event listeners **before** connecting
mongoose_1.default.connection
    .on("connecting", () => console.log("🔄 Connecting to MongoDB..."))
    .on("connected", () => console.log("✅ Connected to MongoDB"))
    .on("open", () => console.log("🔓 Connection is open"))
    .on("disconnecting", () => console.log("🚪 Disconnecting from MongoDB..."))
    .on("disconnected", () => console.log("❌ Disconnected from MongoDB"))
    .on("close", () => console.log("🔒 Connection closed"))
    .on("reconnected", () => console.log("🔁 Reconnected to MongoDB"))
    .on("error", (err) => console.error("❗ Connection error:", err))
    .on("fullsetup", () => console.log("📡 All replica set members connected"))
    .on("reconnectFailed", () => console.warn("⚠️ Reconnection failed"));
const loadServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_config_1.ENV.DB_URL);
        console.log("🌿 Mongoose connected successfully");
        // Start Express server
        server = app_1.app.listen(env_config_1.ENV.SERVER_PORT, () => {
            console.log(`🚀 Server is running on port ${env_config_1.ENV.SERVER_PORT} & URL: http://localhost:${env_config_1.ENV.SERVER_PORT}/`);
        });
    }
    catch (err) {
        console.error("❌ Failed to connect MongoDB or start server:", err);
        process.exit(1);
    }
});
// Graceful shutdown
const handleExit = (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down...`);
    if (server) {
        server.close(() => {
            console.log("🛑 HTTP server closed.");
            mongoose_1.default.connection.close(false);
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
};
//  Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Rejection:", reason);
    handleExit("unhandledRejection");
});
// Handle uncaughtException
process.on("uncaughtException", (reason) => {
    console.error("❌ uncaughtException:", reason);
    handleExit("uncaughtException");
});
// Handle termination signals
process.on("SIGINT", () => handleExit("SIGINT"));
process.on("SIGTERM", () => handleExit("SIGTERM"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield loadServer();
    yield (0, superAdmin_1.seedAdmin)();
}))();
