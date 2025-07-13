import express from "express";
import { env } from "@common/configs/env.config";
import { routes } from "./routes";
import cors from "cors";
import { errorMiddleware } from "@common/middlewares/error.middleware";
import { connectDatabase } from "@common/configs/database.config";

const PORT = env.SERVER.PORT;

async function startServer() {
  try {
    await connectDatabase();

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
      cors({
        origin: env.SERVER.FRONT_URL,
        credentials: true,
      })
    );

    routes(app);
    app.use(errorMiddleware);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("서버 시작 실패:", error);
    process.exit(1);
  }
}

startServer();
