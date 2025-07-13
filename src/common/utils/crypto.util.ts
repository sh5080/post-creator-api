import crypto from "crypto";
import { env } from "@common/configs/env.config";

export async function hashPassword(password: string): Promise<string> {
  return crypto
    .createHash("sha256")
    .update(password + env.AUTH.SALT)
    .digest("hex");
}
