import { cn } from '@/utils/cn';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  variant?: 'grid' | 'carousel';
  className?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          )}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 sm:p-8">
      <Quote className="absolute right-6 top-6 h-8 w-8 text-blue-100 sm:h-10 sm:w-10" />

      {testimonial.rating && (
        <div className="mb-4">
          <StarRating rating={testimonial.rating} />
        </div>
      )}

      <blockquote className="flex-1">
        <p className="text-base leading-7 text-gray-700 sm:text-lg">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </blockquote>

      <div className="mt-6 flex items-center gap-4 border-t border-gray-100 pt-6">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.author}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-semibold text-white">
            {testimonial.author.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-900">{testimonial.author}</div>
          <div className="text-sm text-gray-600">
            {testimonial.role}
            {testimonial.company && ` at ${testimonial.company}`}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection({
  title,
  subtitle,
  testimonials,
  variant = 'grid',
  className,
}: TestimonialsSectionProps) {
  return (
    <section
      className={cn(
        'w-full py-16 px-4 sm:py-20 md:py-24 lg:py-32',
        'bg-gray-50',
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg leading-8 text-gray-600 sm:text-xl">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={cn(
            'mt-12 sm:mt-16',
            variant === 'grid' &&
              'grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
