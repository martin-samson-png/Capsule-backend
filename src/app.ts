import express from "express"
import { corsMiddleware } from "./middleware/cors"
const app = express()

app.use(corsMiddleware);
app.use(express.json());

export default app