import { Router } from "express";
import { PostController } from "./post.controller";
import { upload } from "../utils/image.util";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const postController = new PostController();

router.post(
  "/",
  authMiddleware,
  upload.array("images"),
  postController.generatePost
);

export const postRouter = router;
