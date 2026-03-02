import { PostgrestError } from "@supabase/supabase-js";
import { AppError } from "../error/AppError";

export const mapPgErrorToAppError = (err: PostgrestError) => {
  switch (err.code) {
    case "P0001":
      return AppError.unauthorized(err.message);
    case "P0002":
      return AppError.badRequest(err.message);
    case "P0003":
      return AppError.notFound(err.message);
    case "P0004":
      return AppError.forbidden(err.message);
    case "P0005":
      return AppError.conflict(err.message);
    case "P0006":
      return AppError.internalServer(err.message);
    default:
      return AppError.internalServer(err.message);
  }
};
