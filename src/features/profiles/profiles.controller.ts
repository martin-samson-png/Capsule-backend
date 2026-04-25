import { AppError } from "../../error/AppError.js";
import { toCamelCase } from "../../utils/formatters.js";
import { ProfileService } from "./profiles.service.js";
import type { Request, Response, NextFunction } from "express";

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const accessToken = req.accessToken;

      if (!userId || !accessToken) {
        return next(AppError.unauthorized("Utilisateur non authentifié"));
      }

      const me = await this.profileService.getProfileByUserId(
        userId,
        accessToken,
      );

      const response = toCamelCase(me);

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getAccountByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.userId;
      const accessToken = req.accessToken;

      if (!userId || !accessToken) {
        return next(AppError.unauthorized("Utilisateur non authentifié"));
      }

      const accounts = await this.profileService.getAccountByUserId(
        userId,
        accessToken,
      );

      const response = toCamelCase(accounts);

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
