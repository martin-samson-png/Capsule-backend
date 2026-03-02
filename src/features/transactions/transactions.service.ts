import { createSupabaseUserClient } from "../../config/supabase";
import { AppError } from "../../error/AppError";
import { CreateTransaction } from "../../types/transactions";

export class TransactionService {
  async create(
    input: CreateTransaction & { userId: string; accessToken: string },
  ) {
    const supabaseUser = createSupabaseUserClient(input.accessToken);
    if (input.type === "transfer") {
      if (!input.fromAccountId || !input.toAccountId)
        throw AppError.badRequest("Compte manquant");
      if (input.fromAccountId === input.toAccountId)
        throw AppError.badRequest(
          "Vous ne pouvez pas transferer sur le meme compte",
        );
      if (input.amountCents <= 0) throw AppError.badRequest("Montant invalide");

      const { data: rows, error } = await supabaseUser.rpc("create_transfer", {
        p_from_account_id: input.fromAccountId,
        p_to_account_id: input.toAccountId,
        p_amount_cents: input.amountCents,
        p_date: input.date,
        p_label: input.label ?? null,
      });

      if (error)
        switch (error.code) {
          case "P0001":
            throw AppError.unauthorized(error.message);
          case "P0002":
            throw AppError.badRequest(error.message);
          case "P0003":
            throw AppError.notFound(error.message);
          case "P0004":
            throw AppError.forbidden(error.message);
          case "P0005":
            throw AppError.conflict(error.message);
          case "P0006":
            throw AppError.internalServer(error.message);
          default:
            throw AppError.internalServer(error.message);
        }

      const result = rows?.[0];

      if (!result)
        throw AppError.internalServer("Transfer OK mais résultat absent");

      return result;
    }

    if (input.type === "expense" || input.type === "income") {
      if (!input.accounId) throw AppError.badRequest("Compte manquant");
      if (input.amountCents <= 0) throw AppError.badRequest("Montant invalide");

      const { data: rows, error } = await supabaseUser.rpc(
        "create_transaction",
        {
          p_account_id: input.accounId,
          p_amount_cents: input.amountCents,
          p_date: input.date,
          p_category_id: input.categoryId,
          p_type: input.type,
        },
      );
    }
  }
}
