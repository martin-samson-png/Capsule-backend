import "dotenv/config"
import Joi from "joi"

const schema = Joi.object({
    NODE_ENV:Joi.string().valid("developpement", "production").required(),
    PORT: Joi.number().default(3001),
    SUPABASE_URL:Joi.string().required(),
    SUPABASE_ANON_KEY: Joi.string().required(),
    FRONT_URL:Joi.string().uri().required()
}).unknown();

const {value, error} = schema.validate(process.env)
if(error) throw new Error(`ENV ERROR : ${error.message}`);

export const env = value