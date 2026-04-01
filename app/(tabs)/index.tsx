import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Container } from '@/src/components/ui/Container';
import { Spacer } from '@/src/components/ui/Spacer';
import { BalanceHeader } from '@/src/components/dashboard/BalanceHeader';
import { TransactionItem } from '@/src/components/dashboard/TransactionItem';
import { Typography } from '@/src/components/ui/Typography';
import { Button } from '@/src/components/ui/Button';
import { router } from 'expo-router';
import { theme } from '@/src/styles/theme';
import { useExpenseStore } from '@/src/store/useExpenseStore';

export default function HomeScreen() {
  const transactions = useExpenseStore((state) => state.transactions);

  // Ordenar por data mais recente
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Container padding={0} backgroundColor={theme.colors.background}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Spacer size="xxl" />
        <BalanceHeader />
        
        <Container padding="lg" flex={0}>
          <Button label="+ Nova Transação" onPress={() => router.push('/modal')} />
        </Container>
        
        <Spacer size="lg" />
        
        <Container padding="lg" flex={0}>
          <Typography variant="title" weight="semibold">
            Transações Recentes
          </Typography>
          <Spacer size="lg" />
          
          {sortedTransactions.length === 0 ? (
            <Container padding="lg" backgroundColor={theme.colors.surface} style={styles.emptyCard}>
              <Typography variant="body" color={theme.colors.secondaryText} align="center">
                Você ainda não tem gastos ou receitas cadastrados.
              </Typography>
            </Container>
          ) : (
            <View>
              {sortedTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </View>
          )}
        </Container>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl,
  },
  emptyCard: {
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  }
});
