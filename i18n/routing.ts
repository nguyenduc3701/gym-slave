import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['vi', 'en', 'fr', 'ko', 'zh', 'ja', 'pt'],
  defaultLocale: 'en',
  localePrefix: 'as-needed', // 'en' không có prefix trong URL
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

