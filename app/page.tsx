'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';

export default function Home() {
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Wait for zustand persist hydration to load profile from localStorage
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (profile.onboardingCompleted) {
      router.replace('/dashboard');
    } else {
      router.replace('/onboarding');
    }
  }, [hydrated, profile.onboardingCompleted, router]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: '#0d0d0d', color: '#ffdad8' }}
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
          IRON_PULSE
        </div>
        <div className="w-8 h-8 border-4 border-t-red-600 border-r-transparent border-b-orange-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

