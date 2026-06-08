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
  const t = await getTranslations({ locale, namespace: 'metadata.records' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://gym-slave.vercel.app${locale === routing.defaultLocale ? '' : `/${locale}`}/records`,
    },
    openGraph: {
      title: `${t('title')} | Gym Slave`,
      description: t('description'),
    },
  };
}

export default function RecordsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#140707', color: '#ffdad8', fontFamily: 'var(--font-hanken)' }}
    >
      <Header />
      <div className="pt-24 px-6 md:px-12 pb-12">
        {children}
      </div>
    </div>
  );
}
