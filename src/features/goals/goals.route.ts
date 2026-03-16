import { Router } from "express";
import { GoalsService } from "./goals.service";
import { GoalsController } from "./goals.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { validate } from "../../middleware/validate";
import { goalCreateSchema } from "../../validator/goals/create.schema";
import { goalFindSchema } from "../../validator/goals/find.schema";
import { goalUpdateSchema } from "../../validator/goals/update.schema";
import { idParamSchema } from "../../validator/common/idParams.schema";

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

export default router;
