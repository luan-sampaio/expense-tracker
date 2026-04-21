import { useExpenseStore } from '@/src/store/useExpenseStore';
import { theme } from '@/src/styles/theme';
import { formatCurrency, formatMonthLabel } from '@/src/utils/formatters';
import { getDashboardMetrics } from '@/src/utils/transactionMetrics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacer } from '@/src/components/ui/Spacer';
import { Typography } from '@/src/components/ui/Typography';

export function BalanceHeader() {
  const transactions = useExpenseStore((state) => state.transactions);
  const metrics = useMemo(() => getDashboardMetrics(transactions), [transactions]);
  const monthLabel = useMemo(() => formatMonthLabel(new Date()), []);
  const topExpenseLabel = metrics.topExpense
    ? `${metrics.topExpense.description} · ${formatCurrency(metrics.topExpense.amount)}`
    : 'Nenhuma despesa no mês';
  const topCategoryLabel = metrics.topExpenseCategory
    ? `${metrics.topExpenseCategory.category.label} · ${formatCurrency(metrics.topExpenseCategory.amount)}`
    : 'Nenhuma categoria ainda';
  const comparisonColor = metrics.expenseComparison.direction === 'up'
    ? theme.colors.expense
    : metrics.expenseComparison.direction === 'down'
      ? theme.colors.income
      : theme.colors.info;
  const comparisonIcon = metrics.expenseComparison.direction === 'up'
    ? 'arrow-upward'
    : metrics.expenseComparison.direction === 'down'
      ? 'arrow-downward'
      : 'remove';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.balanceBlock}>
          <Typography variant="caption" weight="medium" color={theme.colors.secondaryText}>
            Saldo do mês
          </Typography>
          <Typography
            variant="hero"
            weight="bold"
            color={metrics.balance >= 0 ? theme.colors.primaryText : theme.colors.expense}
            align="center"
            numberOfLines={1}
            style={styles.balanceAmount}
          >
            {formatCurrency(metrics.balance)}
          </Typography>
          <Typography variant="caption" color={theme.colors.secondaryText}>
            {monthLabel}
          </Typography>
        </View>
        <Spacer size="lg" />
        <View style={styles.metricsRow}>
          <View style={[styles.miniCard, styles.incomeCard]}>
            <View style={[styles.metricIcon, { backgroundColor: theme.colors.incomeBackground }]}>
              <MaterialIcons name="arrow-upward" size={18} color={theme.colors.income} />
            </View>
            <View>
              <Typography variant="caption" color={theme.colors.secondaryText}>Receitas</Typography>
              <Typography variant="body" weight="bold" color={theme.colors.income} numberOfLines={1}>
                {formatCurrency(metrics.income)}
              </Typography>
            </View>
          </View>
          <View style={[styles.miniCard, styles.expenseCard]}>
            <View style={[styles.metricIcon, { backgroundColor: theme.colors.expenseBackground }]}>
              <MaterialIcons name="arrow-downward" size={18} color={theme.colors.expense} />
            </View>
            <View>
              <Typography variant="caption" color={theme.colors.secondaryText}>Despesas</Typography>
              <Typography variant="body" weight="bold" color={theme.colors.expense} numberOfLines={1}>
                {formatCurrency(metrics.expenses)}
              </Typography>
            </View>
          </View>
          <View style={[styles.miniCard, styles.contributionCard]}>
            <View style={[styles.metricIcon, { backgroundColor: theme.colors.primaryBackground }]}>
              <MaterialIcons name="savings" size={18} color={theme.colors.primary} />
            </View>
            <View>
              <Typography variant="caption" color={theme.colors.secondaryText}>Aportes</Typography>
              <Typography variant="body" weight="bold" color={theme.colors.primary} numberOfLines={1}>
                {formatCurrency(metrics.contributions)}
              </Typography>
            </View>
          </View>
        </View>
        <Spacer size="lg" />
        <View style={styles.insightsGrid}>
          <View style={styles.insight}>
            <View style={[styles.insightIcon, { backgroundColor: theme.colors.expenseBackground }]}>
              <MaterialIcons name="payments" size={18} color={theme.colors.expense} />
            </View>
            <View style={styles.insightText}>
              <Typography variant="caption" color={theme.colors.secondaryText}>
                Maior gasto
              </Typography>
              <Typography variant="body" weight="semibold" numberOfLines={2}>
                {topExpenseLabel}
              </Typography>
            </View>
          </View>
          <View style={styles.insight}>
            <View style={[styles.insightIcon, { backgroundColor: theme.colors.primaryBackground }]}>
              <MaterialIcons name="category" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.insightText}>
              <Typography variant="caption" color={theme.colors.secondaryText}>
                Categoria destaque
              </Typography>
              <Typography variant="body" weight="semibold" numberOfLines={2}>
                {topCategoryLabel}
              </Typography>
            </View>
          </View>
          <View style={styles.insight}>
            <View style={[styles.insightIcon, { backgroundColor: theme.colors.infoBackground }]}>
              <MaterialIcons name={comparisonIcon} size={18} color={comparisonColor} />
            </View>
            <View style={styles.insightText}>
              <Typography variant="caption" color={theme.colors.secondaryText}>
                Comparação mensal
              </Typography>
              <Typography variant="body" weight="semibold" color={comparisonColor} numberOfLines={2}>
                {metrics.expenseComparison.label}
              </Typography>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    width: '100%',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  balanceBlock: {
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  balanceAmount: {
    width: '100%',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: theme.spacing.sm,
  },
  miniCard: {
    flex: 1,
    minWidth: 128,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  incomeCard: {
    backgroundColor: theme.colors.incomeBackground,
  },
  expenseCard: {
    backgroundColor: theme.colors.expenseBackground,
  },
  contributionCard: {
    backgroundColor: theme.colors.primaryBackground,
  },
  metricIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  insightsGrid: {
    width: '100%',
    gap: theme.spacing.sm,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingTop: theme.spacing.md,
  },
  insightIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
  },
  insightText: {
    flex: 1,
    minWidth: 0,
    gap: theme.spacing.xs,
  },
});
