"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const env_config_1 = require("../config/env.config");
const user_interface_1 = require("../modules/users/user/user.interface");
const user_model_1 = require("../modules/users/user/user.model");
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const superAdmin = yield user_model_1.User.findOne({ email: env_config_1.ENV.ADMIN_EMAIL });
    if (superAdmin) {
        console.log(" Admin already exists");
        return;
    }
    // const hashedPassword = await bcrypt.hash(
    //   ENV.ADMIN_PASSWORD,
    //   Number(ENV.SALT_ROUND)
    // );
    // if (!hashedPassword) {
    //   throw new Error("Failed to hash  admin password");
    // }
    const providers = {
        provide: "credential",
        providerID: env_config_1.ENV.ADMIN_EMAIL,
        lastLogin: new Date(),
    };
    console.log("Creating Super Admin...");
    const newSuperAdmin = yield user_model_1.User.create({
        email: env_config_1.ENV.ADMIN_EMAIL,
        password: env_config_1.ENV.ADMIN_PASSWORD,
        role: user_interface_1.Role.ADMIN,
        name: "Admin",
        isActive: user_interface_1.EISACTIVE.ACTIVE,
        phone: env_config_1.ENV.ADMIN_PHONE,
        isVerified: true,
        auths: [providers],
    });
    if (newSuperAdmin) {
        console.log(" Admin created successfully:", newSuperAdmin);
    }
});
exports.seedAdmin = seedAdmin;
