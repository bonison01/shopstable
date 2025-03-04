
export type TransactionType = 'income' | 'expense';

export interface CashTransaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category?: string | null;
  notes?: string | null;
  created_at?: string | null;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
