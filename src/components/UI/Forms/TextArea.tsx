import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface TextAreaProps {
  label: string;
  placeholder?: string;
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
  rows?: number;
  maxLength?: number;
  minLength?: number;
  showCharCount?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  name?: string;
  id?: string;
  autoFocus?: boolean;
  className?: string;
  textAreaClassName?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      placeholder,
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
      rows = 4,
      maxLength,
      minLength,
      showCharCount = false,
      resize = 'vertical',
      name,
      id,
      autoFocus,
      className,
      textAreaClassName,
    },
    ref
  ) => {
    const generatedId = useId();
    const textAreaId = id || generatedId;
    const helperId = `${textAreaId}-helper`;
    const errorId = `${textAreaId}-error`;

    const currentLength = value?.length || 0;

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className={cn('w-full space-y-1', className)}>
        <div className="flex items-center justify-between">
          <label
            htmlFor={textAreaId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {showCharCount && maxLength && (
            <span
              className={cn(
                'text-xs',
                currentLength > maxLength ? 'text-red-500' : 'text-gray-400'
              )}
              aria-live="polite"
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textAreaId}
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
          rows={rows}
          maxLength={maxLength}
          minLength={minLength}
          autoFocus={autoFocus}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            'w-full px-3 py-2 border rounded-md text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            resizeClasses[resize],
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
            disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed',
            readOnly && 'bg-gray-50',
            textAreaClassName
          )}
        />

        {(helperText || error) && (
          <p
            id={error ? errorId : helperId}
            className={cn('text-xs', error ? 'text-red-500' : 'text-gray-500')}
            role={error ? 'alert' : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
