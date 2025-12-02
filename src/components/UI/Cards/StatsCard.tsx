import { cn } from '@/utils/cn';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export interface StatsCardProps {
  /** Stat icon */
  icon: LucideIcon;
  /** Numeric value to display */
  value: string | number;
  /** Label describing the stat */
  label: string;
  /** Trend percentage change */
  trend?: number;
  /** Trend period description */
  trendPeriod?: string;
  /** Additional CSS classes */
  className?: string;
  /** Visual variant */
  variant?: 'default' | 'colored' | 'gradient';
  /** Color scheme for colored/gradient variants */
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

/**
 * Stats card component for displaying key metrics.
 * Includes icon, numeric value, label, and optional trend indicator.
 */
export function StatsCard({
  icon: Icon,
  value,
  label,
  trend,
  trendPeriod = 'vs last period',
  className,
  variant = 'default',
  color = 'blue',
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      icon: 'text-blue-600 bg-blue-100',
      gradient: 'from-blue-500 to-blue-600',
      border: 'border-blue-200',
    },
    green: {
      icon: 'text-green-600 bg-green-100',
      gradient: 'from-green-500 to-green-600',
      border: 'border-green-200',
    },
    purple: {
      icon: 'text-purple-600 bg-purple-100',
      gradient: 'from-purple-500 to-purple-600',
      border: 'border-purple-200',
    },
    orange: {
      icon: 'text-orange-600 bg-orange-100',
      gradient: 'from-orange-500 to-orange-600',
      border: 'border-orange-200',
    },
    red: {
      icon: 'text-red-600 bg-red-100',
      gradient: 'from-red-500 to-red-600',
      border: 'border-red-200',
    },
  };

  const isPositive = trend !== undefined && trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  if (variant === 'gradient') {
    return (
      <div
        className={cn(
          'rounded-xl p-6',
          'bg-gradient-to-br',
          colorClasses[color].gradient,
          'text-white',
          'shadow-lg',
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          {trend !== undefined && (
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                'bg-white/20 backdrop-blur-sm'
              )}
            >
              <TrendIcon className="w-3 h-3" aria-hidden="true" />
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-white/80">{label}</div>

        {trend !== undefined && (
          <div className="text-xs text-white/60 mt-2">{trendPeriod}</div>
        )}
      </div>
    );
  }

  if (variant === 'colored') {
    return (
      <div
        className={cn(
          'rounded-xl p-6',
          'bg-white border-l-4',
          colorClasses[color].border,
          'shadow-sm hover:shadow-md transition-shadow',
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'p-3 rounded-lg flex-shrink-0',
              colorClasses[color].icon
            )}
          >
            <Icon className="w-6 h-6" aria-hidden="true" />
          </div>

          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {value}
            </div>
            <div className="text-sm text-gray-600">{label}</div>

            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                <TrendIcon
                  className={cn(
                    'w-4 h-4',
                    isPositive ? 'text-green-500' : 'text-red-500'
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'text-sm font-medium',
                    isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {isPositive ? '+' : ''}{trend}%
                </span>
                <span className="text-xs text-gray-500">{trendPeriod}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'rounded-xl p-6',
        'bg-white border border-gray-200',
        'hover:shadow-lg transition-shadow duration-200',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            'p-3 rounded-lg',
            colorClasses[color].icon
          )}
        >
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>

        {trend !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
              isPositive
                ? 'text-green-700 bg-green-100'
                : 'text-red-700 bg-red-100'
            )}
          >
            <TrendIcon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isPositive ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>

      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>

      {trend !== undefined && trendPeriod && (
        <div className="text-xs text-gray-400 mt-2">{trendPeriod}</div>
      )}
    </div>
  );
}
