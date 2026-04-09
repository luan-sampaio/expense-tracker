import { useExpenseStore } from '../store/useExpenseStore';
import { Transaction } from '../types';

export type Period = 'week' | 'month' | 'year' | 'all';

export function useFilteredTransactions(period: Period): Transaction[] {
  const transactions = useExpenseStore((state) => state.transactions);

  if (period === 'all') return transactions;

  const now = new Date();

  const cutoff: Record<Exclude<Period, 'all'>, Date> = {
    week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    month: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
    year: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
  };

  return transactions.filter(
    (t) => new Date(t.date) >= cutoff[period as Exclude<Period, 'all'>]
  );
}
