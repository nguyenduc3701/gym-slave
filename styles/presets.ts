import { MantineColorsTuple } from '@mantine/core';

export type ThemePresetKey = 'default' | 'cyber-purple' | 'toxic-green' | 'earth-brown' | 'ocean-blue';

export interface ThemePreset {
  key: ThemePresetKey;
  label: string;
  description: string;
  primary: MantineColorsTuple;
  secondary: MantineColorsTuple;
  primaryColor: string;
  secondaryColor: string;
  /** Màu gradient text (logo, tiêu đề) */
  gradient: [string, string];
  /** Màu nền header + border */
  headerBg: string;
  headerBorder: string;
  /** Màu CSS vars */
  cssVars: {
    primary: string;
    secondary: string;
    onBg: string;
    onSurface: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
  };
}

// ── 1. DEFAULT: Đen / Đỏ / Cam (hiện tại) ──────────────────
const fireRed: MantineColorsTuple = [
  '#ffdad8', '#ffb3b2', '#ff8a8a', '#ff6060', '#ff3636',
  '#ff003c', '#e0002f', '#bf002a', '#92001e', '#680012',
];
const burnOrange: MantineColorsTuple = [
  '#ffdbcc', '#ffb693', '#ff9060', '#ff7830', '#ff8500',
  '#fe6b00', '#e06000', '#bf5200', '#7a3000', '#561f00',
];

// ── 2. CYBER PURPLE: Đen / Tím / Hồng Neon ─────────────────
const neonPurple: MantineColorsTuple = [
  '#f3d6ff', '#e4adff', '#d480ff', '#c44fff', '#b824ff',
  '#a800f0', '#9200d0', '#7c00b0', '#5e0086', '#400060',
];
const hotPink: MantineColorsTuple = [
  '#ffe4f8', '#ffc3ef', '#ff9de4', '#ff72d9', '#ff4ace',
  '#f020c0', '#d010a8', '#b00090', '#820068', '#5c0049',
];

// ── 3. TOXIC GREEN: Đen / Xanh Lá Neon ─────────────────────
const neonGreen: MantineColorsTuple = [
  '#d8ffe4', '#acffca', '#78ffab', '#44ff8c', '#1aff74',
  '#00e85a', '#00c84c', '#00a83e', '#007d2d', '#00561e',
];
const acidLime: MantineColorsTuple = [
  '#edffd4', '#d8ffa6', '#c0ff72', '#a8ff3e', '#97f020',
  '#84d400', '#6eb800', '#569800', '#3e7000', '#284a00',
];

// ── 4. EARTH BROWN: Xám / Nâu / Đất ───────────────────────
const warmBrown: MantineColorsTuple = [
  '#f8ece0', '#efd3b8', '#e5b98c', '#da9e60', '#d08a3a',
  '#c47520', '#ac651a', '#905314', '#6e3d0c', '#4e2b06',
];
const sandGold: MantineColorsTuple = [
  '#fff9e6', '#fff0c0', '#ffe694', '#ffdb68', '#ffd040',
  '#f0ba00', '#d0a000', '#b08800', '#846400', '#5c4400',
];

// ── 5. OCEAN BLUE: Đen / Xanh Dương / Cyan ─────────────────
const electricBlue: MantineColorsTuple = [
  '#d6eeff', '#a8d6ff', '#72b8ff', '#3c9aff', '#1480ff',
  '#0060f0', '#0050d0', '#0040b0', '#003080', '#00205a',
];
const deepCyan: MantineColorsTuple = [
  '#d0faff', '#9ef4ff', '#60eeff', '#22e8ff', '#00d8f0',
  '#00bcd4', '#00a4ba', '#008a9e', '#006678', '#004455',
];

// ── Tổng hợp tất cả presets ─────────────────────────────────
export const COLOR_PRESETS: ThemePreset[] = [
  {
    key: 'default',
    label: 'Đen / Đỏ / Cam',
    description: 'Cổ điển – cháy bỏng',
    primary: fireRed,
    secondary: burnOrange,
    primaryColor: 'presetPrimary',
    secondaryColor: 'presetSecondary',
    gradient: ['#ff003c', '#fe6b00'],
    headerBg: 'rgba(20, 7, 7, 0.85)',
    headerBorder: '#4e2a2a',
    cssVars: {
      primary: '#ff003c',
      secondary: '#fe6b00',
      onBg: '#ffdad8',
      onSurface: '#ffdad8',
      onSurfaceVariant: '#e9bcba',
      outline: '#af8786',
      outlineVariant: '#5f3e3e',
    },
  },
  {
    key: 'cyber-purple',
    label: 'Đen / Tím / Hồng',
    description: 'Cyberpunk – huyền ảo',
    primary: neonPurple,
    secondary: hotPink,
    primaryColor: 'presetPrimary',
    secondaryColor: 'presetSecondary',
    gradient: ['#a800f0', '#f020c0'],
    headerBg: 'rgba(10, 5, 20, 0.85)',
    headerBorder: '#3a1a5a',
    cssVars: {
      primary: '#a800f0',
      secondary: '#f020c0',
      onBg: '#f3d6ff',
      onSurface: '#f3d6ff',
      onSurfaceVariant: '#d9aaee',
      outline: '#9b72b0',
      outlineVariant: '#4a2260',
    },
  },
  {
    key: 'toxic-green',
    label: 'Đen / Xanh Lá Neon',
    description: 'Toxic – áp đảo',
    primary: neonGreen,
    secondary: acidLime,
    primaryColor: 'presetPrimary',
    secondaryColor: 'presetSecondary',
    gradient: ['#00e85a', '#84d400'],
    headerBg: 'rgba(4, 14, 6, 0.85)',
    headerBorder: '#0a3a12',
    cssVars: {
      primary: '#00e85a',
      secondary: '#84d400',
      onBg: '#d8ffe4',
      onSurface: '#d8ffe4',
      onSurfaceVariant: '#aae8bc',
      outline: '#6aaa80',
      outlineVariant: '#1a4a26',
    },
  },
  {
    key: 'earth-brown',
    label: 'Xám / Nâu / Vàng Đất',
    description: 'Earthy – ấm áp, mạnh mẽ',
    primary: warmBrown,
    secondary: sandGold,
    primaryColor: 'presetPrimary',
    secondaryColor: 'presetSecondary',
    gradient: ['#c47520', '#f0ba00'],
    headerBg: 'rgba(16, 12, 6, 0.85)',
    headerBorder: '#4a3318',
    cssVars: {
      primary: '#c47520',
      secondary: '#f0ba00',
      onBg: '#f8ece0',
      onSurface: '#f8ece0',
      onSurfaceVariant: '#e0c8a8',
      outline: '#a89070',
      outlineVariant: '#604830',
    },
  },
  {
    key: 'ocean-blue',
    label: 'Đen / Xanh Dương / Cyan',
    description: 'Ocean – lạnh ngắt, bất bại',
    primary: electricBlue,
    secondary: deepCyan,
    primaryColor: 'presetPrimary',
    secondaryColor: 'presetSecondary',
    gradient: ['#0060f0', '#00bcd4'],
    headerBg: 'rgba(4, 8, 20, 0.85)',
    headerBorder: '#0a2050',
    cssVars: {
      primary: '#0060f0',
      secondary: '#00bcd4',
      onBg: '#d6eeff',
      onSurface: '#d6eeff',
      onSurfaceVariant: '#a8ccee',
      outline: '#6090b8',
      outlineVariant: '#1a3060',
    },
  },
];

export const DEFAULT_PRESET = COLOR_PRESETS[0];

export function getPreset(key: ThemePresetKey): ThemePreset {
  return COLOR_PRESETS.find((p) => p.key === key) ?? DEFAULT_PRESET;
}
