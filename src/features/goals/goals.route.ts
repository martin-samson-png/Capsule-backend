import { Router } from "express";
import { GoalsService } from "./goals.service.js";
import { GoalsController } from "./goals.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { validate } from "../../middleware/validate.js";
import { goalCreateSchema } from "../../validator/goals/create.schema.js";
import { goalFindSchema } from "../../validator/goals/find.schema.js";
import { goalUpdateSchema } from "../../validator/goals/update.schema.js";
import { idParamSchema } from "../../validator/common/idParams.schema.js";

const goalsService = new GoalsService();
const goalsController = new GoalsController(goalsService);

const router = Router();

router.post(
  "/create",
  requireAuth,
  validate(goalCreateSchema),
  (req, res, next) => {
    goalsController.create(req, res, next);
  },
);

router.get(
  "/",
  requireAuth,
  validate(goalFindSchema, "query"),
  (req, res, next) => goalsController.getByUserId(req, res, next),
);

router.patch(
  "/:id",
  requireAuth,
  validate(goalUpdateSchema),
  validate(idParamSchema, "params"),
  (req, res, next) => goalsController.update(req, res, next),
);

router.delete(
  "/:id",
  requireAuth,
  validate(idParamSchema, "params"),
  (req, res, next) => goalsController.delete(req, res, next),
);

export default router;
