import Joi from "joi";
export const goalCreateSchema = Joi.object({
    label: Joi.string().required().min(1).messages({
        "any.required": "Le libellé est obligatoire",
        "string.empty": "Le libellé ne peut pas être vide",
        "string.min": "Le libellé doit contenir au moins 1 caractère.",
    }),
    targetAmount: Joi.number().positive().required().messages({
        "any.required": "Le montant à atteindre est obligatoire.",
        "number.base": "Le montant à atteindre doit être un nombre.",
        "number.positive": "Le montant à atteindre doit être supérieur à 0.",
    }),
    deadline: Joi.date().iso().greater("now").required().messages({
        "any.required": "La date est obligatoire.",
        "date.base": "La date est invalide.",
        "date.format": "La date doit être au format ISO.",
        "date.greater": "La date doit être dans le futur",
    }),
});
//# sourceMappingURL=create.schema.js.map