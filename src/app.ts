import express from "express";
import { corsMiddleware } from "./middleware/cors.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middleware/handleError.js";
const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use("/api", router);

app.use(errorHandler);

export default app;
