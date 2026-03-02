import Joi from "joi";

export const transactionCreateSchema = Joi.object({
  accountId: Joi.string().uuid().optional().messages({
    "string.base": "accountId doit être une chaîne de caractères.",
    "string.guid": "accountId doit être un UUID valide.",
  }),

  fromAccountId: Joi.string().uuid().optional().messages({
    "string.base": "fromAccountId doit être une chaîne de caractères.",
    "string.guid": "fromAccountId doit être un UUID valide.",
  }),

  toAccountId: Joi.string().uuid().optional().messages({
    "string.base": "toAccountId doit être une chaîne de caractères.",
    "string.guid": "toAccountId doit être un UUID valide.",
  }),

  categoryId: Joi.string().uuid().optional().messages({
    "string.base": "categoryId doit être une chaîne de caractères.",
    "string.guid": "categoryId doit être un UUID valide.",
  }),

  type: Joi.string()
    .valid("expense", "income", "transfer")
    .required()
    .messages({
      "any.required": "Le type de transaction est obligatoire.",
      "string.empty": "Le type de transaction est obligatoire.",
      "any.only": "Le type doit être 'expense', 'income' ou 'transfer'.",
      "string.base": "Le type de transaction est invalide.",
    }),

  date: Joi.date().iso().required().messages({
    "any.required": "La date est obligatoire.",
    "date.base": "La date est invalide.",
    "date.format": "La date doit être au format ISO (YYYY-MM-DD).",
  }),

  amountCent: Joi.number().min(0).required().messages({
    "any.required": "Le montant est obligatoire.",
    "number.base": "Le montant doit être un nombre.",
    "number.min": "Le montant doit être supérieur ou égal à 0.",
  }),

  label: Joi.string().min(1).required().messages({
    "any.required": "Le libellé est obligatoire.",
    "string.base": "Le libellé doit être une chaîne de caractères.",
    "string.empty": "Le libellé ne peut pas être vide.",
    "string.min": "Le libellé doit contenir au moins 1 caractère.",
  }),
});
