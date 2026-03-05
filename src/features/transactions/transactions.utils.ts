import { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../../error/AppError";
import { mapPgErrorToAppError } from "../../utils/error.utils";

type CreateTransferRpc = {
  p_from_account_id: string;
  p_to_account_id: string;
  p_amount_cents: number;
  p_date: string;
  p_label: string | null;
};

type CreateTransactionRpc = {
  p_account_id: string;
  p_amount_cents: number;
  p_date: string;
  p_type: string;
  p_category_id: string | null;
  p_label: string | null;
};

type UpdateTransactionRpc = {
  p_id: string;
  p_amount_cents: number | null;
  p_date: string | null;
  p_category_id: string | null;
  p_set_category: boolean;
  p_label: string | null;
  p_set_label: boolean;
};

type RpcMap = {
  create_transfer: CreateTransferRpc;
  create_transaction: CreateTransactionRpc;
  update_transaction: UpdateTransactionRpc;
};

export const getAccountForUserOrThrow = async (
  accountId: string,
  userId: string,
  supabaseUser: SupabaseClient,
) => {
  const { data, error } = await supabaseUser
    .from("accounts")
    .select("id, user_id, type, balance_cents")
    .eq("id", accountId)
    .single();

  if (error)
    throw AppError.internalServer("Erreur lors de la récupération du compte");

  if (!data) throw AppError.notFound("Compte introuvable");

  if (userId !== data.user_id)
    throw AppError.forbidden("Accès interdit à ce compte");

  return data;
};

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
