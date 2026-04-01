import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../ui/Typography';
import { Spacer } from '../ui/Spacer';
import { theme } from '@/src/styles/theme';
import { Transaction } from '@/src/types';

interface Props {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: Props) {
  const isIncome = transaction.type === 'income';

  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(transaction.amount);

  const dateStr = new Date(transaction.date).toLocaleDateString('pt-BR');

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={[
          styles.iconPlaceholder, 
          { backgroundColor: isIncome ? theme.colors.incomeBackground : theme.colors.expenseBackground }
        ]}>
           <Typography variant="title" weight="bold" color={isIncome ? theme.colors.income : theme.colors.expense}>
              {transaction.category.substring(0, 1).toUpperCase()}
           </Typography>
        </View>
        <Spacer horizontal size="md" />
        <View>
          <Typography variant="body" weight="semibold">
            {transaction.description}
          </Typography>
          <Spacer size="xs" />
          <Typography variant="caption" color={theme.colors.secondaryText}>
            {dateStr} • {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
          </Typography>
        </View>
      </View>

      <Typography 
        variant="body" 
        weight="semibold" 
        color={isIncome ? theme.colors.income : theme.colors.primaryText}
      >
        {isIncome ? '+' : '-'}{formattedAmount}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
