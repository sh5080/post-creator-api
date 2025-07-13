import { Router } from "express";
import { UserController } from "./user.controller";

const userController = new UserController();
const userRouter: Router = Router();

userRouter.post("/signup", userController.signup);

export { userRouter };
