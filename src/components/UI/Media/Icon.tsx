import { cn } from '@/utils/cn';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted';
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const variantClasses = {
  default: 'text-current',
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  muted: 'text-gray-400',
};

export function Icon({
  name,
  size = 'md',
  variant = 'default',
  className,
  strokeWidth = 2,
  ...props
}: IconProps) {
  const LucideIcon = LucideIcons[name] as React.ComponentType<LucideProps>;

  if (!LucideIcon || typeof LucideIcon !== 'function') {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  const sizeClass = typeof size === 'number' ? undefined : sizeClasses[size];
  const sizeValue = typeof size === 'number' ? size : undefined;

  return (
    <LucideIcon
      className={cn(sizeClass, variantClasses[variant], className)}
      size={sizeValue}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}

// Export icon names for reference
export const iconNames = Object.keys(LucideIcons).filter(
  (key) => typeof LucideIcons[key as IconName] === 'function' && key !== 'createLucideIcon'
) as IconName[];
