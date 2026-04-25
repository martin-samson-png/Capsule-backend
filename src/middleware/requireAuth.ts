import { supabase } from "../config/supabase.js";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../error/AppError.js";

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return next(AppError.unauthorized("Token manquant"));
    const token = req.headers.authorization?.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);
    if (!data || error) {
      return next(AppError.unauthorized("Token manquant ou expiré"));
    }
    req.userId = data.user.id;
    req.accessToken = token;
    return next();
  } catch (err) {
    return next(err);
  }
};
