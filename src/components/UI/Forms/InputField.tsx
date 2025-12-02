import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  name?: string;
  id?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  inputClassName?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      placeholder,
      type = 'text',
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      helperText,
      error,
      disabled,
      required,
      readOnly,
      autoComplete,
      autoFocus,
      maxLength,
      minLength,
      pattern,
      name,
      id,
      leadingIcon,
      trailingIcon,
      size = 'md',
      className,
      inputClassName,
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className={cn('w-full space-y-1', className)}>
        <label
          htmlFor={inputId}
          className={cn(
            'block font-medium text-gray-700',
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
          )}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <div className="relative">
          {leadingIcon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none',
                iconSizeClasses[size]
              )}
              aria-hidden="true"
            >
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            id={inputId}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              'w-full border rounded-md transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              sizeClasses[size],
              leadingIcon && 'pl-10',
              trailingIcon && 'pr-10',
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
              disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed',
              readOnly && 'bg-gray-50',
              inputClassName
            )}
          />

          {trailingIcon && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none',
                iconSizeClasses[size]
              )}
              aria-hidden="true"
            >
              {trailingIcon}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p
            id={error ? errorId : helperId}
            className={cn(
              size === 'sm' ? 'text-[10px]' : 'text-xs',
              error ? 'text-red-500' : 'text-gray-500'
            )}
            role={error ? 'alert' : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
