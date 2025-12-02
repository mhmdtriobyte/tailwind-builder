import { cn } from '@/utils/cn';
import { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallbackInitials?: string;
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  border?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

const statusClasses = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
  none: '',
};

const statusSizeClasses = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2 h-2 border',
  md: 'w-3 h-3 border-2',
  lg: 'w-4 h-4 border-2',
  xl: 'w-5 h-5 border-2',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({
  src,
  alt,
  size = 'md',
  fallbackInitials,
  status = 'none',
  border = false,
  className,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const initials = fallbackInitials || getInitials(alt);
  const showFallback = !src || hasError;

  return (
    <div className={cn('relative inline-block', className)}>
      {showFallback ? (
        <div
          className={cn(
            'rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium',
            sizeClasses[size],
            border && 'ring-2 ring-white ring-offset-2'
          )}
        >
          {initials}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className={cn(
            'rounded-full object-cover',
            sizeClasses[size],
            border && 'ring-2 ring-white ring-offset-2'
          )}
        />
      )}
      {status !== 'none' && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-white',
            statusClasses[status],
            statusSizeClasses[size]
          )}
        />
      )}
    </div>
  );
}
