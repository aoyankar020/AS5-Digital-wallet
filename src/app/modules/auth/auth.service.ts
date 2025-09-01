import { User } from "../users/user/user.model";
import { StatusCodes } from "http-status-codes";
import { matched } from "../../utils/isValidPass.util";

import { ENV } from "../../config/env.config";
import { JWT } from "../../utils/jwt.util";

import { IUSER } from "../users/user/user.interface";
import { IAGENT } from "../users/agent/agent.interface";
import { Agent } from "../users/agent/agent.model";
import { AppError } from "../../helper/error.helper";
import { createAgentTokens, createUserTokens } from "../../utils/userToken";

const user_login_service = async (payload: Partial<IUSER>) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(StatusCodes.BAD_GATEWAY, "User not valid");
  }
  const isMatched = await matched(payload.password as string, user);

  if (!isMatched) {
    throw new AppError(StatusCodes.BAD_GATEWAY, "Passnot matched");
  }
  const {
    password,

    ...userWithoutPassword
  } = user.toObject();
  const jwtPayload = { ...userWithoutPassword };

  const tokens = await createUserTokens(jwtPayload);

  if (!tokens.token) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Access Token is not Created Successfully"
    );
  }
  if (!tokens.refreshToken) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Refresh Token is not Created Successfully"
    );
  }

  return {
    statusCode: StatusCodes.OK,
    status: true,
    message: "login Successfully ",
    data: {
      accessToken: tokens.token,
      RefreshToken: tokens.refreshToken,
      data: userWithoutPassword,
    },
  };
};
const agent_login_service = async (payload: Partial<IAGENT>) => {
  const user = await Agent.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Not Valid");
  }
  const isMatched = await matched(payload.password as string, user);
  console.log("Password ", isMatched);
  console.log("Password ", payload.password);
  if (!isMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password Not Matched");
  }
  const { password, ...userWithoutPassword } = user.toObject();
  const jwtPayload = { ...userWithoutPassword };

  const tokens = await createAgentTokens(jwtPayload);
  if (!tokens.token) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Access Token is not Created Successfully"
    );
  }
  if (!tokens.refreshToken) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Refresh Token is not Created Successfully"
    );
  }

  return {
    statusCode: StatusCodes.OK,
    status: true,
    message: "login Successfully ",
    data: {
      accessToken: tokens.token,
      RefreshToken: tokens.refreshToken,
      data: userWithoutPassword,
    },
  };
};

export const authServices = {
  user_login_service,
  agent_login_service,
};
