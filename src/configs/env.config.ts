import { AppEnv } from "../types/env.type";
import { validateEnv } from "../utils/validators/env.validator";
import * as dotenv from "dotenv";

// .env 파일 로드
dotenv.config();

const rawEnv = {
  SERVER: {
    PORT: process.env.PORT!,
    FRONT_URL: process.env.FRONT_URL!,
  },
  AUTH: {
    JWT_SECRET: process.env.JWT_SECRET!,
    SALT: process.env.AUTH_SALT!,
    VALID_CREDENTIALS: JSON.parse(process.env.VALID_CREDENTIALS!),
  },
  GEMINI: {
    API_KEY: process.env.GEMINI_API_KEY!,
  },
};

let validatedEnv: AppEnv;
try {
  validatedEnv = validateEnv(rawEnv);
  console.log("환경 변수 유효성 검사 성공.");
} catch (error: any) {
  console.error("환경 변수 설정 오류:", error.message);
  process.exit(1);
}

export const env = validatedEnv;
