import { Request, Response } from "express";
import { asyncHandller } from "../../middlewares/async.handler";
import { authServices } from "./auth.service";
import { sendResponse } from "../../middlewares/sendResponse";
import { StatusCodes } from "http-status-codes";

const userLogin = asyncHandller(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response) => {
    const credentials = req.body;

    const islogin = await authServices.user_login_service(credentials);
    console.log("Login Controller :", islogin);

    res.cookie("refreshToken", islogin.data.RefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("accessToken", islogin.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    sendResponse(res, {
      statusCode: islogin.statusCode,
      status: islogin.status,
      message: islogin.message,
      data: islogin.data,
    });
  }
);
const logout = asyncHandller(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: true,
    message: "User Logged Out Successfully",
    data: null,
  });
});
const agentLogin = asyncHandller(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response) => {
    const credentials = req.body;

    const islogin = await authServices.agent_login_service(credentials);
    res.cookie("refreshToken", islogin.data.RefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("accessToken", islogin.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
  logout,
};
