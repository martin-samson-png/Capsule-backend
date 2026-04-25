import { AppError } from "../../error/AppError.js";
import { toCamelCase } from "../../utils/formatters.js";
export class CategoriesController {
    categoriesService;
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    create = async (req, res, next) => {
        try {
            const userId = req.userId;
            const accessToken = req.accessToken;
            if (!accessToken || !userId)
                return next(AppError.unauthorized("Utilisateur non authentifié"));
            const body = req.validateBody;
            const result = await this.categoriesService.create({
                accessToken,
                userId,
                ...body,
            });
            const response = toCamelCase(result);
            res.status(201).json(response);
        }
        catch (err) {
            next(err);
        }
    };
    getByUserId = async (req, res, next) => {
        try {
            const userId = req.userId;
            const accessToken = req.accessToken;
            if (!accessToken || !userId)
                return next(AppError.unauthorized("Utilisateur non authentifié"));
            const categories = await this.categoriesService.getByUserId(userId, accessToken);
            const response = toCamelCase(categories);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    };
    update = async (req, res, next) => {
        try {
            const userId = req.userId;
            const accessToken = req.accessToken;
            if (!accessToken || !userId)
                return next(AppError.unauthorized("Utilisateur non authentifié"));
            const body = req.validateBody;
            const { id: categoryId } = req.validateParams;
            const result = await this.categoriesService.update({
                accessToken,
                userId,
                categoryId,
                ...body,
            });
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    };
    delete = async (req, res, next) => {
        try {
            const userId = req.userId;
            const accessToken = req.accessToken;
            if (!accessToken || !userId)
                return next(AppError.unauthorized("Utilisateur non authentifié"));
            const { id: categoryId } = req.validateParams;
            await this.categoriesService.delete(userId, accessToken, categoryId);
            res.status(204).end();
        }
        catch (err) {
            next(err);
        }
    };
}
//# sourceMappingURL=categories.controller.js.map