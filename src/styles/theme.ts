export const theme = {
  colors: {
    background: '#FFFFFF', // Pure white background
    surface: '#F6F6F8', // Subtle off-white for cards/containers
    primaryText: '#1C1C1E', // Almost black for high contrast minimal text
    secondaryText: '#8E8E93', // Clean gray for supporting text
    border: '#E5E5EA', // Ultra light gray for separators
    income: '#34C759', // Vibrant but soft green
    incomeBackground: '#E8F5E9',
    expense: '#FF3B30', // Vibrant red
    expenseBackground: '#FFEBEE',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  typography: {
    sizes: {
      caption: 12,
      body: 15,
      title: 20,
      heading: 28,
      hero: 40,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    } as const,
  },
  borderRadius: {
    sm: 8,
    md: 14, // iOS style roundness
    lg: 20,
    pill: 9999,
  },
};

export type ThemeType = typeof theme;
