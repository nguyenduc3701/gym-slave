'use client';

import { useEffect } from 'react';
import { MantineProvider, createTheme, mergeMantineTheme, rem } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useUserStore } from '@/store/useUserStore';
import { getPreset } from '@/styles/presets';
import { theme as baseTheme } from '@/styles/theme';

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const themePreset = useUserStore((s) => s.profile.themePreset ?? 'default');
  const preset = getPreset(themePreset);

  // Áp dụng CSS custom properties lên :root để các phần hardcode cũng đổi màu
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', preset.cssVars.primary);
    root.style.setProperty('--color-secondary', preset.cssVars.secondary);
    root.style.setProperty('--color-on-bg', preset.cssVars.onBg);
    root.style.setProperty('--color-on-surface', preset.cssVars.onSurface);
    root.style.setProperty('--color-on-surface-variant', preset.cssVars.onSurfaceVariant);
    root.style.setProperty('--color-outline', preset.cssVars.outline);
    root.style.setProperty('--color-outline-variant', preset.cssVars.outlineVariant);
    root.style.setProperty('--preset-gradient-from', preset.gradient[0]);
    root.style.setProperty('--preset-gradient-to', preset.gradient[1]);
    root.style.setProperty('--preset-header-bg', preset.headerBg);
    root.style.setProperty('--preset-header-border', preset.headerBorder);
  }, [preset]);

  // Override theme với màu preset hiện tại
  const dynamicTheme = mergeMantineTheme(
    baseTheme,
    createTheme({
      primaryColor: 'presetPrimary',
      colors: {
        presetPrimary: preset.primary,
        presetSecondary: preset.secondary,
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
                borderColor: preset.gradient[1],
                boxShadow: `0 0 20px ${preset.gradient[1]}26`,
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
    })
  );

  return (
    <MantineProvider theme={dynamicTheme} forceColorScheme="dark">
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  );
}
