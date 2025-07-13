import { Router } from "express";
import { PostController } from "./post.controller";
import { upload } from "@common/utils/image.util";
import { authMiddleware } from "@common/middlewares/auth.middleware";

const router = Router();
const postController = new PostController();

router.post(
  "/",
  authMiddleware,
  upload.array("images"),
  postController.generatePost
);

export const postRouter = router;
