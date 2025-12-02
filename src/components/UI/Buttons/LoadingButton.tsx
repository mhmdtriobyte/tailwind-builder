import { cn } from '@/utils/cn';
import { Loader2, LucideIcon } from 'lucide-react';

export interface LoadingButtonProps {
  /** Button text content */
  text: string;
  /** Loading state */
  isLoading: boolean;
  /** Text to show when loading (optional, defaults to text) */
  loadingText?: string;
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
  /** Optional icon to display when not loading */
  icon?: LucideIcon;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'outline';
}

/**
 * Button component with loading spinner state.
 * Automatically disables when loading and shows a spinner animation.
 */
export function LoadingButton({
  text,
  isLoading,
  loadingText,
  onClick,
  className,
  disabled = false,
  size = 'md',
  fullWidth = false,
  icon: Icon,
  type = 'button',
  variant = 'primary',
}: LoadingButtonProps) {
  const isDisabled = disabled || isLoading;

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
    primary: [
      'bg-blue-600 text-white',
      'hover:bg-blue-700 active:bg-blue-800',
      'focus:ring-blue-500',
      'shadow-sm hover:shadow-md',
    ],
    secondary: [
      'bg-gray-100 text-gray-700',
      'hover:bg-gray-200 active:bg-gray-300',
      'focus:ring-gray-400',
      'shadow-sm',
    ],
    outline: [
      'bg-transparent border-2 border-gray-300 text-gray-700',
      'hover:bg-gray-50 hover:border-gray-400',
      'focus:ring-gray-400',
    ],
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium',
        'rounded-lg',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2
            className={cn(iconSizeClasses[size], 'animate-spin')}
            aria-hidden="true"
          />
          <span>{loadingText || text}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className={iconSizeClasses[size]} aria-hidden="true" />}
          <span>{text}</span>
        </>
      )}
    </button>
  );
}
