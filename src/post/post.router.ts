import { Router } from "express";
import { generatePostController } from "./post.controller";
import { upload } from "../utils/image.util";

export const postRouter = Router();

postRouter.post("/", upload.array("images"), generatePostController);
