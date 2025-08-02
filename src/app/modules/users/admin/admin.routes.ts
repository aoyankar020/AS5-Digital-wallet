import { Router } from "express";
import { checkAuthandAuthorization } from "../../../middlewares/checkAuthAndAuthorization";
import { ROLE } from "../user/user.interface";
import { controller } from "../user/user.controller";
import { agent_controller } from "../agent/agent.controller";

export const adminRouter = Router();
// get all users
adminRouter.get(
  "/users",
  checkAuthandAuthorization(ROLE.ADMIN),
  controller.getUsers
);
// Get all Agents
adminRouter.get(
  "/agents",
  checkAuthandAuthorization(ROLE.ADMIN),
  agent_controller.getUsers
);
// view All transactions
adminRouter.get(
  "/transaction-history",
  checkAuthandAuthorization(ROLE.ADMIN),
  controller.getAllUsersTransactions
);
// View All wallet
adminRouter.get(
  "/wallets",
  checkAuthandAuthorization(ROLE.ADMIN),
  controller.getWallets
);
// Approve Agent
adminRouter.patch(
  "/approve/agent",

  checkAuthandAuthorization(ROLE.ADMIN),
  controller.approveAgent
);
// Approve Wallet
adminRouter.patch(
  "/approve/wallet",

  checkAuthandAuthorization(ROLE.ADMIN),
  controller.blockWallet
);
