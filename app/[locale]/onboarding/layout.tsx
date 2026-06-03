import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.onboarding' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://gym-slave.vercel.app${locale === routing.defaultLocale ? '' : `/${locale}`}/onboarding`,
    },
  };
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
