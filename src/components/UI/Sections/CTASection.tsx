import { cn } from '@/utils/cn';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  headline: string;
  description: string;
  ctaText: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  variant?: 'blue' | 'purple' | 'gradient' | 'dark';
  className?: string;
}

const variantStyles = {
  blue: 'bg-blue-600',
  purple: 'bg-purple-600',
  gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500',
  dark: 'bg-gray-900',
};

const buttonStyles = {
  blue: 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg shadow-blue-900/20',
  purple: 'bg-white text-purple-600 hover:bg-purple-50 shadow-lg shadow-purple-900/20',
  gradient: 'bg-white text-purple-600 hover:bg-gray-50 shadow-lg shadow-purple-900/20',
  dark: 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg shadow-black/20',
};

const secondaryButtonStyles = {
  blue: 'border-white/30 text-white hover:bg-white/10',
  purple: 'border-white/30 text-white hover:bg-white/10',
  gradient: 'border-white/30 text-white hover:bg-white/10',
  dark: 'border-white/30 text-white hover:bg-white/10',
};

export function CTASection({
  headline,
  description,
  ctaText,
  ctaLink = '#',
  secondaryCtaText,
  secondaryCtaLink = '#',
  variant = 'gradient',
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        'relative w-full overflow-hidden py-16 px-4 sm:py-20 md:py-24',
        variantStyles[variant],
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {headline}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
          {description}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={ctaLink}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent',
              buttonStyles[variant]
            )}
          >
            {ctaText}
            <ArrowRight className="h-5 w-5" />
          </a>
          {secondaryCtaText && (
            <a
              href={secondaryCtaLink}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-full border-2 px-8 py-4 text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent',
                secondaryButtonStyles[variant]
              )}
            >
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
