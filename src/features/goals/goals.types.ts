type UpdateGoalRpc = {
  p_id: string;
  p_label: string | null;
  p_target_amount_cents: number | null;
  p_deadline: string | null;
  p_status: string | null;
  p_set_deadline: boolean;
};

type DeleteGoalRpc = {
  p_id: string;
};

export type GoalRpcMap = {
  update_goal: UpdateGoalRpc;
  delete_goal: DeleteGoalRpc;
};
