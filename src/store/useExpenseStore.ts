import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ExpenseState } from '../types';

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      removeTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      updateTransaction: (id, updatedFields) => {
        const existing = get().transactions.find((t) => t.id === id);
        if (!existing) return;
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...existing, ...updatedFields } : t
          ),
        }));
      },

      clearAll: () => set({ transactions: [] }),
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
