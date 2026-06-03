'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Menu, ActionIcon, Text } from '@mantine/core';
import { IconWorld, IconCheck } from '@tabler/icons-react';
import { routing } from '@/i18n/routing';

const LOCALE_CONFIG = [
  { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'ko', flag: '🇰🇷', name: '한국어' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentConfig = LOCALE_CONFIG.find((l) => l.code === locale) ?? LOCALE_CONFIG[0];

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    
    // Save to localStorage
    localStorage.setItem('preferred_locale', newLocale);

    // Use next-intl router to push pathname with new locale
    router.push(pathname, { locale: newLocale });
  };

  return (
    <Menu
      shadow="xl"
      width={180}
      position="bottom-end"
      styles={{
        dropdown: {
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
        },
        item: {
          color: '#ffdad8',
          borderRadius: '8px',
          '&[data-hovered]': {
            backgroundColor: 'rgba(255,255,255,0.06)',
          },
        },
      }}
    >
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          radius="lg"
          aria-label="Switch language"
          title="Switch language"
          style={{ position: 'relative' }}
        >
          <IconWorld size={18} />
          <span
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              fontSize: '10px',
              lineHeight: 1,
            }}
          >
            {currentConfig.flag}
          </span>
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '10px',
            letterSpacing: '0.08em',
            color: '#5f3e3e',
            textTransform: 'uppercase',
          }}
        >
          Language
        </Menu.Label>
        {LOCALE_CONFIG.map((lang) => (
          <Menu.Item
            key={lang.code}
            onClick={() => switchLocale(lang.code)}
            leftSection={
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{lang.flag}</span>
            }
            rightSection={
              locale === lang.code ? (
                <IconCheck size={14} color="#ff003c" />
              ) : null
            }
          >
            <Text size="sm" fw={locale === lang.code ? 700 : 400}>
              {lang.name}
            </Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
