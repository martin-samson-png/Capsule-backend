import cors from "cors";
import { env } from "../config/env.js";
export const corsMiddleware = cors({
    origin: env.FRONT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
});
//# sourceMappingURL=cors.js.map