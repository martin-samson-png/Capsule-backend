import Joi from "joi";
export const goalFindSchema = Joi.object({
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
    label: Joi.string().optional().min(1).messages({
        "string.base": "Le libellé doit être une chaîne de caractere",
        "string.empty": "Le libellé ne peut pas être vide",
        "string.min": "Le libellé doit contenir au moins 1 caractère.",
    }),
    status: Joi.string()
        .valid("active", "completed", "archived")
        .optional()
        .messages({
        "string.base": "Le status doit être une chaîne de caractere",
        "any.only": "Status invalide",
    }),
    deadlineFrom: Joi.date().iso().optional().messages({
        "date.base": "La date est invalide.",
        "date.format": "La date doit être au format ISO.",
    }),
    deadlineTo: Joi.date().iso().optional().messages({
        "date.base": "La date est invalide.",
        "date.format": "La date doit être au format ISO.",
    }),
    sortBy: Joi.string()
        .valid("createdAt", "deadline", "targetAmount")
        .default("createdAt")
        .optional()
        .messages({
        "string.base": "SortBy doit être une chaîne de caractere",
        "any.only": "SortBy invalide",
    }),
    sortOrder: Joi.string().valid("asc", "desc").default("asc").messages({
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