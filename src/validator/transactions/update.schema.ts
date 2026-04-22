import Joi from "joi";

export const transactionUpdateSchema = Joi.object({
  amount: Joi.number().positive().optional().messages({
    "number.base": "Le montant doit être un nombre.",
    "number.positive": "Le montant doit être supérieur à 0.",
  }),
  date: Joi.date().iso().less("now").optional().messages({
    "date.base": "La date est invalide.",
    "date.format": "La date doit être au format ISO.",
    "date.less": "La date doit être dans le passé",
  }),
  categoryId: Joi.string().uuid().allow(null).optional().messages({
    "string.base": "categoryId doit être une chaîne de caractères.",
    "string.guid": "categoryId doit être un UUID valide.",
  }),
  label: Joi.string().allow(null).optional().messages({
    "string.base": "Le libellé doit être une chaîne de caractères.",
    "string.min": "Le libellé doit contenir au moins 1 caractère.",
  }),
})
  .min(1)
  .messages({ "object.min": "Aucun champ à mettre à jour" });
