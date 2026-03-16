import Joi from "joi";

export const categoryCreateSchema = Joi.object({
  label: Joi.string().min(1).required().messages({
    "string.base": "Le libellé doit être une chaîne de caractere",
    "any.required": "Le libellé est obligatoire",
    "string.empty": "Le libellé ne peut pas être vide",
    "string.min": "Le libellé doit contenir au moins 1 caractère.",
  }),
  icon: Joi.string().min(1).optional().messages({
    "string.base": "L'icon doit être une chaîne de caractere",
    "string.empty": "L'icon ne peut pas être vide",
    "string.min": "L'icon doit contenir au moins 1 caractère.",
  }),
  color: Joi.string().min(1).required().messages({
    "string.base": "La couleur doit être une chaîne de caractere",
    "any.required": "La couleur est obligatoire",
    "string.empty": "La couleur ne peut pas être vide",
    "string.min": "La couleur doit contenir au moins 1 caractère.",
  }),
});
