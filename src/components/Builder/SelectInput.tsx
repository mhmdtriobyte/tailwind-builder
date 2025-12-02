'use client';

import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className,
  disabled = false,
}: SelectInputProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-xs font-medium text-gray-400">
        {label}
      </label>
      <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
        <Select.Trigger
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 text-sm',
            'bg-gray-800 border border-gray-700 rounded-md',
            'text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors duration-150',
            'data-[placeholder]:text-gray-500'
          )}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={cn(
              'overflow-hidden bg-gray-800 border border-gray-700 rounded-md shadow-xl',
              'z-50'
            )}
            position="popper"
            sideOffset={4}
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-800 text-gray-400 cursor-default">
              <ChevronDown className="w-4 h-4 rotate-180" />
            </Select.ScrollUpButton>

            <Select.Viewport className="p-1 max-h-60">
              {options.filter(opt => opt.value !== '').map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'relative flex items-center px-8 py-2 text-sm text-white rounded',
                    'select-none outline-none cursor-pointer',
                    'data-[highlighted]:bg-gray-700',
                    'data-[disabled]:text-gray-500 data-[disabled]:pointer-events-none'
                  )}
                >
                  <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <Check className="w-4 h-4 text-blue-500" />
                  </Select.ItemIndicator>
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-800 text-gray-400 cursor-default">
              <ChevronDown className="w-4 h-4" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

interface MultiSelectOption {
  label: string;
  value: string;
}

interface ButtonGroupSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: MultiSelectOption[];
  className?: string;
}

export function ButtonGroupSelect({
  label,
  value,
  onChange,
  options,
  className,
}: ButtonGroupSelectProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-xs font-medium text-gray-400">
        {label}
      </label>
      <div className="flex rounded-md overflow-hidden border border-gray-700">
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 px-2 py-1.5 text-xs font-medium',
              'transition-colors duration-150',
              value === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white',
              index !== 0 && 'border-l border-gray-700'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
