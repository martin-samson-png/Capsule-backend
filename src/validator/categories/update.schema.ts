import Joi from "joi";

export const categoryUpdateSchema = Joi.object({
  label: Joi.string().optional().min(1).messages({
    "any.required": "Le libellé est obligatoire",
    "string.empty": "Le libellé ne peut pas être vide",
    "string.min": "Le libellé doit contenir au moins 1 caractère.",
  }),
  icon: Joi.string().optional().allow(null).min(1).messages({
    "any.required": "Le libellé est obligatoire",
    "string.empty": "Le libellé ne peut pas être vide",
    "string.min": "Le libellé doit contenir au moins 1 caractère.",
  }),
  color: Joi.string().min(1).optional().messages({
    "string.base": "La couleur doit être une chaîne de caractere",
    "string.empty": "La couleur ne peut pas être vide",
    "string.min": "La couleur doit contenir au moins 1 caractère.",
  }),
})
  .min(1)
  .messages({ "object.min": "Aucun champ à mettre à jour" });
