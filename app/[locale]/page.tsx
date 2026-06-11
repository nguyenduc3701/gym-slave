'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { useLocale } from 'next-intl';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://gym-slave.vercel.app/#website',
      url: 'https://gym-slave.vercel.app',
      name: 'Gym Slave',
      description:
        'Ứng dụng lập lịch tập gym cá nhân hoá theo cơ thể, giới tính và mục tiêu tập luyện.',
      inLanguage: 'vi',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://gym-slave.vercel.app/dashboard',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://gym-slave.vercel.app/#app',
      name: 'Gym Slave',
      url: 'https://gym-slave.vercel.app',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      inLanguage: 'vi',
      description:
        'Gym Slave là ứng dụng web giúp bạn lập lịch tập gym cá nhân hoá dựa trên cơ thể, giới tính, mục tiêu và cường độ tập luyện. Hỗ trợ theo dõi workout, dinh dưỡng và tiến độ theo thời gian.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'VND',
      },
      featureList: [
        'Lập lịch tập gym cá nhân hoá',
        'Theo dõi workout hàng tuần',
        'Quản lý dinh dưỡng và calo',
        'Biểu đồ tiến độ tập luyện',
        'Hỗ trợ cả nam và nữ',
        'Bài tập cho từng nhóm cơ',
        'Cardio và bài tập cơ bắp',
      ],
      keywords: 'gym, lịch tập gym, workout, tập thể dục, dinh dưỡng gym, fitness',
    },
    {
      '@type': 'Organization',
      '@id': 'https://gym-slave.vercel.app/#organization',
      name: 'Gym Slave',
      url: 'https://gym-slave.vercel.app',
      description: 'Nền tảng lịch tập gym cá nhân hoá cho người Việt.',
    },
  ],
};

export default function Home() {
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);
  const [hydrated, setHydrated] = useState(false);
  const currentLocale = useLocale();

  useEffect(() => {
    // Wait for zustand persist hydration to load profile from localStorage
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    let targetLocale = currentLocale;
    const savedLocale = localStorage.getItem('preferred_locale');
    if (savedLocale && ['en', 'vi', 'fr', 'ko', 'zh', 'ja', 'pt'].includes(savedLocale)) {
      targetLocale = savedLocale;
    }

    const nextPath = profile.onboardingCompleted ? '/dashboard' : '/onboarding';
    
    // next-intl default route is usually without prefix for default locale, but since we're replacing, 
    // it's safer to use the targetLocale directly to let next-intl middleware handle the redirect or just prepend it.
    // Assuming 'en' is the default and 'as-needed' is used:
    if (targetLocale === 'en') {
      router.replace(nextPath);
    } else {
      router.replace(`/${targetLocale}${nextPath}`);
    }
  }, [hydrated, profile.onboardingCompleted, router, currentLocale]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: '#0d0d0d', color: 'var(--color-on-bg)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            style={{
              fontFamily: 'var(--font-anybody)',
              fontWeight: 800,
              fontSize: '32px',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
            className="gradient-text animate-pulse"
          >
            GYM SLAVE
          </div>
          <div className="w-8 h-8 border-4 border-t-red-600 border-r-transparent border-b-orange-500 border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </>
  );
}
