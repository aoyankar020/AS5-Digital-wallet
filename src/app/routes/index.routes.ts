import { Router } from "express";
import { userRouter } from "../modules/users/user/user.routes";
import { authRouter } from "../modules/auth/auth.route";
import { agentRouter } from "../modules/users/agent/agent.route";
import { adminRouter } from "../modules/users/admin/admin.routes";

export const routerController = Router();
const routesModules = [
  {
    path: "/user",
    router: userRouter,
  },
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/agent",
    router: agentRouter,
  },
  {
    path: "/admin",
    router: adminRouter,
  },
];
routesModules.forEach((route) => {
  if (route.path) {
    routerController.use(route.path, route.router);
  }
});
