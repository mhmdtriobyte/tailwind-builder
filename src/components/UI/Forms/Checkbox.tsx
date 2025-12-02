import { forwardRef, useId } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CheckboxProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  name?: string;
  id?: string;
  value?: string;
  size?: 'sm' | 'md' | 'lg';
  labelPosition?: 'left' | 'right';
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      checked,
      defaultChecked,
      onChange,
      indeterminate = false,
      disabled,
      required,
      error,
      helperText,
      name,
      id,
      value,
      size = 'md',
      labelPosition = 'right',
      className,
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const helperId = `${checkboxId}-helper`;
    const errorId = `${checkboxId}-error`;

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const iconSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    };

    const labelSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const isChecked = checked ?? defaultChecked ?? false;

    const LabelContent = (
      <span
        className={cn(
          'font-medium select-none',
          labelSizeClasses[size],
          disabled ? 'text-gray-400' : 'text-gray-700'
        )}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </span>
    );

    return (
      <div className={cn('inline-flex flex-col', className)}>
        <label
          htmlFor={checkboxId}
          className={cn(
            'inline-flex items-center gap-2 cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}
        >
          {labelPosition === 'left' && LabelContent}

          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              name={name}
              value={value}
              checked={checked}
              defaultChecked={defaultChecked}
              onChange={(e) => onChange?.(e.target.checked)}
              disabled={disabled}
              required={required}
              aria-invalid={!!error}
              aria-describedby={
                error ? errorId : helperText ? helperId : undefined
              }
              className="sr-only peer"
            />
            <div
              className={cn(
                'flex items-center justify-center border-2 rounded transition-colors',
                sizeClasses[size],
                error
                  ? 'border-red-500'
                  : 'border-gray-300',
                !disabled && 'peer-hover:border-blue-500',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2',
                (isChecked || indeterminate) && !disabled && 'bg-blue-600 border-blue-600',
                (isChecked || indeterminate) && disabled && 'bg-gray-400 border-gray-400',
                disabled && !isChecked && !indeterminate && 'bg-gray-100 border-gray-300'
              )}
              aria-hidden="true"
            >
              {indeterminate ? (
                <Minus
                  className={cn(iconSizeClasses[size], 'text-white')}
                  strokeWidth={3}
                />
              ) : isChecked ? (
                <Check
                  className={cn(iconSizeClasses[size], 'text-white')}
                  strokeWidth={3}
                />
              ) : null}
            </div>
          </div>

          {labelPosition === 'right' && LabelContent}
        </label>

        {(helperText || error) && (
          <p
            id={error ? errorId : helperId}
            className={cn(
              'mt-1 text-xs',
              error ? 'text-red-500' : 'text-gray-500',
              labelPosition === 'right' && size === 'sm' && 'ml-6',
              labelPosition === 'right' && size === 'md' && 'ml-7',
              labelPosition === 'right' && size === 'lg' && 'ml-8'
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

Checkbox.displayName = 'Checkbox';
