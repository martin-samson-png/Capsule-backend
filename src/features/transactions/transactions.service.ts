import { createSupabaseUserClient } from "../../config/supabase";
import { AppError } from "../../error/AppError";
import { CreateTransaction } from "../../types/transactions";
import { toPgDate } from "../../utils/date";
import { rpcSingleRow } from "./transactions.utils";

export class TransactionService {
  async create(
    input: CreateTransaction & { userId: string; accessToken: string },
  ) {
    const supabaseUser = createSupabaseUserClient(input.accessToken);
    const pgDate = toPgDate(input.date);
    if (input.type === "transfer") {
      if (!input.fromAccountId || !input.toAccountId)
        throw AppError.badRequest("Compte manquant");
      if (input.fromAccountId === input.toAccountId)
        throw AppError.badRequest(
          "Vous ne pouvez pas transferer sur le meme compte",
        );
      if (input.amountCents <= 0) throw AppError.badRequest("Montant invalide");

      const result = await rpcSingleRow(
        supabaseUser,
        "create_transfer",
        {
          p_from_account_id: input.fromAccountId,
          p_to_account_id: input.toAccountId,
          p_amount_cents: input.amountCents,
          p_date: pgDate,
          p_label: input.label ?? null,
        },
        "Transfer OK mais résultat absent",
      );

      return result;
    } else if (input.type === "expense" || input.type === "income") {
      if (!input.accountId) throw AppError.badRequest("Compte manquant");
      if (input.amountCents <= 0) throw AppError.badRequest("Montant invalide");

      const result = await rpcSingleRow(
        supabaseUser,
        "create_transaction",
        {
          p_account_id: input.accountId,
          p_amount_cents: input.amountCents,
          p_date: pgDate,
          p_type: input.type,
          p_category_id: input.categoryId ?? null,
          p_label: input.label ?? null,
        },
        "Transaction OK mais résultat absent",
      );

      return result;
    } else throw AppError.badRequest("Type incorrect");
  }
}
