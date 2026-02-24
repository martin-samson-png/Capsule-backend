import express from "express";
import { corsMiddleware } from "./middleware/cors";
import { router } from "./routes";
import { errorHandler } from "./middleware/handleError";
import { AppError } from "./error/AppError";
const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use("/api", router);

app.use(errorHandler);

export default app;
