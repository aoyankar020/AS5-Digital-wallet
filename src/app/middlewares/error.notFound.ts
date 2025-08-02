import { Request, Response } from "express";

export const page_not_Found = (req: Request, res: Response) => {
  res.send({
    status: false,
    code: 404,
    message: "Page Not Found",
  });
};
