import { Request, Response } from "express";
import { asyncHandller } from "../../middlewares/async.handler";
import { authServices } from "./auth.service";
import { sendResponse } from "../../middlewares/sendResponse";

const userLogin = asyncHandller(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response) => {
    const credentials = req.body;
    const islogin = await authServices.user_login_service(credentials);
    res.cookie("refreshToken", islogin.data.RefreshToken, {
      httpOnly: true,
      secure: false,
    });
    sendResponse(res, {
      statusCode: islogin.statusCode,
      status: islogin.status,
      message: islogin.message,
      data: islogin.data,
    });
  }
);
const agentLogin = asyncHandller(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response) => {
    const credentials = req.body;

    const islogin = await authServices.agent_login_service(credentials);
    res.cookie("refreshToken", islogin.data.RefreshToken, {
      httpOnly: true,
      secure: false,
    });
    sendResponse(res, {
      statusCode: islogin.statusCode,
      status: islogin.status,
      message: islogin.message,
      data: islogin.data,
    });
  }
);

export const authController = {
  agentLogin,
  userLogin,
};
