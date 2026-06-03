import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const metadata: Metadata = { title: 'Onboarding' };

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
