import { theme } from '@/src/styles/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Spacer } from '@/src/components/ui/Spacer';
import { Typography } from '@/src/components/ui/Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ label, error, containerStyle, style, ...rest }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <>
          <Typography variant="body" weight="semibold" color={theme.colors.primaryText}>
            {label}
          </Typography>
          <Spacer size="xs" />
        </>
      )}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        accessibilityHint={error ?? rest.accessibilityHint}
        accessibilityState={{ disabled: rest.editable === false }}
        placeholderTextColor={theme.colors.tertiaryText}
        {...rest}
      />
      {error && (
        <>
          <Spacer size="xs" />
          <View style={styles.errorRow}>
            <MaterialIcons name="error-outline" size={16} color={theme.colors.expense} />
            <Typography variant="caption" weight="semibold" color={theme.colors.expense}>
              {error}
            </Typography>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: theme.colors.surface,
    minHeight: 56,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.primaryText,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  inputError: {
    borderWidth: 2,
    borderColor: theme.colors.expense,
    backgroundColor: theme.colors.expenseBackground,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
});
