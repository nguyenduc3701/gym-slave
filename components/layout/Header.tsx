'use client';

import { ActionIcon, Avatar, Badge, Text, Indicator } from '@mantine/core';
import { IconMenu2, IconBell } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAppStore } from '@/store/useAppStore';
import { useUserStore } from '@/store/useUserStore';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function Header() {
  const pathname = usePathname();
  const { toggleSidebar } = useAppStore();
  const { profile } = useUserStore();
  const t = useTranslations('header');

  // Map pathname segment to translation key
  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return t('pages.dashboard');
    if (pathname.includes('/workout')) return t('pages.workout');
    if (pathname.includes('/nutrition')) return t('pages.nutrition');
    if (pathname.includes('/progress')) return t('pages.progress');
    if (pathname.includes('/settings')) return t('pages.settings');
    return 'Gym Slave';
  };

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b border-white/[0.06]"
      style={{ backgroundColor: 'rgba(13,13,13,0.85)', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center gap-4">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <IconMenu2 size={20} />
        </ActionIcon>
        <div>
          <p className="label-caps" style={{ color: '#5f3e3e' }}>
            {t('brand')}
          </p>
          <Text
            style={{
              fontFamily: 'var(--font-anybody)',
              fontWeight: 700,
              fontSize: '20px',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {getPageTitle()}
          </Text>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <LanguageSwitcher />

        <Indicator color="red" size={8} offset={4}>
          <ActionIcon variant="subtle" color="gray" size="lg" radius="lg">
            <IconBell size={18} />
          </ActionIcon>
        </Indicator>

        <div className="flex items-center gap-2 pl-3 border-l border-white/[0.08]">
          <div className="text-right hidden sm:block">
            <Text size="sm" fw={600} lh={1.2}>
              {profile.name}
            </Text>
            <Badge
              size="xs"
              variant="light"
              color="fireRed"
              style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px' }}
            >
              {profile.goal.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <Avatar
            size={36}
            radius="xl"
            style={{
              background: 'linear-gradient(135deg, #ff003c, #fe6b00)',
              fontFamily: 'var(--font-anybody)',
              fontWeight: 700,
            }}
          >
            {profile.name.charAt(0)}
          </Avatar>
        </div>
      </div>
    </header>
  );
}
