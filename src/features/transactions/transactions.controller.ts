import { AppError } from "../../error/AppError";
import {
  CreateTransaction,
  FindTransaction,
  TransactionService,
  UpdateTransaction,
} from "./transactions.service";
import type { Request, Response, NextFunction } from "express";

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.accessToken;

      if (!accessToken)
        return next(AppError.unauthorized("Utilisateur non authentifié"));

      const body = req.validateBody as Omit<
        CreateTransaction,
        "userId" | "accessToken"
      >;

      const result = await this.transactionService.create({
        ...body,
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

      const transactions = await this.transactionService.getByUserId({
        ...query,
        userId,
        accessToken,
      });

      res.status(200).json(transactions);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.accessToken;
      if (!accessToken)
        return next(AppError.unauthorized("Utilisateur non authentifié"));

      const { id: transactionId } = req.validateParams as { id: string };
      const body = req.validateBody as Omit<
        UpdateTransaction,
        "accessToken" | "transactionId"
      >;

      await this.transactionService.update({
        accessToken,
        transactionId,
        ...body,
      });

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.accessToken;
      if (!accessToken)
        return next(AppError.unauthorized("Utilisateur non authentifié"));

      const { id: transactionId } = req.validateParams as { id: string };

      await this.transactionService.delete(transactionId, accessToken);

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };
}
