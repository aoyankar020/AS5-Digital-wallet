import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { GlobalError } from "./app/middlewares/error.global";
import { page_not_Found } from "./app/middlewares/error.notFound";
import { routerController } from "./app/routes/index.routes";
export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://digitalwallerfronted.vercel.app", // your frontend origin
    // origin: "https://digitalwallerfronted.vercel.app", // your frontend origin
    credentials: true, // allow cookies/authorization headers
  })
);
app.use("/api/wallet/v1", routerController);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(GlobalError);
app.use(page_not_Found);
