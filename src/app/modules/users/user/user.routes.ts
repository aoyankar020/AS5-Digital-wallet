import { Router } from "express";
import { controller } from "./user.controller";
import { userZodValidation } from "../../../utils/zod.validation.util";
import { userValidationSchema } from "./user.validation";

import { checkAuthandAuthorization } from "../../../middlewares/checkAuthAndAuthorization";

import { Role } from "./user.interface";

export const userRouter = Router();

userRouter.post(
  "/regester",
  userZodValidation(userValidationSchema),
  controller.createUser
);

userRouter.post(
  "/add-money",
  checkAuthandAuthorization(Role.USER),
  controller.addMoney
);
userRouter.post(
  "/withdraw",
  checkAuthandAuthorization(Role.USER),
  controller.withrowMoney
);
userRouter.post(
  "/send-money",
  checkAuthandAuthorization(Role.USER),
  controller.SendMoney
);
userRouter.get(
  "/transaction-history",
  checkAuthandAuthorization(Role.USER),
  controller.getTransactions
);
userRouter.get(
  "/wallet",
  checkAuthandAuthorization(Role.USER),
  controller.getPersonalWallet
);
userRouter.get(
  "/newusertoken",

  controller.getUserNewAccessToken
);
userRouter.get(
  "/me",
  checkAuthandAuthorization(Role.USER, Role.ADMIN),
  controller.getMe
);
userRouter.patch(
  "/update_user",
  checkAuthandAuthorization(Role.USER, Role.ADMIN),
  controller.saveUserProfile
);
