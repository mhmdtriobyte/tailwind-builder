'use client';

import { useState } from 'react';
import {
  Layers,
  Blend,
  Filter,
  Move,
  ChevronDown,
  RotateCw,
  Maximize2,
  Eye,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';

// ============================================================================
// CONSTANTS
// ============================================================================

const BLEND_MODES = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
];

const GRADIENT_PRESETS = [
  { name: 'Blue Purple', value: 'bg-gradient-to-r from-blue-500 to-purple-600' },
  { name: 'Green Teal', value: 'bg-gradient-to-r from-green-400 to-teal-500' },
  { name: 'Orange Red', value: 'bg-gradient-to-r from-orange-400 to-red-500' },
  { name: 'Pink Rose', value: 'bg-gradient-to-r from-pink-500 to-rose-500' },
  { name: 'Indigo Blue', value: 'bg-gradient-to-r from-indigo-500 to-blue-500' },
  { name: 'Yellow Orange', value: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
  { name: 'Cyan Blue', value: 'bg-gradient-to-r from-cyan-400 to-blue-500' },
  { name: 'Purple Pink', value: 'bg-gradient-to-r from-purple-500 to-pink-500' },
];

const GRADIENT_DIRECTIONS = [
  { value: 'to-r', label: 'Right', icon: 'rotate-0' },
  { value: 'to-l', label: 'Left', icon: 'rotate-180' },
  { value: 'to-t', label: 'Up', icon: '-rotate-90' },
  { value: 'to-b', label: 'Down', icon: 'rotate-90' },
  { value: 'to-tr', label: 'Top Right', icon: '-rotate-45' },
  { value: 'to-tl', label: 'Top Left', icon: '-rotate-135' },
  { value: 'to-br', label: 'Bottom Right', icon: 'rotate-45' },
  { value: 'to-bl', label: 'Bottom Left', icon: 'rotate-135' },
];

const FILTER_OPTIONS = [
  { key: 'blur', label: 'Blur', min: 0, max: 20, unit: 'px', tailwind: 'blur' },
  { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%', tailwind: 'brightness' },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%', tailwind: 'contrast' },
  { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%', tailwind: 'grayscale' },
  { key: 'hue-rotate', label: 'Hue Rotate', min: 0, max: 360, unit: 'deg', tailwind: 'hue-rotate' },
  { key: 'saturate', label: 'Saturate', min: 0, max: 200, unit: '%', tailwind: 'saturate' },
  { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%', tailwind: 'sepia' },
];

const TRANSFORM_SCALE_OPTIONS = [
  { value: 'scale-75', label: '75%' },
  { value: 'scale-90', label: '90%' },
  { value: 'scale-95', label: '95%' },
  { value: 'scale-100', label: '100%' },
  { value: 'scale-105', label: '105%' },
  { value: 'scale-110', label: '110%' },
  { value: 'scale-125', label: '125%' },
  { value: 'scale-150', label: '150%' },
];

const TRANSFORM_ROTATE_OPTIONS = [
  { value: 'rotate-0', label: '0' },
  { value: 'rotate-1', label: '1' },
  { value: 'rotate-2', label: '2' },
  { value: 'rotate-3', label: '3' },
  { value: 'rotate-6', label: '6' },
  { value: 'rotate-12', label: '12' },
  { value: 'rotate-45', label: '45' },
  { value: 'rotate-90', label: '90' },
  { value: 'rotate-180', label: '180' },
  { value: '-rotate-1', label: '-1' },
  { value: '-rotate-2', label: '-2' },
  { value: '-rotate-3', label: '-3' },
  { value: '-rotate-6', label: '-6' },
  { value: '-rotate-12', label: '-12' },
  { value: '-rotate-45', label: '-45' },
  { value: '-rotate-90', label: '-90' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-between w-full px-3 py-2',
          'text-sm text-gray-300 hover:bg-gray-800/50',
          'transition-colors duration-150'
        )}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && <div className="p-3 border-t border-gray-800">{children}</div>}
    </div>
  );
}

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}

function SliderInput({ label, value, min, max, unit, onChange }: SliderInputProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-400">{label}</label>
        <span className="text-xs text-gray-500">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full h-1.5 rounded-full appearance-none cursor-pointer',
          'bg-gray-700 accent-blue-500'
        )}
      />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AdvancedStylePanel() {
  const { selectedId, getElementById, updateElement } = useBuilderStore();

  const [filters, setFilters] = useState({
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    'hue-rotate': 0,
    saturate: 100,
    sepia: 0,
  });

  const [transform, setTransform] = useState({
    scale: 'scale-100',
    rotate: 'rotate-0',
    translateX: '0',
    translateY: '0',
  });

  const [blendMode, setBlendMode] = useState('normal');
  const [selectedGradient, setSelectedGradient] = useState<string | null>(null);

  const selectedElement = selectedId ? getElementById(selectedId) : null;

  const handleApplyFilter = (key: string, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    if (!selectedElement) return;

    const filterOption = FILTER_OPTIONS.find((f) => f.key === key);
    if (!filterOption) return;

    const currentEffects = selectedElement.styles.effects || [];
    const prefix = filterOption.tailwind;

    // Remove existing filter of this type
    const filteredEffects = currentEffects.filter((c) => !c.startsWith(prefix));

    // Add new filter class if value is not default
    const defaultValue = key === 'brightness' || key === 'contrast' || key === 'saturate' ? 100 : 0;
    if (value !== defaultValue) {
      filteredEffects.push(`${prefix}-${value}`);
    }

    updateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        effects: filteredEffects,
      },
    });
  };

  const handleApplyTransform = (type: 'scale' | 'rotate', value: string) => {
    setTransform((prev) => ({ ...prev, [type]: value }));

    if (!selectedElement) return;

    const currentEffects = selectedElement.styles.effects || [];
    const prefix = type === 'scale' ? 'scale-' : 'rotate';

    // Remove existing transform of this type
    const filteredEffects = currentEffects.filter((c) => !c.includes(prefix));

    // Add new transform class
    if (value !== 'scale-100' && value !== 'rotate-0') {
      filteredEffects.push(value);
    }

    updateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        effects: filteredEffects,
      },
    });
  };

  const handleApplyGradient = (gradient: string) => {
    setSelectedGradient(gradient);

    if (!selectedElement) return;

    const currentColors = selectedElement.styles.colors || [];

    // Remove existing gradient classes
    const filteredColors = currentColors.filter(
      (c) => !c.includes('gradient') && !c.includes('from-') && !c.includes('to-') && !c.includes('via-')
    );

    // Add new gradient classes
    const gradientClasses = gradient.split(' ');
    filteredColors.push(...gradientClasses);

    updateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        colors: filteredColors,
      },
    });
  };

  const handleApplyBlendMode = (mode: string) => {
    setBlendMode(mode);

    if (!selectedElement) return;

    const currentEffects = selectedElement.styles.effects || [];

    // Remove existing blend mode
    const filteredEffects = currentEffects.filter((c) => !c.startsWith('mix-blend-'));

    // Add new blend mode
    if (mode !== 'normal') {
      filteredEffects.push(`mix-blend-${mode}`);
    }

    updateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        effects: filteredEffects,
      },
    });
  };

  return (
    <div className="space-y-3">
      {/* Gradients */}
      <CollapsibleSection
        title="Gradients"
        icon={<Layers className="w-4 h-4 text-gray-400" />}
        defaultOpen
      >
        <div className="space-y-3">
          {/* Gradient Presets */}
          <div className="grid grid-cols-4 gap-2">
            {GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleApplyGradient(preset.value)}
                className={cn(
                  'w-full aspect-square rounded-md',
                  preset.value,
                  selectedGradient === preset.value && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900'
                )}
                title={preset.name}
              />
            ))}
          </div>

          {/* Direction */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Direction</label>
            <div className="grid grid-cols-4 gap-1">
              {GRADIENT_DIRECTIONS.map((dir) => (
                <button
                  key={dir.value}
                  className={cn(
                    'p-2 rounded-md border border-gray-700',
                    'text-gray-400 hover:text-white hover:bg-gray-800',
                    'transition-colors duration-150'
                  )}
                  title={dir.label}
                >
                  <Move className={cn('w-3 h-3 mx-auto', dir.icon)} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Filters */}
      <CollapsibleSection
        title="Filters"
        icon={<Filter className="w-4 h-4 text-gray-400" />}
      >
        <div className="space-y-3">
          {FILTER_OPTIONS.map((filter) => (
            <SliderInput
              key={filter.key}
              label={filter.label}
              value={filters[filter.key as keyof typeof filters]}
              min={filter.min}
              max={filter.max}
              unit={filter.unit}
              onChange={(value) => handleApplyFilter(filter.key, value)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Transform */}
      <CollapsibleSection
        title="Transform"
        icon={<Move className="w-4 h-4 text-gray-400" />}
      >
        <div className="space-y-3">
          {/* Scale */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Scale</label>
            <select
              value={transform.scale}
              onChange={(e) => handleApplyTransform('scale', e.target.value)}
              className={cn(
                'w-full px-3 py-2 text-sm rounded-lg',
                'bg-gray-800 border border-gray-700 text-gray-300',
                'focus:outline-none focus:border-blue-500'
              )}
            >
              {TRANSFORM_SCALE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rotate */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Rotate</label>
            <select
              value={transform.rotate}
              onChange={(e) => handleApplyTransform('rotate', e.target.value)}
              className={cn(
                'w-full px-3 py-2 text-sm rounded-lg',
                'bg-gray-800 border border-gray-700 text-gray-300',
                'focus:outline-none focus:border-blue-500'
              )}
            >
              {TRANSFORM_ROTATE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Blend Mode */}
      <CollapsibleSection
        title="Blend Mode"
        icon={<Blend className="w-4 h-4 text-gray-400" />}
      >
        <select
          value={blendMode}
          onChange={(e) => handleApplyBlendMode(e.target.value)}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-lg',
            'bg-gray-800 border border-gray-700 text-gray-300',
            'focus:outline-none focus:border-blue-500'
          )}
        >
          {BLEND_MODES.map((mode) => (
            <option key={mode} value={mode} className="capitalize">
              {mode}
            </option>
          ))}
        </select>
      </CollapsibleSection>

      {!selectedElement && (
        <p className="text-xs text-gray-500 text-center py-2">
          Select an element to apply advanced styles
        </p>
      )}
    </div>
  );
}

export default AdvancedStylePanel;
