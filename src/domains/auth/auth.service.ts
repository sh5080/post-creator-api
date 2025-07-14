import { User } from "@common/models/user.model";
import { UnauthorizedException } from "@common/types/response.type";
import { LoginDto } from "@auth/dto/auth.dto";
import { generateAccessToken } from "@common/utils/jwt.util";
import * as bcrypt from "bcrypt";
import { generateRefreshToken } from "@common/utils/jwt.util";

export class AuthService {
  async validate(dto: LoginDto) {
    const user = await User.findOne({ email: dto.email });

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

    const accessToken = await generateAccessToken({
      userId: user._id.toString(),
      nickname: user.nickname,
      role: user.role,
    });

    const refreshToken = await generateRefreshToken(user._id.toString());

    return { accessToken, refreshToken };
  }
}
