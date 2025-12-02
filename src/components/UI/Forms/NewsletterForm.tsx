import { useState, FormEvent } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface NewsletterFormProps {
  onSubmit?: (email: string) => void;
  loading?: boolean;
  success?: boolean;
  error?: string;
  successMessage?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  privacyNote?: React.ReactNode;
  variant?: 'inline' | 'stacked' | 'card';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NewsletterForm({
  onSubmit,
  loading = false,
  success = false,
  error,
  successMessage = 'Thanks for subscribing!',
  title,
  description,
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  privacyNote,
  variant = 'inline',
  size = 'md',
  className,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);

  const emailError = touched && !email
    ? 'Email is required'
    : touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? 'Invalid email address'
    : '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!emailError && email) {
      onSubmit?.(email);
    }
  };

  const sizeClasses = {
    sm: {
      input: 'px-3 py-2 text-sm',
      button: 'px-4 py-2 text-sm',
      icon: 'w-4 h-4',
    },
    md: {
      input: 'px-4 py-2.5 text-sm',
      button: 'px-5 py-2.5 text-sm',
      icon: 'w-5 h-5',
    },
    lg: {
      input: 'px-5 py-3 text-base',
      button: 'px-6 py-3 text-base',
      icon: 'w-5 h-5',
    },
  };

  const sizes = sizeClasses[size];

  // Success State
  if (success) {
    return (
      <div
        className={cn(
          variant === 'card' && 'bg-white rounded-2xl shadow-lg p-6',
          className
        )}
      >
        <div className="flex items-center gap-3 text-green-600">
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium">{successMessage}</p>
            {description && (
              <p className="text-sm text-green-600/80 mt-0.5">
                Check your inbox to confirm your subscription.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Card Variant
  if (variant === 'card') {
    return (
      <div className={cn('bg-white rounded-2xl shadow-lg p-6', className)}>
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <div className="relative">
              <Mail
                className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400',
                  sizes.icon
                )}
                aria-hidden="true"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder={placeholder}
                disabled={loading}
                aria-invalid={!!emailError}
                aria-label="Email address"
                className={cn(
                  'w-full pl-10 border rounded-lg transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  sizes.input,
                  emailError || error
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-blue-500',
                  loading && 'bg-gray-100 cursor-not-allowed'
                )}
              />
            </div>
            {(emailError || error) && (
              <p className="text-xs text-red-500" role="alert">
                {emailError || error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full bg-blue-600 text-white font-medium rounded-lg transition-colors',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'disabled:opacity-70 disabled:cursor-not-allowed',
              'inline-flex items-center justify-center gap-2',
              sizes.button
            )}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Subscribing...
              </>
            ) : (
              buttonText
            )}
          </button>

          {privacyNote && (
            <p className="text-xs text-gray-500 text-center">{privacyNote}</p>
          )}
        </form>
      </div>
    );
  }

  // Stacked Variant
  if (variant === 'stacked') {
    return (
      <div className={cn('w-full', className)}>
        {(title || description) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="space-y-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder={placeholder}
              disabled={loading}
              aria-invalid={!!emailError}
              aria-label="Email address"
              className={cn(
                'w-full border rounded-lg transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                sizes.input,
                emailError || error
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-blue-500',
                loading && 'bg-gray-100 cursor-not-allowed'
              )}
            />
            {(emailError || error) && (
              <p className="text-xs text-red-500" role="alert">
                {emailError || error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full bg-blue-600 text-white font-medium rounded-lg transition-colors',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'disabled:opacity-70 disabled:cursor-not-allowed',
              sizes.button
            )}
          >
            {loading ? 'Subscribing...' : buttonText}
          </button>

          {privacyNote && (
            <p className="text-xs text-gray-500">{privacyNote}</p>
          )}
        </form>
      </div>
    );
  }

  // Inline Variant (default)
  return (
    <div className={cn('w-full', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder={placeholder}
              disabled={loading}
              aria-invalid={!!emailError}
              aria-label="Email address"
              className={cn(
                'w-full border rounded-lg transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                sizes.input,
                emailError || error
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-blue-500',
                loading && 'bg-gray-100 cursor-not-allowed'
              )}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'flex-shrink-0 bg-blue-600 text-white font-medium rounded-lg transition-colors',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'disabled:opacity-70 disabled:cursor-not-allowed',
              'inline-flex items-center gap-2',
              sizes.button
            )}
            aria-label={buttonText}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                <span className="hidden sm:inline">{buttonText}</span>
                <ArrowRight className="w-4 h-4 sm:hidden" aria-hidden="true" />
              </>
            )}
          </button>
        </div>

        {(emailError || error) && (
          <p className="mt-1 text-xs text-red-500" role="alert">
            {emailError || error}
          </p>
        )}

        {privacyNote && (
          <p className="mt-2 text-xs text-gray-500">{privacyNote}</p>
        )}
      </form>
    </div>
  );
}
