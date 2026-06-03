'use client';

import { Text, TextProps } from '@mantine/core';
import { cn } from '@/lib/utils';

interface StatDisplayProps extends Omit<TextProps, 'size'> {
  value: string | number;
  unit?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: boolean;
}

const sizeMap = {
  sm: '24px',
  md: '32px',
  lg: '48px',
  xl: '64px',
};

export function StatDisplay({
  value,
  unit,
  label,
  size = 'md',
  gradient = false,
  className,
  ...props
}: StatDisplayProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <p className="label-caps">{label}</p>}
      <div className="flex items-baseline gap-1">
        <Text
          className={cn('stat-number', gradient && 'gradient-text')}
          style={{
            fontSize: sizeMap[size],
            fontFamily: 'var(--font-anybody)',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
          {...props}
        >
          {value}
        </Text>
        {unit && (
          <Text
            className="label-caps"
            style={{ fontSize: '11px', alignSelf: 'flex-end', paddingBottom: '3px' }}
          >
            {unit}
          </Text>
        )}
      </div>
    </div>
  );
}
