import { Router } from "express";
import { authController } from "./auth.controller";

export const authRouter = Router();
authRouter.post("/user", authController.userLogin);
authRouter.post("/agent", authController.agentLogin);
