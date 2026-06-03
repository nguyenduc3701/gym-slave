import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const baseUrl = 'https://gym-slave.vercel.app';
const now = new Date();

const pages = [
  { path: '', priority: 1.0, changeFrequency: 'monthly' as const },
  { path: '/onboarding', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/dashboard', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/workout', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/nutrition', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/progress', priority: 0.7, changeFrequency: 'weekly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const page of pages) {
      const localePrefx = locale === routing.defaultLocale ? '' : `/${locale}`;
      const url = `${baseUrl}${localePrefx}${page.path || '/'}`.replace(/\/$/, '') || baseUrl;

      entries.push({
        url: url === baseUrl ? baseUrl : url,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((loc) => {
              const locPrefix = loc === routing.defaultLocale ? '' : `/${loc}`;
              const locUrl = `${baseUrl}${locPrefix}${page.path || '/'}`.replace(/\/$/, '') || baseUrl;
              return [loc, locUrl === baseUrl ? baseUrl : locUrl];
            })
          ),
        },
      });
    }
  }

  return entries;
}
