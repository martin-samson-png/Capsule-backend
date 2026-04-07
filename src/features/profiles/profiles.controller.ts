import { AppError } from "../../error/AppError";
import { ProfileService } from "./profiles.service";
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
      res.status(200).json(me);
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
      res.status(200).json(accounts);
    } catch (err) {
      next(err);
    }
  };
}
