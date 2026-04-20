import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { api } from '../lib/api';
import { ExpenseState, PendingMutation, Transaction } from '../types';

let isFlushingQueue = false;

type TransactionSyncOperation = {
  operation: 'add' | 'update' | 'remove';
  transaction_id?: string;
  transaction?: Transaction;
  client_operation_id: string;
};

type TransactionSyncResult = {
  operation: string;
  transaction_id: string;
  client_operation_id: string;
  status: 'applied' | 'failed';
  message: string;
};

type TransactionSyncResponse = {
  results: TransactionSyncResult[];
  transactions: Transaction[];
};

type PendingMutationInput =
  | {
      type: 'upsert';
      transaction: Transaction;
    }
  | {
      type: 'delete';
      transactionId: string;
    };

function createMutationId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function normalizeTransaction(transaction: Transaction): Transaction {
  return { ...transaction, amount: Number(transaction.amount) };
}

function isNotFound(error: unknown) {
  return error instanceof Error && error.message.includes('404');
}

function createPendingMutation(mutation: PendingMutationInput): PendingMutation {
  return {
    ...mutation,
    id: createMutationId(),
    createdAt: new Date().toISOString(),
    attempts: 0,
    lastAttemptAt: null,
    lastError: null,
  };
}

function normalizePendingMutation(mutation: PendingMutation): PendingMutation {
  return {
    ...mutation,
    attempts: mutation.attempts ?? 0,
    lastAttemptAt: mutation.lastAttemptAt ?? null,
    lastError: mutation.lastError ?? null,
  };
}

function compactQueue(queue: PendingMutation[], next: PendingMutation) {
  const normalizedQueue = queue.map(normalizePendingMutation);
  const filtered = normalizedQueue.filter((mutation) => {
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

function applyPendingMutations(
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

function getMutationLabel(mutation: PendingMutation) {
  if (mutation.type === 'upsert') {
    const description = mutation.transaction.description.trim();
    return description ? `"${description}"` : mutation.transaction.id;
  }

  return mutation.transactionId;
}

function buildMutationError(mutation: PendingMutation, message: string) {
  const action = mutation.type === 'upsert' ? 'Salvar' : 'Remover';
  return `${action} ${getMutationLabel(mutation)}: ${message}`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Erro desconhecido ao sincronizar.';
}

async function syncPendingMutations(pendingMutations: PendingMutation[]) {
  if (pendingMutations.length === 0) {
    return null;
  }

  return api.post<TransactionSyncResponse>('/transactions/sync', {
    operations: pendingMutations.map(toSyncOperation),
  });
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      transactions: [],
      pendingMutations: [],
      isLoading: false,
      error: null,
      lastSyncAt: null,
      syncStatus: 'synced',

      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          amount: Number(transaction.amount),
          id: createMutationId(),
        };
        const pendingMutation = createPendingMutation({
          type: 'upsert',
          transaction: newTransaction,
        });

        set((state) => ({
          transactions: [...state.transactions, newTransaction],
          pendingMutations: compactQueue(state.pendingMutations, pendingMutation),
          error: null,
          syncStatus: 'online',
        }));
        get().syncAll({ silent: true });
      },

      removeTransaction: (id) => {
        const pendingMutation = createPendingMutation({
          type: 'delete',
          transactionId: id,
        });

        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
          pendingMutations: compactQueue(state.pendingMutations, pendingMutation),
          error: null,
          syncStatus: 'online',
        }));
        get().syncAll({ silent: true });
      },

      updateTransaction: (id, updatedFields) => {
        const existing = get().transactions.find((t) => t.id === id);
        if (!existing) return;
        const updated = normalizeTransaction({ ...existing, ...updatedFields });
        const pendingMutation = createPendingMutation({
          type: 'upsert',
          transaction: updated,
        });

        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? updated : t
          ),
          pendingMutations: compactQueue(state.pendingMutations, pendingMutation),
          error: null,
          syncStatus: 'online',
        }));
        get().syncAll({ silent: true });
      },

      clearAll: () => {
        const deleteMutations = get().transactions.map((transaction) =>
          createPendingMutation({
            type: 'delete' as const,
            transactionId: transaction.id,
          })
        );

        set((state) => ({
          transactions: [],
          pendingMutations: deleteMutations.reduce(
            (queue, mutation) => compactQueue(queue, mutation),
            state.pendingMutations
          ),
          error: null,
          syncStatus: deleteMutations.length > 0 ? 'online' : state.syncStatus,
        }));
        get().syncAll({ silent: true });
      },

      discardPendingMutations: () => {
        set({
          pendingMutations: [],
          error: null,
          syncStatus: 'synced',
        });
        get().syncAll({ silent: true });
      },

      syncAll: async (options) => {
        if (isFlushingQueue) return;

        isFlushingQueue = true;
        if (!options?.silent) {
          set({ isLoading: true, error: null, syncStatus: 'syncing' });
        } else {
          set({ syncStatus: 'syncing' });
        }

        try {
          const pendingMutations = get().pendingMutations.map(normalizePendingMutation);
          const attemptedAt = new Date().toISOString();

          if (pendingMutations.length > 0) {
            set((state) => ({
              pendingMutations: state.pendingMutations.map((mutation) => ({
                ...normalizePendingMutation(mutation),
                attempts: (mutation.attempts ?? 0) + 1,
                lastAttemptAt: attemptedAt,
                lastError: null,
              })),
            }));
          }

          const syncResponse = await syncPendingMutations(pendingMutations);

          if (syncResponse) {
            const resultById = new Map(
              syncResponse.results.map((result) => [result.client_operation_id, result])
            );

            set((state) => ({
              pendingMutations: state.pendingMutations
                .map(normalizePendingMutation)
                .filter((mutation) => resultById.get(mutation.id)?.status !== 'applied')
                .map((mutation) => {
                  const result = resultById.get(mutation.id);

                  if (!result || result.status !== 'failed') {
                    return mutation;
                  }

                  return {
                    ...mutation,
                    lastError: buildMutationError(
                      mutation,
                      result.message || 'O servidor recusou esta alteração.'
                    ),
                  };
                }),
            }));
          }

          const data = syncResponse?.transactions ?? await api.get<Transaction[]>('/transactions/');
          const normalized = data.map(normalizeTransaction); // backend retorna Decimal como string
          const localWithPending = applyPendingMutations(normalized, get().pendingMutations);
          const hasPendingMutations = get().pendingMutations.length > 0;
          const pendingError = get().pendingMutations.find((mutation) => mutation.lastError)?.lastError;

          set({
            transactions: localWithPending,
            isLoading: false,
            error: pendingError ?? null,
            lastSyncAt: new Date().toISOString(),
            syncStatus: hasPendingMutations ? 'online' : 'synced',
          });
        } catch (err) {
          console.error('Sync failed:', err);
          const message = isNotFound(err)
            ? 'O servidor não encontrou uma das transações pendentes.'
            : getErrorMessage(err);

          set((state) => ({
            pendingMutations: state.pendingMutations.map((mutation) => ({
              ...normalizePendingMutation(mutation),
              lastError: buildMutationError(mutation, message),
            })),
          }));

          const hasPendingMutations = get().pendingMutations.length > 0;
          const pendingError = get().pendingMutations.find((mutation) => mutation.lastError)?.lastError;
          const errorMessage = hasPendingMutations
            ? pendingError ?? 'Sem conexão com o servidor. Suas alterações locais foram salvas e serão sincronizadas automaticamente.'
            : 'Não foi possível sincronizar com o servidor.';

          set({
            isLoading: false,
            error: options?.silent && !hasPendingMutations ? get().error : errorMessage,
            syncStatus: 'offline',
          });
        } finally {
          isFlushingQueue = false;
        }
      },
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
