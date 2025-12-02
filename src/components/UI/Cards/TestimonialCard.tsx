import { cn } from '@/utils/cn';
import { Quote } from 'lucide-react';

export interface TestimonialCardProps {
  /** Testimonial quote text */
  quote: string;
  /** Author avatar image URL */
  avatar?: string;
  /** Author name */
  author: string;
  /** Author role/title */
  role?: string;
  /** Company name */
  company?: string;
  /** Rating (1-5 stars) */
  rating?: number;
  /** Additional CSS classes */
  className?: string;
  /** Visual variant */
  variant?: 'default' | 'bordered' | 'filled';
}

/**
 * Testimonial card component for displaying customer quotes.
 * Includes quote, avatar, author info, and optional rating.
 */
export function TestimonialCard({
  quote,
  avatar,
  author,
  role,
  company,
  rating,
  className,
  variant = 'default',
}: TestimonialCardProps) {
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    bordered: 'bg-white border-2 border-gray-900',
    filled: 'bg-gray-50 border border-gray-100',
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={cn(
              'w-4 h-4',
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <article
      className={cn(
        'rounded-xl p-6 sm:p-8',
        'transition-all duration-200',
        'hover:shadow-lg',
        variantClasses[variant],
        className
      )}
    >
      {/* Quote Icon */}
      <Quote
        className="w-8 h-8 text-blue-500 mb-4 rotate-180"
        aria-hidden="true"
      />

      {/* Rating */}
      {rating !== undefined && (
        <div className="mb-4">
          {renderStars(rating)}
        </div>
      )}

      {/* Quote Text */}
      <blockquote className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author Info */}
      <footer className="flex items-center gap-4">
        {/* Avatar */}
        {avatar ? (
          <img
            src={avatar}
            alt={`${author}'s avatar`}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg"
            aria-hidden="true"
          >
            {author.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Author Details */}
        <div>
          <cite className="not-italic font-semibold text-gray-900 block">
            {author}
          </cite>
          {(role || company) && (
            <span className="text-sm text-gray-500">
              {role}
              {role && company && ' at '}
              {company && (
                <span className="font-medium text-gray-600">{company}</span>
              )}
            </span>
          )}
        </div>
      </footer>
    </article>
  );
}
