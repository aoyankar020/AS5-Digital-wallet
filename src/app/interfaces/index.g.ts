import { JwtPayload } from "jsonwebtoken";
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
