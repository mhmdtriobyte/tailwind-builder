import { cn } from '@/utils/cn';
import { ShoppingCart, Heart } from 'lucide-react';

export interface ProductCardProps {
  /** Product image URL */
  image: string;
  /** Product title */
  title: string;
  /** Product price */
  price: string;
  /** Original price (for showing discount) */
  originalPrice?: string;
  /** Product rating (0-5) */
  rating?: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Product description */
  description?: string;
  /** Badge text (e.g., "Sale", "New") */
  badge?: string;
  /** Badge color variant */
  badgeVariant?: 'default' | 'sale' | 'new' | 'hot';
  /** Click handler for buy button */
  onBuy?: () => void;
  /** Click handler for wishlist */
  onWishlist?: () => void;
  /** Whether item is in wishlist */
  isWishlisted?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Product card component for e-commerce displays.
 * Includes image, title, price, rating, and action buttons.
 */
export function ProductCard({
  image,
  title,
  price,
  originalPrice,
  rating,
  reviewCount,
  description,
  badge,
  badgeVariant = 'default',
  onBuy,
  onWishlist,
  isWishlisted = false,
  className,
}: ProductCardProps) {
  const badgeClasses = {
    default: 'bg-gray-900 text-white',
    sale: 'bg-red-500 text-white',
    new: 'bg-blue-500 text-white',
    hot: 'bg-orange-500 text-white',
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
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
    <div
      className={cn(
        'group bg-white rounded-xl overflow-hidden',
        'border border-gray-200',
        'transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badge */}
        {badge && (
          <span
            className={cn(
              'absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full',
              badgeClasses[badgeVariant]
            )}
          >
            {badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={onWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full',
            'bg-white/90 backdrop-blur-sm',
            'transition-all duration-200',
            'hover:bg-white hover:scale-110',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            isWishlisted && 'text-red-500'
          )}
        >
          <Heart
            className={cn('w-5 h-5', isWishlisted && 'fill-current')}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* Rating */}
        {rating !== undefined && (
          <div className="flex items-center gap-2 mb-3">
            {renderStars(rating)}
            {reviewCount !== undefined && (
              <span className="text-xs text-gray-500">
                ({reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price and Buy Button */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              {price}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={onBuy}
            aria-label={`Add ${title} to cart`}
            className={cn(
              'inline-flex items-center justify-center gap-1.5',
              'px-3 py-2 text-sm font-medium',
              'bg-blue-600 text-white rounded-lg',
              'transition-all duration-200',
              'hover:bg-blue-700 active:bg-blue-800',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            )}
          >
            <ShoppingCart className="w-4 h-4" aria-hidden="true" />
            <span>Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
