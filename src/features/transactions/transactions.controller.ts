import { AppError } from "../../error/AppError";
import {
  CreateTransaction,
  FindTransaction,
  TransactionService,
} from "./transactions.service";
import type { Request, Response, NextFunction } from "express";

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const accessToken = req.accessToken;

      if (!userId || !accessToken)
        return next(AppError.unauthorized("Utilisateur non authentifié"));

      const body = req.validateBody as Omit<
        CreateTransaction,
        "userId" | "accessToken"
      >;

      const result = await this.transactionService.create({
        ...body,
        userId,
        accessToken,
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
        FindTransaction,
        "userId" | "accessToken" | "accountId"
      >;

      const { id: accountId } = req.validateParams as { id: string };

      const transactions = await this.transactionService.getByUserId({
        ...query,
        accountId,
        userId,
        accessToken,
      });

      res.status(200).json(transactions);
    } catch (err) {
      next(err);
    }
  };
}
