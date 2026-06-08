'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  IconLayoutDashboard,
  IconBarbell,
  IconSalad,
  IconChartBar,
  IconSettings,
  IconFlame,
  IconX,
  IconClipboardList,
} from '@tabler/icons-react';
import { Text, ActionIcon, Divider } from '@mantine/core';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { routing } from '@/i18n/routing';

export function Sidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const t = useTranslations('nav');

  const localePath = (path: string) =>
    locale === routing.defaultLocale ? path : `/${locale}${path}`;

  const navItems = [
    { labelKey: 'dashboard', href: '/dashboard', icon: IconLayoutDashboard },
    { labelKey: 'workout', href: '/workout', icon: IconBarbell },
    { labelKey: 'nutrition', href: '/nutrition', icon: IconSalad },
    { labelKey: 'progress', href: '/progress', icon: IconChartBar },
    { labelKey: 'records', href: '/records', icon: IconClipboardList },
    { labelKey: 'settings', href: '/settings', icon: IconSettings },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full flex flex-col transition-transform duration-300 ease-in-out',
          'w-64 border-r border-white/[0.06]',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ backgroundColor: '#111111' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #ff003c, #fe6b00)' }}
            >
              <IconFlame size={18} color="white" stroke={2.5} />
            </div>
            <Text
              style={{
                fontFamily: 'var(--font-anybody)',
                fontWeight: 800,
                fontSize: '18px',
                letterSpacing: '-0.02em',
              }}
              className="gradient-text"
            >
              GYM SLAVE
            </Text>
          </div>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <IconX size={16} />
          </ActionIcon>
        </div>

        <Divider color="rgba(255,255,255,0.06)" />

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <p className="label-caps px-3 py-2 mb-1">{t('mainMenu')}</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const href = localePath(item.href);
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={item.href}
                href={href}
                className={cn('sidebar-nav-item', isActive && 'active')}
              >
                <Icon size={18} stroke={isActive ? 2.5 : 1.8} />
                {t(item.labelKey as 'dashboard' | 'workout' | 'nutrition' | 'progress' | 'settings')}
              </Link>
            );
          })}
        </nav>

        {/* Bottom info */}
        <div className="p-4 border-t border-white/[0.06]">
          <p className="label-caps text-center" style={{ color: '#5f3e3e' }}>
            GYM SLAVE v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
