import { Router } from "express";
import { AuthController } from "@auth/auth.controller";

const router = Router();
const authController = new AuthController();

router.post("/login", authController.login);

export const authRouter = router;
