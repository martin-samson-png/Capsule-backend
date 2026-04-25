import { createSupabaseUserClient } from "../../config/supabase.js";
import { AppError } from "../../error/AppError.js";
import { convertToPgDate } from "../../utils/date.js";
import { euroToCents } from "../../utils/money.js";
import { rpcVoid } from "../../utils/rpc.js";

export type GoalStatus = "active" | "completed" | "archived";

export interface CreateGoal {
  userId: string;
  accessToken: string;
  label: string;
  targetAmount: number;
  deadline: Date;
}

export interface FindGoal {
  userId: string;
  accessToken: string;
  page: number;
  limit: number;
  label?: string;
  status?: GoalStatus;
  deadlineFrom?: Date;
  deadLineTo?: Date;
  sortBy: "createdAt" | "deadline" | "targetAmount";
  sortOrder: "asc" | "desc";
}

export interface UpdateGoal {
  accessToken: string;
  goalId: string;
  label?: string;
  targetAmount?: number;
  status?: string;
  deadline?: string;
}

export class GoalsService {
  async create(input: CreateGoal) {
    const supabaseUser = createSupabaseUserClient(input.accessToken);
    const pgDeadline = convertToPgDate(input.deadline);
    const targetAmountCents = euroToCents(input.targetAmount);

    const { data, error } = await supabaseUser
      .from("goals")
      .insert({
        user_id: input.userId,
        label: input.label,
        target_amount_cents: targetAmountCents,
        deadline: pgDeadline,
      })
      .select(
        "id, label , target_amount_cents, current_amount_cents, deadline, status, created_at",
      )
      .single();

    if (error)
      throw AppError.internalServer("Erreur lors de l'insertion des données");

    if (!data)
      throw AppError.internalServer("Objectif créé mais résultat absent");

    return data;
  }

  async getByUserId(input: FindGoal) {
    const supabaseUser = createSupabaseUserClient(input.accessToken);

    let deadlineFromPgDate;
    let deadLineToPgDate;
    const asc = input.sortOrder === "asc";
    const from = (input.page - 1) * input.limit;
    const to = from + input.limit - 1;
    const sortMap = {
      createdAt: "created_at",
      deadline: "deadline",
      targetAmount: "target_amount_cents",
    };
    const sortColumn = sortMap[input.sortBy];

    if (input.deadlineFrom)
      deadlineFromPgDate = convertToPgDate(input.deadlineFrom);
    if (input.deadLineTo) deadLineToPgDate = convertToPgDate(input.deadLineTo);

    let query = supabaseUser
      .from("goals")
      .select(
        "id, label , target_amount_cents, current_amount_cents, deadline, status, created_at",
      )
      .eq("user_id", input.userId);

    if (input.label) query.eq("label", input.label);
    if (input.status) query.eq("status", input.status);
    if (input.deadlineFrom) query.gte("deadline", deadlineFromPgDate);
    if (input.deadLineTo) query.lte("deadline", deadLineToPgDate);

    query.order(sortColumn, { ascending: asc });

    if (sortColumn !== "created_at")
      query = query.order("created_at", { ascending: asc });

    query.order("id", { ascending: asc });

    query.range(from, to);

    const { data, error } = await query;

    if (error)
      throw AppError.internalServer(
        "Erreur lors de la récupération des objectifs",
      );

    const hasMore = data.length === input.limit;

    return { data: data ?? [], hasMore };
  }

  async update(input: UpdateGoal) {
    const supabaseUser = createSupabaseUserClient(input.accessToken);

    let pgDeadline;
    let targetAmountCents;

    const { accessToken, goalId, ...body } = input;

    const patch = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v !== undefined),
    );

    if (Object.keys(patch).length === 0)
      throw AppError.badRequest("Aucun champ à mettre à jour");

    const setDeadline = Object.hasOwn(input, "deadline");

    if (input.deadline !== undefined)
      pgDeadline = convertToPgDate(input.deadline);

    if (input.targetAmount !== undefined)
      targetAmountCents = euroToCents(input.targetAmount);

    await rpcVoid(supabaseUser, "update_goal", {
      p_id: input.goalId,
      p_label: input.label ?? null,
      p_target_amount_cents: targetAmountCents ?? null,
      p_deadline: pgDeadline ?? null,
      p_status: input.status ?? null,
      p_set_deadline: setDeadline,
    });

    return { ok: true };
  }

  async delete(goalId: string, accessToken: string) {
    const supabaseUser = createSupabaseUserClient(accessToken);

    await rpcVoid(supabaseUser, "delete_goal", { p_id: goalId });

    return { ok: true };
  }
}
