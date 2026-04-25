import { Response, Request, NextFunction, Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { validate } from "../../middleware/validate.js";
import { categoryCreateSchema } from "../../validator/categories/create.schema.js";
import { CategoriesService } from "./categories.service.js";
import { CategoriesController } from "./categories.controller.js";
import { idParamSchema } from "../../validator/common/idParams.schema.js";
import { categoryUpdateSchema } from "../../validator/categories/update.schema.js";

const router = Router();

const categoryService = new CategoriesService();

const categoriesController = new CategoriesController(categoryService);

router.post(
  "/",
  requireAuth,
  validate(categoryCreateSchema),
  (req: Request, res: Response, next: NextFunction) =>
    categoriesController.create(req, res, next),
);

router.get(
  "/",
  requireAuth,
  (req: Request, res: Response, next: NextFunction) =>
    categoriesController.getByUserId(req, res, next),
);

router.patch(
  "/:id",
  requireAuth,
  validate(idParamSchema, "params"),
  validate(categoryUpdateSchema),
  (req: Request, res: Response, next: NextFunction) =>
    categoriesController.update(req, res, next),
);

router.delete(
  "/:id",
  requireAuth,
  validate(idParamSchema, "params"),
  (req: Request, res: Response, next: NextFunction) =>
    categoriesController.delete(req, res, next),
);

export default router;
