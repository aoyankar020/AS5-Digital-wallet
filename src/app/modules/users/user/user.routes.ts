import { Router } from "express";
import { controller } from "./user.controller";
import { userZodValidation } from "../../../utils/zod.validation.util";
import { userValidationSchema } from "./user.validation";

import { ROLE } from "./user.interface";

import { checkAuthandAuthorization } from "../../../middlewares/checkAuthAndAuthorization";

export const userRouter = Router();

userRouter.post(
  "/regester",
  userZodValidation(userValidationSchema),
  controller.createUser
);

userRouter.post(
  "/add-money",
  checkAuthandAuthorization(ROLE.USER),
  controller.addMoney
);
userRouter.post(
  "/withdraw",
  checkAuthandAuthorization(ROLE.USER),
  controller.withrowMoney
);
userRouter.post(
  "/send-money",
  checkAuthandAuthorization(ROLE.USER),
  controller.SendMoney
);
userRouter.get(
  "/transaction-history",
  checkAuthandAuthorization(ROLE.USER),
  controller.getTransactions
);
userRouter.get(
  "/wallet",
  checkAuthandAuthorization(ROLE.USER),
  controller.getPersonalWallet
);
userRouter.get(
  "/newusertoken",

  controller.getUserNewAccessToken
);
