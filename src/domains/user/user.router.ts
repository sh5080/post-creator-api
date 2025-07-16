import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "@common/middlewares/auth.middleware";
const userController = new UserController();
const userRouter: Router = Router();

userRouter.post("/signup", userController.signup);
userRouter.patch("/nickname", authMiddleware, userController.updateNickname);

export { userRouter };
