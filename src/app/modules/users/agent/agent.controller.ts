import { Request, Response } from "express";
import { asyncHandller } from "../../../middlewares/async.handler";
import { sendResponse } from "../../../middlewares/sendResponse";
import { agent_services } from "./agent.service";

// Create New User
const createUser = asyncHandller(async (req: Request, res: Response) => {
  const payload = req.body; // Receiving data from client
  const isCreated = await agent_services.createAGENT_service(payload); // passing data to createUser_service
  sendResponse(res, {
    statusCode: isCreated.statusCode,
    status: isCreated.status,
    message: isCreated.message,
    data: isCreated.data,
  });
});
// Cash In
const cashIn = asyncHandller(async (req: Request, res: Response) => {
  const { phone, receiver, ammount } = req.body; // Receiving data from client
  const isCreated = await agent_services.cashIn_service(
    { phone },
    receiver,
    ammount
  ); // passing data to createUser_service
  sendResponse(res, {
    statusCode: isCreated.statusCode,
    status: isCreated.status,
    message: isCreated.message,
    data: isCreated.data,
  });
});
// Cash Out
const cashOut = asyncHandller(async (req: Request, res: Response) => {
  const { phone, sender, ammount } = req.body; // Receiving data from client
  const isCreated = await agent_services.cashOut_service(
    { phone },
    sender,
    ammount
  ); // passing data to createUser_service
  sendResponse(res, {
    statusCode: isCreated.statusCode,
    status: isCreated.status,
    message: isCreated.message,
    data: isCreated.data,
  });
});
const getUsers = asyncHandller(async (req: Request, res: Response) => {
  const isCreated = await agent_services.getUser_service();
  sendResponse(res, {
    statusCode: isCreated.statusCode,
    status: isCreated.status,
    message: isCreated.message,
    data: isCreated.data,
  });
});
const getPersonalWallet = asyncHandller(async (req: Request, res: Response) => {
  const { wallet } = req.user;
  const isCreated = await agent_services.getPersonalWallet(wallet);
  sendResponse(res, {
    statusCode: isCreated.statusCode,
    status: isCreated.status,
    message: isCreated.message,
    data: isCreated.data,
  });
});
const getPersonalTransaction = asyncHandller(
  async (req: Request, res: Response) => {
    const user = req.user;

    const isCreated = await agent_services.getTranasaction_service(user.email);
    sendResponse(res, {
      statusCode: isCreated.statusCode,
      status: isCreated.status,
      message: isCreated.message,
      data: isCreated.data,
    });
  }
);
const getAgentNewAccessToken = asyncHandller(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const getNewAccessToken = await agent_services.getNewAgentAccessToken(
      refreshToken
    );

    sendResponse(res, {
      statusCode: getNewAccessToken.statusCode,
      status: getNewAccessToken.status,
      message: getNewAccessToken.message,
      data: getNewAccessToken.data.newToken,
    });
  }
);
export const agent_controller = {
  createUser,
  cashIn,
  cashOut,
  getUsers,
  getPersonalWallet,
  getPersonalTransaction,
  getAgentNewAccessToken,
};
