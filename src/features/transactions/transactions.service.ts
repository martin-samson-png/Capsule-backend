import { createSupabaseUserClient } from "../../config/supabase";
import { AppError } from "../../error/AppError";
import { convertToPgDate } from "../../utils/date";
import { euroToCents } from "../../utils/money";
import { rpcSingleRow, rpcVoid } from "../../utils/rpc";

export type TransactionType =
  | "expense"
  | "income"
  | "transfer"
  | "contribution";

export interface CreateTransaction {
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  categoryId?: string;
  goalId?: string;
  type: TransactionType;
  date: Date;
  amount: number;
  label?: string;
  accessToken: string;
}

export interface FindTransaction {
  userId: string;
  accessToken: string;
  page: number;
  limit: number;
  accountId: string;
  categoryId?: string;
  from?: Date;
  to?: Date;
  type?: TransactionType;
  sortBy: "category" | "createdAt" | "date";
  sortOrder: "asc" | "desc";
}

export interface UpdateTransaction {
  accessToken: string;
  transactionId: string;
  amount?: number;
  date?: Date;
  categoryId?: string | null;
  label?: string | null;
}

export class TransactionService {
  async create(input: CreateTransaction) {
    const supabaseUser = createSupabaseUserClient(input.accessToken);
    const pgDate = convertToPgDate(input.date);
    const amountCents = Math.round(input.amount * 100);

    if (input.type === "transfer") {
      if (!input.fromAccountId || !input.toAccountId)
        throw AppError.badRequest("Compte manquant");
      if (input.fromAccountId === input.toAccountId)
        throw AppError.badRequest(
          "Vous ne pouvez pas transferer sur le meme compte",
        );

      const result = await rpcSingleRow(
        supabaseUser,
        "create_transfer",
        {
          p_from_account_id: input.fromAccountId,
          p_to_account_id: input.toAccountId,
          p_amount_cents: amountCents,
          p_date: pgDate,
          p_label: input.label ?? null,
        },
        "Transfer OK mais résultat absent",
      );

      return result;
    } else if (input.type === "expense" || input.type === "income") {
      if (!input.accountId) throw AppError.badRequest("Compte manquant");

      const result = await rpcSingleRow(
        supabaseUser,
        "create_transaction",
        {
          p_account_id: input.accountId,
          p_amount_cents: amountCents,
          p_date: pgDate,
          p_type: input.type,
          p_category_id: input.categoryId ?? null,
          p_label: input.label ?? null,
        },
        "Transaction OK mais résultat absent",
      );

      return result;
    } else if (input.type === "contribution") {
      if (!input.accountId) throw AppError.badRequest("Compte manquant");
      if (!input.goalId) throw AppError.badRequest("Objectif manquant");

      const result = await rpcSingleRow(
        supabaseUser,
        "create_contribution",
        {
          p_account_id: input.accountId,
          p_goal_id: input.goalId,
          p_category_id: input.categoryId ?? null,
          p_amount_cents: amountCents,
          p_date: pgDate,
          p_label: input.label ?? null,
        },
        "Transaction OK mais résultat absent",
      );

      return result;
    } else throw AppError.badRequest("Type incorrect");
  }

  async getByUserId(input: FindTransaction) {
    const supabaseUser = createSupabaseUserClient(input.accessToken);

    let fromPgDate;
    let toPgDate;
    const asc = input.sortOrder === "asc";
    const from = (input.page - 1) * input.limit;
    const to = from + input.limit - 1;
    const sortMap = {
      date: "date",
      createdAt: "created_at",
      category: "category_id",
    };
    const sortColumn = sortMap[input.sortBy];

    if (input.from) fromPgDate = convertToPgDate(input.from);
    if (input.to) toPgDate = convertToPgDate(input.to);

    if (input.categoryId) {
      const { data, error } = await supabaseUser
        .from("categories")
        .select("id")
        .eq("id", input.categoryId);

      if (error)
        throw AppError.internalServer(
          "Erreur lors de la récupération des categories",
        );
      if (!data?.length) throw AppError.notFound("Categorie inexistante");
    }

    let query = supabaseUser
      .from("transactions")
      .select("id, date, amount_cents, label, created_at, type")
      .eq("user_id", input.userId)
      .or(
        `account_id.eq.${input.accountId},from_account_id.eq.${input.accountId},to_account_id.eq.${input.accountId}`,
      );

    if (input.categoryId) query.eq("category_id", input.categoryId);
    if (input.type) query.eq("type", input.type);
    if (input.from) query.gte("date", fromPgDate);
    if (input.to) query.lte("date", toPgDate);

    query = query.order(sortColumn, { ascending: asc });

    if (sortColumn !== "created_at")
      query = query.order("created_at", { ascending: asc });

    query = query.order("id", { ascending: asc });

    query = query.range(from, to);

    const { data, error } = await query;

    if (error)
      throw AppError.internalServer(
        "Erreur lors de la récupération des transactions",
      );

    const hasMore = data.length === input.limit;

    return { data: data ?? [], hasMore };
  }

  async update(input: UpdateTransaction) {
    const supabaseUser = createSupabaseUserClient(input.accessToken);

    let pgDate;
    let amountCents;

    const { accessToken, transactionId, ...body } = input;

    const patch = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v !== undefined),
    );

    if (Object.keys(patch).length === 0)
      throw AppError.badRequest("Aucun champ à mettre à jour");

    const setCategory = Object.hasOwn(input, "categoryId");
    const setLabel = Object.hasOwn(input, "label");

    if (input.date !== undefined) pgDate = convertToPgDate(input.date);

    if (input.amount !== undefined) amountCents = euroToCents(input.amount);
    console.log(input.transactionId);

    await rpcVoid(supabaseUser, "update_transaction", {
      p_id: input.transactionId,
      p_amount_cents: amountCents ?? null,
      p_date: pgDate ?? null,
      p_category_id: input.categoryId ?? null,
      p_set_category: setCategory,
      p_label: input.label ?? null,
      p_set_label: setLabel,
    });

    return { ok: true };
  }

  async delete(transactionId: string, accessToken: string) {
    const supabaseUser = createSupabaseUserClient(accessToken);

    await rpcVoid(supabaseUser, "delete_transaction", { p_id: transactionId });

    return { ok: true };
  }
}
