import { Request, Response } from "express";
import { AuthService } from "@auth/auth.service";
import { authValidator } from "@auth/dto/auth.dto";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    const dto = authValidator.validate(req.body);
    try {
      const { token } = await this.authService.validate(dto);
      res.json({ token });
    } catch (error) {
      throw error;
    }
  };
}
