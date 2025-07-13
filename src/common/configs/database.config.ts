import mongoose from "mongoose";
import { env } from "./env.config";

export async function connectDatabase() {
  try {
    await mongoose.connect(env.SERVER.MONGODB_URI);
    console.log("MongoDB 연결 성공");
  } catch (error) {
    console.error("MongoDB 연결 실패:", error);
    process.exit(1);
  }
}

mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 에러:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB 연결이 끊어졌습니다. 재연결을 시도합니다.");
  connectDatabase();
});
