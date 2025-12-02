import { cn } from '@/utils/cn';

interface Stat {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

interface StatsSectionProps {
  title?: string;
  subtitle?: string;
  stats: Stat[];
  variant?: 'default' | 'cards' | 'gradient';
  className?: string;
}

export function StatsSection({
  title,
  subtitle,
  stats,
  variant = 'default',
  className,
}: StatsSectionProps) {
  return (
    <section
      className={cn(
        'w-full py-16 px-4 sm:py-20 md:py-24',
        variant === 'gradient'
          ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500'
          : 'bg-gray-50',
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
            {title && (
              <h2
                className={cn(
                  'text-3xl font-bold tracking-tight sm:text-4xl',
                  variant === 'gradient' ? 'text-white' : 'text-gray-900'
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={cn(
                  'mt-4 text-lg leading-8',
                  variant === 'gradient' ? 'text-white/80' : 'text-gray-600'
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                'flex flex-col items-center p-6 sm:p-8 text-center',
                variant === 'cards' &&
                  'rounded-2xl bg-white shadow-lg shadow-gray-200/50 border border-gray-100',
                variant === 'gradient' &&
                  'rounded-2xl bg-white/10 backdrop-blur-sm'
              )}
            >
              <div
                className={cn(
                  'text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl',
                  variant === 'gradient' ? 'text-white' : 'text-gray-900'
                )}
              >
                {stat.prefix && (
                  <span className="text-blue-600">{stat.prefix}</span>
                )}
                {stat.value}
                {stat.suffix && (
                  <span
                    className={cn(
                      'text-2xl sm:text-3xl',
                      variant === 'gradient' ? 'text-white/80' : 'text-blue-600'
                    )}
                  >
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div
                className={cn(
                  'mt-2 text-sm font-medium sm:text-base',
                  variant === 'gradient' ? 'text-white/70' : 'text-gray-600'
                )}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
