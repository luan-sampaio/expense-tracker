import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Container } from '@/src/components/ui/Container';
import { Typography } from '@/src/components/ui/Typography';
import { Spacer } from '@/src/components/ui/Spacer';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useExpenseStore } from '@/src/store/useExpenseStore';
import { TransactionType, Category } from '@/src/types';

export default function ModalScreen() {
  const addTransaction = useExpenseStore((state) => state.addTransaction);

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | string>('outros');

  const handleSave = () => {
    if (!amount || !description) return;
    
    const numericAmount = parseFloat(amount.replace(',', '.'));
    
    if (isNaN(numericAmount)) return;

    addTransaction({
      amount: numericAmount,
      description,
      type,
      category: category.toLowerCase(),
      date: new Date().toISOString(),
    });
    
    router.back();
  };

  return (
    <Container padding="lg">
      <Stack.Screen options={{ title: 'Nova Transação' }} />
      
      <Spacer size="xl" />
      <Typography variant="title" weight="bold">
        Tipo de Movimentação
      </Typography>
      <Spacer size="lg" />

      <View style={styles.typeSelector}>
        <Button 
          label="Despesa" 
          variant={type === 'expense' ? 'danger' : 'secondary'} 
          style={styles.typeButton}
          onPress={() => setType('expense')}
        />
        <Spacer size="md" horizontal />
        <Button 
          label="Receita" 
          variant={type === 'income' ? 'primary' : 'secondary'} 
          style={styles.typeButton}
          onPress={() => setType('income')}
        />
      </View>
      <Spacer size="xl" />

      <Input 
        label="Valor (R$)" 
        placeholder="0,00" 
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />
      <Spacer size="lg" />

      <Input 
        label="Descrição" 
        placeholder="Ex: Conta de Luz, Salário" 
        value={description}
        onChangeText={setDescription}
      />
      <Spacer size="lg" />

      <Input 
        label="Categoria" 
        placeholder="Ex: comida, transporte, casa" 
        value={category}
        onChangeText={setCategory}
      />
      <Spacer size="xxl" />

      <Button label="Salvar" onPress={handleSave} />
    </Container>
  );
}

const styles = StyleSheet.create({
  typeSelector: {
    flexDirection: 'row',
    width: '100%',
  },
  typeButton: {
    flex: 1,
  }
});
