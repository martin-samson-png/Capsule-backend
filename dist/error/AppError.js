export class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
    static badRequest(message) {
        return new AppError(400, message);
    }
    static unauthorized(message) {
        return new AppError(401, message);
    }
    static forbidden(message) {
        return new AppError(403, message);
    }
    static notFound(message) {
        return new AppError(404, message);
    }
    static conflict(message) {
        return new AppError(409, message);
    }
    static internalServer(message) {
        return new AppError(500, message);
    }
}
//# sourceMappingURL=AppError.js.map