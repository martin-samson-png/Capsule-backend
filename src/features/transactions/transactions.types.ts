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

type CreateContributionRpc = {
  p_account_id: string;
  p_goal_id: string;
  p_category_id: string | null;
  p_amount_cents: number;
  p_date: string;
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

type DeleteTransactionRpc = {
  p_id: string;
};

export type TransactionRpcMap = {
  create_transfer: CreateTransferRpc;
  create_transaction: CreateTransactionRpc;
  create_contribution: CreateContributionRpc;
  update_transaction: UpdateTransactionRpc;
  delete_transaction: DeleteTransactionRpc;
};
