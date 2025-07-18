export interface ServerEnv {
  PORT: string;
  FRONT_URL: string;
  DB_URL: string;
}

export interface GeminiEnv {
  API_KEY: string;
}

export interface AuthEnv {
  JWT_SECRET: string;
  SALT: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
}

export interface AppEnv {
  SERVER: ServerEnv;
  GEMINI: GeminiEnv;
  AUTH: AuthEnv;
}
