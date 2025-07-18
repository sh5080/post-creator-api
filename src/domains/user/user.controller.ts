import { UserService } from "./user.service";
import {
  createUserValidator,
  updateNicknameValidator,
  UpdateNicknameResponseDto,
  updatePasswordValidator,
  UpdatePasswordResponseDto,
  CreateUserDto,
} from "./dto/user.dto";
import { AuthRequest } from "@common/types/request.type";
import { AuthService } from "@auth/auth.service";
import {
  Controller,
  Post,
  Req,
  Body,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@common/guards/auth.guard";
import { TokenInterceptor } from "@common/interceptors/token.interceptor";

@Controller("api/users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post("signup")
  async signup(@Body() body: CreateUserDto) {
    const dto = createUserValidator.validate(body);
    const user = await this.userService.createUser(dto);

    return {
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  @Post("update-nickname")
  @UseGuards(AuthGuard)
  @UseInterceptors(TokenInterceptor)
  async updateNickname(@Req() req: AuthRequest, @Body() body: any) {
    const dto = updateNicknameValidator.validate(body);
    const { userId } = req.user!;
    const user = await this.userService.updateNickname(userId, dto);

    // 새로운 토큰 생성
    const { accessToken, refreshToken } =
      await this.authService.generateAuthTokens(user);

    const responseDto: UpdateNicknameResponseDto = {
      nickname: user.nickname,
      updatedAt: user.updatedAt,
    };

    req.user!.tokens = { accessToken, refreshToken };

    return responseDto;
  }

  @Post("update-password")
  @UseGuards(AuthGuard)
  @UseInterceptors(TokenInterceptor)
  async updatePassword(@Req() req: AuthRequest, @Body() body: any) {
    const dto = updatePasswordValidator.validate(body);
    const { userId } = req.user!;
    const user = await this.userService.updatePassword(userId, dto);

    // 새로운 토큰 생성
    const { accessToken, refreshToken } =
      await this.authService.generateAuthTokens(user);

    const responseDto: UpdatePasswordResponseDto = {
      updatedAt: user.updatedAt,
    };

    req.user!.tokens = { accessToken, refreshToken };
    return responseDto;
  }

  @Post("delete")
  @UseGuards(AuthGuard)
  async deleteUser(@Req() req: AuthRequest) {
    const { userId } = req.user!;
    await this.userService.deleteUser(userId);

    return { message: "사용자가 성공적으로 삭제되었습니다." };
  }
}
