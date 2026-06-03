export const APP_NAME = 'Ignite Fitness';
export const APP_TAGLINE = 'TRAIN. TRACK. DOMINATE.';

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Workout', href: '/workout', icon: 'workout' },
  { label: 'Nutrition', href: '/nutrition', icon: 'nutrition' },
  { label: 'Progress', href: '/progress', icon: 'progress' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
] as const;

export const COLORS = {
  primary: '#ff003c',
  secondary: '#fe6b00',
  surface: '#1a1a1a',
  surfaceHigh: '#262626',
  background: '#0d0d0d',
} as const;
