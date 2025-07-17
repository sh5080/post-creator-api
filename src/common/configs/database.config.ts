import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env.config";

const pool = new Pool({
  connectionString: env.SERVER.DB_URL,
});

export const db = drizzle(pool);

// 연결 확인
pool
  .connect()
  .then(() => console.log("Neon DB 연결 성공"))
  .catch((error) => {
    console.error("Neon DB 연결 실패:", error);
    process.exit(1);
  });
