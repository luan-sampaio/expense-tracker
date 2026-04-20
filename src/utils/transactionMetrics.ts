import { getCategoryMeta } from '@/src/constants/categories';
import {
  calculateBalance,
  groupExpensesByCategory,
  sumTransactionsByType,
} from '@/src/domain/transactions';
import { Transaction } from '@/src/types';

function isSameMonth(date: string, reference: Date) {
  const transactionDate = new Date(date);

  return (
    transactionDate.getMonth() === reference.getMonth() &&
    transactionDate.getFullYear() === reference.getFullYear()
  );
}

function getPreviousMonth(reference: Date) {
  return new Date(reference.getFullYear(), reference.getMonth() - 1, 1);
}

function summarizeMonth(transactions: Transaction[], reference: Date) {
  const monthTransactions = transactions.filter((transaction) =>
    isSameMonth(transaction.date, reference)
  );

  const income = sumTransactionsByType(monthTransactions, 'income');
  const expenses = sumTransactionsByType(monthTransactions, 'expense');
  const balance = calculateBalance(monthTransactions);

  return {
    balance,
    income,
    expenses,
    transactions: monthTransactions,
  };
}

function getTopExpense(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === 'expense')
    .sort((a, b) => b.amount - a.amount)[0] ?? null;
}

function getTopExpenseCategory(transactions: Transaction[]) {
  const totals = groupExpensesByCategory(transactions);

  const [categoryId, amount] = Object.entries(totals)
    .sort(([, a], [, b]) => b - a)[0] ?? [];

  if (!categoryId) return null;

  return {
    amount,
    category: getCategoryMeta(categoryId),
  };
}

function getExpenseComparison(currentExpenses: number, previousExpenses: number) {
  if (previousExpenses === 0) {
    return currentExpenses > 0
      ? 'Sem despesas no mês anterior'
      : 'Sem despesas nos dois meses';
  }

  const difference = currentExpenses - previousExpenses;
  const percentage = Math.abs((difference / previousExpenses) * 100);
  const direction = difference > 0 ? 'acima' : 'abaixo';

  if (difference === 0) {
    return 'Mesmo gasto do mês anterior';
  }

  return `${percentage.toFixed(0)}% ${direction} do mês anterior`;
}

export function getDashboardMetrics(transactions: Transaction[], reference = new Date()) {
  const currentMonth = summarizeMonth(transactions, reference);
  const previousMonth = summarizeMonth(transactions, getPreviousMonth(reference));

  return {
    ...currentMonth,
    topExpense: getTopExpense(currentMonth.transactions),
    topExpenseCategory: getTopExpenseCategory(currentMonth.transactions),
    expenseComparison: getExpenseComparison(currentMonth.expenses, previousMonth.expenses),
    previousMonth,
  };
}
