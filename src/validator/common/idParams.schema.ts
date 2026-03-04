import Joi from "joi";

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "any.required": "id est obligatoire",
    "string.empty": "id est obligatoire",
    "string.guid": "id doit être un UUID valide",
  }),
});
