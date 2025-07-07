export interface ServerEnv {
  PORT: string;
  FRONT_URL: string;
}

export interface GeminiEnv {
  API_KEY: string;
}

export interface AppEnv {
  SERVER: ServerEnv;
  GEMINI: GeminiEnv;
}
