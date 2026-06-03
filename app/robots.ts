import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://gym-slave.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/onboarding', '/dashboard', '/workout', '/nutrition', '/progress'],
        disallow: ['/settings', '/api/'],
      },
      // Cho phép các AI crawlers phổ biến
      {
        userAgent: 'GPTBot',
        allow: ['/', '/onboarding', '/dashboard', '/workout', '/nutrition', '/progress'],
        disallow: ['/settings', '/api/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/', '/onboarding', '/dashboard', '/workout', '/nutrition', '/progress'],
        disallow: ['/settings', '/api/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/onboarding', '/dashboard', '/workout', '/nutrition', '/progress'],
        disallow: ['/settings', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
