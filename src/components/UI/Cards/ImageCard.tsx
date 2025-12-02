import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

export interface ImageCardProps {
  /** Background image URL */
  image: string;
  /** Card title */
  title: string;
  /** Card subtitle or description */
  subtitle?: string;
  /** Badge text */
  badge?: string;
  /** Optional footer content */
  footer?: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Aspect ratio */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
  /** Overlay style */
  overlay?: 'gradient' | 'dark' | 'light' | 'none';
  /** Content alignment */
  contentPosition?: 'bottom' | 'center' | 'top';
}

/**
 * Image card component with full background image and overlay text.
 * Great for hero sections, portfolios, and visual galleries.
 */
export function ImageCard({
  image,
  title,
  subtitle,
  badge,
  footer,
  onClick,
  className,
  aspectRatio = 'video',
  overlay = 'gradient',
  contentPosition = 'bottom',
}: ImageCardProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[21/9]',
  };

  const overlayClasses = {
    gradient: 'bg-gradient-to-t from-black/80 via-black/40 to-transparent',
    dark: 'bg-black/50',
    light: 'bg-white/30 backdrop-blur-sm',
    none: '',
  };

  const contentPositionClasses = {
    bottom: 'justify-end items-start',
    center: 'justify-center items-center text-center',
    top: 'justify-start items-start',
  };

  const textColorClass = overlay === 'light' ? 'text-gray-900' : 'text-white';

  return (
    <article
      className={cn(
        'group relative rounded-xl overflow-hidden',
        aspectClasses[aspectRatio],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Background Image */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className={cn('absolute inset-0', overlayClasses[overlay])} />

      {/* Badge */}
      {badge && (
        <span
          className={cn(
            'absolute top-4 left-4 px-3 py-1',
            'text-xs font-semibold rounded-full',
            'bg-white/90 text-gray-900 backdrop-blur-sm'
          )}
        >
          {badge}
        </span>
      )}

      {/* Content */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col p-6',
          contentPositionClasses[contentPosition]
        )}
      >
        <div className={contentPosition === 'center' ? 'max-w-md' : ''}>
          <h3
            className={cn(
              'text-xl sm:text-2xl font-bold mb-2 leading-tight',
              textColorClass
            )}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className={cn(
                'text-sm sm:text-base leading-relaxed',
                overlay === 'light' ? 'text-gray-700' : 'text-white/80'
              )}
            >
              {subtitle}
            </p>
          )}
          {footer && <div className="mt-4">{footer}</div>}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-black/0 group-hover:bg-black/20',
          'transition-colors duration-300'
        )}
        aria-hidden="true"
      />
    </article>
  );
}
