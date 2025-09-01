import { StatusCodes } from "http-status-codes";
import { AppError } from "../helper/error.helper";
import { JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/env.config";
import { JWT } from "../utils/jwt.util";
import { NextFunction, Request, Response } from "express";
import { Role } from "../modules/users/user/user.interface";
// import { ROLE } from "../constant/role";

export const checkAuthandAuthorization =
  (...roles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("ROLES:", roles);
    console.log("Cookie:", req.cookies);
    try {
      const token =
        (req.headers.authorization as string) || req.cookies.accessToken;
      // const token = req.cookies.accessToken;
      console.log("Token :", token);

      const isValid = await JWT.verifyToken(token, ENV.JWT_SECRET);
      console.log("Validity Token  :", isValid);
      if (!isValid) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Token is not Valid");
      }
      const decoded = isValid as JwtPayload;
      console.log("Decoded data:", decoded);
      console.log(
        "Passing Role ",
        roles,
        "Decoded role",
        decoded?.role as Role
      );
      const userRole = (decoded?.role || "").trim().toUpperCase();
      const allowedRoles = roles.map((r) => r.toUpperCase());
      if (!allowedRoles.includes(userRole as Role)) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "You are Not Authorized for this route"
        );
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
