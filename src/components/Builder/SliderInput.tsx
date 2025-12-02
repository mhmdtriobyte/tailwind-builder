'use client';

import * as Slider from '@radix-ui/react-slider';
import { cn } from '@/utils/cn';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
  disabled?: boolean;
  showValue?: boolean;
}

export function SliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  className,
  disabled = false,
  showValue = true,
}: SliderInputProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-gray-400">
          {label}
        </label>
        {showValue && (
          <span className="text-xs font-medium text-white">
            {value}{unit}
          </span>
        )}
      </div>
      <Slider.Root
        className={cn(
          'relative flex items-center select-none touch-none w-full h-5',
          disabled && 'opacity-50 pointer-events-none'
        )}
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      >
        <Slider.Track className="bg-gray-700 relative grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className={cn(
            'block w-4 h-4 bg-white rounded-full shadow-md',
            'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
            'transition-colors duration-150'
          )}
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
}

interface SliderWithInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
  disabled?: boolean;
}

export function SliderWithInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  className,
  disabled = false,
}: SliderWithInputProps) {
  const handleInputChange = (inputValue: string) => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      onChange(Math.max(min, Math.min(max, numValue)));
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-gray-400">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={cn(
              'w-14 px-2 py-1 text-xs text-right',
              'bg-gray-800 border border-gray-700 rounded',
              'text-white',
              'focus:outline-none focus:ring-1 focus:ring-blue-500',
              'disabled:opacity-50'
            )}
          />
          {unit && (
            <span className="text-xs text-gray-500">{unit}</span>
          )}
        </div>
      </div>
      <Slider.Root
        className={cn(
          'relative flex items-center select-none touch-none w-full h-5',
          disabled && 'opacity-50 pointer-events-none'
        )}
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      >
        <Slider.Track className="bg-gray-700 relative grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className={cn(
            'block w-4 h-4 bg-white rounded-full shadow-md',
            'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
            'transition-colors duration-150'
          )}
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
}
