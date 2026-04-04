'use client';

import React, { useState, useCallback, useMemo } from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Switch from '@radix-ui/react-switch';
import * as Popover from '@radix-ui/react-popover';
import {
  Plus,
  Trash2,
  Copy,
  Check,
  GripVertical,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { cn } from '@/utils/cn';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ShadowValue {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
  enabled: boolean;
}

export interface ShadowEditorProps {
  shadows: ShadowValue[];
  onChange: (shadows: ShadowValue[]) => void;
  onPreview?: (cssShadow: string) => void;
  className?: string;
}

export interface ShadowPreset {
  name: string;
  description: string;
  shadows: Omit<ShadowValue, 'id' | 'enabled'>[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_SHADOW: Omit<ShadowValue, 'id'> = {
  offsetX: 0,
  offsetY: 4,
  blur: 6,
  spread: -1,
  color: 'rgba(0, 0, 0, 0.1)',
  inset: false,
  enabled: true,
};

const SHADOW_PRESETS: ShadowPreset[] = [
  {
    name: 'Subtle',
    description: 'Light, barely visible shadow',
    shadows: [
      { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.05)', inset: false },
    ],
  },
  {
    name: 'Small',
    description: 'Small elevation shadow',
    shadows: [
      { offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: 'rgba(0, 0, 0, 0.1)', inset: false },
      { offsetX: 0, offsetY: 1, blur: 2, spread: -1, color: 'rgba(0, 0, 0, 0.1)', inset: false },
    ],
  },
  {
    name: 'Medium',
    description: 'Standard card shadow',
    shadows: [
      { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: 'rgba(0, 0, 0, 0.1)', inset: false },
      { offsetX: 0, offsetY: 2, blur: 4, spread: -2, color: 'rgba(0, 0, 0, 0.1)', inset: false },
    ],
  },
  {
    name: 'Large',
    description: 'Prominent elevation',
    shadows: [
      { offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: 'rgba(0, 0, 0, 0.1)', inset: false },
      { offsetX: 0, offsetY: 4, blur: 6, spread: -4, color: 'rgba(0, 0, 0, 0.1)', inset: false },
    ],
  },
  {
    name: 'XL',
    description: 'Modal/dialog shadow',
    shadows: [
      { offsetX: 0, offsetY: 20, blur: 25, spread: -5, color: 'rgba(0, 0, 0, 0.1)', inset: false },
      { offsetX: 0, offsetY: 8, blur: 10, spread: -6, color: 'rgba(0, 0, 0, 0.1)', inset: false },
    ],
  },
  {
    name: 'Glow',
    description: 'Colored glow effect',
    shadows: [
      { offsetX: 0, offsetY: 0, blur: 20, spread: 0, color: 'rgba(59, 130, 246, 0.5)', inset: false },
    ],
  },
  {
    name: 'Inner',
    description: 'Inset shadow for depth',
    shadows: [
      { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: 'rgba(0, 0, 0, 0.06)', inset: true },
    ],
  },
  {
    name: 'Pressed',
    description: 'Button pressed state',
    shadows: [
      { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: 'rgba(0, 0, 0, 0.1)', inset: true },
      { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.08)', inset: true },
    ],
  },
];

const COLOR_PRESETS = [
  'rgba(0, 0, 0, 0.05)',
  'rgba(0, 0, 0, 0.1)',
  'rgba(0, 0, 0, 0.15)',
  'rgba(0, 0, 0, 0.2)',
  'rgba(0, 0, 0, 0.25)',
  'rgba(0, 0, 0, 0.3)',
  'rgba(59, 130, 246, 0.5)',   // Blue
  'rgba(139, 92, 246, 0.5)',   // Purple
  'rgba(236, 72, 153, 0.5)',   // Pink
  'rgba(34, 197, 94, 0.5)',    // Green
  'rgba(234, 179, 8, 0.5)',    // Yellow
  'rgba(239, 68, 68, 0.5)',    // Red
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateShadowCSS(shadows: ShadowValue[]): string {
  const enabledShadows = shadows.filter((s) => s.enabled);
  if (enabledShadows.length === 0) return 'none';

  return enabledShadows
    .map((shadow) => {
      const { offsetX, offsetY, blur, spread, color, inset } = shadow;
      const insetStr = inset ? 'inset ' : '';
      return `${insetStr}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`;
    })
    .join(', ');
}

function createShadowId(): string {
  return `shadow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function parseRgbaColor(color: string): { r: number; g: number; b: number; a: number } | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] ? parseFloat(match[4]) : 1,
    };
  }
  return null;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface ShadowSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

function ShadowSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = 'px',
}: ShadowSliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-gray-500 uppercase">{label}</label>
        <span className="text-[10px] font-mono text-gray-400">
          {value}
          {unit}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-4"
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={min}
          max={max}
          step={step}
        >
          <Slider.Track className="bg-gray-700 relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-3 h-3 bg-white rounded-full shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </Slider.Root>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const num = parseInt(e.target.value);
            if (!isNaN(num)) onChange(Math.max(min, Math.min(max, num)));
          }}
          className="w-12 px-1 py-0.5 text-[10px] text-center bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

interface ShadowColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

function ShadowColorPicker({ color, onChange }: ShadowColorPickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = parseRgbaColor(color);

  const handleOpacityChange = useCallback(
    (opacity: number) => {
      if (parsed) {
        onChange(`rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${opacity})`);
      }
    },
    [parsed, onChange]
  );

  return (
    <div className="space-y-1">
      <label className="text-[10px] text-gray-500 uppercase">Color</label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className={cn(
              'w-full flex items-center gap-2 px-2 py-1.5',
              'bg-gray-800 border border-gray-700 rounded',
              'text-xs text-white',
              'hover:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500'
            )}
          >
            <div
              className="w-4 h-4 rounded border border-gray-600"
              style={{ backgroundColor: color }}
            />
            <span className="flex-1 text-left truncate text-[10px]">{color}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="w-56 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
            sideOffset={5}
          >
            <div className="space-y-3">
              <div className="text-xs font-medium text-white">Shadow Color</div>
              {/* Color presets grid */}
              <div className="grid grid-cols-6 gap-1">
                {COLOR_PRESETS.map((presetColor) => (
                  <button
                    key={presetColor}
                    onClick={() => {
                      onChange(presetColor);
                      setOpen(false);
                    }}
                    className={cn(
                      'w-7 h-7 rounded border-2 transition-colors',
                      color === presetColor
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-gray-500'
                    )}
                    style={{ backgroundColor: presetColor }}
                  />
                ))}
              </div>
              {/* Opacity slider */}
              {parsed && (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-gray-500">Opacity</span>
                    <span className="text-[10px] text-gray-400">
                      {Math.round(parsed.a * 100)}%
                    </span>
                  </div>
                  <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-4"
                    value={[parsed.a]}
                    onValueChange={([v]) => handleOpacityChange(v)}
                    min={0}
                    max={1}
                    step={0.05}
                  >
                    <Slider.Track className="bg-gray-700 relative grow rounded-full h-1.5">
                      <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-3.5 h-3.5 bg-white rounded-full shadow hover:bg-gray-100 focus:outline-none" />
                  </Slider.Root>
                </div>
              )}
            </div>
            <Popover.Arrow className="fill-gray-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

interface ShadowItemProps {
  shadow: ShadowValue;
  index: number;
  onChange: (shadow: ShadowValue) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isDragging?: boolean;
  dragHandleProps?: object;
}

function ShadowItem({
  shadow,
  index,
  onChange,
  onDelete,
  onDuplicate,
  isDragging,
  dragHandleProps,
}: ShadowItemProps) {
  const [expanded, setExpanded] = useState(index === 0);

  const handleChange = useCallback(
    (updates: Partial<ShadowValue>) => {
      onChange({ ...shadow, ...updates });
    },
    [shadow, onChange]
  );

  return (
    <div
      className={cn(
        'border border-gray-700 rounded-lg overflow-hidden',
        isDragging && 'opacity-50',
        !shadow.enabled && 'opacity-60'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-800/50">
        <button
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center gap-2 text-left"
        >
          <div
            className="w-4 h-4 rounded border border-gray-600"
            style={{
              boxShadow: shadow.enabled
                ? `${shadow.inset ? 'inset ' : ''}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`
                : 'none',
              backgroundColor: shadow.inset ? '#1f2937' : 'white',
            }}
          />
          <span className="text-xs text-white">
            Shadow {index + 1}
            {shadow.inset && (
              <span className="ml-1 text-[10px] text-gray-500">(inset)</span>
            )}
          </span>
          <ChevronDown
            className={cn(
              'w-3 h-3 text-gray-400 transition-transform',
              expanded && 'rotate-180'
            )}
          />
        </button>

        <Switch.Root
          checked={shadow.enabled}
          onCheckedChange={(enabled: boolean) => handleChange({ enabled })}
          className={cn(
            'w-7 h-4 rounded-full relative',
            'transition-colors',
            shadow.enabled ? 'bg-blue-500' : 'bg-gray-700'
          )}
        >
          <Switch.Thumb
            className={cn(
              'block w-3 h-3 bg-white rounded-full',
              'transition-transform duration-100',
              'translate-x-0.5',
              'data-[state=checked]:translate-x-[14px]'
            )}
          />
        </Switch.Root>

        <button
          onClick={onDuplicate}
          className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
          title="Duplicate"
        >
          <Copy className="w-3 h-3" />
        </button>

        <button
          onClick={onDelete}
          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Controls */}
      {expanded && (
        <div className="p-3 space-y-3 bg-gray-800/30">
          <div className="grid grid-cols-2 gap-3">
            <ShadowSlider
              label="Offset X"
              value={shadow.offsetX}
              onChange={(v) => handleChange({ offsetX: v })}
              min={-50}
              max={50}
            />
            <ShadowSlider
              label="Offset Y"
              value={shadow.offsetY}
              onChange={(v) => handleChange({ offsetY: v })}
              min={-50}
              max={50}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ShadowSlider
              label="Blur"
              value={shadow.blur}
              onChange={(v) => handleChange({ blur: v })}
              min={0}
              max={100}
            />
            <ShadowSlider
              label="Spread"
              value={shadow.spread}
              onChange={(v) => handleChange({ spread: v })}
              min={-50}
              max={50}
            />
          </div>

          <ShadowColorPicker
            color={shadow.color}
            onChange={(color) => handleChange({ color })}
          />

          <div className="flex items-center justify-between">
            <label className="text-[10px] text-gray-500 uppercase">Inset</label>
            <Switch.Root
              checked={shadow.inset}
              onCheckedChange={(inset: boolean) => handleChange({ inset })}
              className={cn(
                'w-8 h-4 rounded-full relative',
                'transition-colors',
                shadow.inset ? 'bg-blue-500' : 'bg-gray-700'
              )}
            >
              <Switch.Thumb
                className={cn(
                  'block w-3 h-3 bg-white rounded-full',
                  'transition-transform duration-100',
                  'translate-x-0.5',
                  'data-[state=checked]:translate-x-[17px]'
                )}
              />
            </Switch.Root>
          </div>
        </div>
      )}
    </div>
  );
}

interface PresetButtonProps {
  preset: ShadowPreset;
  onClick: () => void;
}

function PresetButton({ preset, onClick }: PresetButtonProps) {
  const cssPreview = useMemo(() => {
    return preset.shadows
      .map((s) => {
        const insetStr = s.inset ? 'inset ' : '';
        return `${insetStr}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`;
      })
      .join(', ');
  }, [preset]);

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-2 rounded-lg border',
        'bg-gray-800/50 border-gray-700',
        'hover:border-gray-600 hover:bg-gray-800',
        'transition-colors'
      )}
    >
      <div
        className="w-8 h-8 rounded bg-white"
        style={{ boxShadow: cssPreview }}
      />
      <div className="text-center">
        <div className="text-[10px] font-medium text-white">{preset.name}</div>
        <div className="text-[9px] text-gray-500">{preset.description}</div>
      </div>
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ShadowEditor({
  shadows,
  onChange,
  onPreview,
  className,
}: ShadowEditorProps) {
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Generate CSS shadow string
  const cssShadow = useMemo(() => generateShadowCSS(shadows), [shadows]);

  // Add new shadow
  const handleAddShadow = useCallback(() => {
    const newShadow: ShadowValue = {
      id: createShadowId(),
      ...DEFAULT_SHADOW,
    };
    const newShadows = [...shadows, newShadow];
    onChange(newShadows);
    onPreview?.(generateShadowCSS(newShadows));
  }, [shadows, onChange, onPreview]);

  // Update shadow
  const handleUpdateShadow = useCallback(
    (index: number, updatedShadow: ShadowValue) => {
      const newShadows = [...shadows];
      newShadows[index] = updatedShadow;
      onChange(newShadows);
      onPreview?.(generateShadowCSS(newShadows));
    },
    [shadows, onChange, onPreview]
  );

  // Delete shadow
  const handleDeleteShadow = useCallback(
    (index: number) => {
      const newShadows = shadows.filter((_, i) => i !== index);
      onChange(newShadows);
      onPreview?.(generateShadowCSS(newShadows));
    },
    [shadows, onChange, onPreview]
  );

  // Duplicate shadow
  const handleDuplicateShadow = useCallback(
    (index: number) => {
      const newShadow: ShadowValue = {
        ...shadows[index],
        id: createShadowId(),
      };
      const newShadows = [...shadows];
      newShadows.splice(index + 1, 0, newShadow);
      onChange(newShadows);
      onPreview?.(generateShadowCSS(newShadows));
    },
    [shadows, onChange, onPreview]
  );

  // Apply preset
  const handleApplyPreset = useCallback(
    (preset: ShadowPreset) => {
      const newShadows: ShadowValue[] = preset.shadows.map((s) => ({
        id: createShadowId(),
        ...s,
        enabled: true,
      }));
      onChange(newShadows);
      onPreview?.(generateShadowCSS(newShadows));
      setShowPresets(false);
    },
    [onChange, onPreview]
  );

  // Reset all shadows
  const handleReset = useCallback(() => {
    onChange([]);
    onPreview?.('none');
  }, [onChange, onPreview]);

  // Copy CSS
  const handleCopyCSS = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`box-shadow: ${cssShadow};`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  }, [cssShadow]);

  // Drag and drop reorder
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === targetIndex) return;

      const newShadows = [...shadows];
      const [removed] = newShadows.splice(draggedIndex, 1);
      newShadows.splice(targetIndex, 0, removed);
      setDraggedIndex(targetIndex);
      onChange(newShadows);
    },
    [draggedIndex, shadows, onChange]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    onPreview?.(cssShadow);
  }, [cssShadow, onPreview]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">Box Shadow</span>
          {shadows.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded">
              {shadows.filter((s) => s.enabled).length} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCSS}
            disabled={shadows.length === 0}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-xs',
              'transition-colors',
              shadows.length > 0
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 cursor-not-allowed'
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
            disabled={shadows.length === 0}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-xs',
              'transition-colors',
              shadows.length > 0
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 cursor-not-allowed'
            )}
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Presets Section */}
      <div className="space-y-2">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Presets
          <span className="text-gray-600">
            {showPresets ? '(hide)' : '(show)'}
          </span>
        </button>

        {showPresets && (
          <div className="grid grid-cols-4 gap-2">
            {SHADOW_PRESETS.map((preset) => (
              <PresetButton
                key={preset.name}
                preset={preset}
                onClick={() => handleApplyPreset(preset)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Shadow List */}
      <div className="space-y-2">
        {shadows.map((shadow, index) => (
          <div
            key={shadow.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <ShadowItem
              shadow={shadow}
              index={index}
              onChange={(updated) => handleUpdateShadow(index, updated)}
              onDelete={() => handleDeleteShadow(index)}
              onDuplicate={() => handleDuplicateShadow(index)}
              isDragging={draggedIndex === index}
            />
          </div>
        ))}
      </div>

      {/* Add Shadow Button */}
      <button
        onClick={handleAddShadow}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed',
          'border-gray-700 text-gray-400',
          'hover:border-gray-600 hover:text-white hover:bg-gray-800/50',
          'transition-colors'
        )}
      >
        <Plus className="w-4 h-4" />
        <span className="text-xs">Add Shadow</span>
      </button>

      {/* Live Preview */}
      <div className="pt-3 border-t border-gray-800">
        <div className="text-xs font-medium text-gray-400 mb-2">Preview</div>
        <div className="flex items-center justify-center p-8 bg-gray-800/30 rounded-lg">
          <div
            className="w-24 h-24 rounded-lg bg-white"
            style={{ boxShadow: cssShadow }}
          />
        </div>
      </div>

      {/* CSS Preview */}
      <div className="pt-3 border-t border-gray-800">
        <div className="text-xs font-medium text-gray-400 mb-2">Generated CSS</div>
        <code
          className={cn(
            'block p-2 rounded text-xs font-mono break-all',
            'bg-gray-800 text-gray-300'
          )}
        >
          box-shadow: {cssShadow};
        </code>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { SHADOW_PRESETS, generateShadowCSS, createShadowId };
export default ShadowEditor;
