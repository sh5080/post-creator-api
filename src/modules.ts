import { postRouter } from "./post/post.router";
import { Express } from "express";

export const modules = (app: Express) => {
  app.use("/post", postRouter);
};
