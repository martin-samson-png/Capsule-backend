export type TransactionType = "expense" | "income" | "transfer";

export interface CreateTransaction {
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  categoryId?: string;
  type: TransactionType;
  date: Date;
  amountCents: number;
  label?: string;
}

export type CreateTransferRpc = {
  p_from_account_id: string;
  p_to_account_id: string;
  p_amount_cents: number;
  p_date: string;
  p_label: string | null;
};

export type CreateTransactionRpc = {
  p_account_id: string;
  p_amount_cents: number;
  p_date: string;
  p_type: string;
  p_category_id: string | null;
  p_label: string | null;
};

export interface UpdateTransaction {
  id: string;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  categoryId?: string;
  type?: TransactionType;
  date?: Date;
  amountCents?: number;
  label?: string;
}
