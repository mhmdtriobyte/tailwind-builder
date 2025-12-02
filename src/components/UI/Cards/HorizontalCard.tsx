import { cn } from '@/utils/cn';
import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

export interface HorizontalCardProps {
  /** Image URL */
  image: string;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Badge text */
  badge?: string;
  /** Badge color variant */
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Meta information (e.g., date, category) */
  meta?: string;
  /** Optional action button text */
  actionText?: string;
  /** Action click handler */
  onAction?: () => void;
  /** Card click handler */
  onClick?: () => void;
  /** Optional footer content */
  footer?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Image position */
  imagePosition?: 'left' | 'right';
  /** Image size */
  imageSize?: 'sm' | 'md' | 'lg';
}

/**
 * Horizontal card component with image on one side and content on the other.
 * Great for blog posts, news articles, and product listings.
 */
export function HorizontalCard({
  image,
  title,
  description,
  badge,
  badgeVariant = 'default',
  meta,
  actionText,
  onAction,
  onClick,
  footer,
  className,
  imagePosition = 'left',
  imageSize = 'md',
}: HorizontalCardProps) {
  const badgeClasses = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
  };

  const imageSizeClasses = {
    sm: 'w-24 sm:w-32',
    md: 'w-32 sm:w-48',
    lg: 'w-48 sm:w-64',
  };

  const Content = (
    <div className="flex-1 p-4 sm:p-5 flex flex-col">
      {/* Meta and Badge Row */}
      <div className="flex items-center gap-2 mb-2">
        {badge && (
          <span
            className={cn(
              'px-2 py-0.5 text-xs font-medium rounded-full',
              badgeClasses[badgeVariant]
            )}
          >
            {badge}
          </span>
        )}
        {meta && <span className="text-xs text-gray-500">{meta}</span>}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
        {description}
      </p>

      {/* Footer / Action */}
      {footer ? (
        <div className="mt-auto">{footer}</div>
      ) : actionText ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction?.();
          }}
          className={cn(
            'inline-flex items-center gap-1 text-sm font-medium',
            'text-blue-600 hover:text-blue-700',
            'transition-colors duration-200 mt-auto'
          )}
        >
          {actionText}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );

  const ImageElement = (
    <div
      className={cn(
        'flex-shrink-0 overflow-hidden',
        imageSizeClasses[imageSize],
        imagePosition === 'left' ? 'rounded-l-xl' : 'rounded-r-xl'
      )}
    >
      <img
        src={image}
        alt=""
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
  );

  return (
    <article
      className={cn(
        'group flex rounded-xl overflow-hidden',
        'bg-white border border-gray-200',
        'transition-all duration-200',
        'hover:shadow-lg hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {imagePosition === 'left' ? (
        <>
          {ImageElement}
          {Content}
        </>
      ) : (
        <>
          {Content}
          {ImageElement}
        </>
      )}
    </article>
  );
}
