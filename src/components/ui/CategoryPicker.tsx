import { CategoryIcon } from '@/src/components/ui/CategoryIcon';
import { getCategoriesByType } from '@/src/constants/categories';
import { theme } from '@/src/styles/theme';
import { TransactionType } from '@/src/types';
import { impactFeedback } from '@/src/utils/haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '@/src/components/ui/Typography';

interface CategoryPickerProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  type: TransactionType;
}

export function CategoryPicker({ selectedCategory, onSelectCategory, type }: CategoryPickerProps) {
  const categories = getCategoriesByType(type);

  return (
    <View style={styles.container}>
      <Typography variant="body" weight="semibold" style={styles.label}>
        Categoria
      </Typography>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                {
                  backgroundColor: category.backgroundColor,
                },
                isSelected && styles.categoryItemSelected,
                isSelected && { borderColor: category.color },
              ]}
              onPress={() => {
                impactFeedback();
                onSelectCategory(category.id);
              }}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Selecionar categoria ${category.label}`}
              accessibilityState={{ selected: isSelected }}
            >
              {isSelected && (
                <View style={[styles.selectedMark, { backgroundColor: category.color }]}>
                  <MaterialIcons name="check" size={14} color={theme.colors.surface} />
                </View>
              )}
              <CategoryIcon category={category} size="sm" />
              <Typography
                variant="caption"
                weight={isSelected ? 'semibold' : 'regular'}
                color={isSelected ? category.color : theme.colors.secondaryText}
                align="center"
              >
                {category.label}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: theme.spacing.sm,
  },
  scrollContent: {
    paddingVertical: theme.spacing.xs,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 88,
    minHeight: 88,
  },
  categoryItemSelected: {
    borderWidth: 3,
    ...theme.shadows.sm,
  },
  selectedMark: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
});
