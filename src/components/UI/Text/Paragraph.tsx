import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface ParagraphProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'white' | 'success' | 'warning' | 'error';
  align?: 'left' | 'center' | 'right' | 'justify';
  leading?: 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  truncate?: boolean;
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const colorClasses = {
  default: 'text-gray-700',
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  muted: 'text-gray-500',
  white: 'text-white',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

const leadingClasses = {
  tight: 'leading-tight',
  snug: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
};

const lineClampClasses = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};

export function Paragraph({
  children,
  size = 'md',
  weight = 'normal',
  color = 'default',
  align = 'left',
  leading = 'normal',
  truncate = false,
  lineClamp,
  className,
}: ParagraphProps) {
  return (
    <p
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        colorClasses[color],
        alignClasses[align],
        leadingClasses[leading],
        truncate && 'truncate',
        lineClamp && lineClampClasses[lineClamp],
        className
      )}
    >
      {children}
    </p>
  );
}
