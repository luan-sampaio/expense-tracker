export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'food' 
  | 'transport' 
  | 'housing' 
  | 'entertainment' 
  | 'salary' 
  | 'other';

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO 8601 string
  category: string;
  type: TransactionType;
  description: string;
  budgetGroupId?: string;
}

interface PendingMutationBase {
  id: string;
  createdAt: string;
}

export type PendingMutation =
  | (PendingMutationBase & {
      type: 'create';
      transaction: Transaction;
    })
  | (PendingMutationBase & {
      type: 'update';
      transaction: Transaction;
    })
  | (PendingMutationBase & {
      type: 'delete';
      transactionId: string;
    });

export type SyncStatus = 'online' | 'offline' | 'syncing' | 'synced';
export type BudgetGroupId = string;
export type BudgetPresetId = 'classic' | 'essential' | 'savings' | 'custom';

export interface BudgetAllocation {
  groupId: BudgetGroupId;
  label: string;
  percentage: number;
}

export interface BudgetSettings {
  isVisible: boolean;
  presetId: BudgetPresetId;
  allocations: BudgetAllocation[];
}

export interface ExpenseState {
  transactions: Transaction[];
  pendingMutations: PendingMutation[];
  isLoading: boolean;
  error: string | null;
  lastSyncAt: string | null;
  syncStatus: SyncStatus;
  budgetSettings: BudgetSettings;
  setBudgetSettings: (settings: BudgetSettings) => void;
  setBudgetVisibility: (isVisible: boolean) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  clearAll: () => void;
  syncAll: (options?: { silent?: boolean }) => Promise<void>;
}
