import { cn } from '@/utils/cn';
import { LucideIcon } from 'lucide-react';

export interface SecondaryButtonProps {
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
}

/**
 * Secondary button component with gray background.
 * Used for secondary actions that are less prominent than primary actions.
 */
export function SecondaryButton({
  text,
  onClick,
  className,
  disabled = false,
  size = 'md',
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
}: SecondaryButtonProps) {
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

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium',
        'bg-gray-100 text-gray-700 rounded-lg',
        'hover:bg-gray-200 active:bg-gray-300',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
        'shadow-sm hover:shadow',
        sizeClasses[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-gray-100 hover:shadow-sm',
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
