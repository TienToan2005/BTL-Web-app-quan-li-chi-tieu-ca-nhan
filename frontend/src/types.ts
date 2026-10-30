export type CategoryType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type TxFilterType = 'ALL' | 'INCOME' | 'EXPENSE';

export interface Session {
  id: number;
  username: string;
  role: string;
}

export interface Wallet {
  id: number;
  name: string;
  balance: number;
  icon?: string | null;
  color?: string | null;
}

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  user_id: number | null;
  icon?: string | null;
  color?: string | null;
  transaction_count?: number;
}

export interface Transaction {
  id: number;
  amount: number;
  note: string | null;
  transaction_date: string;
  category_name: string;
  category_type: CategoryType;
  category_icon?: string | null;
  category_color?: string | null;
  wallet_name: string;
  image_url: string | null;
}

export interface Budget {
  id: number;
  category_name: string;
  amount_limit: number;
  actual_spent: number;
  month: number;
  year: number;
}

export interface ReportItem {
  category_name: string;
  category_color?: string | null;
  actual_spent?: number;
  total?: number;
}

export interface MonthlyReport {
  period_income: number;
  period_expenses: number;
  period_change: number;
  item_expenses: ReportItem[];
  item_incomes: ReportItem[];
}

export interface Period {
  month: number;
  year: number;
}

export interface TransactionInput {
  user_id: number;
  wallet_id: number;
  category_id: number;
  amount: number;
  note: string;
  transaction_date: string;
}

export interface AdminStats {
  total_users: number;
  total_wallets: number;
  total_tx: number;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string | null;
  role: string;
  status: 'ACTIVE' | 'BANNED';
  created_at: string;
}

export interface AdminUserDetail {
  id: number;
  username: string;
  email: string | null;
  created_at: string;
  total_wallets: number;
  total_balance: number;
  recent_transactions: { id: number; amount: number; note: string | null; type: string; date: string }[];
}
