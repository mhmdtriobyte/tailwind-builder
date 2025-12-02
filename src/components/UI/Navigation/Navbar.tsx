import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface NavbarProps {
  logo?: React.ReactNode;
  logoText?: string;
  links?: NavLink[];
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  onLinkClick?: (href: string) => void;
  onMobileMenuToggle?: (isOpen: boolean) => void;
  sticky?: boolean;
  transparent?: boolean;
  className?: string;
}

export function Navbar({
  logo,
  logoText = 'Brand',
  links = [],
  ctaText = 'Get Started',
  ctaHref = '#',
  onCtaClick,
  onLinkClick,
  onMobileMenuToggle,
  sticky = false,
  transparent = false,
  className,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuToggle?.(newState);
  };

  const handleLinkClick = (href: string) => {
    onLinkClick?.(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        'w-full px-4 py-3 transition-all duration-200',
        sticky && 'sticky top-0 z-50',
        transparent ? 'bg-transparent' : 'bg-white shadow-sm',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          aria-label={`${logoText} - Home`}
        >
          {logo || (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {logoText.charAt(0)}
            </div>
          )}
          <span>{logoText}</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6" role="menubar">
            {links.map((link, index) => (
              <li key={index} role="none">
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    link.active
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                  role="menuitem"
                  aria-current={link.active ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <a
            href={ctaHref}
            onClick={(e) => {
              if (onCtaClick) {
                e.preventDefault();
                onCtaClick();
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {ctaText}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleMobileMenuToggle}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="pt-4 pb-2 space-y-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className={cn(
                'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                link.active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              aria-current={link.active ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
          <a
            href={ctaHref}
            onClick={(e) => {
              if (onCtaClick) {
                e.preventDefault();
                onCtaClick();
              }
            }}
            className="block px-3 py-2 mt-2 bg-blue-600 text-white text-sm font-medium rounded-lg text-center hover:bg-blue-700 transition-colors"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </nav>
  );
}
