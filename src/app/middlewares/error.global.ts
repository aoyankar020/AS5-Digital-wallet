import { NextFunction, Request, Response } from "express";
import { ENV } from "../config/env.config";
import { AppError } from "../helper/error.helper";

export const GlobalError = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statuscode = 500;
  let message = "Global Error :";
  if (err instanceof AppError) {
    statuscode = err.code;
    message = err.message;
  }
  res.send({
    statuscode: statuscode,
    status: false,
    message: `${message} ${err?.message}`,
    Error: err,
    stack: ENV.NODE_ENV === "development" ? err.stack : null,
  });
};
