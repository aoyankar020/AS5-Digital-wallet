import { Router } from "express";
import { authController } from "./auth.controller";

export const authRouter = Router();
authRouter.post("/login/user", authController.userLogin);
authRouter.post("/login/agent", authController.agentLogin);
authRouter.post("/logout", authController.logout);
