import { AppError } from "../error/AppError.js";
export const mapPgErrorToAppError = (err) => {
    if (err.code === "23514" && err.message?.includes("chl_balance_noneg")) {
        return AppError.conflict("Fonds insuffisants sur le compte épargne.");
    }
    switch (err.code) {
        case "P0001":
            return AppError.unauthorized(err.message);
        case "P0002":
            return AppError.badRequest(err.message);
        case "P0003":
            return AppError.notFound(err.message);
        case "P0004":
            return AppError.forbidden(err.message);
        case "P0005":
            return AppError.conflict(err.message);
        case "P0006":
            return AppError.internalServer(err.message);
        case "23514":
            return AppError.badRequest("Contrainte de validation non respectée.");
        default:
            return AppError.internalServer(err.message);
    }
};
//# sourceMappingURL=error.utils.js.map