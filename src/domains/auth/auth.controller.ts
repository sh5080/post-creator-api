import { Request, Response, NextFunction } from "express";
import { AuthService } from "@auth/auth.service";
import { activityValidator, authValidator } from "@auth/dto/auth.dto";
import { sendActivityToken, sendAuthTokens } from "@common/utils/token.util";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    const dto = authValidator.validate(req.body);
    try {
      const user = await this.authService.validate(dto);
      const { accessToken, refreshToken } =
        await this.authService.generateAuthTokens(user);

      await sendAuthTokens(res, accessToken, refreshToken);
      res.json({ message: "로그인 성공" });
    } catch (error) {
      next(error);
    }
  };

  checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const dto = authValidator.validate(req.body);
    const activityDto = activityValidator.validate(req.query);
    try {
      const user = await this.authService.validate(dto);
      const token = await this.authService.generateActivityToken(
        user,
        activityDto.activity
      );

      await sendActivityToken(res, token);
      res.json({ message: "인증 성공" });
    } catch (error) {
      next(error);
    }
  };
}
