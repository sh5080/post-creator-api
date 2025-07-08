import { Express } from "express";
import { postRouter } from "./post/post.router";
import { authRouter } from "./auth/auth.router";

export const routes = (app: Express) => {
  app.use("/post", postRouter);
  app.use("/auth", authRouter);
};
