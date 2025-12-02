import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface ListProps {
  children: ReactNode;
  type?: 'unordered' | 'ordered';
  variant?: 'disc' | 'circle' | 'square' | 'decimal' | 'alpha' | 'roman' | 'none';
  size?: 'sm' | 'md' | 'lg';
  spacing?: 'tight' | 'normal' | 'relaxed';
  color?: 'default' | 'muted' | 'primary';
  className?: string;
}

interface ListItemProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

const variantClasses = {
  disc: 'list-disc',
  circle: 'list-[circle]',
  square: 'list-[square]',
  decimal: 'list-decimal',
  alpha: 'list-[lower-alpha]',
  roman: 'list-[lower-roman]',
  none: 'list-none',
};

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const spacingClasses = {
  tight: 'space-y-1',
  normal: 'space-y-2',
  relaxed: 'space-y-4',
};

const colorClasses = {
  default: 'text-gray-700',
  muted: 'text-gray-500',
  primary: 'text-blue-600',
};

const markerColorClasses = {
  default: 'marker:text-gray-400',
  muted: 'marker:text-gray-400',
  primary: 'marker:text-blue-400',
};

export function List({
  children,
  type = 'unordered',
  variant,
  size = 'md',
  spacing = 'normal',
  color = 'default',
  className,
}: ListProps) {
  const Tag = type === 'ordered' ? 'ol' : 'ul';

  // Default variant based on list type
  const listVariant = variant || (type === 'ordered' ? 'decimal' : 'disc');

  return (
    <Tag
      className={cn(
        'pl-5',
        variantClasses[listVariant],
        sizeClasses[size],
        spacingClasses[spacing],
        colorClasses[color],
        markerColorClasses[color],
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function ListItem({ children, icon, className }: ListItemProps) {
  if (icon) {
    return (
      <li className={cn('flex items-start gap-2 list-none -ml-5', className)}>
        <span className="flex-shrink-0 mt-0.5">{icon}</span>
        <span>{children}</span>
      </li>
    );
  }

  return <li className={className}>{children}</li>;
}

// Compound component pattern
List.Item = ListItem;
