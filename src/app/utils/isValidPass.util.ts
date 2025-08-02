import { IUSER } from "../modules/users/user/user.interface";
import bcrypt from "bcryptjs";

export const matched = async (password: string, user: Partial<IUSER>) => {
  const isValid = await bcrypt.compare(password, user?.password as string);
  if (!isValid) {
    return false;
  }
  return true;
};
