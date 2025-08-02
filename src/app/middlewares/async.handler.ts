import { NextFunction, Request, Response } from "express";
type AsyncType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
export const asyncHandller =
  (fun: AsyncType) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fun(req, res, next)).catch((error) => {
      next(error);
    });
  };
