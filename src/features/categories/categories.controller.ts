import { Request, Response, NextFunction } from "express";
import {
  CategoriesService,
  CreateCategory,
  UpdateCategory,
} from "./categories.service";
import { AppError } from "../../error/AppError";
import { toCamelCase } from "../../utils/formatters";

export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const accessToken = req.accessToken;

      if (!accessToken || !userId)
        return next(AppError.unauthorized("Utilisateur non authentifié"));

      const body = req.validateBody as Omit<
        CreateCategory,
        "accessToken" | "userId"
      >;

      const result = await this.categoriesService.create({
        accessToken,
        userId,
        ...body,
      });

      const response = toCamelCase(result);

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  getByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const accessToken = req.accessToken;

      if (!accessToken || !userId)
        return next(AppError.unauthorized("Utilisateur non authentifié"));

      const categories = await this.categoriesService.getByUserId(
        userId,
        accessToken,
      );

      const response = toCamelCase(categories);

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const accessToken = req.accessToken;

      if (!accessToken || !userId)
        return next(AppError.unauthorized("Utilisateur non authentifié"));

      const body = req.validateBody as Omit<
        UpdateCategory,
        "accessToken" | "userId" | "categoryId"
      >;

      const { id: categoryId } = req.validateParams as { id: string };

      const result = await this.categoriesService.update({
        accessToken,
        userId,
        categoryId,
        ...body,
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const accessToken = req.accessToken;

      if (!accessToken || !userId)
        return next(AppError.unauthorized("Utilisateur non authentifié"));

      const { id: categoryId } = req.validateParams as { id: string };

      await this.categoriesService.delete(userId, accessToken, categoryId);

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };
}
