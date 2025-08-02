"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerController = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/users/user/user.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const agent_route_1 = require("../modules/users/agent/agent.route");
const admin_routes_1 = require("../modules/users/admin/admin.routes");
exports.routerController = (0, express_1.Router)();
const routesModules = [
    {
        path: "/user",
        router: user_routes_1.userRouter,
    },
    {
        path: "/auth/login",
        router: auth_route_1.authRouter,
    },
    {
        path: "/agent",
        router: agent_route_1.agentRouter,
    },
    {
        path: "/admin",
        router: admin_routes_1.adminRouter,
    },
];
routesModules.forEach((route) => {
    if (route.path) {
        exports.routerController.use(route.path, route.router);
    }
});
