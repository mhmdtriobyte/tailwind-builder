'use client';

import React, { useState, useCallback, useMemo } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { SlidersHorizontal, RotateCcw, Sparkles, Copy, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FilterValues {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
}

export interface FilterEditorProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onPreview?: (cssFilter: string) => void;
  className?: string;
}

interface FilterDefinition {
  key: keyof FilterValues;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultValue: number;
  cssFunction: (value: number) => string;
}

export interface FilterPreset {
  name: string;
  description: string;
  values: Partial<FilterValues>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const FILTER_DEFINITIONS: FilterDefinition[] = [
  {
    key: 'blur',
    label: 'Blur',
    min: 0,
    max: 20,
    step: 0.5,
    unit: 'px',
    defaultValue: 0,
    cssFunction: (v) => `blur(${v}px)`,
  },
  {
    key: 'brightness',
    label: 'Brightness',
    min: 0,
    max: 200,
    step: 5,
    unit: '%',
    defaultValue: 100,
    cssFunction: (v) => `brightness(${v}%)`,
  },
  {
    key: 'contrast',
    label: 'Contrast',
    min: 0,
    max: 200,
    step: 5,
    unit: '%',
    defaultValue: 100,
    cssFunction: (v) => `contrast(${v}%)`,
  },
  {
    key: 'grayscale',
    label: 'Grayscale',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
    defaultValue: 0,
    cssFunction: (v) => `grayscale(${v}%)`,
  },
  {
    key: 'hueRotate',
    label: 'Hue Rotate',
    min: 0,
    max: 360,
    step: 5,
    unit: 'deg',
    defaultValue: 0,
    cssFunction: (v) => `hue-rotate(${v}deg)`,
  },
  {
    key: 'invert',
    label: 'Invert',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
    defaultValue: 0,
    cssFunction: (v) => `invert(${v}%)`,
  },
  {
    key: 'opacity',
    label: 'Opacity',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
    defaultValue: 100,
    cssFunction: (v) => `opacity(${v}%)`,
  },
  {
    key: 'saturate',
    label: 'Saturate',
    min: 0,
    max: 200,
    step: 5,
    unit: '%',
    defaultValue: 100,
    cssFunction: (v) => `saturate(${v}%)`,
  },
  {
    key: 'sepia',
    label: 'Sepia',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
    defaultValue: 0,
    cssFunction: (v) => `sepia(${v}%)`,
  },
];

const DEFAULT_FILTER_VALUES: FilterValues = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
  saturate: 100,
  sepia: 0,
};

const FILTER_PRESETS: FilterPreset[] = [
  {
    name: 'Vintage',
    description: 'Warm, faded retro look',
    values: {
      brightness: 110,
      contrast: 90,
      saturate: 85,
      sepia: 30,
    },
  },
  {
    name: 'Dramatic',
    description: 'High contrast, bold',
    values: {
      brightness: 95,
      contrast: 140,
      saturate: 120,
    },
  },
  {
    name: 'Faded',
    description: 'Soft, washed out',
    values: {
      brightness: 110,
      contrast: 85,
      saturate: 80,
      grayscale: 10,
    },
  },
  {
    name: 'B&W',
    description: 'Classic black and white',
    values: {
      grayscale: 100,
      contrast: 110,
    },
  },
  {
    name: 'Warm',
    description: 'Golden, sunny tones',
    values: {
      brightness: 105,
      saturate: 110,
      sepia: 15,
      hueRotate: 350,
    },
  },
  {
    name: 'Cool',
    description: 'Blue, icy tones',
    values: {
      brightness: 105,
      saturate: 90,
      hueRotate: 180,
    },
  },
  {
    name: 'Muted',
    description: 'Desaturated, subtle',
    values: {
      saturate: 60,
      contrast: 95,
      brightness: 105,
    },
  },
  {
    name: 'Pop',
    description: 'Vibrant, eye-catching',
    values: {
      saturate: 150,
      contrast: 115,
      brightness: 105,
    },
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateFilterCSS(values: FilterValues): string {
  const filters: string[] = [];

  FILTER_DEFINITIONS.forEach((def) => {
    const value = values[def.key];
    if (value !== def.defaultValue) {
      filters.push(def.cssFunction(value));
    }
  });

  return filters.length > 0 ? filters.join(' ') : 'none';
}

function hasActiveFilters(values: FilterValues): boolean {
  return FILTER_DEFINITIONS.some(
    (def) => values[def.key] !== def.defaultValue
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface FilterSliderProps {
  definition: FilterDefinition;
  value: number;
  onChange: (value: number) => void;
  isModified: boolean;
}

function FilterSlider({
  definition,
  value,
  onChange,
  isModified,
}: FilterSliderProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { label, min, max, step, unit, defaultValue } = definition;

  const handleReset = useCallback(() => {
    onChange(defaultValue);
  }, [onChange, defaultValue]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">{label}</label>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-xs font-mono',
              isModified ? 'text-blue-400' : 'text-gray-500'
            )}
          >
            {value}
            {unit}
          </span>
          {isModified && (
            <button
              onClick={handleReset}
              className="p-0.5 text-gray-500 hover:text-white transition-colors"
              title="Reset to default"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          min={min}
          max={max}
          step={step}
        >
          <Slider.Track className="bg-gray-700 relative grow rounded-full h-1.5">
            <Slider.Range
              className={cn(
                'absolute rounded-full h-full',
                isModified ? 'bg-blue-500' : 'bg-gray-500'
              )}
            />
            {/* Default value marker */}
            {defaultValue > min && defaultValue < max && (
              <div
                className="absolute w-0.5 h-3 bg-gray-500 top-1/2 -translate-y-1/2"
                style={{
                  left: `${((defaultValue - min) / (max - min)) * 100}%`,
                }}
              />
            )}
          </Slider.Track>
          <Slider.Thumb
            className={cn(
              'block w-4 h-4 rounded-full shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              'transition-colors duration-150',
              isModified
                ? 'bg-blue-500 hover:bg-blue-400'
                : 'bg-white hover:bg-gray-100'
            )}
            aria-label={label}
          />
        </Slider.Root>

        {/* Numeric input */}
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const num = parseFloat(e.target.value);
            if (!isNaN(num)) {
              onChange(Math.max(min, Math.min(max, num)));
            }
          }}
          min={min}
          max={max}
          step={step}
          className={cn(
            'w-14 px-2 py-1 text-xs text-right',
            'bg-gray-800 border border-gray-700 rounded',
            'text-white',
            'focus:outline-none focus:ring-1 focus:ring-blue-500'
          )}
        />
      </div>
    </div>
  );
}

interface PresetButtonProps {
  preset: FilterPreset;
  isActive: boolean;
  onClick: () => void;
}

function PresetButton({ preset, isActive, onClick }: PresetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-start p-2 rounded-lg border transition-colors',
        isActive
          ? 'bg-blue-500/20 border-blue-500/50 text-white'
          : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
      )}
    >
      <span className="text-xs font-medium">{preset.name}</span>
      <span className="text-[10px] text-gray-500">{preset.description}</span>
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FilterEditor({
  values,
  onChange,
  onPreview,
  className,
}: FilterEditorProps) {
  const [copied, setCopied] = useState(false);
  const [expandedPresets, setExpandedPresets] = useState(false);

  // Generate CSS filter string
  const cssFilter = useMemo(() => generateFilterCSS(values), [values]);

  // Check if any filters are active
  const hasFilters = useMemo(() => hasActiveFilters(values), [values]);

  // Check which preset is currently active (if any)
  const activePreset = useMemo(() => {
    return FILTER_PRESETS.find((preset) => {
      return Object.entries(preset.values).every(([key, presetValue]) => {
        return values[key as keyof FilterValues] === presetValue;
      });
    });
  }, [values]);

  // Handle filter value change
  const handleFilterChange = useCallback(
    (key: keyof FilterValues, value: number) => {
      const newValues = { ...values, [key]: value };
      onChange(newValues);
      onPreview?.(generateFilterCSS(newValues));
    },
    [values, onChange, onPreview]
  );

  // Apply preset
  const handleApplyPreset = useCallback(
    (preset: FilterPreset) => {
      const newValues = { ...DEFAULT_FILTER_VALUES, ...preset.values };
      onChange(newValues);
      onPreview?.(generateFilterCSS(newValues));
    },
    [onChange, onPreview]
  );

  // Reset all filters
  const handleReset = useCallback(() => {
    onChange(DEFAULT_FILTER_VALUES);
    onPreview?.('none');
  }, [onChange, onPreview]);

  // Copy CSS to clipboard
  const handleCopyCSS = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`filter: ${cssFilter};`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [cssFilter]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">CSS Filters</span>
          {hasFilters && (
            <span className="px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCSS}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-xs',
              'text-gray-400 hover:text-white hover:bg-gray-800',
              'transition-colors'
            )}
            title="Copy CSS"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleReset}
            disabled={!hasFilters}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-xs',
              'transition-colors',
              hasFilters
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 cursor-not-allowed'
            )}
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Presets Section */}
      <div className="space-y-2">
        <button
          onClick={() => setExpandedPresets(!expandedPresets)}
          className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Presets
          <span className="text-gray-600">
            {expandedPresets ? '(hide)' : '(show)'}
          </span>
        </button>

        {expandedPresets && (
          <div className="grid grid-cols-2 gap-2">
            {FILTER_PRESETS.map((preset) => (
              <PresetButton
                key={preset.name}
                preset={preset}
                isActive={activePreset?.name === preset.name}
                onClick={() => handleApplyPreset(preset)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter Sliders */}
      <div className="space-y-4">
        {FILTER_DEFINITIONS.map((definition) => (
          <FilterSlider
            key={definition.key}
            definition={definition}
            value={values[definition.key]}
            onChange={(value) => handleFilterChange(definition.key, value)}
            isModified={values[definition.key] !== definition.defaultValue}
          />
        ))}
      </div>

      {/* CSS Preview */}
      <div className="pt-3 border-t border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">Generated CSS</span>
        </div>
        <code
          className={cn(
            'block p-2 rounded text-xs font-mono break-all',
            'bg-gray-800 text-gray-300'
          )}
        >
          filter: {cssFilter};
        </code>
      </div>

      {/* Live Preview Box */}
      <div className="pt-3 border-t border-gray-800">
        <div className="text-xs font-medium text-gray-400 mb-2">Preview</div>
        <div className="relative">
          <div
            className="w-full h-24 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
            style={{ filter: cssFilter }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="text-white text-sm font-medium px-3 py-1 rounded bg-black/30"
              style={{ filter: cssFilter }}
            >
              Preview Text
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { DEFAULT_FILTER_VALUES, FILTER_PRESETS, generateFilterCSS };
export default FilterEditor;
