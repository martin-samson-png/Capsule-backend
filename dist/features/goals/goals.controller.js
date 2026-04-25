import { AppError } from "../../error/AppError.js";
import { toCamelCase } from "../../utils/formatters.js";
export class GoalsController {
    goalsService;
    constructor(goalsService) {
        this.goalsService = goalsService;
    }
    create = async (req, res, next) => {
        try {
            const accessToken = req.accessToken;
            const userId = req.userId;
            if (!accessToken || !userId)
                return next(AppError.unauthorized("Utilisateur non authentifié"));
            const body = req.validateBody;
            const result = await this.goalsService.create({
                ...body,
                accessToken,
                userId,
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
            if (!userId || !accessToken)
                return next(AppError.unauthorized("Utilisateur non authentifié"));
            const query = req.validateQuery;
            const goals = await this.goalsService.getByUserId({
                ...query,
                userId,
                accessToken,
            });
            const response = toCamelCase(goals);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    };
    update = async (req, res, next) => {
        try {
            const accessToken = req.accessToken;
            if (!accessToken)
                return next(AppError.unauthorized("Utilisateur non authentifié"));
            const { id: goalId } = req.validateParams;
            const body = req.validateBody;
            await this.goalsService.update({ goalId, accessToken, ...body });
            res.status(204).end();
        }
        catch (err) {
            next(err);
        }
    };
    delete = async (req, res, next) => {
        try {
            const accessToken = req.accessToken;
            if (!accessToken)
                return next(AppError.unauthorized("Utilisateur non authentifié"));
            const { id: goalId } = req.validateParams;
            await this.goalsService.delete(goalId, accessToken);
            res.status(204).end();
        }
        catch (err) {
            next(err);
        }
    };
}
//# sourceMappingURL=goals.controller.js.map