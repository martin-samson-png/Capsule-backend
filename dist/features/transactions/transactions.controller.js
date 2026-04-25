import { AppError } from "../../error/AppError.js";
import { toCamelCase } from "../../utils/formatters.js";
export class TransactionController {
    transactionService;
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    create = async (req, res, next) => {
        try {
            const accessToken = req.accessToken;
            if (!accessToken)
                return next(AppError.unauthorized("Utilisateur non authentifié"));
            const body = req.validateBody;
            const result = await this.transactionService.create({
                ...body,
                accessToken,
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
            const transactions = await this.transactionService.getByUserId({
                ...query,
                userId,
                accessToken,
            });
            const response = toCamelCase(transactions);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    };
    getById = async (req, res, next) => {
        try {
            const { id: transactionId } = req.validateParams;
            const userId = req.userId;
            const accessToken = req.accessToken;
            if (!userId || !accessToken)
                return next(AppError.unauthorized("Utilisateur non authentifié"));
            const transaction = await this.transactionService.getById({
                transactionId,
                userId,
                accessToken,
            });
            const response = toCamelCase(transaction);
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
            const { id: transactionId } = req.validateParams;
            const body = req.validateBody;
            await this.transactionService.update({
                accessToken,
                transactionId,
                ...body,
            });
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
            const { id: transactionId } = req.validateParams;
            await this.transactionService.delete(transactionId, accessToken);
            res.status(204).end();
        }
        catch (err) {
            next(err);
        }
    };
}
//# sourceMappingURL=transactions.controller.js.map