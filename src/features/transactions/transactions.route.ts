import { Router } from "express";
import { TransactionService } from "./transactions.service";
import { TransactionController } from "./transactions.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { validate } from "../../middleware/validate";
import {
  transactionCreateSchema,
  transactionFindSchema,
} from "../../validator/transactions/transactions.schema";
import { idParamSchema } from "../../validator/common/idParams.schema";

const router = Router();

const transactionService = new TransactionService();
const transactionController = new TransactionController(transactionService);

router.post(
  "/create",
  requireAuth,
  validate(transactionCreateSchema),
  (req, res, next) => transactionController.create(req, res, next),
);

router.get(
  "/:id",
  requireAuth,
  validate(transactionFindSchema, "query"),
  validate(idParamSchema, "params"),
  (req, res, next) => transactionController.getByUserId(req, res, next),
);

export default router;
