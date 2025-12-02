import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface ToggleSwitchProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  name?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  labelPosition?: 'left' | 'right';
  showOnOffLabels?: boolean;
  onLabel?: string;
  offLabel?: string;
  className?: string;
}

export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  (
    {
      label,
      checked,
      defaultChecked,
      onChange,
      disabled,
      required,
      error,
      helperText,
      name,
      id,
      size = 'md',
      labelPosition = 'right',
      showOnOffLabels = false,
      onLabel = 'On',
      offLabel = 'Off',
      className,
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id || generatedId;
    const helperId = `${switchId}-helper`;
    const errorId = `${switchId}-error`;

    const isChecked = checked ?? defaultChecked ?? false;

    const trackSizeClasses = {
      sm: 'w-8 h-4',
      md: 'w-11 h-6',
      lg: 'w-14 h-8',
    };

    const thumbSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-5 h-5',
      lg: 'w-7 h-7',
    };

    const thumbTranslateClasses = {
      sm: 'translate-x-4',
      md: 'translate-x-5',
      lg: 'translate-x-6',
    };

    const labelSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

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
          htmlFor={switchId}
          className={cn(
            'inline-flex items-center gap-3 cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}
        >
          {labelPosition === 'left' && LabelContent}

          {showOnOffLabels && labelPosition === 'right' && (
            <span
              className={cn(
                'text-xs font-medium w-6 text-right',
                disabled ? 'text-gray-400' : 'text-gray-500'
              )}
              aria-hidden="true"
            >
              {isChecked ? '' : offLabel}
            </span>
          )}

          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={switchId}
              name={name}
              checked={checked}
              defaultChecked={defaultChecked}
              onChange={(e) => onChange?.(e.target.checked)}
              disabled={disabled}
              required={required}
              role="switch"
              aria-checked={isChecked}
              aria-invalid={!!error}
              aria-describedby={
                error ? errorId : helperText ? helperId : undefined
              }
              className="sr-only peer"
            />
            {/* Track */}
            <div
              className={cn(
                'rounded-full transition-colors duration-200',
                trackSizeClasses[size],
                error && 'ring-2 ring-red-500',
                isChecked
                  ? disabled
                    ? 'bg-gray-400'
                    : 'bg-blue-600'
                  : disabled
                  ? 'bg-gray-200'
                  : 'bg-gray-300',
                !disabled && 'peer-hover:opacity-90',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2'
              )}
              aria-hidden="true"
            >
              {/* Thumb */}
              <div
                className={cn(
                  'rounded-full bg-white shadow-sm transform transition-transform duration-200',
                  thumbSizeClasses[size],
                  'absolute top-0.5 left-0.5',
                  isChecked && thumbTranslateClasses[size]
                )}
              />
            </div>
          </div>

          {showOnOffLabels && labelPosition === 'right' && (
            <span
              className={cn(
                'text-xs font-medium w-6',
                disabled ? 'text-gray-400' : 'text-gray-500'
              )}
              aria-hidden="true"
            >
              {isChecked ? onLabel : ''}
            </span>
          )}

          {labelPosition === 'right' && LabelContent}

          {showOnOffLabels && labelPosition === 'left' && (
            <span
              className={cn(
                'text-xs font-medium min-w-[2rem]',
                disabled ? 'text-gray-400' : 'text-gray-500'
              )}
              aria-hidden="true"
            >
              {isChecked ? onLabel : offLabel}
            </span>
          )}
        </label>

        {(helperText || error) && (
          <p
            id={error ? errorId : helperId}
            className={cn(
              'mt-1 text-xs',
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

ToggleSwitch.displayName = 'ToggleSwitch';
