'use client';

import { Button, ButtonProps } from '@mantine/core';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  children: React.ReactNode;
  onClick?: () => void;
}

export function GradientButton({ children, className, onClick, ...props }: GradientButtonProps) {
  return (
    <Button
      radius="xl"
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, var(--preset-gradient-from), var(--preset-gradient-to))',
        border: 'none',
        fontFamily: 'var(--font-jetbrains)',
        fontWeight: 600,
        fontSize: '12px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        transition: 'all 0.2s ease',
      }}
      styles={{
        root: {
          '&:hover': {
            filter: 'brightness(1.15)',
            boxShadow: '0 0 20px color-mix(in srgb, var(--preset-gradient-from) 40%, transparent)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Button>
  );
}
