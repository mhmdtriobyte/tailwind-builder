import { cn } from '@/utils/cn';
import { LucideIcon } from 'lucide-react';

export interface GhostButtonProps {
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
  variant?: 'default' | 'primary' | 'danger';
}

/**
 * Ghost button component with transparent background and hover effect.
 * Used for subtle actions that should not distract from main content.
 */
export function GhostButton({
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
}: GhostButtonProps) {
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
      'text-gray-600',
      'hover:bg-gray-100 hover:text-gray-900',
      'active:bg-gray-200',
      'focus:ring-gray-400',
    ],
    primary: [
      'text-blue-600',
      'hover:bg-blue-50 hover:text-blue-700',
      'active:bg-blue-100',
      'focus:ring-blue-400',
    ],
    danger: [
      'text-red-600',
      'hover:bg-red-50 hover:text-red-700',
      'active:bg-red-100',
      'focus:ring-red-400',
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
        'bg-transparent rounded-lg',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
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
