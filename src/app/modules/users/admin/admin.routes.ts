import { Router } from "express";
import { checkAuthandAuthorization } from "../../../middlewares/checkAuthAndAuthorization";

import { controller } from "../user/user.controller";
import { agent_controller } from "../agent/agent.controller";
import { Role } from "../user/user.interface";

export const adminRouter = Router();
// get all users
adminRouter.get(
  "/users",
  checkAuthandAuthorization(Role.ADMIN),
  controller.getUsers
);
// Get all Agents
adminRouter.get(
  "/agents",
  checkAuthandAuthorization(Role.ADMIN),
  agent_controller.getUsers
);
// view All transactions
adminRouter.get(
  "/transaction-history",
  checkAuthandAuthorization(Role.ADMIN),
  controller.getAllUsersTransactions
);
// View All wallet
adminRouter.get(
  "/wallets",
  checkAuthandAuthorization(Role.ADMIN),
  controller.getWallets
);
// Approve Agent
adminRouter.patch(
  "/approve/agent",

  checkAuthandAuthorization(Role.ADMIN),
  controller.approveAgent
);
// Approve Wallet
adminRouter.patch(
  "/approve/wallet",

  checkAuthandAuthorization(Role.ADMIN),
  controller.blockWallet
);
adminRouter.get(
  "/overview",

  checkAuthandAuthorization(Role.ADMIN),
  controller.getOverview
);
