import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { validate } from "../../middleware/validate";
import { categoryCreateSchema } from "../../validator/categories/create.schema";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { idParamSchema } from "../../validator/common/idParams.schema";
import { categoryUpdateSchema } from "../../validator/categories/update.schema";

const router = Router();

const categoryService = new CategoriesService();

const categoriesController = new CategoriesController(categoryService);

router.post(
  "/",
  requireAuth,
  validate(categoryCreateSchema),
  (req, res, next) => categoriesController.create(req, res, next),
);

router.get("/", requireAuth, (req, res, next) =>
  categoriesController.getByUserId(req, res, next),
);

router.patch(
  "/:id",
  requireAuth,
  validate(idParamSchema, "params"),
  validate(categoryUpdateSchema),
  (req, res, next) => categoriesController.update(req, res, next),
);

router.delete(
  "/:id",
  requireAuth,
  validate(idParamSchema, "params"),
  (req, res, next) => categoriesController.delete(req, res, next),
);

export default router;
