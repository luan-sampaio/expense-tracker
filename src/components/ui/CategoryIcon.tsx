import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { CategoryMeta } from '@/src/constants/categories';
import { theme } from '@/src/styles/theme';
import { StyleSheet, View } from 'react-native';

type CategoryIconSize = 'sm' | 'md' | 'lg';

interface CategoryIconProps {
  category: CategoryMeta;
  size?: CategoryIconSize;
}

const ICON_SIZE = {
  sm: 18,
  md: 24,
  lg: 34,
};

const CONTAINER_SIZE = {
  sm: 36,
  md: 48,
  lg: 72,
};

export function CategoryIcon({ category, size = 'md' }: CategoryIconProps) {
  const containerSize = CONTAINER_SIZE[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          backgroundColor: category.backgroundColor,
        },
      ]}
    >
      <MaterialIcons
        name={category.iconName}
        size={ICON_SIZE[size]}
        color={category.color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
