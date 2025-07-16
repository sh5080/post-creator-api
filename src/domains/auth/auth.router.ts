import { Router } from "express";
import { AuthController } from "@auth/auth.controller";

const authController = new AuthController();
const authRouter: Router = Router();

authRouter.post("/login", authController.login);
authRouter.post("/check", authController.checkAuth);

export { authRouter };
