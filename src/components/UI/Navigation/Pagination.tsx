import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPageNumbers = true,
  size = 'md',
  disabled = false,
  className,
}: PaginationProps) {
  const sizeClasses = {
    sm: 'h-8 min-w-[2rem] text-xs',
    md: 'h-10 min-w-[2.5rem] text-sm',
    lg: 'h-12 min-w-[3rem] text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // Generate page numbers array with ellipsis
  const generatePages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];

    // Always include first page
    pages.push(1);

    // Calculate range around current page
    const leftSibling = Math.max(2, currentPage - siblingCount);
    const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount);

    // Add left ellipsis if needed
    if (leftSibling > 2) {
      pages.push('ellipsis');
    }

    // Add pages around current
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Add right ellipsis if needed
    if (rightSibling < totalPages - 1) {
      pages.push('ellipsis');
    }

    // Always include last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageClick = (page: number) => {
    if (!disabled && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const buttonBaseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    sizeClasses[size]
  );

  const getButtonClasses = (isActive: boolean, isDisabled: boolean) => {
    if (isDisabled || disabled) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }
    if (isActive) {
      return 'bg-blue-600 text-white';
    }
    return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={cn('flex items-center justify-center', className)}
      aria-label="Pagination navigation"
      role="navigation"
    >
      <ul className="flex items-center gap-1" role="list">
        {/* First Page Button */}
        {showFirstLast && (
          <li>
            <button
              type="button"
              onClick={() => handlePageClick(1)}
              disabled={!canGoPrevious || disabled}
              className={cn(
                buttonBaseClasses,
                getButtonClasses(false, !canGoPrevious)
              )}
              aria-label="Go to first page"
            >
              <ChevronLeft className={cn(iconSizes[size], '-mr-1')} aria-hidden="true" />
              <ChevronLeft className={cn(iconSizes[size], '-ml-2')} aria-hidden="true" />
            </button>
          </li>
        )}

        {/* Previous Button */}
        <li>
          <button
            type="button"
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={!canGoPrevious || disabled}
            className={cn(
              buttonBaseClasses,
              getButtonClasses(false, !canGoPrevious)
            )}
            aria-label="Go to previous page"
          >
            <ChevronLeft className={iconSizes[size]} aria-hidden="true" />
          </button>
        </li>

        {/* Page Numbers */}
        {showPageNumbers && pages.map((page, index) => (
          <li key={`${page}-${index}`}>
            {page === 'ellipsis' ? (
              <span
                className={cn(
                  'inline-flex items-center justify-center text-gray-400',
                  sizeClasses[size]
                )}
                aria-hidden="true"
              >
                <MoreHorizontal className={iconSizes[size]} />
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handlePageClick(page)}
                disabled={disabled}
                className={cn(
                  buttonBaseClasses,
                  getButtonClasses(page === currentPage, false)
                )}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            type="button"
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={!canGoNext || disabled}
            className={cn(
              buttonBaseClasses,
              getButtonClasses(false, !canGoNext)
            )}
            aria-label="Go to next page"
          >
            <ChevronRight className={iconSizes[size]} aria-hidden="true" />
          </button>
        </li>

        {/* Last Page Button */}
        {showFirstLast && (
          <li>
            <button
              type="button"
              onClick={() => handlePageClick(totalPages)}
              disabled={!canGoNext || disabled}
              className={cn(
                buttonBaseClasses,
                getButtonClasses(false, !canGoNext)
              )}
              aria-label="Go to last page"
            >
              <ChevronRight className={cn(iconSizes[size], '-mr-1')} aria-hidden="true" />
              <ChevronRight className={cn(iconSizes[size], '-ml-2')} aria-hidden="true" />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageInfo?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageInfo = true,
  disabled = false,
  className,
}: SimplePaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div
      className={cn('flex items-center justify-between gap-4', className)}
      role="navigation"
      aria-label="Simple pagination"
    >
      <button
        type="button"
        onClick={() => canGoPrevious && !disabled && onPageChange(currentPage - 1)}
        disabled={!canGoPrevious || disabled}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          canGoPrevious && !disabled
            ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        )}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        <span>Previous</span>
      </button>

      {showPageInfo && (
        <span className="text-sm text-gray-600">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </span>
      )}

      <button
        type="button"
        onClick={() => canGoNext && !disabled && onPageChange(currentPage + 1)}
        disabled={!canGoNext || disabled}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          canGoNext && !disabled
            ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        )}
        aria-label="Go to next page"
      >
        <span>Next</span>
        <ChevronRight className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
