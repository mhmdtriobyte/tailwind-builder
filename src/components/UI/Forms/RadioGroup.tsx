import { useId } from 'react';
import { cn } from '@/utils/cn';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RadioGroup({
  label,
  options,
  value,
  defaultValue,
  onChange,
  name,
  disabled,
  required,
  error,
  helperText,
  orientation = 'vertical',
  size = 'md',
  className,
}: RadioGroupProps) {
  const generatedId = useId();
  const groupName = name || generatedId;
  const helperId = `${groupName}-helper`;
  const errorId = `${groupName}-error`;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const currentValue = value ?? defaultValue;

  return (
    <fieldset
      className={cn('w-full', className)}
      aria-describedby={error ? errorId : helperText ? helperId : undefined}
    >
      <legend
        className={cn(
          'block font-medium text-gray-700 mb-2',
          labelSizeClasses[size]
        )}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </legend>

      <div
        className={cn(
          'flex gap-3',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
        role="radiogroup"
        aria-required={required}
        aria-invalid={!!error}
      >
        {options.map((option) => {
          const optionId = `${groupName}-${option.value}`;
          const isChecked = currentValue === option.value;
          const isDisabled = disabled || option.disabled;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                'inline-flex items-start gap-2 cursor-pointer',
                isDisabled && 'cursor-not-allowed opacity-60'
              )}
            >
              <div className="relative flex items-center">
                <input
                  type="radio"
                  id={optionId}
                  name={groupName}
                  value={option.value}
                  checked={value !== undefined ? isChecked : undefined}
                  defaultChecked={value === undefined && defaultValue === option.value}
                  onChange={(e) => onChange?.(e.target.value)}
                  disabled={isDisabled}
                  required={required}
                  className="sr-only peer"
                />
                <div
                  className={cn(
                    'flex items-center justify-center border-2 rounded-full transition-colors',
                    sizeClasses[size],
                    error
                      ? 'border-red-500'
                      : 'border-gray-300',
                    !isDisabled && 'peer-hover:border-blue-500',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2',
                    isChecked && !isDisabled && 'border-blue-600',
                    isChecked && isDisabled && 'border-gray-400'
                  )}
                  aria-hidden="true"
                >
                  {isChecked && (
                    <div
                      className={cn(
                        'rounded-full',
                        dotSizeClasses[size],
                        isDisabled ? 'bg-gray-400' : 'bg-blue-600'
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <span
                  className={cn(
                    'font-medium select-none',
                    labelSizeClasses[size],
                    isDisabled ? 'text-gray-400' : 'text-gray-700'
                  )}
                >
                  {option.label}
                </span>
                {option.description && (
                  <span
                    className={cn(
                      'text-gray-500',
                      size === 'sm' ? 'text-[10px]' : 'text-xs'
                    )}
                  >
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {(helperText || error) && (
        <p
          id={error ? errorId : helperId}
          className={cn(
            'mt-2 text-xs',
            error ? 'text-red-500' : 'text-gray-500'
          )}
          role={error ? 'alert' : undefined}
        >
          {error || helperText}
        </p>
      )}
    </fieldset>
  );
}
