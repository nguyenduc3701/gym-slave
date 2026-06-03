import type { Metadata } from 'next';
import { Anybody, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import './globals.css';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://gym-slave.vercel.app'),
  title: {
    template: '%s | Gym Slave',
    default: 'Gym Slave – Train Hard. Track Smart. Dominate.',
  },
  description:
    'Gym Slave là ứng dụng quản lý lịch tập gym cá nhân hoá theo cơ thể, giới tính và mục tiêu của bạn.',
  keywords: [
    'gym', 'lịch tập gym', 'tập gym', 'workout tracker', 'gym slave',
    'fitness app', 'personal training', 'gym schedule', 'health app',
  ],
  authors: [{ name: 'Gym Slave Team' }],
  creator: 'Gym Slave',
  publisher: 'Gym Slave',
  openGraph: {
    type: 'website',
    siteName: 'Gym Slave',
    title: 'Gym Slave – Train Hard. Track Smart. Dominate.',
    description: 'Personalized gym schedule app tailored to your body, gender and goals.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Gym Slave' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gym Slave – Train Hard. Track Smart. Dominate.',
    description: 'Personalized gym schedule app tailored to your body, gender and goals.',
    images: ['/og-image.png'],
    creator: '@gymslave',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Note: lang is set dynamically per locale in app/[locale]/layout.tsx
    // This root layout provides global fonts, styles and Mantine
    <html suppressHydrationWarning>
      <head>
        <ColorSchemeScript forceColorScheme="dark" />
      </head>
      <body className={`${anybody.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`}>
        <MantineProvider theme={theme} forceColorScheme="dark">
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
