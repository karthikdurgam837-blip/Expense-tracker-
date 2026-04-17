export type Category = 
  | 'Food' 
  | 'Transport' 
  | 'Rent' 
  | 'Utilities' 
  | 'Entertainment' 
  | 'Healthcare' 
  | 'Shopping' 
  | 'Salary' 
  | 'Others';

export type TransactionType = 'Income' | 'Expense';

export interface SpendingInsight {
  title: string;
  content: string;
  type: 'warning' | 'info' | 'success';
}

export interface Transaction {
  id: string;
  date: string;
  category: Category;
  amount: number;
  type: TransactionType;
  description: string;
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}

export interface FinancialForecast {
  nextMonthTotal: number;
  confidence: number;
  explanation: string;
  riskFactors: string[];
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}
