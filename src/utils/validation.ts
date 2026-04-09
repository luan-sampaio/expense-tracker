export interface TransactionFormErrors {
  amount: string;
  description: string;
}

export interface TransactionFormValues {
  amount: string;
  description: string;
}

export function validateTransactionForm(values: TransactionFormValues): {
  errors: TransactionFormErrors;
  isValid: boolean;
} {
  const errors: TransactionFormErrors = { amount: '', description: '' };
  let isValid = true;

  if (!values.amount.trim()) {
    errors.amount = 'Valor é obrigatório';
    isValid = false;
  } else {
    const numeric = parseFloat(values.amount.replace(',', '.'));
    if (isNaN(numeric) || numeric <= 0) {
      errors.amount = 'Valor deve ser um número positivo';
      isValid = false;
    }
  }

  if (!values.description.trim()) {
    errors.description = 'Descrição é obrigatória';
    isValid = false;
  }

  return { errors, isValid };
}

export function parseAmount(value: string): number {
  return parseFloat(value.replace(',', '.'));
}
