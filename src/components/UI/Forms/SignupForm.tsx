import { useState, FormEvent } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface SignupFormProps {
  onSubmit?: (data: SignupFormData) => void;
  onLoginClick?: () => void;
  loading?: boolean;
  error?: string;
  logo?: React.ReactNode;
  title?: string;
  subtitle?: string;
  showTermsCheckbox?: boolean;
  termsLabel?: React.ReactNode;
  loginText?: string;
  loginLinkText?: string;
  submitButtonText?: string;
  minPasswordLength?: number;
  className?: string;
}

export function SignupForm({
  onSubmit,
  onLoginClick,
  loading = false,
  error,
  logo,
  title = 'Create an account',
  subtitle = 'Get started with your free account today',
  showTermsCheckbox = true,
  termsLabel = (
    <>
      I agree to the{' '}
      <a href="#" className="text-blue-600 hover:underline">
        Terms of Service
      </a>{' '}
      and{' '}
      <a href="#" className="text-blue-600 hover:underline">
        Privacy Policy
      </a>
    </>
  ),
  loginText = 'Already have an account?',
  loginLinkText = 'Sign in',
  submitButtonText = 'Create account',
  minPasswordLength = 8,
  className,
}: SignupFormProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    acceptTerms: false,
  });

  const updateField = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation
  const nameError = touched.name && !formData.name.trim() ? 'Name is required' : '';
  const emailError = touched.email && !formData.email
    ? 'Email is required'
    : touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ? 'Invalid email address'
    : '';
  const passwordError = touched.password && !formData.password
    ? 'Password is required'
    : touched.password && formData.password.length < minPasswordLength
    ? `Password must be at least ${minPasswordLength} characters`
    : '';
  const confirmPasswordError = touched.confirmPassword && !formData.confirmPassword
    ? 'Please confirm your password'
    : touched.confirmPassword && formData.password !== formData.confirmPassword
    ? 'Passwords do not match'
    : '';
  const termsError = touched.acceptTerms && showTermsCheckbox && !formData.acceptTerms
    ? 'You must accept the terms'
    : '';

  // Password strength indicators
  const passwordStrength = {
    hasMinLength: formData.password.length >= minPasswordLength,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true,
    });

    if (
      !nameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      !termsError &&
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      (!showTermsCheckbox || formData.acceptTerms)
    ) {
      onSubmit?.(formData);
    }
  };

  const PasswordRequirement = ({ met, label }: { met: boolean; label: string }) => (
    <li className="flex items-center gap-1.5 text-xs">
      {met ? (
        <Check className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
      ) : (
        <X className="w-3.5 h-3.5 text-gray-300" aria-hidden="true" />
      )}
      <span className={met ? 'text-green-600' : 'text-gray-500'}>{label}</span>
    </li>
  );

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
          {/* Name Field */}
          <div className="space-y-1">
            <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                id="signup-name"
                name="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                onBlur={() => markTouched('name')}
                placeholder="John Doe"
                autoComplete="name"
                disabled={loading}
                aria-invalid={!!nameError}
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  nameError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500',
                  loading && 'bg-gray-100 cursor-not-allowed'
                )}
              />
            </div>
            {nameError && <p className="text-xs text-red-500" role="alert">{nameError}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="email"
                id="signup-email"
                name="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                onBlur={() => markTouched('email')}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                aria-invalid={!!emailError}
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  emailError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500',
                  loading && 'bg-gray-100 cursor-not-allowed'
                )}
              />
            </div>
            {emailError && <p className="text-xs text-red-500" role="alert">{emailError}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                id="signup-password"
                name="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                onBlur={() => markTouched('password')}
                placeholder="Create a strong password"
                autoComplete="new-password"
                disabled={loading}
                aria-invalid={!!passwordError}
                className={cn(
                  'w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  passwordError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500',
                  loading && 'bg-gray-100 cursor-not-allowed'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && <p className="text-xs text-red-500" role="alert">{passwordError}</p>}

            {/* Password Strength */}
            {formData.password && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-colors',
                        strengthScore >= level
                          ? strengthScore <= 2
                            ? 'bg-red-500'
                            : strengthScore <= 3
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                          : 'bg-gray-200'
                      )}
                    />
                  ))}
                </div>
                <ul className="grid grid-cols-2 gap-1">
                  <PasswordRequirement met={passwordStrength.hasMinLength} label={`${minPasswordLength}+ characters`} />
                  <PasswordRequirement met={passwordStrength.hasUppercase} label="Uppercase" />
                  <PasswordRequirement met={passwordStrength.hasLowercase} label="Lowercase" />
                  <PasswordRequirement met={passwordStrength.hasNumber} label="Number" />
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="signup-confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                onBlur={() => markTouched('confirmPassword')}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={loading}
                aria-invalid={!!confirmPasswordError}
                className={cn(
                  'w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  confirmPasswordError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500',
                  loading && 'bg-gray-100 cursor-not-allowed'
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-xs text-red-500" role="alert">{confirmPasswordError}</p>
            )}
          </div>

          {/* Terms Checkbox */}
          {showTermsCheckbox && (
            <div className="space-y-1">
              <label className="inline-flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => updateField('acceptTerms', e.target.checked)}
                  onBlur={() => markTouched('acceptTerms')}
                  disabled={loading}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">{termsLabel}</span>
              </label>
              {termsError && <p className="text-xs text-red-500" role="alert">{termsError}</p>}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            )}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </span>
            ) : (
              submitButtonText
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {loginText}{' '}
          <button
            type="button"
            onClick={onLoginClick}
            className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
          >
            {loginLinkText}
          </button>
        </p>
      </div>
    </div>
  );
}
