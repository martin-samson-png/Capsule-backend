import type { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "../error/AppError.js";

type ValidateTarget = "body" | "params" | "query";

export const validate =
  (schema: Joi.ObjectSchema, target: ValidateTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    let data: unknown;

    switch (target) {
      case "params":
        data = req.params;
        break;
      case "query":
        data = req.query;
        break;
      case "body":
        data = req.body;
        break;
      default:
        data = req.body;
        break;
    }

    if (target === "body" && (data === undefined || data === null))
      return next(AppError.badRequest("Le body est requis"));

    const { value, error } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const err = AppError.badRequest(
        error.details.map((d) => d.message).join(", "),
      );
      return next(err);
    }

    if (target === "body") req.validateBody = value;
    if (target === "params") req.validateParams = value;
    if (target === "query") req.validateQuery = value;

    next();
  };
