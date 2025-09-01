import { Router } from "express";

import { agent_controller } from "./agent.controller";
import { checkAuthandAuthorization } from "../../../middlewares/checkAuthAndAuthorization";
import { agentValidationSchema } from "./agent.validation";
import { userZodValidation } from "../../../utils/zod.validation.util";
import { Role } from "../user/user.interface";

export const agentRouter = Router();

agentRouter.post(
  "/regester",
  userZodValidation(agentValidationSchema),
  agent_controller.createUser
);
agentRouter.post(
  "/cash-in",
  checkAuthandAuthorization(Role.AGENT),
  agent_controller.cashIn
);
agentRouter.post(
  "/cash-out",
  checkAuthandAuthorization(Role.AGENT),
  agent_controller.cashOut
);
agentRouter.get(
  "/wallet",
  checkAuthandAuthorization(Role.AGENT),
  agent_controller.getPersonalWallet
);
agentRouter.get(
  "/transaction-history",
  checkAuthandAuthorization(Role.AGENT),
  agent_controller.getPersonalTransaction
);
agentRouter.get(
  "/newagenttoken",

  agent_controller.getAgentNewAccessToken
);
agentRouter.get(
  "/me",
  checkAuthandAuthorization(Role.AGENT),
  agent_controller.getMe
);
agentRouter.patch(
  "/update",
  checkAuthandAuthorization(Role.AGENT),
  agent_controller.saveProfile
);
