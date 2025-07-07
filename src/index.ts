import express from "express";
import { env } from "./configs/env.config";
import { validateEnv } from "./utils/validators/env.validator";
import { AppEnv } from "./types/env.type";
import { modules } from "./modules";
import cors from "cors";
let validatedEnv: AppEnv;
try {
  validatedEnv = validateEnv(env);
  console.log("환경 변수 유효성 검사 성공.");
} catch (error: any) {
  console.error("환경 변수 설정 오류:", error.message);
  process.exit(1);
}

const PORT = env.SERVER.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.SERVER.FRONT_URL,
    credentials: true,
  })
);

modules(app);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
