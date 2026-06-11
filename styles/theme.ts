import { createTheme, MantineColorsTuple, rem } from '@mantine/core';

// Apex Performance Color System from Stitch
const fireRed: MantineColorsTuple = [
  'var(--color-on-bg)', // 0
  'var(--color-on-surface-variant)', // 1
  '#ff8a8a', // 2
  '#ff6060', // 3
  '#ff3636', // 4
  'var(--color-primary)', // 5 - PRIMARY
  '#e0002f', // 6
  'var(--color-primary)', // 7
  '#92001e', // 8
  '#680012', // 9
];

const burnOrange: MantineColorsTuple = [
  '#ffdbcc', // 0
  '#ffb693', // 1
  '#ff9060', // 2
  '#ff7830', // 3
  '#ff8500', // 4
  'var(--color-secondary)', // 5 - SECONDARY
  '#e06000', // 6
  '#bf5200', // 7
  '#7a3000', // 8
  '#561f00', // 9
];

const teal: MantineColorsTuple = [
  '#8af3f5', // 0
  '#6cd7d8', // 1
  '#4abcbd', // 2
  '#2aa0a2', // 3
  '#1a8486', // 4
  '#006b6d', // 5
  '#005456', // 6
  '#004f51', // 7
  '#003738', // 8
  '#002020', // 9
];

export const theme = createTheme({
  primaryColor: 'fireRed',
  colors: {
    fireRed,
    burnOrange,
    teal,
  },
  defaultRadius: 'md',
  radius: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24),
  },
  fontFamily: 'var(--font-hanken), sans-serif',
  fontFamilyMonospace: 'var(--font-jetbrains), monospace',
  headings: {
    fontFamily: 'var(--font-anybody), sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: rem(48), lineHeight: '1.1', fontWeight: '800' },
      h2: { fontSize: rem(36), lineHeight: '1.1', fontWeight: '800' },
      h3: { fontSize: rem(24), lineHeight: '1.2', fontWeight: '700' },
      h4: { fontSize: rem(20), lineHeight: '1.3', fontWeight: '700' },
    },
  },
  spacing: {
    xs: rem(4),
    sm: rem(12),
    md: rem(24),
    lg: rem(48),
    xl: rem(80),
  },
  components: {
    Card: {
      defaultProps: {
        radius: 'lg',
        bg: '#1a1a1a',
      },
      styles: {
        root: {
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: 'var(--color-secondary)',
            boxShadow: '0 0 20px rgba(254, 107, 0, 0.15)',
          },
        },
      },
    },
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'lg',
      },
    },
    Select: {
      defaultProps: {
        radius: 'lg',
      },
    },
    Progress: {
      defaultProps: {
        radius: 'xl',
      },
    },
  },
});
