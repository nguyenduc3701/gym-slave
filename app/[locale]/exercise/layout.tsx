import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  let title = 'Thư viện bài tập';
  let description = 'Xem danh sách và kỹ thuật các bài tập gym cá nhân hoá.';
  try {
    const t = await getTranslations({ locale, namespace: 'metadata.workout' });
    title = t('title');
    description = t('description');
  } catch (e) {}

  return {
    title,
    description,
    alternates: {
      canonical: `https://gym-slave.vercel.app${locale === routing.defaultLocale ? '' : `/${locale}`}/exercise`,
    },
    openGraph: {
      title: `${title} | Gym Slave`,
      description,
    },
  };
}

export default function ExerciseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#140707', color: '#ffdad8', fontFamily: 'var(--font-hanken)' }}
    >
      <Header />
      <div className="pt-24">
        {children}
      </div>
    </div>
  );
}
