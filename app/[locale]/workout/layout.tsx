import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.workout' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://gym-slave.vercel.app${locale === routing.defaultLocale ? '' : `/${locale}`}/workout`,
    },
    openGraph: {
      title: `${t('title')} | Gym Slave`,
      description: t('description'),
    },
  };
}

export default function WorkoutLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
