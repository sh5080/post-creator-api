import { FastifyReply } from "fastify";

export async function sendAuthTokens(
  res: FastifyReply,
  accessToken: string,
  refreshToken: string
) {
  res.header("Authorization", `Bearer ${accessToken}`);
  // 새로운 토큰 설정
  res.header(
    "Set-Cookie",
    `refreshToken=${refreshToken}; HttpOnly; Secure=${
      process.env.NODE_ENV === "production"
    }; SameSite=Strict; Max-Age=${14 * 24 * 60 * 60}`
  );
}

export async function sendActivityToken(res: FastifyReply, token: string) {
  res.header("X-A-Token", token);
}
