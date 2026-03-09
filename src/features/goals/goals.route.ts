import { Router } from "express";
import { GoalsService } from "./goals.service";
import { GoalsController } from "./goals.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { validate } from "../../middleware/validate";
import { goalCreateSchema } from "../../validator/goals/create.schema";
import { goalFindSchema } from "../../validator/goals/find.schema";

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

export default router;
