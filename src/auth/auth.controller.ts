import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { validateAuthInput } from "../utils/validators/input.validator";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    const dto = validateAuthInput(req.body);
    try {
      const { token } = await this.authService.validate(dto);
      res.json({ token });
    } catch (error) {
      throw error;
    }
  };

  generatePassword = async (req: Request, res: Response) => {
    const dto = validateAuthInput(req.body);
    try {
      const hashedPassword = await this.authService.createPasswordHash(
        dto.password
      );

      res.json({ hashedPassword });
    } catch (error) {
      throw error;
    }
  };
}
