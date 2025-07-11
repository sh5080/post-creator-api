import { CredentialRequest } from "./request.type";
export interface ServerEnv {
  PORT: string;
  FRONT_URL: string;
}

export interface GeminiEnv {
  API_KEY: string;
}

export interface AuthEnv {
  JWT_SECRET: string;
  SALT: string;
  VALID_CREDENTIALS: CredentialRequest[];
}

export interface AppEnv {
  SERVER: ServerEnv;
  GEMINI: GeminiEnv;
  AUTH: AuthEnv;
}
