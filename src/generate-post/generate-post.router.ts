import { Router } from "express";
import { generatePostController } from "./generate-post.controller";
import { upload } from "../utils/image.util";

export const generatePostRouter = Router();

generatePostRouter.post("/", upload.array("images"), generatePostController);
