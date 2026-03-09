import { Request, Response, NextFunction } from "express";
import { CreateGoal, FindGoal, GoalsService } from "./goals.service";
import { AppError } from "../../error/AppError";

export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.accessToken;
      const userId = req.userId;

      if (!accessToken || !userId)
        return next(AppError.unauthorized("Utilisateur non authentifié"));

      const body = req.validateBody as Omit<
        CreateGoal,
        "accessToken" | "userId"
      >;

      const result = await this.goalsService.create({
        ...body,
        accessToken,
        userId,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  getByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const accessToken = req.accessToken;

      if (!userId || !accessToken)
        return next(AppError.unauthorized("Utilisateur non authentifié"));

      const query = req.validateQuery as Omit<
        FindGoal,
        "userId" | "accessToken"
      >;

      const goals = await this.goalsService.getByUserId({
        ...query,
        userId,
        accessToken,
      });

      res.status(200).json(goals);
    } catch (err) {
      next(err);
    }
  };
}
