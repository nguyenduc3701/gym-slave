'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconBarbell,
  IconSalad,
  IconChartBar,
  IconSettings,
  IconFlame,
  IconX,
} from '@tabler/icons-react';
import { Text, ActionIcon, Divider } from '@mantine/core';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: IconLayoutDashboard },
  { label: 'Workout', href: '/workout', icon: IconBarbell },
  { label: 'Nutrition', href: '/nutrition', icon: IconSalad },
  { label: 'Progress', href: '/progress', icon: IconChartBar },
  { label: 'Settings', href: '/settings', icon: IconSettings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

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
              {APP_NAME.toUpperCase()}
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
          <p className="label-caps px-3 py-2 mb-1">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn('sidebar-nav-item', isActive && 'active')}
              >
                <Icon size={18} stroke={isActive ? 2.5 : 1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom info */}
        <div className="p-4 border-t border-white/[0.06]">
          <p className="label-caps text-center" style={{ color: '#5f3e3e' }}>
            APEX PERFORMANCE v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
