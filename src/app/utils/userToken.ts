import { StatusCodes } from "http-status-codes";
import { ENV } from "../config/env.config";
import { IUSER } from "../modules/users/user/user.interface";
import { JWT } from "./jwt.util";
import { AppError } from "../helper/error.helper";

export const createUserTokens = async (jwtPayload: Partial<IUSER>) => {
  const token = await JWT.generateToken(
    jwtPayload,
    ENV.JWT_SECRET,
    ENV.JWT_EXPIRE
  );
  const refreshToken = await JWT.generateToken(
    jwtPayload,
    ENV.JWT_REFRESH_SECRET,
    ENV.JWT_REFRESH_EXPIRE
  );
  if (!token) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Access Token is not Created Successfully"
    );
  }
  if (!refreshToken) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Refresh Token is not Created Successfully"
    );
  }
  return {
    token,
    refreshToken,
  };
};

export const createAgentTokens = async (jwtPayload: Partial<IUSER>) => {
  const token = await JWT.generateToken(
    jwtPayload,
    ENV.JWT_SECRET,
    ENV.JWT_EXPIRE
  );
  const refreshToken = await JWT.generateToken(
    jwtPayload,
    ENV.JWT_REFRESH_SECRET,
    ENV.JWT_REFRESH_EXPIRE
  );
  if (!token) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Access Token is not Created Successfully"
    );
  }
  if (!refreshToken) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Refresh Token is not Created Successfully"
    );
  }
  return {
    token,
    refreshToken,
  };
};
