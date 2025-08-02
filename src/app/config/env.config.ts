import dotenv from "dotenv";

dotenv.config();

interface IENV {
  DB_URL: string;
  SERVER_PORT: string;
  NODE_ENV: "development" | "production";
  JWT_SECRET: string;
  SALT_ROUND: number;
  JWT_EXPIRE: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  ADMIN_PHONE: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRE: string;
}
const loadEnv = (): IENV => {
  const ENVS = [
    "DB_URL",
    "SERVER_PORT",
    "NODE_ENV",
    "JWT_SECRET",
    "SALT_ROUND",
    "JWT_EXPIRE",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "ADMIN_PHONE",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRE",
  ];
  ENVS.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing Required Environment Variable: ${key}`);
    }
  });
  return {
    DB_URL: process.env.DB_URL as string,
    SERVER_PORT: process.env.SERVER_PORT as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRE: process.env.JWT_EXPIRE as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    ADMIN_PHONE: process.env.ADMIN_PHONE as string,
    SALT_ROUND: Number(process.env.SALT_ROUND),
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const ENV: IENV = loadEnv();
