import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

export interface ButtonGroupProps {
  /** Button components to group together */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Orientation of the group */
  orientation?: 'horizontal' | 'vertical';
  /** Size of buttons in the group */
  size?: 'sm' | 'md' | 'lg';
  /** Whether buttons should be attached (no gap) */
  attached?: boolean;
  /** Full width group */
  fullWidth?: boolean;
}

export interface ButtonGroupItemProps {
  /** Button text content */
  text: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Active/selected state */
  isActive?: boolean;
  /** Visual variant */
  variant?: 'default' | 'primary';
}

/**
 * Individual button item for use within ButtonGroup.
 */
export function ButtonGroupItem({
  text,
  onClick,
  className,
  disabled = false,
  isActive = false,
  variant = 'default',
}: ButtonGroupItemProps) {
  const variantClasses = {
    default: [
      isActive
        ? 'bg-gray-100 text-gray-900 border-gray-400'
        : 'bg-white text-gray-700 border-gray-300',
      'hover:bg-gray-50 hover:text-gray-900',
      'focus:z-10 focus:ring-2 focus:ring-gray-400 focus:ring-offset-0',
    ],
    primary: [
      isActive
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-white text-blue-600 border-blue-300',
      isActive ? 'hover:bg-blue-700' : 'hover:bg-blue-50',
      'focus:z-10 focus:ring-2 focus:ring-blue-400 focus:ring-offset-0',
    ],
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isActive}
      aria-disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 text-sm font-medium',
        'border transition-all duration-200',
        'focus:outline-none',
        'first:rounded-l-lg last:rounded-r-lg',
        '-ml-px first:ml-0',
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {text}
    </button>
  );
}

/**
 * Container component for grouping related buttons together.
 * Provides visual connection between buttons with proper border handling.
 */
export function ButtonGroup({
  children,
  className,
  orientation = 'horizontal',
  attached = true,
  fullWidth = false,
}: ButtonGroupProps) {
  const orientationClasses = {
    horizontal: attached ? 'flex-row' : 'flex-row gap-2',
    vertical: attached ? 'flex-col' : 'flex-col gap-2',
  };

  return (
    <div
      role="group"
      className={cn(
        'inline-flex',
        orientationClasses[orientation],
        attached && orientation === 'horizontal' && '[&>button:not(:first-child)]:-ml-px',
        attached && orientation === 'vertical' && '[&>button:not(:first-child)]:-mt-px',
        attached && orientation === 'horizontal' && '[&>button]:rounded-none [&>button:first-child]:rounded-l-lg [&>button:last-child]:rounded-r-lg',
        attached && orientation === 'vertical' && '[&>button]:rounded-none [&>button:first-child]:rounded-t-lg [&>button:last-child]:rounded-b-lg',
        fullWidth && 'w-full [&>button]:flex-1',
        className
      )}
    >
      {children}
    </div>
  );
}
