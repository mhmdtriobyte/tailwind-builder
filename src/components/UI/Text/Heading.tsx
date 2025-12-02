import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface HeadingProps {
  children: ReactNode;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'white';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const levelClasses = {
  h1: 'text-4xl md:text-5xl font-bold',
  h2: 'text-3xl md:text-4xl font-bold',
  h3: 'text-2xl md:text-3xl font-semibold',
  h4: 'text-xl md:text-2xl font-semibold',
  h5: 'text-lg md:text-xl font-medium',
  h6: 'text-base md:text-lg font-medium',
};

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl md:text-5xl',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

const colorClasses = {
  default: 'text-gray-900',
  primary: 'text-blue-600',
  secondary: 'text-gray-700',
  muted: 'text-gray-500',
  white: 'text-white',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function Heading({
  children,
  level = 'h2',
  size,
  weight,
  color = 'default',
  align = 'left',
  className,
}: HeadingProps) {
  const Tag = level;

  // If size or weight is explicitly provided, use those. Otherwise use level defaults.
  const classes = cn(
    colorClasses[color],
    alignClasses[align],
    size ? sizeClasses[size] : undefined,
    weight ? weightClasses[weight] : undefined,
    !size && !weight ? levelClasses[level] : undefined,
    className
  );

  return <Tag className={classes}>{children}</Tag>;
}
