import express from "express";
import { env } from "./configs/env.config";
import { routes } from "./routes";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
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

routes(app);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
