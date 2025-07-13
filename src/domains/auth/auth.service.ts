import { env } from "@common/configs/env.config";
import jwt from "jsonwebtoken";
import { User } from "@common/models/user.model";
import { BadRequestException } from "@common/types/response.type";
import { LoginDto } from "@auth/dto/auth.dto";
import { hashPassword } from "@common/utils/crypto.util";
export class AuthService {
  private readonly TOKEN_EXPIRES_IN = "24h";

  private async comparePassword(
    inputPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    const hashedInput = await hashPassword(inputPassword);
    return hashedInput === hashedPassword;
  }

  private async generateToken(email: string, role: string): Promise<string> {
    return jwt.sign({ email, role }, env.AUTH.JWT_SECRET, {
      expiresIn: this.TOKEN_EXPIRES_IN,
    });
  }

  async validate(dto: LoginDto) {
    const user = await User.findOne({ email: dto.email });

    if (!user || !this.comparePassword(dto.password, user.password)) {
      throw new BadRequestException(
        "이메일 또는 패스워드가 올바르지 않습니다."
      );
    }

    const token = await this.generateToken(user.email, user.role);
    return { token };
  }
}
