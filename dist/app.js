"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_global_1 = require("./app/middlewares/error.global");
const error_notFound_1 = require("./app/middlewares/error.notFound");
const index_routes_1 = require("./app/routes/index.routes");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({
    origin: "https://digitalwallerfronted.vercel.app", // your frontend origin
    // origin: "https://digitalwallerfronted.vercel.app", // your frontend origin
    credentials: true, // allow cookies/authorization headers
}));
exports.app.use("/api/wallet/v1", index_routes_1.routerController);
exports.app.get("/", (req, res) => {
    res.send("Hello World!");
});
exports.app.use(error_global_1.GlobalError);
exports.app.use(error_notFound_1.page_not_Found);
