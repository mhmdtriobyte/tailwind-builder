import { cn } from '@/utils/cn';
import { LucideIcon } from 'lucide-react';

export interface FeatureCardProps {
  /** Feature icon */
  icon: LucideIcon;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Link text (optional) */
  linkText?: string;
  /** Link click handler */
  onLinkClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Visual variant */
  variant?: 'default' | 'bordered' | 'filled' | 'minimal';
  /** Icon color scheme */
  iconColor?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  /** Icon position */
  iconPosition?: 'top' | 'left';
}

/**
 * Feature card component for showcasing product features.
 * Includes icon, title, description, and optional link.
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  linkText,
  onLinkClick,
  className,
  variant = 'default',
  iconColor = 'blue',
  iconPosition = 'top',
}: FeatureCardProps) {
  const iconColorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    red: 'text-red-600 bg-red-100',
    gray: 'text-gray-600 bg-gray-100',
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-1',
    bordered: 'bg-white border-2 border-gray-900 hover:bg-gray-50',
    filled: 'bg-gray-50 border border-gray-100 hover:bg-gray-100',
    minimal: 'bg-transparent hover:bg-gray-50',
  };

  if (iconPosition === 'left') {
    return (
      <div
        className={cn(
          'flex gap-4 rounded-xl p-5',
          'transition-all duration-200',
          variantClasses[variant],
          className
        )}
      >
        <div
          className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
            iconColorClasses[iconColor]
          )}
        >
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

          {linkText && (
            <button
              onClick={onLinkClick}
              className={cn(
                'inline-flex items-center gap-1 mt-3 text-sm font-medium',
                'text-blue-600 hover:text-blue-700',
                'transition-colors duration-200'
              )}
            >
              {linkText}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl p-6 text-center',
        'transition-all duration-200',
        variantClasses[variant],
        className
      )}
    >
      <div
        className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4',
          iconColorClasses[iconColor]
        )}
      >
        <Icon className="w-7 h-7" aria-hidden="true" />
      </div>

      <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>

      {linkText && (
        <button
          onClick={onLinkClick}
          className={cn(
            'inline-flex items-center gap-1 mt-4 text-sm font-medium',
            'text-blue-600 hover:text-blue-700',
            'transition-colors duration-200'
          )}
        >
          {linkText}
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
