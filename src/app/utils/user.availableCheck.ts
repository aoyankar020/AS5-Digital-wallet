import { ClientSession } from "mongoose";
import { User } from "../modules/users/user/user.model";
import { Wallet } from "../modules/wallet/wallet.model";

export const isValidUser = async (
  receiver_phone: string,
  session: ClientSession
) => {
  const isValid = await User.findOne({ phone: receiver_phone }).session(
    session
  );
  if (!isValid) {
    return false;
  }
  const walletInfo = await Wallet.findById(isValid.wallet).session(session);
  if (!walletInfo) {
    return false;
  }

  return walletInfo;
};
