'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { 
  IconMenu2, 
  IconX,
  IconHome,
  IconBarbell,
  IconBook,
  IconRuler,
  IconRefresh,
  IconSettings
} from '@tabler/icons-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useUserStore } from '@/store/useUserStore';
import { routing } from '@/i18n/routing';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { resetStore } = useUserStore();
  const t = useTranslations('dashboard');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const localePath = (path: string) =>
    locale === routing.defaultLocale ? path : `/${locale}${path}`;

  const localeLabels = {
    vi: { home: 'Trang chủ', exercise: 'Bài tập', records: 'Nhật Ký', measurements: 'Số Đo', nutrition: 'Dinh Dưỡng', progress: 'Tiến Độ', settings: 'Cài Đặt' },
    en: { home: 'Home', exercise: 'Exercise', records: 'Records', measurements: 'Measurements', nutrition: 'Nutrition', progress: 'Progress', settings: 'Settings' },
    fr: { home: 'Accueil', exercise: 'Exercices', records: 'Historique', measurements: 'Mesures', nutrition: 'Nutrition', progress: 'Progrès', settings: 'Paramètres' },
    ko: { home: '홈', exercise: '운동', records: '기록', measurements: '측정', nutrition: '영양', progress: '진행', settings: '설정' },
    zh: { home: '首页', exercise: '运动', records: '记录', measurements: '测量', nutrition: '营养', progress: '进度', settings: '设置' },
    ja: { home: 'ホーム', exercise: 'エクササイズ', records: '記録', measurements: '測定', nutrition: '栄養', progress: '進捗', settings: '設定' },
    pt: { home: 'Início', exercise: 'Exercícios', records: 'Registros', measurements: 'Medidas', nutrition: 'Nutrição', progress: 'Progresso', settings: 'Configurações' }
  };
  const labels = localeLabels[locale as keyof typeof localeLabels] || localeLabels.en;

  const handleRecreateWorkout = () => {
    resetStore();
    router.push(localePath('/onboarding'));
  };

  const isExercise = pathname.includes('/exercise');

  const navLinks = [
    { href: '/dashboard', label: labels.home, icon: <IconHome size={20} /> },
    { href: '/exercise', label: labels.exercise, icon: <IconBarbell size={20} /> },
    { href: '/records', label: labels.records, icon: <IconBook size={20} /> },
    { href: '/measurements', label: labels.measurements, icon: <IconRuler size={20} /> },
    { href: '/settings', label: labels.settings, icon: <IconSettings size={20} /> },
  ];

  return (
    <nav
      className="fixed top-0 w-full z-50 border-b"
      style={{
        backgroundColor: 'var(--preset-header-bg)',
        backdropFilter: 'blur(16px)',
        borderColor: 'var(--preset-header-border)',
      }}
    >
      <div className="flex justify-between items-center w-full px-4 md:px-12 max-w-[1200px] mx-auto h-16 relative">
        <div className="flex items-center gap-3">
          {/* Mobile Burger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[var(--color-on-bg)] hover:text-white hover:bg-white/5 rounded-lg active:scale-95 transition-all"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {mobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </button>

          {/* Logo */}
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
            className="gradient-text"
          >
            GYM SLAVE
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Navigation Links (Only show first 4 to avoid clutter) */}
          <div className="hidden lg:flex items-center gap-6 mr-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localePath(link.href)}
                className="text-xs uppercase font-bold tracking-wider hover:text-[var(--color-primary)] transition-colors"
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  color: pathname.includes(link.href) ? 'var(--color-primary)' : 'var(--color-on-bg)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <LanguageSwitcher />

          {/* Hide recreate button on mobile and /exercise page */}
          {!isExercise && (
            <button
              onClick={handleRecreateWorkout}
              className="hidden md:flex items-center gap-2 px-5 py-2 rounded-lg uppercase transition-all active:scale-95 font-bold"
              style={{
                background: 'linear-gradient(135deg, var(--preset-gradient-from), var(--preset-gradient-to))',
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

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute left-0 top-0 w-full max-h-[calc(100vh-64px)] overflow-y-auto border-b flex flex-col p-4 shadow-xl shadow-black/50"
              style={{
                backgroundColor: 'rgba(13, 5, 5, 0.98)',
                borderColor: 'var(--preset-header-border)',
              }}
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname.includes(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={localePath(link.href)}
                      className={`flex items-center gap-4 text-sm uppercase font-bold tracking-wider py-4 px-4 rounded-xl transition-colors ${
                        isActive ? 'bg-[var(--color-primary)]/10 text-[--color-primary]' : 'text-[--color-on-bg] hover:bg-white/5'
                      }`}
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        textDecoration: 'none',
                      }}
                    >
                      <span className={isActive ? 'text-[var(--color-primary)]' : 'text-[#af8786]'}>
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  );
                })}

                {/* Mobile Recreate Button */}
                {!isExercise && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <button
                      onClick={handleRecreateWorkout}
                      className="w-full flex justify-center items-center gap-2 px-5 py-4 rounded-xl uppercase transition-all active:scale-95 font-bold"
                      style={{
                        background: 'linear-gradient(135deg, var(--preset-gradient-from), var(--preset-gradient-to))',
                        color: '#fff',
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: '12px',
                        letterSpacing: '0.08em',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <IconRefresh size={18} />
                      {t('recreateBtn')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
