import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { Anybody, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import '../globals.css';
import { theme } from '@/styles/theme';

const anybody = Anybody({
  subsets: ['latin'],
  variable: '--font-anybody',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600', '700'],
});

type Locale = 'vi' | 'en' | 'fr' | 'ko' | 'zh' | 'ja' | 'pt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });

  return {
    title: {
      template: '%s - Gym Slave - Cá nhân hoá lịch tập',
      default: t('title'),
    },
    description: t('description'),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering for all pages under [locale]
  setRequestLocale(locale);

  const messages = await getMessages();

  const langMap: Record<Locale, string> = {
    vi: 'vi',
    en: 'en',
    fr: 'fr',
    ko: 'ko',
    zh: 'zh-Hans',
    ja: 'ja',
    pt: 'pt',
  };

  return (
    <html lang={langMap[locale as Locale] ?? locale} suppressHydrationWarning>
      <head>
        <ColorSchemeScript forceColorScheme="dark" />
      </head>
      <body className={`${anybody.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`}>
        <MantineProvider theme={theme} forceColorScheme="dark">
          <Notifications position="top-right" />
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

