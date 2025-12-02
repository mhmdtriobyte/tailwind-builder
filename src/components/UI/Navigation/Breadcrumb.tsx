import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHomeIcon?: boolean;
  onItemClick?: (href: string, index: number) => void;
  maxItems?: number;
  className?: string;
}

export function Breadcrumb({
  items,
  separator,
  showHomeIcon = true,
  onItemClick,
  maxItems,
  className,
}: BreadcrumbProps) {
  // Handle truncation if maxItems is set
  const displayItems = maxItems && items.length > maxItems
    ? [
        items[0],
        { label: '...', href: undefined },
        ...items.slice(-(maxItems - 2))
      ]
    : items;

  const defaultSeparator = (
    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
  );

  const handleClick = (e: React.MouseEvent, href: string | undefined, index: number) => {
    if (onItemClick && href) {
      e.preventDefault();
      onItemClick(href, index);
    }
  };

  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1" role="list">
        {displayItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li
              key={index}
              className="flex items-center"
            >
              {/* Separator */}
              {!isFirst && (
                <span className="mx-2" aria-hidden="true">
                  {separator || defaultSeparator}
                </span>
              )}

              {/* Breadcrumb Item */}
              {isEllipsis ? (
                <span className="text-sm text-gray-400 px-1">...</span>
              ) : isLast ? (
                <span
                  className="text-sm font-medium text-gray-900"
                  aria-current="page"
                >
                  {item.icon && (
                    <span className="mr-1.5 inline-flex" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || '#'}
                  onClick={(e) => handleClick(e, item.href, index)}
                  className={cn(
                    'text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded',
                    'inline-flex items-center'
                  )}
                >
                  {isFirst && showHomeIcon && !item.icon ? (
                    <>
                      <Home className="w-4 h-4" aria-hidden="true" />
                      <span className="sr-only">{item.label}</span>
                    </>
                  ) : (
                    <>
                      {item.icon && (
                        <span className="mr-1.5" aria-hidden="true">
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                    </>
                  )}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
