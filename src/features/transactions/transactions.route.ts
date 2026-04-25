import { Router } from "express";
import { TransactionService } from "./transactions.service.js";
import { TransactionController } from "./transactions.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { validate } from "../../middleware/validate.js";
import { transactionCreateSchema } from "../../validator/transactions/create.schema.js";
import { transactionFindSchema } from "../../validator/transactions/find.schema.js";
import { transactionUpdateSchema } from "../../validator/transactions/update.schema.js";
import { idParamSchema } from "../../validator/common/idParams.schema.js";

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

router.get(
  "/:id",
  requireAuth,
  validate(idParamSchema, "params"),
  (req, res, next) => {
    transactionController.getById(req, res, next);
  },
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
