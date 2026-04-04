'use client';

import { useState } from 'react';
import {
  MousePointer,
  Focus,
  Hand,
  AlertCircle,
  CheckCircle,
  Loader2,
  Ban,
  Trash2,
  Copy,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCustomizationStore } from '@/store/customizationStore';
import { useBuilderStore } from '@/store/builderStore';
import type { ElementState } from '@/types/customization';

// ============================================================================
// CONSTANTS
// ============================================================================

const ELEMENT_STATES: Array<{
  id: ElementState;
  name: string;
  icon: typeof MousePointer;
  prefix: string;
  description: string;
}> = [
  {
    id: 'default',
    name: 'Default',
    icon: MousePointer,
    prefix: '',
    description: 'Normal state',
  },
  {
    id: 'hover',
    name: 'Hover',
    icon: Hand,
    prefix: 'hover:',
    description: 'When mouse is over element',
  },
  {
    id: 'focus',
    name: 'Focus',
    icon: Focus,
    prefix: 'focus:',
    description: 'When element is focused',
  },
  {
    id: 'active',
    name: 'Active',
    icon: MousePointer,
    prefix: 'active:',
    description: 'When element is being clicked',
  },
  {
    id: 'disabled',
    name: 'Disabled',
    icon: Ban,
    prefix: 'disabled:',
    description: 'When element is disabled',
  },
  {
    id: 'loading',
    name: 'Loading',
    icon: Loader2,
    prefix: '',
    description: 'Loading state',
  },
  {
    id: 'error',
    name: 'Error',
    icon: AlertCircle,
    prefix: '',
    description: 'Error state',
  },
  {
    id: 'success',
    name: 'Success',
    icon: CheckCircle,
    prefix: '',
    description: 'Success state',
  },
];

const STATE_PROPERTIES = [
  {
    category: 'Background',
    property: 'bg',
    options: [
      { value: 'bg-blue-600', label: 'Blue' },
      { value: 'bg-blue-700', label: 'Blue Dark' },
      { value: 'bg-green-600', label: 'Green' },
      { value: 'bg-red-600', label: 'Red' },
      { value: 'bg-yellow-600', label: 'Yellow' },
      { value: 'bg-gray-600', label: 'Gray' },
      { value: 'bg-gray-700', label: 'Gray Dark' },
      { value: 'bg-transparent', label: 'Transparent' },
    ],
  },
  {
    category: 'Text Color',
    property: 'text',
    options: [
      { value: 'text-white', label: 'White' },
      { value: 'text-gray-300', label: 'Light Gray' },
      { value: 'text-gray-500', label: 'Gray' },
      { value: 'text-blue-400', label: 'Blue' },
      { value: 'text-green-400', label: 'Green' },
      { value: 'text-red-400', label: 'Red' },
    ],
  },
  {
    category: 'Border Color',
    property: 'border',
    options: [
      { value: 'border-blue-500', label: 'Blue' },
      { value: 'border-blue-600', label: 'Blue Dark' },
      { value: 'border-green-500', label: 'Green' },
      { value: 'border-red-500', label: 'Red' },
      { value: 'border-gray-500', label: 'Gray' },
      { value: 'border-transparent', label: 'Transparent' },
    ],
  },
  {
    category: 'Shadow',
    property: 'shadow',
    options: [
      { value: 'shadow-none', label: 'None' },
      { value: 'shadow-sm', label: 'Small' },
      { value: 'shadow', label: 'Medium' },
      { value: 'shadow-md', label: 'Medium Large' },
      { value: 'shadow-lg', label: 'Large' },
      { value: 'shadow-xl', label: 'Extra Large' },
    ],
  },
  {
    category: 'Scale',
    property: 'scale',
    options: [
      { value: 'scale-95', label: '95%' },
      { value: 'scale-100', label: '100%' },
      { value: 'scale-105', label: '105%' },
      { value: 'scale-110', label: '110%' },
    ],
  },
  {
    category: 'Opacity',
    property: 'opacity',
    options: [
      { value: 'opacity-100', label: '100%' },
      { value: 'opacity-75', label: '75%' },
      { value: 'opacity-50', label: '50%' },
      { value: 'opacity-25', label: '25%' },
    ],
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface StateTabProps {
  state: typeof ELEMENT_STATES[0];
  isActive: boolean;
  hasStyles: boolean;
  onClick: () => void;
}

function StateTab({ state, isActive, hasStyles, onClick }: StateTabProps) {
  const Icon = state.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-1.5 px-3 py-2 rounded-lg',
        'text-sm transition-all duration-200',
        isActive
          ? 'bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/50'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      )}
    >
      <Icon className={cn('w-4 h-4', state.id === 'loading' && 'animate-spin')} />
      <span>{state.name}</span>
      {hasStyles && !isActive && (
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
      )}
    </button>
  );
}

interface StatePropertyRowProps {
  category: string;
  property: string;
  options: Array<{ value: string; label: string }>;
  currentValue: string;
  state: ElementState;
  onChange: (value: string) => void;
}

function StatePropertyRow({
  category,
  options,
  currentValue,
  state,
  onChange,
}: StatePropertyRowProps) {
  const stateConfig = ELEMENT_STATES.find((s) => s.id === state);
  const prefix = stateConfig?.prefix || '';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-400">{category}</label>
        {currentValue && prefix && (
          <span className="text-[10px] text-gray-600 font-mono">
            {prefix}
            {currentValue}
          </span>
        )}
      </div>
      <select
        value={currentValue}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-2 text-sm rounded-lg',
          'bg-gray-800 border border-gray-700 text-gray-300',
          'focus:outline-none focus:border-blue-500'
        )}
      >
        <option value="">Inherit</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function VariantPanel() {
  useCustomizationStore(); // Keep store connection for variant management
  const { selectedId, getElementById, updateElement } = useBuilderStore();

  const [activeState, setActiveState] = useState<ElementState>('default');
  const [stateStyles, setStateStyles] = useState<Record<ElementState, Record<string, string>>>({
    default: {},
    hover: {},
    focus: {},
    active: {},
    disabled: {},
    loading: {},
    error: {},
    success: {},
  });

  const selectedElement = selectedId ? getElementById(selectedId) : null;

  const handleStyleChange = (property: string, value: string) => {
    setStateStyles((prev) => ({
      ...prev,
      [activeState]: {
        ...prev[activeState],
        [property]: value,
      },
    }));

    if (!selectedElement) return;

    const stateConfig = ELEMENT_STATES.find((s) => s.id === activeState);
    const prefix = stateConfig?.prefix || '';

    // Build the full class with state prefix
    const fullClass = prefix + value;

    // Get current effects/colors
    const currentEffects = selectedElement.styles.effects || [];
    const currentColors = selectedElement.styles.colors || [];

    // Determine which style category to update
    const isColor = property.startsWith('bg') || property.startsWith('text') || property.startsWith('border');

    if (isColor) {
      // Filter out existing classes of the same type with the same prefix
      const filtered = currentColors.filter((c) => {
        const hasPrefix = prefix ? c.startsWith(prefix) : !ELEMENT_STATES.some((s) => s.prefix && c.startsWith(s.prefix));
        const sameProperty = c.includes(property);
        return !(hasPrefix && sameProperty);
      });

      updateElement(selectedElement.id, {
        styles: {
          ...selectedElement.styles,
          colors: value ? [...filtered, fullClass] : filtered,
        },
      });
    } else {
      // Filter out existing classes of the same type with the same prefix
      const filtered = currentEffects.filter((c) => {
        const hasPrefix = prefix ? c.startsWith(prefix) : !ELEMENT_STATES.some((s) => s.prefix && c.startsWith(s.prefix));
        const sameProperty = c.includes(property);
        return !(hasPrefix && sameProperty);
      });

      updateElement(selectedElement.id, {
        styles: {
          ...selectedElement.styles,
          effects: value ? [...filtered, fullClass] : filtered,
        },
      });
    }
  };

  const handleCopyState = (fromState: ElementState, toState: ElementState) => {
    setStateStyles((prev) => ({
      ...prev,
      [toState]: { ...prev[fromState] },
    }));
  };

  const handleClearState = (state: ElementState) => {
    setStateStyles((prev) => ({
      ...prev,
      [state]: {},
    }));

    if (!selectedElement) return;

    const stateConfig = ELEMENT_STATES.find((s) => s.id === state);
    const prefix = stateConfig?.prefix || '';

    // Remove all classes with this state prefix
    const filteredColors = (selectedElement.styles.colors || []).filter(
      (c) => !c.startsWith(prefix)
    );
    const filteredEffects = (selectedElement.styles.effects || []).filter(
      (c) => !c.startsWith(prefix)
    );

    updateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        colors: filteredColors,
        effects: filteredEffects,
      },
    });
  };

  const hasStylesForState = (state: ElementState) => {
    return Object.keys(stateStyles[state] || {}).some((key) => stateStyles[state][key]);
  };

  const currentStateConfig = ELEMENT_STATES.find((s) => s.id === activeState);

  return (
    <div className="space-y-4">
      {/* State Tabs */}
      <div className="flex flex-wrap gap-1">
        {ELEMENT_STATES.map((state) => (
          <StateTab
            key={state.id}
            state={state}
            isActive={activeState === state.id}
            hasStyles={hasStylesForState(state.id)}
            onClick={() => setActiveState(state.id)}
          />
        ))}
      </div>

      {/* State Description */}
      <div className="p-3 bg-gray-800/30 rounded-lg">
        <div className="flex items-center gap-2">
          {currentStateConfig && (
            <currentStateConfig.icon
              className={cn(
                'w-4 h-4 text-blue-400',
                activeState === 'loading' && 'animate-spin'
              )}
            />
          )}
          <div>
            <p className="text-sm text-white font-medium">{currentStateConfig?.name}</p>
            <p className="text-xs text-gray-500">{currentStateConfig?.description}</p>
          </div>
        </div>
        {currentStateConfig?.prefix && (
          <p className="mt-2 text-xs text-gray-600 font-mono">
            Prefix: {currentStateConfig.prefix}
          </p>
        )}
      </div>

      {/* State Actions */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => {
            const prevIndex = ELEMENT_STATES.findIndex((s) => s.id === activeState) - 1;
            if (prevIndex >= 0) {
              handleCopyState(ELEMENT_STATES[prevIndex].id, activeState);
            }
          }}
          className={cn(
            'flex items-center gap-1 px-2 py-1.5 rounded-md',
            'text-xs text-gray-400 hover:text-white hover:bg-gray-800',
            'transition-colors duration-150'
          )}
        >
          <Copy className="w-3 h-3" />
          Copy from previous
        </button>
        <button
          onClick={() => handleClearState(activeState)}
          className={cn(
            'flex items-center gap-1 px-2 py-1.5 rounded-md',
            'text-xs text-gray-400 hover:text-red-400 hover:bg-gray-800',
            'transition-colors duration-150'
          )}
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      {/* State Properties */}
      {selectedElement ? (
        <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
          {STATE_PROPERTIES.map(({ category, property, options }) => (
            <StatePropertyRow
              key={category}
              category={category}
              property={property}
              options={options}
              currentValue={stateStyles[activeState]?.[property] || ''}
              state={activeState}
              onChange={(value) => handleStyleChange(property, value)}
            />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 text-center py-4">
          Select an element to configure state variants
        </p>
      )}

      {/* Preview */}
      {selectedElement && hasStylesForState(activeState) && (
        <div className="p-3 bg-gray-800/30 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">Preview Classes</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(stateStyles[activeState] || {})
              .filter(([, value]) => value)
              .map(([, value]) => {
                const prefix = currentStateConfig?.prefix || '';
                return (
                  <span
                    key={value}
                    className="px-2 py-0.5 text-xs bg-blue-600/20 text-blue-400 rounded font-mono"
                  >
                    {prefix}
                    {value}
                  </span>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default VariantPanel;
