'use client';

import { useState, useMemo } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { colorPalette, specialColors } from '@/lib/tailwindClasses';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: 'bg' | 'text' | 'border';
  className?: string;
}

// Tailwind color shades mapped to their actual hex values for preview
const colorHexMap: Record<string, Record<string, string>> = {
  gray: {
    '50': '#f9fafb', '100': '#f3f4f6', '200': '#e5e7eb', '300': '#d1d5db',
    '400': '#9ca3af', '500': '#6b7280', '600': '#4b5563', '700': '#374151',
    '800': '#1f2937', '900': '#111827',
  },
  red: {
    '50': '#fef2f2', '100': '#fee2e2', '200': '#fecaca', '300': '#fca5a5',
    '400': '#f87171', '500': '#ef4444', '600': '#dc2626', '700': '#b91c1c',
    '800': '#991b1b', '900': '#7f1d1d',
  },
  orange: {
    '50': '#fff7ed', '100': '#ffedd5', '200': '#fed7aa', '300': '#fdba74',
    '400': '#fb923c', '500': '#f97316', '600': '#ea580c', '700': '#c2410c',
    '800': '#9a3412', '900': '#7c2d12',
  },
  amber: {
    '50': '#fffbeb', '100': '#fef3c7', '200': '#fde68a', '300': '#fcd34d',
    '400': '#fbbf24', '500': '#f59e0b', '600': '#d97706', '700': '#b45309',
    '800': '#92400e', '900': '#78350f',
  },
  yellow: {
    '50': '#fefce8', '100': '#fef9c3', '200': '#fef08a', '300': '#fde047',
    '400': '#facc15', '500': '#eab308', '600': '#ca8a04', '700': '#a16207',
    '800': '#854d0e', '900': '#713f12',
  },
  lime: {
    '50': '#f7fee7', '100': '#ecfccb', '200': '#d9f99d', '300': '#bef264',
    '400': '#a3e635', '500': '#84cc16', '600': '#65a30d', '700': '#4d7c0f',
    '800': '#3f6212', '900': '#365314',
  },
  green: {
    '50': '#f0fdf4', '100': '#dcfce7', '200': '#bbf7d0', '300': '#86efac',
    '400': '#4ade80', '500': '#22c55e', '600': '#16a34a', '700': '#15803d',
    '800': '#166534', '900': '#14532d',
  },
  emerald: {
    '50': '#ecfdf5', '100': '#d1fae5', '200': '#a7f3d0', '300': '#6ee7b7',
    '400': '#34d399', '500': '#10b981', '600': '#059669', '700': '#047857',
    '800': '#065f46', '900': '#064e3b',
  },
  teal: {
    '50': '#f0fdfa', '100': '#ccfbf1', '200': '#99f6e4', '300': '#5eead4',
    '400': '#2dd4bf', '500': '#14b8a6', '600': '#0d9488', '700': '#0f766e',
    '800': '#115e59', '900': '#134e4a',
  },
  cyan: {
    '50': '#ecfeff', '100': '#cffafe', '200': '#a5f3fc', '300': '#67e8f9',
    '400': '#22d3ee', '500': '#06b6d4', '600': '#0891b2', '700': '#0e7490',
    '800': '#155e75', '900': '#164e63',
  },
  sky: {
    '50': '#f0f9ff', '100': '#e0f2fe', '200': '#bae6fd', '300': '#7dd3fc',
    '400': '#38bdf8', '500': '#0ea5e9', '600': '#0284c7', '700': '#0369a1',
    '800': '#075985', '900': '#0c4a6e',
  },
  blue: {
    '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe', '300': '#93c5fd',
    '400': '#60a5fa', '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8',
    '800': '#1e40af', '900': '#1e3a8a',
  },
  indigo: {
    '50': '#eef2ff', '100': '#e0e7ff', '200': '#c7d2fe', '300': '#a5b4fc',
    '400': '#818cf8', '500': '#6366f1', '600': '#4f46e5', '700': '#4338ca',
    '800': '#3730a3', '900': '#312e81',
  },
  violet: {
    '50': '#f5f3ff', '100': '#ede9fe', '200': '#ddd6fe', '300': '#c4b5fd',
    '400': '#a78bfa', '500': '#8b5cf6', '600': '#7c3aed', '700': '#6d28d9',
    '800': '#5b21b6', '900': '#4c1d95',
  },
  purple: {
    '50': '#faf5ff', '100': '#f3e8ff', '200': '#e9d5ff', '300': '#d8b4fe',
    '400': '#c084fc', '500': '#a855f7', '600': '#9333ea', '700': '#7e22ce',
    '800': '#6b21a8', '900': '#581c87',
  },
  fuchsia: {
    '50': '#fdf4ff', '100': '#fae8ff', '200': '#f5d0fe', '300': '#f0abfc',
    '400': '#e879f9', '500': '#d946ef', '600': '#c026d3', '700': '#a21caf',
    '800': '#86198f', '900': '#701a75',
  },
  pink: {
    '50': '#fdf2f8', '100': '#fce7f3', '200': '#fbcfe8', '300': '#f9a8d4',
    '400': '#f472b6', '500': '#ec4899', '600': '#db2777', '700': '#be185d',
    '800': '#9d174d', '900': '#831843',
  },
  rose: {
    '50': '#fff1f2', '100': '#ffe4e6', '200': '#fecdd3', '300': '#fda4af',
    '400': '#fb7185', '500': '#f43f5e', '600': '#e11d48', '700': '#be123c',
    '800': '#9f1239', '900': '#881337',
  },
  slate: {
    '50': '#f8fafc', '100': '#f1f5f9', '200': '#e2e8f0', '300': '#cbd5e1',
    '400': '#94a3b8', '500': '#64748b', '600': '#475569', '700': '#334155',
    '800': '#1e293b', '900': '#0f172a',
  },
  zinc: {
    '50': '#fafafa', '100': '#f4f4f5', '200': '#e4e4e7', '300': '#d4d4d8',
    '400': '#a1a1aa', '500': '#71717a', '600': '#52525b', '700': '#3f3f46',
    '800': '#27272a', '900': '#18181b',
  },
  neutral: {
    '50': '#fafafa', '100': '#f5f5f5', '200': '#e5e5e5', '300': '#d4d4d4',
    '400': '#a3a3a3', '500': '#737373', '600': '#525252', '700': '#404040',
    '800': '#262626', '900': '#171717',
  },
  stone: {
    '50': '#fafaf9', '100': '#f5f5f4', '200': '#e7e5e4', '300': '#d6d3d1',
    '400': '#a8a29e', '500': '#78716c', '600': '#57534e', '700': '#44403c',
    '800': '#292524', '900': '#1c1917',
  },
};

const specialHexMap: Record<string, string> = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

function getColorHex(colorClass: string): string {
  if (specialHexMap[colorClass]) {
    return specialHexMap[colorClass];
  }

  // Parse the color class (e.g., "bg-blue-500" -> "blue", "500")
  const parts = colorClass.split('-');
  if (parts.length < 2) return '#9ca3af';

  const colorName = parts[parts.length - 2];
  const shade = parts[parts.length - 1];

  if (colorHexMap[colorName] && colorHexMap[colorName][shade]) {
    return colorHexMap[colorName][shade];
  }

  return '#9ca3af';
}

function parseColorValue(value: string, prefix: string): { color: string; shade: string } | null {
  if (!value) return null;

  const match = value.match(new RegExp(`^${prefix}-([a-z]+)-?(\\d+)?$`));
  if (match) {
    return {
      color: match[1],
      shade: match[2] || '',
    };
  }

  // Check for special colors
  for (const special of specialColors) {
    if (value === `${prefix}-${special}`) {
      return { color: special, shade: '' };
    }
  }

  return null;
}

export function ColorPicker({
  label,
  value,
  onChange,
  prefix = 'bg',
  className,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

  const colorFamilies = useMemo(
    () => Object.keys(colorPalette),
    []
  );

  const currentHex = useMemo(() => {
    if (!value) return 'transparent';
    return getColorHex(value);
  }, [value]);

  const displayValue = useMemo(() => {
    if (!value) return 'None';
    const parsed = parseColorValue(value, prefix);
    if (parsed) {
      return parsed.shade ? `${parsed.color}-${parsed.shade}` : parsed.color;
    }
    return value;
  }, [value, prefix]);

  const handleColorSelect = (colorName: string, shade?: string) => {
    const newValue = shade ? `${prefix}-${colorName}-${shade}` : `${prefix}-${colorName}`;
    onChange(newValue);
    setOpen(false);
    setSelectedFamily(null);
  };

  const handleClear = () => {
    onChange('');
    setOpen(false);
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-xs font-medium text-gray-400">
        {label}
      </label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2',
              'bg-gray-800 border border-gray-700 rounded-md',
              'text-white text-sm',
              'hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500',
              'transition-colors duration-150'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 rounded border border-gray-600',
                currentHex === 'transparent' && 'bg-checkered'
              )}
              style={{
                backgroundColor: currentHex === 'transparent' ? undefined : currentHex,
              }}
            />
            <span className="flex-1 text-left truncate">{displayValue}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={cn(
              'w-72 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl',
              'z-50'
            )}
            sideOffset={5}
            align="start"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">
                {selectedFamily ? (
                  <button
                    onClick={() => setSelectedFamily(null)}
                    className="flex items-center gap-1 hover:text-blue-400"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                    {selectedFamily}
                  </button>
                ) : (
                  'Color Palette'
                )}
              </span>
              <button
                onClick={handleClear}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>

            {/* Special Colors */}
            {!selectedFamily && (
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1.5">Special</div>
                <div className="flex gap-1">
                  {specialColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={cn(
                        'w-8 h-8 rounded border-2',
                        value === `${prefix}-${color}`
                          ? 'border-blue-500'
                          : 'border-gray-600 hover:border-gray-500',
                        color === 'transparent' && 'bg-checkered',
                        color === 'white' && 'bg-white',
                        color === 'black' && 'bg-black'
                      )}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Color Grid / Shades */}
            {selectedFamily ? (
              // Show shades for selected family
              <div>
                <div className="grid grid-cols-10 gap-1">
                  {colorPalette[selectedFamily as keyof typeof colorPalette].map((shade) => {
                    const colorClass = `${prefix}-${selectedFamily}-${shade}`;
                    const hex = colorHexMap[selectedFamily]?.[shade] || '#9ca3af';
                    return (
                      <button
                        key={shade}
                        onClick={() => handleColorSelect(selectedFamily, shade)}
                        className={cn(
                          'w-6 h-6 rounded border-2',
                          value === colorClass
                            ? 'border-blue-500 ring-2 ring-blue-500/50'
                            : 'border-transparent hover:border-gray-500'
                        )}
                        style={{ backgroundColor: hex }}
                        title={`${selectedFamily}-${shade}`}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              // Show color families
              <div className="grid grid-cols-4 gap-2">
                {colorFamilies.map((family) => {
                  const previewHex = colorHexMap[family]?.['500'] || '#9ca3af';
                  return (
                    <button
                      key={family}
                      onClick={() => setSelectedFamily(family)}
                      className={cn(
                        'flex flex-col items-center gap-1 p-2 rounded',
                        'hover:bg-gray-700/50 transition-colors'
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded border border-gray-600"
                        style={{ backgroundColor: previewHex }}
                      />
                      <span className="text-[10px] text-gray-400 capitalize">
                        {family}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <Popover.Arrow className="fill-gray-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <style jsx global>{`
        .bg-checkered {
          background-image: linear-gradient(45deg, #374151 25%, transparent 25%),
            linear-gradient(-45deg, #374151 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #374151 75%),
            linear-gradient(-45deg, transparent 75%, #374151 75%);
          background-size: 8px 8px;
          background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
        }
      `}</style>
    </div>
  );
}

// Quick color select for common colors
interface QuickColorSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: 'bg' | 'text' | 'border';
  className?: string;
}

export function QuickColorSelect({
  label,
  value,
  onChange,
  prefix = 'bg',
  className,
}: QuickColorSelectProps) {
  const quickColors = [
    'white',
    'black',
    'gray-500',
    'red-500',
    'orange-500',
    'yellow-500',
    'green-500',
    'blue-500',
    'indigo-500',
    'purple-500',
    'pink-500',
  ];

  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-xs font-medium text-gray-400">
        {label}
      </label>
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => onChange('')}
          className={cn(
            'w-6 h-6 rounded border-2 bg-checkered',
            !value ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'
          )}
          title="None"
        />
        {quickColors.map((color) => {
          const colorClass = `${prefix}-${color}`;
          let hex: string;
          if (color === 'white') hex = '#ffffff';
          else if (color === 'black') hex = '#000000';
          else {
            const [name, shade] = color.split('-');
            hex = colorHexMap[name]?.[shade] || '#9ca3af';
          }

          return (
            <button
              key={color}
              onClick={() => onChange(colorClass)}
              className={cn(
                'w-6 h-6 rounded border-2',
                value === colorClass
                  ? 'border-blue-500 ring-2 ring-blue-500/50'
                  : 'border-gray-600 hover:border-gray-500'
              )}
              style={{ backgroundColor: hex }}
              title={color}
            />
          );
        })}
      </div>
    </div>
  );
}

export { colorHexMap };
