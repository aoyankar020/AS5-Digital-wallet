import { ClientSession, Types } from "mongoose";
import { Wallet } from "./wallet.model";

const createDefaultWallet = async (
  userId: Types.ObjectId,
  session: ClientSession
) => {
  const walet = await Wallet.create(
    [
      {
        user: userId,
        balance: 50,
      },
    ],
    { session }
  );
  return walet;
};

export const walletService = { createDefaultWallet };
