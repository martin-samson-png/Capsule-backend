import { mapPgErrorToAppError } from "./error.utils.js";
import { AppError } from "../error/AppError.js";
export const rpcSingleRow = async (supabaseUser, fn, args, errMsgIfNoRow) => {
    const { data: rows, error } = await supabaseUser.rpc(fn, args);
    if (error)
        throw mapPgErrorToAppError(error);
    const result = rows?.[0];
    if (!result)
        throw AppError.internalServer(errMsgIfNoRow);
    return result;
};
export const rpcVoid = async (supabaseUser, fn, args) => {
    const { error } = await supabaseUser.rpc(fn, args);
    if (error)
        throw mapPgErrorToAppError(error);
};
//# sourceMappingURL=rpc.js.map