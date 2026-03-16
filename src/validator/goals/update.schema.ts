import Joi from "joi";

export const goalUpdateSchema = Joi.object({
  label: Joi.string().min(1).optional().messages({
    "string.base": "Le libellé doit être une chaîne de caractere",
    "string.empty": "Le libellé ne peut pas être vide",
    "string.min": "Le libellé doit contenir au moins 1 caractère.",
  }),
  targetAmount: Joi.number().positive().optional().messages({
    "number.base": "Le montant à atteindre doit être un nombre.",
    "number.positive": "Le montant à atteindre doit être supérieur à 0.",
  }),
  deadline: Joi.date().iso().greater("now").optional().messages({
    "date.base": "La deadline est invalide.",
    "date.format": "La deadline doit être au format ISO.",
    "date.less": "La deadline doit être dans le futur",
  }),
})
  .min(1)
  .messages({ "object.min": "Aucun champ à mettre à jour" });
