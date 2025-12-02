import { cn } from '@/utils/cn';
import { LucideIcon } from 'lucide-react';

export interface OutlineButtonProps {
  /** Button text content */
  text: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Optional icon to display */
  icon?: LucideIcon;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Color variant */
  variant?: 'default' | 'primary' | 'danger' | 'success';
}

/**
 * Outline button component with border only styling.
 * Used for tertiary actions or when a lighter visual weight is needed.
 */
export function OutlineButton({
  text,
  onClick,
  className,
  disabled = false,
  size = 'md',
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  variant = 'default',
}: OutlineButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const variantClasses = {
    default: [
      'border-gray-300 text-gray-700',
      'hover:bg-gray-50 hover:border-gray-400',
      'focus:ring-gray-400',
    ],
    primary: [
      'border-blue-500 text-blue-600',
      'hover:bg-blue-50 hover:border-blue-600',
      'focus:ring-blue-500',
    ],
    danger: [
      'border-red-500 text-red-600',
      'hover:bg-red-50 hover:border-red-600',
      'focus:ring-red-500',
    ],
    success: [
      'border-green-500 text-green-600',
      'hover:bg-green-50 hover:border-green-600',
      'focus:ring-green-500',
    ],
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium',
        'bg-transparent border-2 rounded-lg',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'active:scale-[0.98]',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100',
        className
      )}
    >
      {Icon && iconPosition === 'left' && (
        <Icon className={iconSizeClasses[size]} aria-hidden="true" />
      )}
      <span>{text}</span>
      {Icon && iconPosition === 'right' && (
        <Icon className={iconSizeClasses[size]} aria-hidden="true" />
      )}
    </button>
  );
}
