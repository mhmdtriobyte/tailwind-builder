import { cn } from '@/utils/cn';

interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  thickness?: 'thin' | 'normal' | 'thick';
  color?: 'light' | 'medium' | 'dark';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

const thicknessClasses = {
  thin: 'border-t',
  normal: 'border-t-2',
  thick: 'border-t-4',
};

const verticalThicknessClasses = {
  thin: 'border-l',
  normal: 'border-l-2',
  thick: 'border-l-4',
};

const colorClasses = {
  light: 'border-gray-100',
  medium: 'border-gray-200',
  dark: 'border-gray-300',
};

const spacingClasses = {
  sm: 'my-4',
  md: 'my-6',
  lg: 'my-8',
  xl: 'my-12',
};

const verticalSpacingClasses = {
  sm: 'mx-4',
  md: 'mx-6',
  lg: 'mx-8',
  xl: 'mx-12',
};

export function Divider({
  className,
  orientation = 'horizontal',
  thickness = 'normal',
  color = 'medium',
  spacing = 'md',
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        isHorizontal
          ? [thicknessClasses[thickness], spacingClasses[spacing], 'w-full']
          : [
              verticalThicknessClasses[thickness],
              verticalSpacingClasses[spacing],
              'h-full self-stretch',
            ],
        colorClasses[color],
        className
      )}
    />
  );
}
