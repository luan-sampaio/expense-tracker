import { PendingMutation, Transaction } from '../types';

type PendingMutationInput =
  | {
      type: 'upsert';
      transaction: Transaction;
    }
  | {
      type: 'delete';
      transactionId: string;
    };

export function createClientId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function normalizeTransaction(transaction: Transaction): Transaction {
  return { ...transaction, amount: Number(transaction.amount) };
}

export function createPendingMutation(mutation: PendingMutationInput): PendingMutation {
  return {
    ...mutation,
    id: createClientId(),
    createdAt: new Date().toISOString(),
  };
}

export function compactQueue(queue: PendingMutation[], next: PendingMutation) {
  const filtered = queue.filter((mutation) => {
    if (next.type === 'upsert') {
      if (mutation.type === 'upsert') {
        return mutation.transaction.id !== next.transaction.id;
      }

      return mutation.transactionId !== next.transaction.id;
    }

    if (mutation.type === 'upsert') {
      return mutation.transaction.id !== next.transactionId;
    }

    return mutation.transactionId !== next.transactionId;
  });

  return [...filtered, next];
}

export function applyPendingMutations(
  transactions: Transaction[],
  pendingMutations: PendingMutation[]
) {
  const byId = new Map(transactions.map((transaction) => [transaction.id, transaction]));

  pendingMutations.forEach((mutation) => {
    if (mutation.type === 'upsert') {
      byId.set(mutation.transaction.id, mutation.transaction);
      return;
    }

    byId.delete(mutation.transactionId);
  });

  return Array.from(byId.values());
}

export function removeAppliedMutations(
  queue: PendingMutation[],
  appliedMutationIds: string[]
) {
  const applied = new Set(appliedMutationIds);
  return queue.filter((mutation) => !applied.has(mutation.id));
}

