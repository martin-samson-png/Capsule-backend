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

  goalId: Joi.string().uuid().optional().messages({
    "string.base": "goalId doit être une chaine de caractère.",
    "string.guid": "goalId doit être un UUID valide.",
  }),

  type: Joi.string()
    .valid("expense", "income", "transfer", "contribution")
    .required()
    .messages({
      "any.required": "Le type de transaction est obligatoire.",
      "string.empty": "Le type de transaction est obligatoire.",
      "any.only":
        "Le type doit être 'expense', 'income', 'transfer' ou 'contribution'.",
      "string.base": "Le type de transaction est invalide.",
    }),

  date: Joi.date().iso().less("now").required().messages({
    "any.required": "La date est obligatoire.",
    "date.base": "La date est invalide.",
    "date.format": "La date doit être au format ISO.",
    "date.less": "La date doit être dans le passé",
  }),

  amount: Joi.number().positive().required().messages({
    "any.required": "Le montant est obligatoire.",
    "number.base": "Le montant doit être un nombre.",
    "number.positive": "Le montant doit être supérieur à 0.",
  }),

  label: Joi.string().optional().min(1).messages({
    "string.base": "Le libellé doit être une chaîne de caractères.",
    "string.empty": "Le libellé ne peut pas être vide.",
    "string.min": "Le libellé doit contenir au moins 1 caractère.",
  }),
});
