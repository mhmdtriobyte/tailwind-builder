import { cn } from '@/utils/cn';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export interface BlogCardProps {
  /** Blog post image URL */
  image: string;
  /** Post title */
  title: string;
  /** Post excerpt/summary */
  excerpt: string;
  /** Publication date */
  date: string;
  /** Reading time (e.g., "5 min read") */
  readTime?: string;
  /** Author name */
  author?: string;
  /** Author avatar URL */
  authorAvatar?: string;
  /** Category/tag */
  category?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'featured';
}

/**
 * Blog card component for article/post displays.
 * Includes image, title, excerpt, date, and optional author info.
 */
export function BlogCard({
  image,
  title,
  excerpt,
  date,
  readTime,
  author,
  authorAvatar,
  category,
  onClick,
  className,
  variant = 'default',
}: BlogCardProps) {
  if (variant === 'compact') {
    return (
      <article
        className={cn(
          'group flex gap-4 p-3 rounded-xl',
          'bg-white border border-gray-200',
          'transition-all duration-200',
          onClick && 'cursor-pointer hover:shadow-md hover:border-gray-300',
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <img
          src={image}
          alt=""
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <time className="text-xs text-gray-500 mt-1 block">{date}</time>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article
        className={cn(
          'group relative rounded-2xl overflow-hidden',
          'aspect-[16/9] sm:aspect-[21/9]',
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
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          {category && (
            <span className="inline-flex self-start px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full mb-3">
              {category}
            </span>
          )}

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 line-clamp-2">
            {title}
          </h2>

          <p className="text-gray-200 text-sm sm:text-base mb-4 line-clamp-2 max-w-2xl">
            {excerpt}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-300">
            {author && (
              <div className="flex items-center gap-2">
                {authorAvatar && (
                  <img
                    src={authorAvatar}
                    alt={author}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span>{author}</span>
              </div>
            )}
            <time>{date}</time>
            {readTime && <span>{readTime}</span>}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'group bg-white rounded-xl overflow-hidden',
        'border border-gray-200',
        'transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <time className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            {date}
          </time>
          {readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {readTime}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {author && (
            <div className="flex items-center gap-2">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={author}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                  {author.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">{author}</span>
            </div>
          )}

          <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
            Read more
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
