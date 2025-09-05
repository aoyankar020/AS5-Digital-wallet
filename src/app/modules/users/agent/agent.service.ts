import { StatusCodes } from "http-status-codes";

import { walletService } from "../../wallet/wallet.service";
import { AppError } from "../../../helper/error.helper";
import { Wallet } from "../../wallet/wallet.model";

import { IAGENT } from "./agent.interface";
import { Agent } from "./agent.model";
import { AUTH, EISACTIVE, TransactionFilter } from "../user/user.interface";
import { User } from "../user/user.model";
import { Transaction } from "../../transaction/tran.model";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../transaction/tran.interface";
import { WSTATUS } from "../../wallet/wallet.interface";
import { Types } from "mongoose";
import { generateToken, verifyToken } from "../../../utils/jwt.util";
import { ENV } from "../../../config/env.config";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../../utils/QueryBuilder";

// Create User and Wallet
const createAGENT_service = async (payload: Partial<IAGENT>) => {
  const session = await Agent.startSession();
  session.startTransaction();
  try {
    const isExistemail = await Agent.findOne({ email: payload.email }).session(
      session
    );
    const isExistPhone = await Agent.findOne({ phone: payload.phone }).session(
      session
    );

    if (isExistPhone || isExistemail) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `You have Already Regestered ! with this  Email : ${payload.email} or Phone: ${payload.phone}`
      );
    }
    const auth: AUTH = {
      provide: "credential",
      providerID: payload.email as string,
      lastLogin: new Date(),
    };

    const agent = await Agent.create([{ auth, ...payload }], { session });
    if (!agent) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Agent not Created");
    }
    const Wallet = await walletService.createDefaultWallet(
      agent[0]._id,
      session
    );

    await Agent.findByIdAndUpdate(
      { _id: agent[0]._id },
      {
        wallet: Wallet[0]._id,
      },
      { new: true, runValidators: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return {
      statusCode: StatusCodes.CREATED,
      status: true,
      message: "Agent Created Successfully",
      data: { agent },
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};
// // CASH IN
const cashIn_service = async (
  payload: Partial<IAGENT>,
  receiver: string,
  ammount: number
) => {
  const session = await Wallet.startSession();
  session.startTransaction();
  try {
    // Try to find user by  email
    const agent = await Agent.findOne({ phone: payload.phone }).session(
      session
    );

    const recever = await User.findOne({ phone: receiver }).session(session);

    if (!agent) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Agent Phone Number is not valid"
      );
    }
    if (!recever) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Receiver Phone Number is not valid"
      );
    }
    const agentwalletInfo = await Wallet.findById(agent.wallet)
      .select("balance ")
      .session(session);
    const receverWalletInfo = await Wallet.findById(recever.wallet)
      .select("balance ")
      .session(session);
    if (!agentwalletInfo) {
      throw new AppError(StatusCodes.BAD_REQUEST, "No Agent Wallet is found");
    }
    if (!receverWalletInfo) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "No Receiver Wallet is found"
      );
    }
    if (agentwalletInfo.status === WSTATUS.BLOCKED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Agent Wallet Is Blocked To Transaction"
      );
    }
    if (receverWalletInfo.status === WSTATUS.BLOCKED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Receiver Wallet Is Blocked To Transaction"
      );
    }
    if (agent?.isActive === EISACTIVE.BLOCKED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Receiver Account Is Blocked To Transaction"
      );
    }
    if (recever?.isActive === EISACTIVE.BLOCKED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Receiver Account Is Blocked To Transaction"
      );
    }
    if (ammount <= 0) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Your Transactional Ammount Can't be empty or Negetive Value"
      );
    }
    if (agentwalletInfo.balance < ammount) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Not Sufficient Money To Transfer"
      );
    }
    agentwalletInfo.balance = agentwalletInfo.balance - ammount; // ✅ Add the amount correctly
    receverWalletInfo.balance = receverWalletInfo.balance + ammount; // ✅ Add the amount correctly
    const transaction = await Transaction.create(
      [
        {
          ammount: ammount,
          initiatedBy: agent._id,
          receiverWallet: receverWalletInfo._id, // user
          senderWallet: agentwalletInfo._id, //  agent
          status: TRANSACTION_STATUS.SUCCESS,
          type: TRANSACTION_TYPE.CASH_IN,
        },
      ],
      { session }
    );
    // Populate the `initiatedBy` field (adjust fields as necessary)
    const populatedTransaction = await Transaction.findById(transaction[0]._id)

      .select("ammount type status initiatedBy")
      .populate("initiatedBy", "name -_id")
      .session(session);

    await agentwalletInfo.save({ session }); // ✅ Save to persist change
    await receverWalletInfo.save({ session }); // ✅ Save to persist change
    await session.commitTransaction();
    session.endSession();
    return {
      statusCode: StatusCodes.OK,
      status: true,
      message: `Credited ${ammount}Tk in acoount ${receiver} is Successfull `,
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
// CASH OUT
const cashOut_service = async (
  payload: Partial<IAGENT>,
  sender: string,
  ammount: number
) => {
  const session = await Agent.startSession();
  session.startTransaction();
  try {
    // Try to find user by  email
    const agent = await Agent.findOne({ phone: payload.phone }).session(
      session
    );

    const Sender = await User.findOne({ phone: sender }).session(session);

    if (!agent) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Agent Phone Number is not valid"
      );
    }
    if (!Sender) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "sender Phone Number is not valid"
      );
    }
    const agentwalletInfo = await Wallet.findById(agent.wallet)
      .select("balance _id")
      .session(session);

    const senderWalletInfo = await Wallet.findById(Sender.wallet)
      .select("balance _id")
      .session(session);
    if (!agentwalletInfo) {
      throw new AppError(StatusCodes.BAD_REQUEST, "No Agent Wallet is found");
    }
    if (!senderWalletInfo) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "No Receiver Wallet is found"
      );
    }
    if (agentwalletInfo.status === WSTATUS.BLOCKED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Agent Wallet Is Blocked To Transaction"
      );
    }
    if (senderWalletInfo.status === WSTATUS.BLOCKED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Sender Wallet Is Blocked To Transaction"
      );
    }
    if (agent?.isActive === EISACTIVE.BLOCKED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Agent Account Is Blocked To Transaction"
      );
    }
    if (Sender?.isActive === EISACTIVE.BLOCKED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Receiver Account Is Blocked To Transaction"
      );
    }
    if (ammount <= 0) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Your Transactional Ammount Can't be empty or Negetive Value"
      );
    }
    if (senderWalletInfo.balance < ammount) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Not  Sufficient Money to Cash out"
      );
    }
    agentwalletInfo.balance = agentwalletInfo.balance + ammount; // ✅ Add the amount correctly
    senderWalletInfo.balance = senderWalletInfo.balance - ammount; // ✅ Add the amount correctly
    const transaction = await Transaction.create(
      [
        {
          ammount: ammount,
          initiatedBy: agent._id,
          receiverWallet: agentwalletInfo._id, // user
          senderWallet: senderWalletInfo._id, //  agent
          status: TRANSACTION_STATUS.SUCCESS,
          type: TRANSACTION_TYPE.CASH_OUT,
        },
      ],
      { session }
    );
    // Populate the `initiatedBy` field (adjust fields as necessary)
    const populatedTransaction = await Transaction.findById(transaction[0]._id)
      .session(session)
      .select("ammount type status initiatedBy")
      .populate("initiatedBy", "name -_id");

    await agentwalletInfo.save({ session }); // ✅ Save to persist change
    await senderWalletInfo.save({ session }); // ✅ Save to persist change
    await session.commitTransaction();
    session.endSession();
    return {
      statusCode: StatusCodes.OK,
      status: true,
      message: `Debited ${ammount}Tk in acoount ${sender} is Successfull `,
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

// Gell all Users
const getUser_service = async () => {
  const users = await Agent.find({});
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
// Get Agent Personal Transaction
const getTranasaction_service = async (
  email: string,
  query: Record<string, string>
) => {
  const user = await Agent.findOne({ email });
  if (!user) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      status: false,
      message: `No Users Found`,
      data: null,
    };
  }

  const filter: TransactionFilter = { initiatedBy: user._id };

  if (query.type) {
    filter.type = query.type;
  }
  const baseQuery = Transaction.find(filter)
    .populate("senderWallet")
    .populate("receiverWallet")
    .populate("initiatedBy", "name email");
  // const transactions = await Transaction.find({ initiatedBy: user._id });
  const modelQuery = new QueryBuilder(baseQuery, query);
  // count for pagination

  const agentAllTransactions = await modelQuery
    .filter()
    .sort()
    .paginate()
    .build();
  const total = await Transaction.countDocuments({
    initiatedBy: user._id,
  });
  return {
    statusCode: StatusCodes.OK,
    status: true,
    message: `Your Transaction History`,
    data: agentAllTransactions,
    meta: {
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
    },
  };
};

const getNewAgentAccessToken = async (token: string) => {
  const isVarifiedToken = verifyToken(
    token,
    ENV.JWT_REFRESH_SECRET
  ) as JwtPayload;
  const user = await Agent.find({
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
};
// Get Profile
const getMe = async (userID: string) => {
  const user = await Agent.findById(userID);

  if (!user) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      status: false,
      message: `No User Found`,
      data: null,
    };
  }
  return {
    statusCode: StatusCodes.OK,
    status: true,
    message: `User Fetched Successfully`,
    data: user,
  };
};
const updateProfile = async (userID: string, payload: Partial<IAGENT>) => {
  const isUpdate = await Agent.findByIdAndUpdate(userID, payload, {
    new: true,
  });

  if (!isUpdate) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      status: false,
      message: `User Not Updated`,
      data: null,
    };
  }
  return {
    statusCode: StatusCodes.OK,
    status: true,
    message: `Profile Updated Successfully`,
    data: isUpdate,
  };
};

export const agent_services = {
  getPersonalWallet,
  createAGENT_service,
  cashIn_service,
  cashOut_service,
  getUser_service,
  getTranasaction_service,
  getNewAgentAccessToken,
  getMe,
  updateProfile,
};
