export const colors = {
  ink: '#0A0A0A',
  text: '#1D1D1F',
  muted: '#6E6E73',
  lime: '#C5FF3D',
  paper: '#F7F7F8',
  cream: '#F1F1F3',
  white: '#FFFFFF',
  line: '#E5E5E7',
  danger: '#B42318',
  success: '#0B8F76',
  blue: '#DFF1FF',
  peach: '#FFE7D7',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 36 } as const;
export const radius = { sm: 10, md: 14, lg: 18, xl: 24, hero: 28, pill: 999 } as const;
export const shadow = {
  card: { shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  lime: { shadowColor: colors.lime, shadowOpacity: 1, shadowRadius: 0, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
} as const;

