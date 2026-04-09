import { Button } from '@/src/components/ui/Button';
import { CategoryPicker } from '@/src/components/ui/CategoryPicker';
import { Container } from '@/src/components/ui/Container';
import { Input } from '@/src/components/ui/Input';
import { Spacer } from '@/src/components/ui/Spacer';
import { Typography } from '@/src/components/ui/Typography';
import { useExpenseStore } from '@/src/store/useExpenseStore';
import { theme } from '@/src/styles/theme';
import { TransactionType } from '@/src/types';
import { parseAmount, TransactionFormErrors, validateTransactionForm } from '@/src/utils/validation';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

export default function ModalScreen() {
  const params = useLocalSearchParams();
  const addTransaction = useExpenseStore((state) => state.addTransaction);
  const updateTransaction = useExpenseStore((state) => state.updateTransaction);
  
  const isEditing = !!params.editId;
  const editId = params.editId as string | undefined;

  const [type, setType] = useState<TransactionType>((params.editType as TransactionType) || 'expense');
  const [amount, setAmount] = useState((params.editAmount as string) || '');
  const [description, setDescription] = useState((params.editDescription as string) || '');
  const [category, setCategory] = useState<string>((params.editCategory as string) || 'other');
  const [errors, setErrors] = useState<TransactionFormErrors>({ amount: '', description: '' });

  const handleSave = () => {
    const { errors: newErrors, isValid } = validateTransactionForm({ amount, description });
    setErrors(newErrors);
    if (!isValid) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    const numericAmount = parseAmount(amount);

    if (isEditing && editId) {
      updateTransaction(editId, {
        amount: numericAmount,
        description: description.trim(),
        type,
        category: category.trim().toLowerCase(),
      });
    } else {
      addTransaction({
        amount: numericAmount,
        description: description.trim(),
        type,
        category: category.trim().toLowerCase(),
        date: new Date().toISOString(),
      });
    }
    
    router.back();
  };

  return (
    <Container padding="lg">
      <Stack.Screen options={{ title: isEditing ? 'Editar Transação' : 'Nova Transação' }} />
      
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
        onChangeText={(text) => {
          setAmount(text);
          if (errors.amount) setErrors({ ...errors, amount: '' });
        }}
      />
      {errors.amount ? (
        <Typography variant="caption" color={theme.colors.expense} style={{ marginTop: 4 }}>
          {errors.amount}
        </Typography>
      ) : null}
      <Spacer size="lg" />

      <Input 
        label="Descrição" 
        placeholder="Ex: Conta de Luz, Salário" 
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          if (errors.description) setErrors({ ...errors, description: '' });
        }}
      />
      {errors.description ? (
        <Typography variant="caption" color={theme.colors.expense} style={{ marginTop: 4 }}>
          {errors.description}
        </Typography>
      ) : null}
      <Spacer size="lg" />

      <CategoryPicker 
        selectedCategory={category}
        onSelectCategory={setCategory}
        type={type}
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
