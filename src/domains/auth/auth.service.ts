import { User } from "@common/models/user.model";
import { LoginDto } from "@auth/dto/auth.dto";
import { generateAccessToken, generateToken } from "@common/utils/jwt.util";
import * as bcrypt from "bcrypt";
import { generateRefreshToken } from "@common/utils/jwt.util";
import { UserRepository } from "@user/user.repository";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}
  async validate(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다."
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다."
      );
    }

    return user;
  }
  async generateAuthTokens(user: typeof User.$inferSelect) {
    const accessToken = await generateAccessToken({
      userId: user.id,
      nickname: user.nickname,
    });
    const refreshToken = await generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }
}
