import { ENV } from "../config/env.config";
import { AUTH, EISACTIVE, ROLE } from "../modules/users/user/user.interface";
import { User } from "../modules/users/user/user.model";

export const seedAdmin = async () => {
  const superAdmin = await User.findOne({ email: ENV.ADMIN_EMAIL });
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
  const providers: AUTH = {
    provide: "credential",
    providerID: ENV.ADMIN_EMAIL,
    lastLogin: new Date(),
  };
  console.log("Creating Super Admin...");
  const newSuperAdmin = await User.create({
    email: ENV.ADMIN_EMAIL,
    password: ENV.ADMIN_PASSWORD,
    role: ROLE.ADMIN,
    name: "Super Admin",
    isActive: EISACTIVE.ACTIVE,
    phone: ENV.ADMIN_PHONE,

    isVerified: true,
    auths: [providers],
  });

  if (newSuperAdmin) {
    console.log(" Admin created successfully:", newSuperAdmin);
  }
};
