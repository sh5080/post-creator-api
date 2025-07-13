import { Express, Router } from "express";
import { authRouter } from "@auth/auth.router";
import { postRouter } from "@post/post.router";
import { userRouter } from "@user/user.router";

export const routes = (app: Express): void => {
  const apiRouter: Router = Router();

  apiRouter.use("/auth", authRouter);
  apiRouter.use("/post", postRouter);
  apiRouter.use("/user", userRouter);

  app.use("/api", apiRouter);
};
