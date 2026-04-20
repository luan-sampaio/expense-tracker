import { getPendingTransactionId } from '@/src/domain/transactions';
import { PendingMutation, Transaction } from '@/src/types';

function getMutationTransactionId(mutation: PendingMutation) {
  return getPendingTransactionId(mutation);
}

export function compactQueue(queue: PendingMutation[], next: PendingMutation) {
  const nextTransactionId = getMutationTransactionId(next);
  const filtered = queue.filter((mutation) => {
    return getMutationTransactionId(mutation) !== nextTransactionId;
  });

  return [...filtered, next];
}

export function applyPendingMutations(
  transactions: Transaction[],
  pendingMutations: PendingMutation[]
) {
  const byId = new Map(transactions.map((transaction) => [transaction.id, transaction]));

  pendingMutations.forEach((mutation) => {
    if (mutation.type === 'delete') {
      byId.delete(mutation.transactionId);
    } else {
      byId.set(mutation.transaction.id, mutation.transaction);
    }
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
