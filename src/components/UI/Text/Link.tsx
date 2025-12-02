import { cn } from '@/utils/cn';
import { ReactNode, AnchorHTMLAttributes } from 'react';

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  children: ReactNode;
  href: string;
  variant?: 'default' | 'primary' | 'secondary' | 'muted' | 'subtle' | 'nav';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  underline?: 'always' | 'hover' | 'none';
  external?: boolean;
  className?: string;
}

const variantClasses = {
  default: 'text-blue-600 hover:text-blue-800',
  primary: 'text-blue-600 hover:text-blue-700',
  secondary: 'text-gray-700 hover:text-gray-900',
  muted: 'text-gray-500 hover:text-gray-700',
  subtle: 'text-gray-600 hover:text-blue-600',
  nav: 'text-gray-700 hover:text-blue-600 font-medium',
};

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const underlineClasses = {
  always: 'underline underline-offset-2',
  hover: 'hover:underline hover:underline-offset-2',
  none: 'no-underline',
};

export function Link({
  children,
  href,
  variant = 'default',
  size = 'md',
  underline = 'hover',
  external = false,
  className,
  ...props
}: LinkProps) {
  const externalProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};

  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-1 transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded',
        variantClasses[variant],
        sizeClasses[size],
        underlineClasses[underline],
        className
      )}
      {...externalProps}
      {...props}
    >
      {children}
      {external && (
        <svg
          className="w-3.5 h-3.5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      )}
    </a>
  );
}
