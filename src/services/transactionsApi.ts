import { api } from '../lib/api';
import { PendingMutation, Transaction } from '../types';

type TransactionSyncOperation = {
  operation: 'add' | 'update' | 'remove';
  transaction_id?: string;
  transaction?: Transaction;
  client_operation_id: string;
};

type TransactionSyncResult = {
  client_operation_id: string;
  status: 'applied' | 'failed';
};

export type TransactionSyncResponse = {
  results: TransactionSyncResult[];
  transactions: Transaction[];
};

function toSyncOperation(mutation: PendingMutation): TransactionSyncOperation {
  if (mutation.type === 'upsert') {
    return {
      operation: 'update',
      transaction: mutation.transaction,
      client_operation_id: mutation.id,
    };
  }

  return {
    operation: 'remove',
    transaction_id: mutation.transactionId,
    client_operation_id: mutation.id,
  };
}

export const transactionsApi = {
  list: () => api.get<Transaction[]>('/transactions/'),

  sync: (pendingMutations: PendingMutation[]) => {
    if (pendingMutations.length === 0) {
      return null;
    }

    return api.post<TransactionSyncResponse>('/transactions/sync', {
      operations: pendingMutations.map(toSyncOperation),
    });
  },
};

