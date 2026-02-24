import { Router } from "express";
import { TransactionService } from "../services/transactions.service";
import { TransactionController } from "./../controllers/transactions.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

const transactionService = new TransactionService();
const transactionController = new TransactionController(transactionService);

router.post("/create", requireAuth, (req, res, next) =>
  transactionController.create(req, res, next),
);

export default router;
