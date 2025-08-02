"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/user", auth_controller_1.authController.userLogin);
exports.authRouter.post("/agent", auth_controller_1.authController.agentLogin);
