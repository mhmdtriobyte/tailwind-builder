'use client';

import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Slider from '@radix-ui/react-slider';
import {
  Plus,
  Copy,
  Check,
  ChevronDown,
  GripVertical,
  Trash2,
} from 'lucide-react';
import { cn } from '@/utils/cn';

// ============================================================================
// TYPES
// ============================================================================

export type GradientType = 'linear' | 'radial' | 'conic';

export interface ColorStop {
  id: string;
  color: string;
  position: number; // 0-100
}

export interface GradientConfig {
  type: GradientType;
  angle: number; // For linear gradients (0-360)
  centerX: number; // For radial/conic (0-100)
  centerY: number; // For radial/conic (0-100)
  stops: ColorStop[];
}

interface GradientBuilderProps {
  value?: GradientConfig;
  onChange: (config: GradientConfig) => void;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_GRADIENT: GradientConfig = {
  type: 'linear',
  angle: 90,
  centerX: 50,
  centerY: 50,
  stops: [
    { id: 'stop_1', color: '#3b82f6', position: 0 },
    { id: 'stop_2', color: '#8b5cf6', position: 100 },
  ],
};

const PRESET_GRADIENTS: { name: string; config: GradientConfig }[] = [
  {
    name: 'Ocean Breeze',
    config: {
      type: 'linear',
      angle: 135,
      centerX: 50,
      centerY: 50,
      stops: [
        { id: 's1', color: '#667eea', position: 0 },
        { id: 's2', color: '#764ba2', position: 100 },
      ],
    },
  },
  {
    name: 'Sunset',
    config: {
      type: 'linear',
      angle: 90,
      centerX: 50,
      centerY: 50,
      stops: [
        { id: 's1', color: '#f093fb', position: 0 },
        { id: 's2', color: '#f5576c', position: 100 },
      ],
    },
  },
  {
    name: 'Forest',
    config: {
      type: 'linear',
      angle: 180,
      centerX: 50,
      centerY: 50,
      stops: [
        { id: 's1', color: '#11998e', position: 0 },
        { id: 's2', color: '#38ef7d', position: 100 },
      ],
    },
  },
  {
    name: 'Midnight',
    config: {
      type: 'linear',
      angle: 135,
      centerX: 50,
      centerY: 50,
      stops: [
        { id: 's1', color: '#0f0c29', position: 0 },
        { id: 's2', color: '#302b63', position: 50 },
        { id: 's3', color: '#24243e', position: 100 },
      ],
    },
  },
  {
    name: 'Fire',
    config: {
      type: 'linear',
      angle: 90,
      centerX: 50,
      centerY: 50,
      stops: [
        { id: 's1', color: '#f12711', position: 0 },
        { id: 's2', color: '#f5af19', position: 100 },
      ],
    },
  },
  {
    name: 'Cool Blues',
    config: {
      type: 'linear',
      angle: 90,
      centerX: 50,
      centerY: 50,
      stops: [
        { id: 's1', color: '#2193b0', position: 0 },
        { id: 's2', color: '#6dd5ed', position: 100 },
      ],
    },
  },
  {
    name: 'Peach',
    config: {
      type: 'linear',
      angle: 45,
      centerX: 50,
      centerY: 50,
      stops: [
        { id: 's1', color: '#ffecd2', position: 0 },
        { id: 's2', color: '#fcb69f', position: 100 },
      ],
    },
  },
  {
    name: 'Purple Rain',
    config: {
      type: 'radial',
      angle: 0,
      centerX: 50,
      centerY: 50,
      stops: [
        { id: 's1', color: '#a18cd1', position: 0 },
        { id: 's2', color: '#fbc2eb', position: 100 },
      ],
    },
  },
  {
    name: 'Rainbow',
    config: {
      type: 'conic',
      angle: 0,
      centerX: 50,
      centerY: 50,
      stops: [
        { id: 's1', color: '#ff0000', position: 0 },
        { id: 's2', color: '#ffff00', position: 20 },
        { id: 's3', color: '#00ff00', position: 40 },
        { id: 's4', color: '#00ffff', position: 60 },
        { id: 's5', color: '#0000ff', position: 80 },
        { id: 's6', color: '#ff00ff', position: 100 },
      ],
    },
  },
  {
    name: 'Neon Glow',
    config: {
      type: 'radial',
      angle: 0,
      centerX: 50,
      centerY: 50,
      stops: [
        { id: 's1', color: '#00f5a0', position: 0 },
        { id: 's2', color: '#00d9f5', position: 100 },
      ],
    },
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateId(): string {
  return `stop_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

function generateGradientCSS(config: GradientConfig): string {
  const sortedStops = [...config.stops].sort((a, b) => a.position - b.position);
  const stopsStr = sortedStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ');

  switch (config.type) {
    case 'linear':
      return `linear-gradient(${config.angle}deg, ${stopsStr})`;
    case 'radial':
      return `radial-gradient(circle at ${config.centerX}% ${config.centerY}%, ${stopsStr})`;
    case 'conic':
      return `conic-gradient(from ${config.angle}deg at ${config.centerX}% ${config.centerY}%, ${stopsStr})`;
    default:
      return `linear-gradient(${config.angle}deg, ${stopsStr})`;
  }
}

function generateTailwindGradient(config: GradientConfig): string {
  // Note: Tailwind's gradient utilities are limited
  // This generates the closest Tailwind classes possible
  const directions: Record<number, string> = {
    0: 'to-t',
    45: 'to-tr',
    90: 'to-r',
    135: 'to-br',
    180: 'to-b',
    225: 'to-bl',
    270: 'to-l',
    315: 'to-tl',
  };

  // Find closest direction
  const closestAngle = Object.keys(directions)
    .map(Number)
    .reduce((prev, curr) =>
      Math.abs(curr - config.angle) < Math.abs(prev - config.angle) ? curr : prev
    );

  const direction = directions[closestAngle] || 'to-r';

  if (config.type === 'linear' && config.stops.length === 2) {
    return `bg-gradient-${direction} from-[${config.stops[0].color}] to-[${config.stops[1].color}]`;
  }

  // For complex gradients, use arbitrary value
  return `bg-[${generateGradientCSS(config).replace(/\s+/g, '_')}]`;
}

// ============================================================================
// COLOR STOP COMPONENT
// ============================================================================

interface ColorStopEditorProps {
  stop: ColorStop;
  onChange: (id: string, updates: Partial<ColorStop>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

function ColorStopEditor({
  stop,
  onChange,
  onRemove,
  canRemove,
}: ColorStopEditorProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg group">
      <div className="flex items-center justify-center w-6 h-6 text-gray-500 cursor-grab">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Color Picker */}
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className={cn(
              'w-8 h-8 rounded-md border-2 border-gray-600',
              'hover:border-gray-500 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
            style={{ backgroundColor: stop.color }}
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50"
            sideOffset={5}
          >
            <input
              type="color"
              value={stop.color}
              onChange={(e) => onChange(stop.id, { color: e.target.value })}
              className="w-40 h-40 cursor-pointer"
            />
            <input
              type="text"
              value={stop.color}
              onChange={(e) => onChange(stop.id, { color: e.target.value })}
              className={cn(
                'w-full mt-2 px-2 py-1 text-sm',
                'bg-gray-800 border border-gray-700 rounded',
                'text-white font-mono',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            />
            <Popover.Arrow className="fill-gray-700" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Position */}
      <div className="flex-1">
        <Slider.Root
          value={[stop.position]}
          onValueChange={([value]) => onChange(stop.id, { position: value })}
          max={100}
          step={1}
          className="relative flex items-center w-full h-5 touch-none select-none"
        >
          <Slider.Track className="relative h-1.5 flex-1 bg-gray-700 rounded-full">
            <Slider.Range className="absolute h-full bg-blue-500 rounded-full" />
          </Slider.Track>
          <Slider.Thumb
            className={cn(
              'block w-4 h-4 bg-white rounded-full shadow-lg',
              'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
              'transition-colors'
            )}
          />
        </Slider.Root>
      </div>

      {/* Position Value */}
      <input
        type="number"
        min={0}
        max={100}
        value={stop.position}
        onChange={(e) => onChange(stop.id, { position: parseInt(e.target.value) || 0 })}
        className={cn(
          'w-14 px-2 py-1 text-sm text-center',
          'bg-gray-800 border border-gray-700 rounded',
          'text-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500'
        )}
      />
      <span className="text-xs text-gray-500">%</span>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(stop.id)}
        disabled={!canRemove}
        className={cn(
          'p-1 rounded opacity-0 group-hover:opacity-100',
          'text-gray-500 hover:text-red-400 hover:bg-red-500/10',
          'disabled:opacity-30 disabled:cursor-not-allowed',
          'transition-all duration-150'
        )}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ============================================================================
// GRADIENT TYPE SELECTOR
// ============================================================================

interface TypeSelectorProps {
  value: GradientType;
  onChange: (type: GradientType) => void;
}

function TypeSelector({ value, onChange }: TypeSelectorProps) {
  const types: { value: GradientType; label: string }[] = [
    { value: 'linear', label: 'Linear' },
    { value: 'radial', label: 'Radial' },
    { value: 'conic', label: 'Conic' },
  ];

  return (
    <div className="flex gap-1 p-1 bg-gray-800 rounded-lg">
      {types.map((type) => (
        <button
          key={type.value}
          onClick={() => onChange(type.value)}
          className={cn(
            'flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            value === type.value
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
          )}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// ANGLE/POSITION CONTROLS
// ============================================================================

interface AngleControlProps {
  angle: number;
  onChange: (angle: number) => void;
}

function AngleControl({ angle, onChange }: AngleControlProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!wheelRef.current) return;

      const rect = wheelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      let newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
      if (newAngle < 0) newAngle += 360;

      onChange(Math.round(newAngle));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onChange]);

  return (
    <div className="flex items-center gap-3">
      <div
        ref={wheelRef}
        onMouseDown={handleMouseDown}
        className={cn(
          'relative w-16 h-16 rounded-full border-2 border-gray-700',
          'bg-gray-800 cursor-pointer',
          'hover:border-gray-600 transition-colors'
        )}
      >
        {/* Dial indicator */}
        <div
          className="absolute top-1/2 left-1/2 w-1 h-6 bg-blue-500 rounded-full origin-bottom"
          style={{
            transform: `translate(-50%, -100%) rotate(${angle}deg)`,
          }}
        />
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-gray-500">Angle</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={360}
            value={angle}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            className={cn(
              'w-16 px-2 py-1 text-sm',
              'bg-gray-800 border border-gray-700 rounded',
              'text-white',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
          />
          <span className="text-xs text-gray-500">deg</span>
        </div>
      </div>
    </div>
  );
}

interface PositionControlProps {
  centerX: number;
  centerY: number;
  onChange: (x: number, y: number) => void;
}

function PositionControl({ centerX, centerY, onChange }: PositionControlProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e.nativeEvent);
  }, []);

  const updatePosition = useCallback(
    (e: MouseEvent | React.MouseEvent['nativeEvent']) => {
      if (!areaRef.current) return;

      const rect = areaRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

      onChange(Math.round(x), Math.round(y));
    },
    [onChange]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => updatePosition(e);
    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updatePosition]);

  return (
    <div className="space-y-2">
      <label className="text-xs text-gray-500">Center Position</label>
      <div className="flex items-start gap-3">
        <div
          ref={areaRef}
          onMouseDown={handleMouseDown}
          className={cn(
            'relative w-24 h-24 rounded-lg border-2 border-gray-700',
            'bg-gray-800 cursor-crosshair',
            'hover:border-gray-600 transition-colors'
          )}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-20">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="border border-gray-600" />
            ))}
          </div>
          {/* Position marker */}
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${centerX}%`, top: `${centerY}%` }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 w-4">X</label>
            <input
              type="number"
              min={0}
              max={100}
              value={centerX}
              onChange={(e) => onChange(parseInt(e.target.value) || 0, centerY)}
              className={cn(
                'w-14 px-2 py-1 text-sm',
                'bg-gray-800 border border-gray-700 rounded',
                'text-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            />
            <span className="text-xs text-gray-500">%</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 w-4">Y</label>
            <input
              type="number"
              min={0}
              max={100}
              value={centerY}
              onChange={(e) => onChange(centerX, parseInt(e.target.value) || 0)}
              className={cn(
                'w-14 px-2 py-1 text-sm',
                'bg-gray-800 border border-gray-700 rounded',
                'text-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            />
            <span className="text-xs text-gray-500">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN GRADIENT BUILDER COMPONENT
// ============================================================================

export function GradientBuilder({
  value,
  onChange,
  className,
}: GradientBuilderProps) {
  const [config, setConfig] = useState<GradientConfig>(value || DEFAULT_GRADIENT);
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Sync with external value
  useEffect(() => {
    if (value) {
      setConfig(value);
    }
  }, [value]);

  // Emit changes
  const updateConfig = useCallback(
    (updates: Partial<GradientConfig>) => {
      const newConfig = { ...config, ...updates };
      setConfig(newConfig);
      onChange(newConfig);
    },
    [config, onChange]
  );

  // Handle stop changes
  const handleStopChange = useCallback(
    (id: string, updates: Partial<ColorStop>) => {
      const newStops = config.stops.map((stop) =>
        stop.id === id ? { ...stop, ...updates } : stop
      );
      updateConfig({ stops: newStops });
    },
    [config.stops, updateConfig]
  );

  // Add a new stop
  const handleAddStop = useCallback(() => {
    const sortedStops = [...config.stops].sort((a, b) => a.position - b.position);
    const midPoint = sortedStops.length >= 2
      ? (sortedStops[0].position + sortedStops[sortedStops.length - 1].position) / 2
      : 50;

    const newStop: ColorStop = {
      id: generateId(),
      color: '#888888',
      position: Math.round(midPoint),
    };

    updateConfig({ stops: [...config.stops, newStop] });
  }, [config.stops, updateConfig]);

  // Remove a stop
  const handleRemoveStop = useCallback(
    (id: string) => {
      if (config.stops.length <= 2) return;
      updateConfig({ stops: config.stops.filter((stop) => stop.id !== id) });
    },
    [config.stops, updateConfig]
  );

  // Copy CSS
  const handleCopyCSS = useCallback(async () => {
    const css = generateGradientCSS(config);
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [config]);

  // Apply preset
  const handleApplyPreset = useCallback(
    (preset: typeof PRESET_GRADIENTS[0]) => {
      // Generate unique IDs for stops
      const stopsWithNewIds = preset.config.stops.map((stop) => ({
        ...stop,
        id: generateId(),
      }));

      const newConfig = {
        ...preset.config,
        stops: stopsWithNewIds,
      };

      setConfig(newConfig);
      onChange(newConfig);
      setShowPresets(false);
    },
    [onChange]
  );

  // Generate CSS for preview
  const gradientCSS = useMemo(() => generateGradientCSS(config), [config]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Live Preview */}
      <div
        className="h-32 rounded-xl border-2 border-gray-700 shadow-inner"
        style={{ background: gradientCSS }}
      />

      {/* Type Selector */}
      <TypeSelector value={config.type} onChange={(type) => updateConfig({ type })} />

      {/* Angle/Position Controls */}
      {config.type === 'linear' && (
        <AngleControl
          angle={config.angle}
          onChange={(angle) => updateConfig({ angle })}
        />
      )}

      {(config.type === 'radial' || config.type === 'conic') && (
        <>
          <PositionControl
            centerX={config.centerX}
            centerY={config.centerY}
            onChange={(x, y) => updateConfig({ centerX: x, centerY: y })}
          />
          {config.type === 'conic' && (
            <AngleControl
              angle={config.angle}
              onChange={(angle) => updateConfig({ angle })}
            />
          )}
        </>
      )}

      {/* Color Stops */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white">Color Stops</label>
          <button
            onClick={handleAddStop}
            className={cn(
              'flex items-center gap-1 px-2 py-1 text-xs rounded-md',
              'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white',
              'transition-colors duration-150'
            )}
          >
            <Plus className="w-3 h-3" />
            Add Stop
          </button>
        </div>

        <div className="space-y-2">
          {config.stops.map((stop) => (
            <ColorStopEditor
              key={stop.id}
              stop={stop}
              onChange={handleStopChange}
              onRemove={handleRemoveStop}
              canRemove={config.stops.length > 2}
            />
          ))}
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className={cn(
            'flex items-center justify-between w-full px-3 py-2',
            'bg-gray-800 rounded-lg text-sm text-gray-300',
            'hover:bg-gray-700 transition-colors duration-150'
          )}
        >
          <span>Preset Gradients</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform duration-200',
              showPresets && 'rotate-180'
            )}
          />
        </button>

        {showPresets && (
          <div className="grid grid-cols-2 gap-2 p-2 bg-gray-800/50 rounded-lg">
            {PRESET_GRADIENTS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset)}
                className={cn(
                  'relative h-16 rounded-lg border border-gray-700',
                  'hover:border-blue-500 hover:ring-2 hover:ring-blue-500/30',
                  'transition-all duration-150 overflow-hidden group'
                )}
                style={{ background: generateGradientCSS(preset.config) }}
              >
                <div
                  className={cn(
                    'absolute inset-x-0 bottom-0 px-2 py-1',
                    'bg-black/60 text-xs text-white',
                    'opacity-0 group-hover:opacity-100',
                    'transition-opacity duration-150'
                  )}
                >
                  {preset.name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Copy CSS */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
        <code className="flex-1 px-3 py-2 text-xs text-gray-400 bg-gray-800 rounded-lg truncate font-mono">
          {gradientCSS}
        </code>
        <button
          onClick={handleCopyCSS}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg',
            'bg-blue-600 text-white hover:bg-blue-500',
            'transition-colors duration-150'
          )}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy CSS
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// GRADIENT PICKER (Popover variant)
// ============================================================================

interface GradientPickerProps {
  value?: string; // CSS gradient string
  onChange: (css: string, config: GradientConfig) => void;
  className?: string;
}

export function GradientPicker({
  value,
  onChange,
  className,
}: GradientPickerProps) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<GradientConfig>(DEFAULT_GRADIENT);

  const handleChange = useCallback(
    (newConfig: GradientConfig) => {
      setConfig(newConfig);
      onChange(generateGradientCSS(newConfig), newConfig);
    },
    [onChange]
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            'w-full h-10 rounded-lg border-2 border-gray-700',
            'hover:border-gray-600 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            className
          )}
          style={{ background: value || generateGradientCSS(config) }}
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={cn(
            'w-80 p-4 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50'
          )}
          sideOffset={5}
          align="start"
        >
          <GradientBuilder value={config} onChange={handleChange} />
          <Popover.Arrow className="fill-gray-700" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default GradientBuilder;
export { generateGradientCSS, generateTailwindGradient };
