import { SupabaseClient } from "@supabase/supabase-js";
import { mapPgErrorToAppError } from "./error.utils";
import { AppError } from "../error/AppError";
import { TransactionRpcMap } from "../features/transactions/transactions.types";
import { GoalRpcMap } from "../features/goals/goals.types";

export type RpcMap = TransactionRpcMap & GoalRpcMap;

export const rpcSingleRow = async <K extends keyof RpcMap, T>(
  supabaseUser: SupabaseClient,
  fn: K,
  args: RpcMap[K],
  errMsgIfNoRow: string,
): Promise<T> => {
  const { data: rows, error } = await supabaseUser.rpc(fn as string, args);

  if (error) throw mapPgErrorToAppError(error);

  const result = rows?.[0];

  if (!result) throw AppError.internalServer(errMsgIfNoRow);

  return result;
};

export const rpcVoid = async <K extends keyof RpcMap, T>(
  supabaseUser: SupabaseClient,
  fn: K,
  args: RpcMap[K],
): Promise<void> => {
  const { error } = await supabaseUser.rpc(fn as string, args);
  if (error) throw mapPgErrorToAppError(error);
};
