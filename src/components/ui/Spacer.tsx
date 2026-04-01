import React from 'react';
import { View } from 'react-native';
import { theme } from '@/src/styles/theme';

interface SpacerProps {
  size?: keyof typeof theme.spacing;
  horizontal?: boolean;
}

export function Spacer({ size = 'md', horizontal = false }: SpacerProps) {
  const value = theme.spacing[size];

  return (
    <View
      style={{
        width: horizontal ? value : 0,
        height: horizontal ? 0 : value,
      }}
    />
  );
}
