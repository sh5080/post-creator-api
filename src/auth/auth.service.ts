import jwt from "jsonwebtoken";
import crypto from "crypto";
import { BadRequestException } from "../types/response.type";
import { env } from "../configs/env.config";
import { CredentialRequest } from "../types/request.type";

export class AuthService {
  private readonly TOKEN_EXPIRES_IN = "24h";

  private hashPassword(password: string): string {
    return crypto
      .createHash("sha256")
      .update(password + env.AUTH.SALT)
      .digest("hex");
  }

  private generateToken(email: string, role: string): string {
    return jwt.sign({ email, role }, env.AUTH.JWT_SECRET, {
      expiresIn: this.TOKEN_EXPIRES_IN,
    });
  }

  async validate(dto: CredentialRequest) {
    const credential = env.AUTH.VALID_CREDENTIALS.find(
      (cred) => cred.email === dto.email
    );

    if (
      !credential ||
      this.hashPassword(dto.password) !== credential.password
    ) {
      throw new BadRequestException(
        "이메일 또는 패스워드가 올바르지 않습니다."
      );
    }

    const token = this.generateToken(dto.email, credential.role!);
    return { token };
  }

  async createPasswordHash(password: string) {
    return this.hashPassword(password);
  }
}
