import { JwtPayload } from "jsonwebtoken";
// eslint-disable-next-line @typescript-eslint/no-namespace

// new test
declare module "express-serve-static-core" {
  interface Request {
    user: JwtPayload;
  }
}

// declare global {
//   namespace Express {
//     interface Request {
//       user: JwtPayload;
//     }
//   }
// }
