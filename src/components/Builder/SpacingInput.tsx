'use client';

import { useState, useCallback } from 'react';
import { Link, Unlink } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SpacingValues {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

interface SpacingInputProps {
  label: string;
  values: SpacingValues;
  onChange: (values: SpacingValues) => void;
  prefix: 'p' | 'm' | 'pt' | 'mt';
  options: { label: string; value: string }[];
  className?: string;
}

const SPACING_OPTIONS = [
  { label: '0', value: '0' },
  { label: '0.5', value: '0.5' },
  { label: '1', value: '1' },
  { label: '1.5', value: '1.5' },
  { label: '2', value: '2' },
  { label: '2.5', value: '2.5' },
  { label: '3', value: '3' },
  { label: '3.5', value: '3.5' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '14', value: '14' },
  { label: '16', value: '16' },
  { label: '20', value: '20' },
  { label: '24', value: '24' },
  { label: '28', value: '28' },
  { label: '32', value: '32' },
  { label: '36', value: '36' },
  { label: '40', value: '40' },
  { label: '44', value: '44' },
  { label: '48', value: '48' },
  { label: 'auto', value: 'auto' },
];

export function SpacingInput({
  label,
  values,
  onChange,
  prefix,
  options = SPACING_OPTIONS,
  className,
}: SpacingInputProps) {
  const [linked, setLinked] = useState(
    values.top === values.right &&
    values.right === values.bottom &&
    values.bottom === values.left
  );

  const handleSingleChange = useCallback(
    (side: keyof SpacingValues, value: string) => {
      if (linked) {
        onChange({ top: value, right: value, bottom: value, left: value });
      } else {
        onChange({ ...values, [side]: value });
      }
    },
    [linked, onChange, values]
  );

  const toggleLinked = useCallback(() => {
    const newLinked = !linked;
    setLinked(newLinked);
    if (newLinked) {
      // When linking, use the top value for all sides
      onChange({
        top: values.top,
        right: values.top,
        bottom: values.top,
        left: values.top,
      });
    }
  }, [linked, onChange, values.top]);

  const SpacingSelect = ({
    value,
    side,
    label: sideLabel,
  }: {
    value: string;
    side: keyof SpacingValues;
    label: string;
  }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-gray-500 uppercase">{sideLabel}</span>
      <select
        value={value}
        onChange={(e) => handleSingleChange(side, e.target.value)}
        className={cn(
          'w-14 px-1 py-1.5 text-xs text-center',
          'bg-gray-800 border border-gray-700 rounded',
          'text-white',
          'focus:outline-none focus:ring-1 focus:ring-blue-500',
          'cursor-pointer appearance-none'
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">{label}</label>
        <button
          onClick={toggleLinked}
          className={cn(
            'p-1 rounded transition-colors',
            linked
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          )}
          title={linked ? 'Unlink values' : 'Link all values'}
        >
          {linked ? (
            <Link className="w-3.5 h-3.5" />
          ) : (
            <Unlink className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <div className="relative bg-gray-800/50 rounded-lg p-3">
        {/* Top */}
        <div className="flex justify-center mb-2">
          <SpacingSelect value={values.top} side="top" label="T" />
        </div>

        {/* Left and Right */}
        <div className="flex justify-between items-center">
          <SpacingSelect value={values.left} side="left" label="L" />

          {/* Center indicator */}
          <div className="w-10 h-10 border border-dashed border-gray-600 rounded flex items-center justify-center">
            <span className="text-[10px] text-gray-500">{prefix}</span>
          </div>

          <SpacingSelect value={values.right} side="right" label="R" />
        </div>

        {/* Bottom */}
        <div className="flex justify-center mt-2">
          <SpacingSelect value={values.bottom} side="bottom" label="B" />
        </div>
      </div>
    </div>
  );
}

interface SimpleSpacingInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: { label: string; value: string }[];
  className?: string;
}

export function SimpleSpacingInput({
  label,
  value,
  onChange,
  options = SPACING_OPTIONS,
  className,
}: SimpleSpacingInputProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-xs font-medium text-gray-400">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-2 text-sm',
          'bg-gray-800 border border-gray-700 rounded-md',
          'text-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'cursor-pointer'
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { SPACING_OPTIONS };
