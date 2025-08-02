import { Router } from "express";

import { agent_controller } from "./agent.controller";
import { checkAuthandAuthorization } from "../../../middlewares/checkAuthAndAuthorization";
import { agentValidationSchema } from "./agent.validation";
import { userZodValidation } from "../../../utils/zod.validation.util";
import { ROLE } from "../user/user.interface";

export const agentRouter = Router();

agentRouter.post(
  "/regester",
  userZodValidation(agentValidationSchema),
  agent_controller.createUser
);
agentRouter.post(
  "/cash-in",
  checkAuthandAuthorization(ROLE.AGENT),
  agent_controller.cashIn
);
agentRouter.post(
  "/cash-out",
  checkAuthandAuthorization(ROLE.AGENT),
  agent_controller.cashOut
);
agentRouter.get(
  "/wallet",
  checkAuthandAuthorization(ROLE.AGENT),
  agent_controller.getPersonalWallet
);
agentRouter.get(
  "/transaction-history",
  checkAuthandAuthorization(ROLE.AGENT),
  agent_controller.getPersonalTransaction
);
agentRouter.get(
  "/newagenttoken",

  agent_controller.getAgentNewAccessToken
);
