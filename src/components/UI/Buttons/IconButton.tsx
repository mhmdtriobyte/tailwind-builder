import { cn } from '@/utils/cn';
import { LucideIcon } from 'lucide-react';

export interface IconButtonProps {
  /** Lucide icon component */
  icon: LucideIcon;
  /** Accessible label for screen readers */
  label: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Visual variant */
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Rounded corners style */
  rounded?: 'md' | 'lg' | 'full';
}

/**
 * Square icon button component for icon-only actions.
 * Always requires an accessible label for screen readers.
 */
export function IconButton({
  icon: Icon,
  label,
  onClick,
  className,
  disabled = false,
  size = 'md',
  type = 'button',
  variant = 'default',
  rounded = 'lg',
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const roundedClasses = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const variantClasses = {
    default: [
      'bg-white text-gray-700 border border-gray-300',
      'hover:bg-gray-50 hover:border-gray-400',
      'active:bg-gray-100',
      'focus:ring-gray-400',
      'shadow-sm',
    ],
    primary: [
      'bg-blue-600 text-white',
      'hover:bg-blue-700',
      'active:bg-blue-800',
      'focus:ring-blue-500',
      'shadow-sm',
    ],
    secondary: [
      'bg-gray-100 text-gray-700',
      'hover:bg-gray-200',
      'active:bg-gray-300',
      'focus:ring-gray-400',
    ],
    ghost: [
      'bg-transparent text-gray-600',
      'hover:bg-gray-100 hover:text-gray-900',
      'active:bg-gray-200',
      'focus:ring-gray-400',
    ],
    danger: [
      'bg-red-600 text-white',
      'hover:bg-red-700',
      'active:bg-red-800',
      'focus:ring-red-500',
      'shadow-sm',
    ],
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-disabled={disabled}
      title={label}
      className={cn(
        'inline-flex items-center justify-center',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        sizeClasses[size],
        roundedClasses[rounded],
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <Icon className={iconSizeClasses[size]} aria-hidden="true" />
    </button>
  );
}
