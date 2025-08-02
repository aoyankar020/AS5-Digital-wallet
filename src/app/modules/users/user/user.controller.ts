import { NextFunction, Request, Response } from "express";
import { asyncHandller } from "../../../middlewares/async.handler";
import { services } from "./user.service";
import { sendResponse } from "../../../middlewares/sendResponse";
import { StatusCodes } from "http-status-codes";

// Create New User
const createUser = asyncHandller(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body; // Receiving data from client
    const isCreated = await services.createUser_service(payload); // passing data to createUser_service

    if (!isCreated) {
      sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        status: false,
        message: "User not Created",
        data: null,
      });
    }
    sendResponse(res, {
      statusCode: isCreated.statusCode,
      status: isCreated.status,
      message: isCreated.message,
      data: isCreated.data,
    });
  }
);
const addMoney = asyncHandller(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user;
    if (!data) {
      sendResponse(res, {
        statusCode: StatusCodes.NON_AUTHORITATIVE_INFORMATION,
        status: false,
        message: "Login First to get Services",
        data: null,
      });
    }
    const { ammount } = req.body;
    const payload = {
      phone: data.phone,
    };

    const isCreated = await services.addMoney_service(payload, ammount);
    sendResponse(res, {
      statusCode: isCreated.statusCode,
      status: isCreated.status,
      message: isCreated.message,
      data: isCreated.data,
    });
  }
);
const withrowMoney = asyncHandller(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user;
    const { ammount } = req.body;
    const payload = {
      phone: data.phone,
    };

    const isCreated = await services.withrow_service(payload, ammount);
    sendResponse(res, {
      statusCode: isCreated.statusCode,
      status: isCreated.status,
      message: isCreated.message,
      data: isCreated.data,
    });
  }
);
const SendMoney = asyncHandller(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone, receiverphone, ammount } = req.body;
    if (phone !== req.user.phone) {
      sendResponse(res, {
        statusCode: StatusCodes.FORBIDDEN,
        status: false,
        message: "Sender Phone Number is Not Valid",
        data: null,
      });
    }
    const isCreated = await services.sendMoney_service(
      { phone },
      ammount,
      receiverphone
    );
    sendResponse(res, {
      statusCode: isCreated.statusCode,
      status: isCreated.status,
      message: isCreated.message,
      data: isCreated.data,
    });
  }
);
const getTransactions = asyncHandller(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const isCreated = await services.getTranasaction_service(user.email);
    sendResponse(res, {
      statusCode: isCreated.statusCode,
      status: isCreated.status,
      message: isCreated.message,
      data: isCreated.data,
    });
  }
);
const getPersonalWallet = asyncHandller(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const { wallet } = req.user;
    const isCreated = await services.getPersonalWallet(wallet);
    sendResponse(res, {
      statusCode: isCreated.statusCode,
      status: isCreated.status,
      message: isCreated.message,
      data: isCreated.data,
    });
  }
);

const getUserNewAccessToken = asyncHandller(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const getNewAccessToken = await services.getNewAccessToken(refreshToken);

    sendResponse(res, {
      statusCode: getNewAccessToken.statusCode,
      status: getNewAccessToken.status,
      message: getNewAccessToken.message,
      data: getNewAccessToken.data.newToken,
    });
  }
);

// for admin
const getAllUsersTransactions = asyncHandller(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const isCreated = await services.getALLUsersTranasaction_service();
    sendResponse(res, {
      statusCode: isCreated.statusCode,
      status: isCreated.status,
      message: isCreated.message,
      data: isCreated.data,
    });
  }
);

const getUsers = asyncHandller(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query || {};
    const isCreated = await services.getUser_service(
      query as Record<string, string>
    );
    sendResponse(res, {
      statusCode: isCreated.statusCode,
      status: isCreated.status,
      message: isCreated.message,
      data: isCreated.data,
    });
  }
);
const getWallets = asyncHandller(async (req: Request, res: Response) => {
  const isCreated = await services.getWallets_service();
  sendResponse(res, {
    statusCode: isCreated.statusCode,
    status: isCreated.status,
    message: isCreated.message,
    data: isCreated.data,
  });
});
const approveAgent = asyncHandller(async (req: Request, res: Response) => {
  const { phone, activeStatus, approveStatus, varifiedStatus } = req.body;
  const isCreated = await services.approve_Agent({
    phone,
    activeStatus,
    approveStatus,
    varifiedStatus,
  });
  sendResponse(res, {
    statusCode: isCreated.statusCode,
    status: isCreated.status,
    message: isCreated.message,
    data: isCreated.data,
  });
});
const blockWallet = asyncHandller(async (req: Request, res: Response) => {
  const { wallet, status } = req.body;
  const isCreated = await services.block_Wallet({ wallet, status });
  sendResponse(res, {
    statusCode: isCreated.statusCode,
    status: isCreated.status,
    message: isCreated.message,
    data: isCreated.data,
  });
});
export const controller = {
  createUser,
  getUsers,
  addMoney,
  SendMoney,
  withrowMoney,
  getTransactions,
  getAllUsersTransactions,
  getWallets,
  approveAgent,
  blockWallet,
  getPersonalWallet,
  getUserNewAccessToken,
};
