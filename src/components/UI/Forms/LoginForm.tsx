import { useState, FormEvent } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string; rememberMe: boolean }) => void;
  onForgotPassword?: () => void;
  onSignUpClick?: () => void;
  loading?: boolean;
  error?: string;
  logo?: React.ReactNode;
  title?: string;
  subtitle?: string;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  showSignUpLink?: boolean;
  signUpText?: string;
  signUpLinkText?: string;
  submitButtonText?: string;
  className?: string;
}

export function LoginForm({
  onSubmit,
  onForgotPassword,
  onSignUpClick,
  loading = false,
  error,
  logo,
  title = 'Welcome back',
  subtitle = 'Sign in to your account to continue',
  showRememberMe = true,
  showForgotPassword = true,
  showSignUpLink = true,
  signUpText = "Don't have an account?",
  signUpLinkText = 'Sign up',
  submitButtonText = 'Sign in',
  className,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = touched.email && !email ? 'Email is required' :
                     touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Invalid email address' : '';
  const passwordError = touched.password && !password ? 'Password is required' : '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!emailError && !passwordError && email && password) {
      onSubmit?.({ email, password, rememberMe });
    }
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          {logo && <div className="mb-4 flex justify-center">{logo}</div>}
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
          >
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email Field */}
          <div className="space-y-1">
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="email"
                id="login-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  emailError
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-blue-500',
                  loading && 'bg-gray-100 cursor-not-allowed'
                )}
              />
            </div>
            {emailError && (
              <p id="email-error" className="text-xs text-red-500" role="alert">
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? 'password-error' : undefined}
                className={cn(
                  'w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  passwordError
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-blue-500',
                  loading && 'bg-gray-100 cursor-not-allowed'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Eye className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {passwordError && (
              <p id="password-error" className="text-xs text-red-500" role="alert">
                {passwordError}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          {(showRememberMe || showForgotPassword) && (
            <div className="flex items-center justify-between">
              {showRememberMe && (
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
              )}
              {showForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              loading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-blue-700'
            )}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              submitButtonText
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        {showSignUpLink && (
          <p className="mt-6 text-center text-sm text-gray-600">
            {signUpText}{' '}
            <button
              type="button"
              onClick={onSignUpClick}
              className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
            >
              {signUpLinkText}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
