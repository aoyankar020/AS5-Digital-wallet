import { Response } from "express";
interface TMeta {
  total?: number; // Total number of items (for paginated responses)
}
interface IInfo<T> {
  statusCode: number;
  message: string;
  status: boolean;
  data: T;
  error?: string; // Optional error message
  meta?: TMeta;
}

export const sendResponse = <T>(res: Response, info: IInfo<T>) => {
  res.status(info.statusCode).json({
    statusCode: info.statusCode,
    success: info.status,
    message: info.message,
    data: info.data,
    error: info.error,
    meta: info.meta,
  });
};
