import { cn } from '@/utils/cn';

interface SpacerProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  axis?: 'horizontal' | 'vertical' | 'both';
}

const verticalSizeClasses = {
  xs: 'h-2',
  sm: 'h-4',
  md: 'h-8',
  lg: 'h-12',
  xl: 'h-16',
  '2xl': 'h-24',
  '3xl': 'h-32',
};

const horizontalSizeClasses = {
  xs: 'w-2',
  sm: 'w-4',
  md: 'w-8',
  lg: 'w-12',
  xl: 'w-16',
  '2xl': 'w-24',
  '3xl': 'w-32',
};

const bothSizeClasses = {
  xs: 'h-2 w-2',
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
  '2xl': 'h-24 w-24',
  '3xl': 'h-32 w-32',
};

export function Spacer({ className, size = 'md', axis = 'vertical' }: SpacerProps) {
  const sizeClasses =
    axis === 'vertical'
      ? verticalSizeClasses
      : axis === 'horizontal'
        ? horizontalSizeClasses
        : bothSizeClasses;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex-shrink-0',
        sizeClasses[size],
        axis === 'vertical' && 'w-full',
        axis === 'horizontal' && 'h-full',
        className
      )}
    />
  );
}
