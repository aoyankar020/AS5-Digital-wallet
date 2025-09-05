"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const checkAuthAndAuthorization_1 = require("../../../middlewares/checkAuthAndAuthorization");
const user_controller_1 = require("../user/user.controller");
const agent_controller_1 = require("../agent/agent.controller");
const user_interface_1 = require("../user/user.interface");
exports.adminRouter = (0, express_1.Router)();
// get all users
exports.adminRouter.get("/users", (0, checkAuthAndAuthorization_1.checkAuthandAuthorization)(user_interface_1.Role.ADMIN), user_controller_1.controller.getUsers);
// Get all Agents
exports.adminRouter.get("/agents", (0, checkAuthAndAuthorization_1.checkAuthandAuthorization)(user_interface_1.Role.ADMIN), agent_controller_1.agent_controller.getUsers);
// view All transactions
exports.adminRouter.get("/transaction-history", (0, checkAuthAndAuthorization_1.checkAuthandAuthorization)(user_interface_1.Role.ADMIN), user_controller_1.controller.getAllUsersTransactions);
// View All wallet
exports.adminRouter.get("/wallets", (0, checkAuthAndAuthorization_1.checkAuthandAuthorization)(user_interface_1.Role.ADMIN), user_controller_1.controller.getWallets);
// Approve Agent
exports.adminRouter.patch("/approve/agent", (0, checkAuthAndAuthorization_1.checkAuthandAuthorization)(user_interface_1.Role.ADMIN), user_controller_1.controller.approveAgent);
// Approve Wallet
exports.adminRouter.patch("/approve/wallet", (0, checkAuthAndAuthorization_1.checkAuthandAuthorization)(user_interface_1.Role.ADMIN), user_controller_1.controller.blockWallet);
exports.adminRouter.get("/overview", (0, checkAuthAndAuthorization_1.checkAuthandAuthorization)(user_interface_1.Role.ADMIN), user_controller_1.controller.getOverview);
