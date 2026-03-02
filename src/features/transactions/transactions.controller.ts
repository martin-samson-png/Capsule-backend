import { TransactionService } from "./transactions.service";
import type { Request, Response, NextFunction } from "express";

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {};
}
