import { cn } from '@/utils/cn';
import { LucideIcon } from 'lucide-react';

export interface GradientButtonProps {
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
  /** Gradient color scheme */
  gradient?: 'blue-purple' | 'green-blue' | 'orange-red' | 'pink-purple' | 'cyan-blue';
}

/**
 * Button component with gradient background.
 * Eye-catching button for special CTAs and promotional content.
 */
export function GradientButton({
  text,
  onClick,
  className,
  disabled = false,
  size = 'md',
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  gradient = 'blue-purple',
}: GradientButtonProps) {
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

  const gradientClasses = {
    'blue-purple': 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
    'green-blue': 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600',
    'orange-red': 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
    'pink-purple': 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600',
    'cyan-blue': 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium',
        'text-white rounded-lg',
        'transition-all duration-300 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
        'shadow-md hover:shadow-lg hover:scale-[1.02]',
        'active:scale-[0.98]',
        sizeClasses[size],
        gradientClasses[gradient],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-md',
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
