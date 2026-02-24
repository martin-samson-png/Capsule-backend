import { CreateTransaction } from "../types/transactions";

export class TransactionService {
  async create(data: CreateTransaction & { userId: string }) {}
}
