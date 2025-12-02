'use client';

import { cn } from '@/utils/cn';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'url';
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className,
  disabled = false,
  min,
  max,
  step,
}: TextInputProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-xs font-medium text-gray-400">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.value);
        }}
        onKeyDown={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={cn(
          'w-full px-3 py-2 text-sm',
          'bg-gray-800 border border-gray-700 rounded-md',
          'text-white placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-150'
        )}
      />
    </div>
  );
}

interface TextAreaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  rows?: number;
}

export function TextAreaInput({
  label,
  value,
  onChange,
  placeholder = '',
  className,
  disabled = false,
  rows = 3,
}: TextAreaInputProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-xs font-medium text-gray-400">
        {label}
      </label>
      <textarea
        value={value ?? ''}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.value);
        }}
        onKeyDown={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={cn(
          'w-full px-3 py-2 text-sm',
          'bg-gray-800 border border-gray-700 rounded-md',
          'text-white placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-150',
          'resize-none'
        )}
      />
    </div>
  );
}
