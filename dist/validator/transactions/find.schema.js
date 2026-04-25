import Joi from "joi";
export const transactionFindSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        "number.base": "page doit être un nombre",
        "number.integer": "page doit être un entier",
        "number.min": "page doit être >= 1",
    }),
    limit: Joi.number().integer().min(1).max(50).default(20).messages({
        "number.base": "limit doit être un nombre",
        "number.integer": "limit doit être un entier",
        "number.min": "limit doit être >= 1",
        "number.max": "limit ne doit pas dépasser 50",
    }),
    accountId: Joi.string().uuid().optional().messages({
        "string.base": "categoryId doit être une chaîne",
        "string.guid": "categoryId doit être un UUID valide.",
    }),
    categoryId: Joi.string().uuid().optional().messages({
        "string.base": "categoryId doit être une chaîne",
        "string.guid": "categoryId doit être un UUID valide.",
    }),
    from: Joi.date().iso().optional().messages({
        "date.base": "La date est invalide.",
        "date.format": "La date doit être au format ISO.",
    }),
    to: Joi.date().iso().optional().messages({
        "date.base": "La date est invalide.",
        "date.format": "La date doit être au format ISO.",
    }),
    type: Joi.string()
        .valid("income", "expense", "transfer", "contribution")
        .optional()
        .messages({
        "string.base": "type doit être une chaîne",
        "any.only": "type invalide",
    }),
    sortBy: Joi.string()
        .valid("category", "createdAt", "date")
        .default("date")
        .messages({
        "string.base": "sortBy doit être une chaîne",
        "any.only": "sortBy invalide",
    }),
    sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
        "string.base": "sortOrder doit être une chaîne",
        "any.only": "sortOrder doit être 'asc' ou 'desc'",
    }),
})
    .custom((value, helpers) => {
    const { from, to } = value;
    if (from && to && from > to)
        return helpers.error("any.custom");
    return value;
})
    .messages({ "any.custom": '"from" doit être <= "to"' });
//# sourceMappingURL=find.schema.js.map