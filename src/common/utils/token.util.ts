import { Response } from "express";

export async function sendAuthTokens(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.setHeader("Authorization", `Bearer ${accessToken}`);
  // 새로운 토큰 설정
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14일
  });
}

export async function sendActivityToken(res: Response, token: string) {
  res.setHeader("X-A-Token", token);
}
