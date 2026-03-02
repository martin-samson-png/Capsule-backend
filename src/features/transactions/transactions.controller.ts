import { AppError } from "../../error/AppError";
import { TransactionService } from "./transactions.service";
import type { Request, Response, NextFunction } from "express";

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const accessToken = req.accessToken;

      if (!userId || !accessToken) {
        return next(AppError.unauthorized("Utilisateur non authentifié"));
      }

      const result = await this.transactionService.create({
        ...req.body,
        userId,
        accessToken,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
}
