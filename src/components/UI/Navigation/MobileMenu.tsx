import { useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  children?: MenuItem[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items?: MenuItem[];
  onItemClick?: (href: string) => void;
  logo?: React.ReactNode;
  logoText?: string;
  position?: 'left' | 'right';
  className?: string;
}

export function MobileMenu({
  isOpen,
  onClose,
  items = [],
  onItemClick,
  logo,
  logoText = 'Brand',
  position = 'left',
  className,
}: MobileMenuProps) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleItemClick = (href: string) => {
    onItemClick?.(href);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Menu */}
      <div
        className={cn(
          'fixed top-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-xl transition-transform duration-300 ease-out',
          position === 'left' ? 'left-0' : 'right-0',
          position === 'left'
            ? isOpen ? 'translate-x-0' : '-translate-x-full'
            : isOpen ? 'translate-x-0' : 'translate-x-full',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {logo || (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {logoText.charAt(0)}
              </div>
            )}
            <span className="font-bold text-gray-900">{logoText}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
          <ul className="space-y-1" role="menu">
            {items.map((item, index) => (
              <li key={index} role="none">
                {item.children && item.children.length > 0 ? (
                  <div className="space-y-1">
                    <span className="block px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {item.label}
                    </span>
                    <ul className="space-y-1 pl-2" role="menu">
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex} role="none">
                          <a
                            href={child.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleItemClick(child.href);
                            }}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                              child.active
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            )}
                            role="menuitem"
                            aria-current={child.active ? 'page' : undefined}
                          >
                            {child.icon && (
                              <span className="flex-shrink-0" aria-hidden="true">
                                {child.icon}
                              </span>
                            )}
                            <span className="flex-1">{child.label}</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleItemClick(item.href);
                    }}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      item.active
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                    role="menuitem"
                    aria-current={item.active ? 'page' : undefined}
                  >
                    {item.icon && (
                      <span className="flex-shrink-0" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
