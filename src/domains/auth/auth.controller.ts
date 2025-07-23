import { AuthService } from "@auth/auth.service";
import { authValidator, LoginDto } from "@auth/dto/auth.dto";
import { Controller, Post, Body, Req, UseInterceptors } from "@nestjs/common";
import { TokenInterceptor } from "@common/interceptors/token.interceptor";
import { generateToken } from "@common/utils/jwt.util";
import { randomUUID } from "crypto";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UseInterceptors(TokenInterceptor)
  async login(@Body() body: LoginDto, @Req() req: any) {
    const dto = authValidator.validate(body);
    const user = await this.authService.validate(dto);

    const { accessToken, refreshToken } =
      await this.authService.generateAuthTokens(user);
    const apiToken = await generateToken({ jwt: randomUUID() });

    req.tokens = { accessToken, refreshToken };
    req.apiToken = apiToken;
    return { message: "로그인 성공" };
  }
}
