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
    "date.format": "La date doit être au format ISO.",
  }),

  amount: Joi.number().positive().required().messages({
    "any.required": "Le montant est obligatoire.",
    "number.base": "Le montant doit être un nombre.",
    "number.positive": "Le montant doit être supérieur à 0.",
  }),

  label: Joi.string().min(1).messages({
    "string.base": "Le libellé doit être une chaîne de caractères.",
    "string.empty": "Le libellé ne peut pas être vide.",
    "string.min": "Le libellé doit contenir au moins 1 caractère.",
  }),
});

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
    .valid("income", "expense", "transfer")
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

    if (from && to && from > to) return helpers.error("any.custom");
    return value;
  })
  .messages({ "any.custom": '"from" doit être <= "to"' });

export const transactionUpdateSchema = Joi.object({
  amount: Joi.number().positive().optional().messages({
    "number.base": "Le montant doit être un nombre.",
    "number.positive": "Le montant doit être supérieur à 0.",
  }),
  date: Joi.date().iso().optional().messages({
    "date.base": "La date est invalide.",
    "date.format": "La date doit être au format ISO.",
  }),
  categoryId: Joi.string().uuid().allow(null).optional().messages({
    "string.base": "categoryId doit être une chaîne de caractères.",
    "string.guid": "categoryId doit être un UUID valide.",
  }),
  label: Joi.string().min(1).allow(null).optional().messages({
    "string.base": "Le libellé doit être une chaîne de caractères.",
    "string.min": "Le libellé doit contenir au moins 1 caractère.",
  }),
})
  .min(1)
  .messages({ "object.min": "Aucun champ à mettre à jour" });
