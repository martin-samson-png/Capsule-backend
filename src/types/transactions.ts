export type TransactionType = "expense" | "income" | "transfer";

export interface CreateTransaction {
  accounId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  categoryId?: string;
  type: TransactionType;
  date: Date;
  amountCents: number;
  label?: string;
}

export interface UpdateTransaction {
  id: string;
  accounId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  categoryId?: string;
  type?: TransactionType;
  date?: Date;
  amountCents?: number;
  label?: string;
}
