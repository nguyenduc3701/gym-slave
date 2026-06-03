import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.dashboard' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://gym-slave.vercel.app${locale === routing.defaultLocale ? '' : `/${locale}`}/dashboard`,
    },
    openGraph: {
      title: `${t('title')} | Gym Slave`,
      description: t('description'),
    },
  };
}

// Dashboard uses its own full-page layout (matching IRON_PULSE Stitch design)
// No wrapping DashboardLayout needed
export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
