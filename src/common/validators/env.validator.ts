import Joi from "joi";
import {
  AppEnv,
  AuthEnv,
  AWSEnv,
  GeminiEnv,
  ServerEnv,
} from "@common/types/env.type";

const envSchema = Joi.object<AppEnv>({
  SERVER: Joi.object<ServerEnv>({
    PORT: Joi.number().integer().min(1).max(65535).required().messages({
      "number.base": "SERVER.PORT는 숫자여야 합니다.",
      "number.integer": "SERVER.PORT는 정수여야 합니다.",
      "number.min": "SERVER.PORT는 1보다 크거나 같아야 합니다.",
      "number.max": "SERVER.PORT는 65535보다 작거나 같아야 합니다.",
      "any.required": "SERVER.PORT는 필수입니다.",
    }),
    FRONT_URL: Joi.string().uri().required().messages({
      "string.base": "SERVER.FRONT_URL은 문자열이어야 합니다.",
      "string.uri": "SERVER.FRONT_URL은 유효한 URL이어야 합니다.",
      "any.required": "SERVER.FRONT_URL은 필수입니다.",
    }),
    DB_URL: Joi.string().uri().required().messages({
      "string.base": "SERVER.DB_URL은 문자열이어야 합니다.",
      "string.uri": "SERVER.DB_URL은 유효한 URL이어야 합니다.",
      "any.required": "SERVER.DB_URL은 필수입니다.",
    }),
  }).required(),
  GEMINI: Joi.object<GeminiEnv>({
    API_KEY: Joi.string()
      .min(1)
      .required() // 최소 1자 이상 (비어있지 않은 문자열)
      .messages({
        "string.base": "GEMINI.API_KEY는 문자열이어야 합니다.",
        "string.empty": "GEMINI.API_KEY는 비어 있을 수 없습니다.",
        "any.required": "GEMINI.API_KEY는 필수입니다.",
      }),
  }).required(),
  AUTH: Joi.object<AuthEnv>({
    JWT_SECRET: Joi.string().required().messages({
      "any.required": "AUTH.JWT_SECRET는 필수입니다.",
    }),
    SALT: Joi.string().required().messages({
      "any.required": "AUTH.SALT는 필수입니다.",
    }),
    ACCESS_TOKEN_EXPIRES_IN: Joi.string().required().messages({
      "any.required": "AUTH.ACCESS_TOKEN_EXPIRES_IN은 필수입니다.",
    }),
    REFRESH_TOKEN_EXPIRES_IN: Joi.string().required().messages({
      "any.required": "AUTH.REFRESH_TOKEN_EXPIRES_IN은 필수입니다.",
    }),
  }).required(),
  AWS: Joi.object<AWSEnv>({
    BUCKET: Joi.string().required().messages({
      "any.required": "AWS.BUCKET은 필수입니다.",
    }),
    ACCESS_KEY_ID: Joi.string().required().messages({
      "any.required": "AWS.ACCESS_KEY_ID은 필수입니다.",
    }),
    SECRET_ACCESS_KEY: Joi.string().required().messages({
      "any.required": "AWS.SECRET_ACCESS_KEY은 필수입니다.",
    }),
  }).required(),
}).unknown(true); // 알 수 없는 키를 허용하려면 false로 변경 (여기서는 env.ts에 정의된 것만 검사)

/**
 * 환경 변수 객체의 유효성을 검사하고, 검증된 값을 반환합니다.
 * 유효성 검사에 실패하면 에러를 던집니다.
 * @param {AppEnv} config - 검증할 환경 변수 객체
 * @returns {AppEnv} 검증된 환경 변수 객체
 */
export const validateEnv = (config: AppEnv): AppEnv => {
  const { error, value } = envSchema.validate(config, { abortEarly: false });

  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join("; ");
    throw new Error(`환경 변수 유효성 검사 오류: ${errorMessages}`);
  }

  return value as AppEnv;
};
