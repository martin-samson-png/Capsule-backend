import { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../../error/AppError";

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
