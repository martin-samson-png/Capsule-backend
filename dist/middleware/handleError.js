import { AppError } from "../error/AppError.js";
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError)
        return res.status(err.statusCode).json({ error: err.message });
    if (err instanceof Error) {
        return res.status(500).json({ error: "Internal server error" });
    }
    console.error("Non-Error thrown:", err);
    return res.status(500).json({ error: "Internal server error" });
};
//# sourceMappingURL=handleError.js.map