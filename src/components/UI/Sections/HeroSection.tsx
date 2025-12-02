import { cn } from '@/utils/cn';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  className?: string;
}

export function HeroSection({
  headline,
  subtext,
  ctaText,
  ctaLink = '#',
  secondaryCtaText,
  secondaryCtaLink = '#',
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'w-full py-20 px-4 sm:py-24 md:py-32 lg:py-40',
        'bg-gradient-to-b from-white to-gray-50',
        className
      )}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
          {headline}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl md:text-2xl max-w-2xl mx-auto">
          {subtext}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={ctaLink}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {ctaText}
            <ArrowRight className="h-5 w-5" />
          </a>
          {secondaryCtaText && (
            <a
              href={secondaryCtaLink}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
