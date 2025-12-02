import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

export interface SimpleCardProps {
  /** Card title */
  title: string;
  /** Card description or body text */
  description: string;
  /** Additional CSS classes */
  className?: string;
  /** Optional header content (above title) */
  header?: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
  /** Card padding size */
  padding?: 'sm' | 'md' | 'lg';
  /** Border style */
  variant?: 'default' | 'bordered' | 'elevated';
  /** Whether the card is hoverable */
  hoverable?: boolean;
}

/**
 * Simple card component with title and description.
 * Basic building block for content presentation.
 */
export function SimpleCard({
  title,
  description,
  className,
  header,
  footer,
  padding = 'md',
  variant = 'default',
  hoverable = false,
}: SimpleCardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200',
    bordered: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-lg border-0',
  };

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        'transition-all duration-200',
        variantClasses[variant],
        hoverable && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        className
      )}
    >
      {header && (
        <div className="border-b border-gray-100">{header}</div>
      )}

      <div className={paddingClasses[padding]}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {footer && (
        <div className={cn('border-t border-gray-100', paddingClasses[padding])}>
          {footer}
        </div>
      )}
    </div>
  );
}
