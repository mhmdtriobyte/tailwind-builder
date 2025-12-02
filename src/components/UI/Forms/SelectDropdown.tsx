import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectGroupOption {
  label: string;
  options: SelectOption[];
}

interface SelectDropdownProps {
  label: string;
  options: (SelectOption | SelectGroupOption)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  selectClassName?: string;
}

function isGroupOption(
  option: SelectOption | SelectGroupOption
): option is SelectGroupOption {
  return 'options' in option;
}

export const SelectDropdown = forwardRef<HTMLSelectElement, SelectDropdownProps>(
  (
    {
      label,
      options,
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      placeholder,
      helperText,
      error,
      disabled,
      required,
      name,
      id,
      size = 'md',
      className,
      selectClassName,
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs pr-8',
      md: 'px-3 py-2 text-sm pr-10',
      lg: 'px-4 py-3 text-base pr-12',
    };

    const iconPositionClasses = {
      sm: 'right-2 w-4 h-4',
      md: 'right-3 w-5 h-5',
      lg: 'right-4 w-5 h-5',
    };

    const renderOptions = (opts: (SelectOption | SelectGroupOption)[]) => {
      return opts.map((option, index) => {
        if (isGroupOption(option)) {
          return (
            <optgroup key={`group-${index}`} label={option.label}>
              {option.options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          );
        }
        return (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        );
      });
    };

    return (
      <div className={cn('w-full space-y-1', className)}>
        <label
          htmlFor={selectId}
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
          <select
            ref={ref}
            id={selectId}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              'w-full border rounded-md appearance-none bg-white transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              sizeClasses[size],
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
              disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed',
              selectClassName
            )}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {renderOptions(options)}
          </select>

          <ChevronDown
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none',
              iconPositionClasses[size]
            )}
            aria-hidden="true"
          />
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

SelectDropdown.displayName = 'SelectDropdown';
