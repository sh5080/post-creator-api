import { generatePostRouter } from "./generate-post/generate-post.router";
import { Express } from "express";

export const modules = (app: Express) => {
  app.use("/generate-post", generatePostRouter);
};
