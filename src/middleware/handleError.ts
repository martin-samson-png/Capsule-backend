import type { Request, Response, NextFunction } from "express";
import { AppError } from "../error/AppError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError)
    return res.status(err.statusCode).json({ error: err.message });
  if (err instanceof Error) {
    return res.status(500).json({ error: "Internal server error" });
  }
  console.error("Non-Error thrown:", err);
  return res.status(500).json({ error: "Internal server error" });
};
