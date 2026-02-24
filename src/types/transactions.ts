export interface CreateTransaction {
  accounId?: string;
  fromAccountId?: string;
  categoryId?: string;
  type: "expense" | "income" | "transfer";
  date: string;
  amountCent: number;
  label?: string;
}
