import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface FlexRowProps {
  children: ReactNode;
  className?: string;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  wrap?: boolean;
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

export function FlexRow({
  children,
  className,
  gap = 'md',
  justify = 'start',
  align = 'center',
  wrap = false,
}: FlexRowProps) {
  return (
    <div
      className={cn(
        'flex flex-row',
        gapClasses[gap],
        justifyClasses[justify],
        alignClasses[align],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
}
