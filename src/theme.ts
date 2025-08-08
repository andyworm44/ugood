export const theme = {
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F8F9FA',
    border: '#E9ECEF',
    text: '#333333',
    subtext: '#666666',
    muted: '#999999',
    primary: '#8FB68E',
    danger: '#FF6B6B',
    success: '#4CAF50',
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 24,
  },
  shadow: {
    card: {
      shadowColor: 'rgba(0,0,0,0.08)',
      shadowOffset: { width: 0, height: 4 } as const,
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

export type Theme = typeof theme;

export default theme;


