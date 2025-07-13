import { Router } from "express";
import { PostController } from "./post.controller";
import { upload } from "@common/utils/image.util";
import { authMiddleware } from "@common/middlewares/auth.middleware";

const postController = new PostController();
const postRouter: Router = Router();

postRouter.post(
  "/",
  authMiddleware,
  upload.array("images"),
  postController.generatePost
);

export { postRouter };
