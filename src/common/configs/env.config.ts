import { AppEnv } from "@common/types/env.type";
import { validateEnv } from "@common/validators/env.validator";
import * as dotenv from "dotenv";

// .env 파일 로드
dotenv.config();

const rawEnv = {
  SERVER: {
    PORT: process.env.PORT!,
    FRONT_URL: process.env.FRONT_URL!,
    MONGODB_URI: process.env.MONGODB_URI!,
  },
  GEMINI: {
    API_KEY: process.env.GEMINI_API_KEY!,
  },
  AUTH: {
    JWT_SECRET: process.env.JWT_SECRET!,
    SALT: process.env.AUTH_SALT!,
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
