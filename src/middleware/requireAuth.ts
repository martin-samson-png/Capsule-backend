import { supabase } from "../config/supabase";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../error/AppError";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) res.status(401).json({ error: "Token inextistant" });
    const { data, error } = await supabase.auth.getUser(token);

    if (!data || error) {
      throw AppError.unauthorized("Token manquant");
    }

    next();
  } catch {
    next();
  }
};
