'use client';

import { Card, CardProps } from '@mantine/core';
import { cn } from '@/lib/utils';

interface DashboardCardProps extends CardProps {
  children: React.ReactNode;
  glowOnHover?: boolean;
}

export function DashboardCard({
  children,
  glowOnHover = true,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <Card
      radius="lg"
      p="md"
      style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      className={cn(glowOnHover && 'card-glow', 'fade-in-up', className)}
      {...props}
    >
      {children}
    </Card>
  );
}
