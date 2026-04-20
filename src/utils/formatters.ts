export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(value: string | Date) {
  return new Date(value).toLocaleDateString('pt-BR');
}

export function formatMonthLabel(value: Date) {
  return value.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
}
