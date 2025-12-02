import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface Grid3ColProps {
  children: ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

export function Grid3Col({ children, className, gap = 'lg' }: Grid3ColProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
