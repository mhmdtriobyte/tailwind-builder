import { cn } from '@/utils/cn';
import { ArrowRight, Play } from 'lucide-react';

interface HeroWithImageProps {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageSrc: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  showPlayButton?: boolean;
  className?: string;
}

export function HeroWithImage({
  headline,
  subtext,
  ctaText,
  ctaLink = '#',
  secondaryCtaText,
  secondaryCtaLink = '#',
  imageSrc,
  imageAlt = 'Hero image',
  imagePosition = 'right',
  showPlayButton = false,
  className,
}: HeroWithImageProps) {
  const contentSection = (
    <div className="flex flex-col justify-center">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
        {headline}
      </h1>
      <p className="mt-6 text-base leading-7 text-gray-600 sm:text-lg md:text-xl">
        {subtext}
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <a
          href={ctaLink}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {ctaText}
          <ArrowRight className="h-5 w-5" />
        </a>
        {secondaryCtaText && (
          <a
            href={secondaryCtaLink}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {secondaryCtaText}
          </a>
        )}
      </div>
    </div>
  );

  const imageSection = (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
        />
        {showPlayButton && (
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-200 hover:bg-black/30"
            aria-label="Play video"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-200 hover:scale-110">
              <Play className="h-6 w-6 text-blue-600 ml-1" fill="currentColor" />
            </div>
          </button>
        )}
      </div>
      <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-xl" />
    </div>
  );

  return (
    <section
      className={cn(
        'w-full py-16 px-4 sm:py-20 md:py-24 lg:py-32',
        'bg-gradient-to-br from-gray-50 via-white to-blue-50',
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {imagePosition === 'left' ? (
            <>
              {imageSection}
              {contentSection}
            </>
          ) : (
            <>
              {contentSection}
              {imageSection}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
