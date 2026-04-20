import { filterTransactions, TransactionPeriod } from '@/src/domain/transactions';
import { useExpenseStore } from '@/src/store/useExpenseStore';
import { Transaction } from '@/src/types';
import { useMemo } from 'react';

export type Period = TransactionPeriod;

export function useFilteredTransactions(period: Period): Transaction[] {
  const transactions = useExpenseStore((state) => state.transactions);

  return useMemo(() => {
    return filterTransactions(transactions, {
      period,
      type: 'all',
      category: 'all',
      search: '',
    });
  }, [period, transactions]);
}
