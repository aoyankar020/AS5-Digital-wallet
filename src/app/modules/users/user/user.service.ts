import { StatusCodes } from "http-status-codes";
import { AUTH, EISACTIVE, IUSER } from "./user.interface";
import { User } from "./user.model";

import { walletService } from "../../wallet/wallet.service";
import { AppError } from "../../../helper/error.helper";
import { Wallet } from "../../wallet/wallet.model";

import { isValidUser } from "../../../utils/user.availableCheck";
import { Transaction } from "../../transaction/tran.model";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../transaction/tran.interface";
import { Agent } from "../agent/agent.model";
import { ApproveAgentOptions } from "../agent/agent.interface";
import { blockWalletOptions, WSTATUS } from "../../wallet/wallet.interface";

import { searchParams } from "./search.constant";
import { excludeItems } from "../../../global.constant";
import { Types } from "mongoose";
import { generateToken, verifyToken } from "../../../utils/jwt.util";
import { ENV } from "../../../config/env.config";
import { email } from "zod";
import { JwtPayload } from "jsonwebtoken";

// Create User and Wallet
const createUser_service = async (payload: Partial<IUSER>) => {
  // Start Session on User Module
  const session = await User.startSession();
  session.startTransaction();
  try {
    const isExistemail = await User.findOne({ email: payload.email }).session(
      session
    );
    const isExistPhone = await User.findOne({ phone: payload.phone }).session(
      session
    );

    if (isExistPhone || isExistemail) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        status: false,
        message: `You have Already Regestered ! with this  Email : ${payload.email} or Phone: ${payload.phone}`,
        data: null,
      };
    }
    const auth: AUTH = {
      provide: "credential",
      providerID: payload.email as string,
      lastLogin: new Date(),
    };
    const user = await User.create([{ auth, ...payload }], { session });
    if (!user) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        status: false,
        message: "User not Created ",
        data: null,
      };
    }
    const Wallet = await walletService.createDefaultWallet(
      user[0]._id,
      session
    );
    if (!Wallet) {
      throw new AppError(StatusCodes.BAD_GATEWAY, "Wallet not Created");
    }

    await User.findByIdAndUpdate(
      { _id: user[0]._id },
      {
        wallet: Wallet[0]._id,
      },
      { new: true, runValidators: true, session }
    );
    await session.commitTransaction(); // session transaction
    session.endSession();
    return {
      statusCode: StatusCodes.CREATED,
      status: true,
      message: "User Created Successfully",
      data: { user },
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};
// Add Money
const addMoney_service = async (payload: Partial<IUSER>, ammount: number) => {
  const session = await Wallet.startSession();
  session.startTransaction();

  try {
    // Try to find user by  email
    const user = await User.findOne({ phone: payload.phone }).session(session);
    if (!user) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "User is not Valid to add money"
      );
    }
    const walletInfo = await Wallet.findById(user.wallet).session(session);
    if (!walletInfo) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Wallet is not Valid to add money"
      );
    }
    if (walletInfo.status === WSTATUS.BLOCKED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Wallet is Blocked To Transfer"
      );
    }
    if (ammount <= 0) {
      throw new AppError(
        StatusCodes.CONFLICT,
        "Your Transaction Ammount Can't be empty or Negetive Value"
      );
    }
    walletInfo.balance = walletInfo.balance + ammount; // ✅ Add the amount correctly
    const transaction = await Transaction.create(
      [
        {
          amount: ammount,
          initiatedBy: user._id,
          receiverWallet: walletInfo._id,
          senderWallet: walletInfo._id,
          status: TRANSACTION_STATUS.SUCCESS,
          type: TRANSACTION_TYPE.ADD_MONEY,
        },
      ],
      { session }
    );
    // Populate the `initiatedBy` field (adjust fields as necessary)
    const populatedTransaction = await Transaction.findById(transaction[0]._id)
      .session(session)
      .select("amount type status initiatedBy")
      .populate("initiatedBy", "name -_id");

    await walletInfo.save({ session });

    await session.commitTransaction();
    session.endSession();
    return {
      statusCode: StatusCodes.CREATED,
      status: true,
      message: "Added Money Successfully",
      data: populatedTransaction,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};
const getNewAccessToken = async (token: string) => {
  try {
    const isVarifiedToken = verifyToken(
      token,
      ENV.JWT_REFRESH_SECRET
    ) as JwtPayload;

    const user = await User.find({
      email: isVarifiedToken?.email,
    });

    if (!user) {
      throw new AppError(StatusCodes.BAD_REQUEST, "No Valid User");
    }

    if (!isVarifiedToken) {
      throw new AppError(StatusCodes.BAD_REQUEST, "No Varid Refresh token");
    }

    const newToken = generateToken({ user }, ENV.JWT_SECRET, ENV.JWT_EXPIRE);
    // Populate the `initiatedBy` field (adjust fields as necessary)

    return {
      statusCode: StatusCodes.CREATED,
      status: true,
      message: "New Token Created",
      data: { newToken },
    };
  } catch (error) {
    throw error;
  }
};
// Withdraw Money
const withrow_service = async (
  payload: Partial<IUSER>,
  withdraw_ammount: number
) => {
  const session = await Wallet.startSession();
  session.startTransaction();

  try {
    // Try to find user by  email
    const user = await User.findOne({ phone: payload.phone }).session(session);

    if (!user) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "User is not Valid to add money"
      );
    }

    const walletInfo = await Wallet.findById(user.wallet).session(session);

    if (!walletInfo) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Wallet is not Valid to add money"
      );
    }
    if (walletInfo.status === WSTATUS.BLOCKED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Wallet is Blocked To Transfer"
      );
    }
    if (walletInfo.balance < withdraw_ammount) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "No Sufficient Fund is Available"
      );
    }
    if (withdraw_ammount <= 0) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Your Transactional Ammount Can't be empty or Negetive Value"
      );
    }
    walletInfo.balance = walletInfo.balance - withdraw_ammount; // ✅ withdraw_ammount the amount correctly
    const transaction = await Transaction.create(
      [
        {
          amount: withdraw_ammount,
          initiatedBy: user._id,
          receiverWallet: walletInfo._id,
          senderWallet: walletInfo._id,
          status: TRANSACTION_STATUS.SUCCESS,
          type: TRANSACTION_TYPE.WITHDRAW,
        },
      ],
      { session }
    );
    // Populate the `initiatedBy` field (adjust fields as necessary)
    const populatedTransaction = await Transaction.findById(transaction[0]._id)
      .session(session)
      .select("amount type status initiatedBy")
      .populate("initiatedBy", "name -_id");

    await walletInfo.save({ session }); // ✅ Save to persist change
    await session.commitTransaction();
    session.endSession();
    return {
      statusCode: StatusCodes.CREATED,
      status: true,
      message: "Withdrawed Successfully",
      data: populatedTransaction,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};
// Send Money
const sendMoney_service = async (
  payload: Partial<IUSER>,
  transfer_ammount: number,
  receiver_phone: string
) => {
  const session = await Wallet.startSession();
  session.startTransaction();
  try {
    const { phone } = payload;
    const senderPhone = phone;
    // Try to find user by  email
    const user = await User.findOne({ phone: senderPhone }).session(session);

    if (!user) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "User is not Valid to Transfer Money"
      );
    }

    const senderWallet = await Wallet.findById(user.wallet).session(session);

    if (!senderWallet) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Sender Wallet is not Found to send money"
      );
    }
    if (senderWallet.status === WSTATUS.BLOCKED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Sender Wallet Is Blocked To Transaction"
      );
    }
    if (senderWallet.balance < transfer_ammount) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "You have not  sufficient fund  to transfer"
      );
    }
    if (receiver_phone === senderPhone) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Sender Phone Number Can't be same as Receiver Phone Number"
      );
    }

    const receiverWallet = await isValidUser(receiver_phone, session); // userwallet

    if (!receiverWallet) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        " Receiver Wallet is not  Found"
      );
    }
    if (receiverWallet.status === WSTATUS.BLOCKED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        " Receiver Wallet Is Blocked To Transaction"
      );
    }
    if (transfer_ammount <= 0) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        " Your Transactional Ammount Can't be empty or Negetive Value"
      );
    }

    senderWallet.balance = senderWallet.balance - transfer_ammount; // ✅ withdraw_ammount the amount correctly
    receiverWallet.balance = receiverWallet.balance + transfer_ammount;
    await senderWallet.save({ session }); // ✅ Save to persist change
    await receiverWallet.save({ session }); // ✅ Save to persist change
    const transaction = await Transaction.create(
      [
        {
          amount: transfer_ammount,
          initiatedBy: user._id,
          receiverWallet: receiverWallet._id,
          senderWallet: senderWallet._id,
          status: TRANSACTION_STATUS.SUCCESS,
          type: TRANSACTION_TYPE.SEND_MONEY,
        },
      ],
      { session }
    );
    // Populate the `initiatedBy` field (adjust fields as necessary)
    const populatedTransaction = await Transaction.findById(transaction[0]._id)
      .session(session)
      .select("amount type status initiatedBy")
      .populate("initiatedBy", "name -_id");
    await session.commitTransaction();
    session.endSession();
    return {
      statusCode: StatusCodes.CREATED,
      status: true,
      message: `${transfer_ammount} TK transfered Successfully to ${receiver_phone}`,
      data: populatedTransaction,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};
// Get Single user Transactions
const getTranasaction_service = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      status: false,
      message: `No Users Found`,
      data: null,
    };
  }
  const transactions = await Transaction.find({ initiatedBy: user._id });

  return {
    statusCode: StatusCodes.OK,
    status: true,
    message: `ALL Transaction History`,
    data: transactions,
  };
};
// Gell User Personal Wallet
const getPersonalWallet = async (walletID: Types.ObjectId) => {
  const wallet = await Wallet.findById(walletID);
  if (!wallet) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      status: false,
      message: `No Wallet is  Found`,
      data: null,
    };
  }
  return {
    statusCode: StatusCodes.OK,
    status: true,
    message: `Successfully Fetched Your Wallet`,
    data: wallet,
  };
};

// ========== Routes for Admin ==============
// Gell all Users
const getUser_service = async (query: Record<string, string>) => {
  const filter = query;
  const searchTerm = filter.searchTerm || "";
  const sort = filter.sort || "-createdAt";
  const fields = filter.fields?.split(",").join(" ") || "";
  const page = Number(filter.page) || 1;
  const limit = Number(filter.limit) || 5;
  const skip = (page - 1) * limit;

  for (const field of excludeItems) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete filter[field];
  }

  const searchQuery = {
    $or: searchParams.map((item) => ({
      [item]: { $regex: searchTerm, $options: "i" },
    })),
  };
  const users = await User.find(searchQuery)
    .find(filter)
    .sort(sort)
    .select(fields)
    .limit(limit)
    .skip(skip);
  if (!users) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      status: false,
      message: `No Users Found`,
      data: null,
    };
  }
  return {
    statusCode: StatusCodes.OK,
    status: true,
    message: `Users Fetched Successfully`,
    data: users,
  };
};

//  Get All Users Wallet
const getWallets_service = async () => {
  const wallets = await Wallet.find({});
  if (!wallets) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      status: false,
      message: `Wallet Finding Problem`,
      data: null,
    };
  }
  return {
    statusCode: StatusCodes.OK,
    status: true,
    message: `Users Fetched Successfully`,
    data: wallets,
  };
};
// Get All Users Transaction
const getALLUsersTranasaction_service = async () => {
  const transactions = await Transaction.find({});

  return {
    statusCode: StatusCodes.OK,
    status: true,
    message: `ALL Users Transaction History`,
    data: transactions,
  };
};

// Approve Agent
const approve_Agent = async ({
  phone,
  activeStatus,
  approveStatus,
  varifiedStatus,
}: ApproveAgentOptions) => {
  const agent = await Agent.findOne({ phone });
  if (!agent) {
    throw new Error("Agent not found");
  }
  if (activeStatus !== EISACTIVE.BLOCKED) {
    if (!agent?.isApproved && approveStatus !== undefined) {
      agent.isApproved = approveStatus;
      await agent.save();
    }
    if (!agent?.isVarified && varifiedStatus !== undefined) {
      agent.isVarified = varifiedStatus;
      await agent.save();
    }
  } else {
    agent.isApproved = false;
    agent.isVarified = false;
    agent.isActive = activeStatus;
  }
  await agent.save();
  return {
    statusCode: StatusCodes.OK,
    status: true,
    message: `Agent is ${activeStatus}  Successfully`,
    data: agent,
  };
};

//  Block Wallet

const block_Wallet = async ({ wallet, status }: blockWalletOptions) => {
  const walet = await Wallet.findByIdAndUpdate(
    wallet, // ID as string
    { status }, // update object
    { new: true, runValidators: true } // return the updated document
  );

  if (!walet) {
    throw new Error("Wallet Address not Valid");
  }

  return {
    statusCode: StatusCodes.OK,
    status: true,
    message: `Agent is Approved Successfully`,
    data: walet,
  };
};

export const services = {
  createUser_service,
  addMoney_service,
  withrow_service,
  sendMoney_service,
  getUser_service,
  getTranasaction_service,
  getALLUsersTranasaction_service,
  getWallets_service,
  approve_Agent,
  block_Wallet,
  getPersonalWallet,
  getNewAccessToken,
};
