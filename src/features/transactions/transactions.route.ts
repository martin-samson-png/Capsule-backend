import { Router } from "express";
import { TransactionService } from "./transactions.service";
import { TransactionController } from "./transactions.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { validate } from "../../middleware/validate";
import { transactionCreateSchema } from "../../validator/transactions/create.schema";
import { transactionFindSchema } from "../../validator/transactions/find.schema";
import { transactionUpdateSchema } from "../../validator/transactions/update.schema";
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
  "/",
  requireAuth,
  validate(transactionFindSchema, "query"),
  (req, res, next) => transactionController.getByUserId(req, res, next),
);

router.patch(
  "/:id",
  requireAuth,
  validate(transactionUpdateSchema),
  validate(idParamSchema, "params"),
  (req, res, next) => {
    transactionController.update(req, res, next);
  },
);

router.delete(
  "/:id",
  requireAuth,
  validate(idParamSchema, "params"),
  (req, res, next) => {
    transactionController.delete(req, res, next);
  },
);

export default router;
