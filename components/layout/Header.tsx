'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useUserStore } from '@/store/useUserStore';
import { useAppStore } from '@/store/useAppStore';
import { routing } from '@/i18n/routing';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { resetStore } = useUserStore();
  const { toggleSidebar } = useAppStore();
  const t = useTranslations('dashboard');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const localePath = (path: string) =>
    locale === routing.defaultLocale ? path : `/${locale}${path}`;

  const localeLabels = {
    vi: { home: 'Trang chủ', exercise: 'Bài tập', records: 'Nhật Ký' },
    en: { home: 'Home', exercise: 'Exercise', records: 'Records' },
    fr: { home: 'Accueil', exercise: 'Exercices', records: 'Historique' },
    ko: { home: '홈', exercise: '운동', records: '기록' },
    zh: { home: '首页', exercise: '运动', records: '记录' },
    ja: { home: 'ホーム', exercise: 'エクササイズ', records: '記録' },
    pt: { home: 'Início', exercise: 'Exercícios', records: 'Registros' }
  };
  const labels = localeLabels[locale as keyof typeof localeLabels] || localeLabels.en;

  const handleRecreateWorkout = () => {
    resetStore();
    router.push(localePath('/onboarding'));
  };

  // Determine if the current page has a sidebar
  const isDashboard = pathname.includes('/dashboard');
  const isExercise = pathname.includes('/exercise');
  const isRecords = pathname.includes('/records');
  const hasSidebar = !isDashboard && !isExercise && !isRecords;

  // We make it absolute/fixed on dashboard and exercise (since they have no sidebar), and sticky on other pages
  const headerClass = !hasSidebar
    ? 'fixed top-0 w-full z-50 border-b'
    : 'sticky top-0 w-full z-20 border-b';

  return (
    <nav
      className={headerClass}
      style={{
        backgroundColor: 'rgba(20, 7, 7, 0.85)',
        backdropFilter: 'blur(16px)',
        borderColor: '#4e2a2a',
      }}
    >
      <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-[1200px] mx-auto h-16 relative">
        <div className="flex items-center gap-3 md:gap-8">
          {/* Burger button */}
          <button
            onClick={() => {
              if (hasSidebar) {
                toggleSidebar();
              } else {
                setMobileMenuOpen(!mobileMenuOpen);
              }
            }}
            className="md:hidden p-1 text-[#ffdad8] hover:text-white active:scale-95 transition-all"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {hasSidebar ? (
              <IconMenu2 size={22} />
            ) : mobileMenuOpen ? (
              <IconX size={22} />
            ) : (
              <IconMenu2 size={22} />
            )}
          </button>

          {/* Logo - only hide on desktop if sidebar is present to avoid double logos */}
          <Link
            href={localePath('/dashboard')}
            style={{
              fontFamily: 'var(--font-anybody)',
              fontWeight: 800,
              fontSize: '20px',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
            className={`gradient-text ${hasSidebar ? 'lg:hidden' : ''}`}
          >
            GYM SLAVE
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 mr-4">
            <Link
              href={localePath('/dashboard')}
              className="text-xs uppercase font-bold tracking-wider hover:text-[#ff003c] transition-colors"
              style={{
                fontFamily: 'var(--font-jetbrains)',
                color: '#ffb3b2',
                textDecoration: 'none',
              }}
            >
              {labels.home}
            </Link>
            <Link
              href={localePath('/exercise')}
              className="text-xs uppercase font-bold tracking-wider hover:text-[#ff003c] transition-colors"
              style={{
                fontFamily: 'var(--font-jetbrains)',
                color: '#ffb3b2',
                textDecoration: 'none',
              }}
            >
              {labels.exercise}
            </Link>
            <Link
              href={localePath('/records')}
              className="text-xs uppercase font-bold tracking-wider hover:text-[#ff003c] transition-colors"
              style={{
                fontFamily: 'var(--font-jetbrains)',
                color: '#ffb3b2',
                textDecoration: 'none',
              }}
            >
              {labels.records}
            </Link>
          </div>
          <LanguageSwitcher />
          {/* Hide recreate button on /exercise page */}
          {!isExercise && (
            <button
              onClick={handleRecreateWorkout}
              className="flex items-center gap-2 px-5 py-2 rounded-lg uppercase transition-all active:scale-95 font-bold"
              style={{
                background: 'linear-gradient(135deg, #bf002a, #fe6b00)',
                color: '#fff',
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t('recreateBtn')}
            </button>
          )}
        </div>

        {/* Mobile Menu Dropdown (only for dashboard where there is no sidebar) */}
        {!hasSidebar && mobileMenuOpen && (
          <div
            className="absolute top-16 left-0 w-full z-50 border-b flex flex-col p-4 gap-2 md:hidden"
            style={{
              backgroundColor: 'rgba(20, 7, 7, 0.95)',
              backdropFilter: 'blur(16px)',
              borderColor: '#4e2a2a',
            }}
          >
            <Link
              href={localePath('/dashboard')}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase font-bold tracking-wider py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
              style={{
                fontFamily: 'var(--font-jetbrains)',
                color: '#ffdad8',
                textDecoration: 'none',
              }}
            >
              {labels.home}
            </Link>
            <Link
              href={localePath('/exercise')}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase font-bold tracking-wider py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
              style={{
                fontFamily: 'var(--font-jetbrains)',
                color: '#ffdad8',
                textDecoration: 'none',
              }}
            >
              {labels.exercise}
            </Link>
            <Link
              href={localePath('/records')}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase font-bold tracking-wider py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
              style={{
                fontFamily: 'var(--font-jetbrains)',
                color: '#ffdad8',
                textDecoration: 'none',
              }}
            >
              {labels.records}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
