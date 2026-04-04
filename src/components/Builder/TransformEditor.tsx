'use client';

import React, { useState, useCallback, useMemo } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Move, RotateCcw, Copy, Check, Maximize2 } from 'lucide-react';
import { cn } from '@/utils/cn';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TransformValues {
  translateX: number;
  translateY: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
}

export type TransformOriginPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

export interface TransformEditorProps {
  values: TransformValues;
  onChange: (values: TransformValues) => void;
  transformOrigin: TransformOriginPosition;
  onTransformOriginChange: (origin: TransformOriginPosition) => void;
  onPreview?: (cssTransform: string) => void;
  className?: string;
}

interface TransformDefinition {
  key: keyof TransformValues;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultValue: number;
  cssFunction: (value: number) => string;
  group: 'translate' | 'rotate' | 'scale' | 'skew';
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TRANSFORM_DEFINITIONS: TransformDefinition[] = [
  {
    key: 'translateX',
    label: 'Translate X',
    min: -200,
    max: 200,
    step: 1,
    unit: 'px',
    defaultValue: 0,
    cssFunction: (v) => `translateX(${v}px)`,
    group: 'translate',
  },
  {
    key: 'translateY',
    label: 'Translate Y',
    min: -200,
    max: 200,
    step: 1,
    unit: 'px',
    defaultValue: 0,
    cssFunction: (v) => `translateY(${v}px)`,
    group: 'translate',
  },
  {
    key: 'rotate',
    label: 'Rotate',
    min: -180,
    max: 180,
    step: 1,
    unit: 'deg',
    defaultValue: 0,
    cssFunction: (v) => `rotate(${v}deg)`,
    group: 'rotate',
  },
  {
    key: 'scaleX',
    label: 'Scale X',
    min: 0.1,
    max: 3,
    step: 0.05,
    unit: 'x',
    defaultValue: 1,
    cssFunction: (v) => `scaleX(${v})`,
    group: 'scale',
  },
  {
    key: 'scaleY',
    label: 'Scale Y',
    min: 0.1,
    max: 3,
    step: 0.05,
    unit: 'x',
    defaultValue: 1,
    cssFunction: (v) => `scaleY(${v})`,
    group: 'scale',
  },
  {
    key: 'skewX',
    label: 'Skew X',
    min: -45,
    max: 45,
    step: 1,
    unit: 'deg',
    defaultValue: 0,
    cssFunction: (v) => `skewX(${v}deg)`,
    group: 'skew',
  },
  {
    key: 'skewY',
    label: 'Skew Y',
    min: -45,
    max: 45,
    step: 1,
    unit: 'deg',
    defaultValue: 0,
    cssFunction: (v) => `skewY(${v}deg)`,
    group: 'skew',
  },
];

const DEFAULT_TRANSFORM_VALUES: TransformValues = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
};

const TRANSFORM_ORIGIN_LABELS: Record<TransformOriginPosition, string> = {
  'top-left': 'Top Left',
  'top': 'Top Center',
  'top-right': 'Top Right',
  'left': 'Center Left',
  'center': 'Center',
  'right': 'Center Right',
  'bottom-left': 'Bottom Left',
  'bottom': 'Bottom Center',
  'bottom-right': 'Bottom Right',
};

const TRANSFORM_ORIGIN_CSS: Record<TransformOriginPosition, string> = {
  'top-left': 'top left',
  'top': 'top center',
  'top-right': 'top right',
  'left': 'center left',
  'center': 'center center',
  'right': 'center right',
  'bottom-left': 'bottom left',
  'bottom': 'bottom center',
  'bottom-right': 'bottom right',
};

const GROUP_LABELS = {
  translate: 'Translation',
  rotate: 'Rotation',
  scale: 'Scale',
  skew: 'Skew',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateTransformCSS(values: TransformValues): string {
  const transforms: string[] = [];

  TRANSFORM_DEFINITIONS.forEach((def) => {
    const value = values[def.key];
    if (value !== def.defaultValue) {
      transforms.push(def.cssFunction(value));
    }
  });

  return transforms.length > 0 ? transforms.join(' ') : 'none';
}

function hasActiveTransforms(values: TransformValues): boolean {
  return TRANSFORM_DEFINITIONS.some(
    (def) => values[def.key] !== def.defaultValue
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface TransformSliderProps {
  definition: TransformDefinition;
  value: number;
  onChange: (value: number) => void;
  isModified: boolean;
}

function TransformSlider({
  definition,
  value,
  onChange,
  isModified,
}: TransformSliderProps) {
  const { label, min, max, step, unit, defaultValue } = definition;

  const handleReset = useCallback(() => {
    onChange(defaultValue);
  }, [onChange, defaultValue]);

  // Calculate display value
  const displayValue = definition.group === 'scale'
    ? value.toFixed(2)
    : Math.round(value);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">{label}</label>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-xs font-mono min-w-[50px] text-right',
              isModified ? 'text-blue-400' : 'text-gray-500'
            )}
          >
            {displayValue}
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
            {/* Colored range from center or min */}
            <Slider.Range
              className={cn(
                'absolute rounded-full h-full',
                isModified ? 'bg-blue-500' : 'bg-gray-500'
              )}
            />
            {/* Center/default marker */}
            {defaultValue > min && defaultValue < max && (
              <div
                className="absolute w-0.5 h-3 bg-gray-500 top-1/2 -translate-y-1/2 z-10"
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
            'w-16 px-2 py-1 text-xs text-right',
            'bg-gray-800 border border-gray-700 rounded',
            'text-white',
            'focus:outline-none focus:ring-1 focus:ring-blue-500'
          )}
        />
      </div>
    </div>
  );
}

interface TransformOriginGridProps {
  value: TransformOriginPosition;
  onChange: (origin: TransformOriginPosition) => void;
}

function TransformOriginGrid({ value, onChange }: TransformOriginGridProps) {
  const positions: TransformOriginPosition[][] = [
    ['top-left', 'top', 'top-right'],
    ['left', 'center', 'right'],
    ['bottom-left', 'bottom', 'bottom-right'],
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-400">Transform Origin</label>
        <span className="text-xs text-gray-500">
          {TRANSFORM_ORIGIN_LABELS[value]}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1 w-fit">
        {positions.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((position) => (
              <button
                key={position}
                onClick={() => onChange(position)}
                className={cn(
                  'w-6 h-6 rounded border transition-colors',
                  'flex items-center justify-center',
                  value === position
                    ? 'bg-blue-500 border-blue-400'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                )}
                title={TRANSFORM_ORIGIN_LABELS[position]}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    value === position ? 'bg-white' : 'bg-gray-500'
                  )}
                />
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TransformEditor({
  values,
  onChange,
  transformOrigin,
  onTransformOriginChange,
  onPreview,
  className,
}: TransformEditorProps) {
  const [copied, setCopied] = useState(false);
  const [linkScale, setLinkScale] = useState(values.scaleX === values.scaleY);

  // Generate CSS transform string
  const cssTransform = useMemo(() => generateTransformCSS(values), [values]);

  // Check if any transforms are active
  const hasTransforms = useMemo(() => hasActiveTransforms(values), [values]);

  // Group definitions by group
  const groupedDefinitions = useMemo(() => {
    const groups: Record<string, TransformDefinition[]> = {
      translate: [],
      rotate: [],
      scale: [],
      skew: [],
    };
    TRANSFORM_DEFINITIONS.forEach((def) => {
      groups[def.group].push(def);
    });
    return groups;
  }, []);

  // Handle transform value change
  const handleTransformChange = useCallback(
    (key: keyof TransformValues, value: number) => {
      let newValues = { ...values, [key]: value };

      // Link scale X and Y if enabled
      if (linkScale && (key === 'scaleX' || key === 'scaleY')) {
        newValues = {
          ...newValues,
          scaleX: value,
          scaleY: value,
        };
      }

      onChange(newValues);
      onPreview?.(generateTransformCSS(newValues));
    },
    [values, onChange, onPreview, linkScale]
  );

  // Reset all transforms
  const handleReset = useCallback(() => {
    onChange(DEFAULT_TRANSFORM_VALUES);
    onPreview?.('none');
  }, [onChange, onPreview]);

  // Copy CSS to clipboard
  const handleCopyCSS = useCallback(async () => {
    const css = `transform: ${cssTransform};\ntransform-origin: ${TRANSFORM_ORIGIN_CSS[transformOrigin]};`;
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [cssTransform, transformOrigin]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">Transform</span>
          {hasTransforms && (
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
            disabled={!hasTransforms}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-xs',
              'transition-colors',
              hasTransforms
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 cursor-not-allowed'
            )}
            title="Reset all transforms"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Transform Origin Grid */}
      <TransformOriginGrid
        value={transformOrigin}
        onChange={onTransformOriginChange}
      />

      {/* Transform Controls by Group */}
      <div className="space-y-6">
        {Object.entries(groupedDefinitions).map(([group, definitions]) => (
          <div key={group} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {GROUP_LABELS[group as keyof typeof GROUP_LABELS]}
              </h4>
              {group === 'scale' && (
                <button
                  onClick={() => {
                    setLinkScale(!linkScale);
                    if (!linkScale) {
                      // Sync scale values when linking
                      handleTransformChange('scaleY', values.scaleX);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded text-[10px]',
                    'transition-colors',
                    linkScale
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-800 text-gray-500 hover:text-gray-300'
                  )}
                >
                  <Maximize2 className="w-3 h-3" />
                  {linkScale ? 'Linked' : 'Link'}
                </button>
              )}
            </div>
            {definitions.map((definition) => (
              <TransformSlider
                key={definition.key}
                definition={definition}
                value={values[definition.key]}
                onChange={(value) => handleTransformChange(definition.key, value)}
                isModified={values[definition.key] !== definition.defaultValue}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Live Preview Box */}
      <div className="pt-3 border-t border-gray-800">
        <div className="text-xs font-medium text-gray-400 mb-2">Preview</div>
        <div className="relative h-32 bg-gray-800/50 rounded-lg overflow-hidden flex items-center justify-center">
          {/* Grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(75, 85, 99, 0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(75, 85, 99, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
          {/* Transform preview box */}
          <div
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg flex items-center justify-center"
            style={{
              transform: cssTransform,
              transformOrigin: TRANSFORM_ORIGIN_CSS[transformOrigin],
            }}
          >
            <span className="text-white text-xs font-medium">Box</span>
          </div>
          {/* Origin point indicator */}
          <div
            className="absolute w-3 h-3 border-2 border-yellow-400 rounded-full bg-yellow-400/30"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      </div>

      {/* CSS Preview */}
      <div className="pt-3 border-t border-gray-800">
        <div className="text-xs font-medium text-gray-400 mb-2">Generated CSS</div>
        <code
          className={cn(
            'block p-2 rounded text-xs font-mono',
            'bg-gray-800 text-gray-300 whitespace-pre-wrap'
          )}
        >
          {`transform: ${cssTransform};\ntransform-origin: ${TRANSFORM_ORIGIN_CSS[transformOrigin]};`}
        </code>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { DEFAULT_TRANSFORM_VALUES, generateTransformCSS };
export default TransformEditor;
