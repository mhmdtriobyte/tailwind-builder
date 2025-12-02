import { cn } from '@/utils/cn';
import { Check, X } from 'lucide-react';

export interface PricingFeature {
  /** Feature text */
  text: string;
  /** Whether feature is included */
  included: boolean;
}

export interface PricingCardProps {
  /** Plan tier name */
  tier: string;
  /** Plan description */
  description?: string;
  /** Price amount */
  price: string;
  /** Price period (e.g., "/month", "/year") */
  period?: string;
  /** List of features */
  features: PricingFeature[];
  /** CTA button text */
  ctaText: string;
  /** Click handler for CTA */
  onCtaClick?: () => void;
  /** Whether this is the highlighted/recommended plan */
  isPopular?: boolean;
  /** Popular badge text */
  popularText?: string;
  /** Additional CSS classes */
  className?: string;
  /** Visual variant */
  variant?: 'default' | 'gradient';
}

/**
 * Pricing card component for subscription/pricing displays.
 * Includes tier name, price, feature list, and CTA button.
 */
export function PricingCard({
  tier,
  description,
  price,
  period = '/month',
  features,
  ctaText,
  onCtaClick,
  isPopular = false,
  popularText = 'Most Popular',
  className,
  variant = 'default',
}: PricingCardProps) {
  const isGradient = variant === 'gradient' && isPopular;

  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'transition-all duration-300',
        isGradient
          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
          : 'bg-white border border-gray-200',
        isPopular && !isGradient && 'border-2 border-blue-500 shadow-xl',
        !isPopular && 'hover:shadow-lg hover:-translate-y-1',
        className
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div
          className={cn(
            'absolute top-0 right-0 px-4 py-1 text-xs font-semibold',
            isGradient
              ? 'bg-white/20 text-white'
              : 'bg-blue-500 text-white',
            'rounded-bl-xl'
          )}
        >
          {popularText}
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h3
            className={cn(
              'text-xl font-bold mb-2',
              isGradient ? 'text-white' : 'text-gray-900'
            )}
          >
            {tier}
          </h3>
          {description && (
            <p
              className={cn(
                'text-sm',
                isGradient ? 'text-white/80' : 'text-gray-500'
              )}
            >
              {description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span
              className={cn(
                'text-4xl sm:text-5xl font-bold tracking-tight',
                isGradient ? 'text-white' : 'text-gray-900'
              )}
            >
              {price}
            </span>
            <span
              className={cn(
                'text-sm font-medium',
                isGradient ? 'text-white/70' : 'text-gray-500'
              )}
            >
              {period}
            </span>
          </div>
        </div>

        {/* Features List */}
        <ul className="space-y-3 mb-8" role="list">
          {features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                'flex items-start gap-3 text-sm',
                !feature.included && (isGradient ? 'text-white/50' : 'text-gray-400')
              )}
            >
              {feature.included ? (
                <Check
                  className={cn(
                    'w-5 h-5 flex-shrink-0 mt-0.5',
                    isGradient ? 'text-white' : 'text-green-500'
                  )}
                  aria-hidden="true"
                />
              ) : (
                <X
                  className={cn(
                    'w-5 h-5 flex-shrink-0 mt-0.5',
                    isGradient ? 'text-white/40' : 'text-gray-300'
                  )}
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  feature.included
                    ? isGradient
                      ? 'text-white'
                      : 'text-gray-700'
                    : isGradient
                    ? 'text-white/50 line-through'
                    : 'text-gray-400 line-through'
                )}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={onCtaClick}
          className={cn(
            'w-full py-3 px-4 rounded-xl font-semibold text-sm',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            isGradient
              ? [
                  'bg-white text-blue-600',
                  'hover:bg-gray-100',
                  'focus:ring-white',
                ]
              : isPopular
              ? [
                  'bg-blue-600 text-white',
                  'hover:bg-blue-700',
                  'focus:ring-blue-500',
                ]
              : [
                  'bg-gray-900 text-white',
                  'hover:bg-gray-800',
                  'focus:ring-gray-500',
                ]
          )}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
}
