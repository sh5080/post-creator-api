import { AuthService } from "@auth/auth.service";
import { activityValidator, authValidator, LoginDto } from "@auth/dto/auth.dto";
import {
  Controller,
  Post,
  UseGuards,
  UnauthorizedException,
  Body,
  Req,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@common/guards/auth.guard";
import { AuthRequest } from "@common/types/request.type";
import { TokenInterceptor } from "@common/interceptors/token.interceptor";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UseInterceptors(TokenInterceptor)
  async login(@Body() body: LoginDto, @Req() req: any) {
    console.log(body);
    const dto = authValidator.validate(body);

    const user = await this.authService.validate(dto);
    const { accessToken, refreshToken } =
      await this.authService.generateAuthTokens(user);

    req.tokens = { accessToken, refreshToken };

    return { message: "로그인 성공" };
  }

  @Post("check")
  @UseGuards(AuthGuard)
  @UseInterceptors(TokenInterceptor)
  async checkAuth(@Req() req: any, @Body() body: any, @Query() query: any) {
    const { userId } = req.user!;
    const dto = authValidator.validate(body);
    const activityDto = activityValidator.validate(query);

    const user = await this.authService.validate(dto);
    if (user.id !== userId) {
      throw new UnauthorizedException("인증 실패");
    }

    const token = await this.authService.generateActivityToken(
      user,
      activityDto.activity
    );

    req.activityToken = token;

    return { message: "인증 성공" };
  }
}
