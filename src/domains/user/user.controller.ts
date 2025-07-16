import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import {
  createUserValidator,
  CreateUserResponseDto,
  updateNicknameValidator,
  UpdateNicknameResponseDto,
} from "./dto/user.dto";
import { AuthRequest } from "@common/types/request.type";
import { AuthService } from "@auth/auth.service";
import { sendAuthTokens } from "@common/utils/token.util";

export class UserController {
  private userService: UserService;
  private authService: AuthService;
  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = createUserValidator.validate(req.body);
      const user = await this.userService.createUser(dto);

      const responseDto: CreateUserResponseDto = {
        email: user.email,
        createdAt: user.createdAt,
      };

      res.status(201).json(responseDto);
    } catch (error) {
      next(error);
    }
  };
  updateNickname = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = updateNicknameValidator.validate(req.body);
      const { userId } = req.user!;
      const user = await this.userService.updateNickname(userId, dto);
      const responseDto: UpdateNicknameResponseDto = {
        nickname: user.nickname,
        updatedAt: user.updatedAt,
      };
      const { accessToken, refreshToken } =
        await this.authService.generateAuthTokens(user);

      await sendAuthTokens(res, accessToken, refreshToken);

      res.status(200).json(responseDto);
    } catch (error) {
      next(error);
    }
  };
}
