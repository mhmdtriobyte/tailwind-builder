import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface Grid2ColProps {
  children: ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  reverseOnMobile?: boolean;
}

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

export function Grid2Col({
  children,
  className,
  gap = 'lg',
  reverseOnMobile = false,
}: Grid2ColProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2',
        gapClasses[gap],
        reverseOnMobile && 'flex flex-col-reverse md:grid',
        className
      )}
    >
      {children}
    </div>
  );
}
