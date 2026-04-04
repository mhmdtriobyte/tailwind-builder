'use client';

import { useState } from 'react';
import {
  Monitor,
  Tablet,
  Eye,
  EyeOff,
  Copy,
  Trash2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCustomizationStore } from '@/store/customizationStore';
import { useBuilderStore } from '@/store/builderStore';
import type { Breakpoint } from '@/types/customization';

// ============================================================================
// CONSTANTS
// ============================================================================

const BREAKPOINTS: Array<{
  id: Breakpoint | 'default';
  name: string;
  minWidth: number;
  icon: typeof Monitor;
  color: string;
}> = [
  { id: 'default', name: 'Base', minWidth: 0, icon: Monitor, color: 'text-gray-400' },
  { id: 'sm', name: 'Small', minWidth: 640, icon: Tablet, color: 'text-green-400' },
  { id: 'md', name: 'Medium', minWidth: 768, icon: Tablet, color: 'text-blue-400' },
  { id: 'lg', name: 'Large', minWidth: 1024, icon: Monitor, color: 'text-purple-400' },
  { id: 'xl', name: 'XL', minWidth: 1280, icon: Monitor, color: 'text-orange-400' },
  { id: '2xl', name: '2XL', minWidth: 1536, icon: Monitor, color: 'text-red-400' },
];

const RESPONSIVE_PROPERTIES = [
  {
    category: 'Display',
    options: [
      { value: 'block', label: 'Block' },
      { value: 'hidden', label: 'Hidden' },
      { value: 'flex', label: 'Flex' },
      { value: 'grid', label: 'Grid' },
      { value: 'inline', label: 'Inline' },
      { value: 'inline-block', label: 'Inline Block' },
      { value: 'inline-flex', label: 'Inline Flex' },
    ],
  },
  {
    category: 'Width',
    options: [
      { value: 'w-auto', label: 'Auto' },
      { value: 'w-full', label: 'Full' },
      { value: 'w-1/2', label: '50%' },
      { value: 'w-1/3', label: '33%' },
      { value: 'w-2/3', label: '66%' },
      { value: 'w-1/4', label: '25%' },
      { value: 'w-3/4', label: '75%' },
    ],
  },
  {
    category: 'Flex Direction',
    options: [
      { value: 'flex-row', label: 'Row' },
      { value: 'flex-col', label: 'Column' },
      { value: 'flex-row-reverse', label: 'Row Reverse' },
      { value: 'flex-col-reverse', label: 'Column Reverse' },
    ],
  },
  {
    category: 'Grid Columns',
    options: [
      { value: 'grid-cols-1', label: '1 Column' },
      { value: 'grid-cols-2', label: '2 Columns' },
      { value: 'grid-cols-3', label: '3 Columns' },
      { value: 'grid-cols-4', label: '4 Columns' },
      { value: 'grid-cols-6', label: '6 Columns' },
      { value: 'grid-cols-12', label: '12 Columns' },
    ],
  },
  {
    category: 'Gap',
    options: [
      { value: 'gap-0', label: '0' },
      { value: 'gap-1', label: '0.25rem' },
      { value: 'gap-2', label: '0.5rem' },
      { value: 'gap-4', label: '1rem' },
      { value: 'gap-6', label: '1.5rem' },
      { value: 'gap-8', label: '2rem' },
    ],
  },
  {
    category: 'Padding',
    options: [
      { value: 'p-0', label: '0' },
      { value: 'p-2', label: '0.5rem' },
      { value: 'p-4', label: '1rem' },
      { value: 'p-6', label: '1.5rem' },
      { value: 'p-8', label: '2rem' },
      { value: 'p-12', label: '3rem' },
    ],
  },
  {
    category: 'Text Size',
    options: [
      { value: 'text-xs', label: 'Extra Small' },
      { value: 'text-sm', label: 'Small' },
      { value: 'text-base', label: 'Base' },
      { value: 'text-lg', label: 'Large' },
      { value: 'text-xl', label: 'XL' },
      { value: 'text-2xl', label: '2XL' },
      { value: 'text-3xl', label: '3XL' },
    ],
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface BreakpointTabProps {
  breakpoint: typeof BREAKPOINTS[0];
  isActive: boolean;
  onClick: () => void;
}

function BreakpointTab({ breakpoint, isActive, onClick }: BreakpointTabProps) {
  const Icon = breakpoint.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 px-3 py-2 rounded-lg',
        'transition-all duration-200',
        isActive
          ? 'bg-gray-800 ring-1 ring-blue-500/50'
          : 'hover:bg-gray-800/50'
      )}
    >
      <Icon className={cn('w-4 h-4', isActive ? breakpoint.color : 'text-gray-500')} />
      <span className={cn('text-[10px] font-medium', isActive ? 'text-white' : 'text-gray-500')}>
        {breakpoint.name}
      </span>
      <span className="text-[9px] text-gray-600">{breakpoint.minWidth}px+</span>
    </button>
  );
}

interface ResponsivePropertyRowProps {
  category: string;
  options: Array<{ value: string; label: string }>;
  currentValue: string;
  breakpoint: Breakpoint | 'default';
  onChange: (value: string) => void;
}

function ResponsivePropertyRow({
  category,
  options,
  currentValue,
  breakpoint,
  onChange,
}: ResponsivePropertyRowProps) {
  const prefix = breakpoint === 'default' ? '' : `${breakpoint}:`;

  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-400">{category}</label>
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
      {currentValue && breakpoint !== 'default' && (
        <p className="text-[10px] text-gray-600">
          Class: {prefix}
          {currentValue}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ResponsivePanel() {
  const { activeBreakpoint, setActiveBreakpoint, showBreakpointIndicator, toggleBreakpointIndicator } =
    useCustomizationStore();
  const { selectedId, getElementById, updateElement, setViewport } = useBuilderStore();

  const [responsiveValues, setResponsiveValues] = useState<Record<string, Record<string, string>>>({
    default: {},
    sm: {},
    md: {},
    lg: {},
    xl: {},
    '2xl': {},
  });

  const selectedElement = selectedId ? getElementById(selectedId) : null;

  const handlePropertyChange = (category: string, value: string) => {
    const breakpoint = activeBreakpoint;

    setResponsiveValues((prev) => ({
      ...prev,
      [breakpoint]: {
        ...prev[breakpoint],
        [category]: value,
      },
    }));

    if (!selectedElement) return;

    const prefix = breakpoint === 'default' ? '' : `${breakpoint}:`;
    const fullClass = prefix + value;

    // Get the responsive styles for this breakpoint
    const responsiveStyles = selectedElement.styles.responsive || { sm: [], md: [], lg: [] };

    if (breakpoint === 'default') {
      // For default, add to layout classes
      const currentLayout = selectedElement.styles.layout || [];
      const categoryPrefix = value.split('-')[0];
      const filtered = currentLayout.filter((c) => !c.startsWith(categoryPrefix));

      updateElement(selectedElement.id, {
        styles: {
          ...selectedElement.styles,
          layout: [...filtered, value],
        },
      });
    } else if (breakpoint === 'sm' || breakpoint === 'md' || breakpoint === 'lg') {
      // For responsive breakpoints
      const currentBp = responsiveStyles[breakpoint] || [];
      const categoryPrefix = value.split('-')[0];
      const filtered = currentBp.filter((c) => !c.includes(categoryPrefix));

      updateElement(selectedElement.id, {
        styles: {
          ...selectedElement.styles,
          responsive: {
            ...responsiveStyles,
            [breakpoint]: [...filtered, fullClass],
          },
        },
      });
    }
  };

  const handleCopyToBreakpoint = (fromBp: Breakpoint | 'default', toBp: Breakpoint | 'default') => {
    setResponsiveValues((prev) => ({
      ...prev,
      [toBp]: { ...prev[fromBp] },
    }));
  };

  const handleClearBreakpoint = (bp: Breakpoint | 'default') => {
    setResponsiveValues((prev) => ({
      ...prev,
      [bp]: {},
    }));

    if (!selectedElement) return;

    if (bp === 'default') {
      updateElement(selectedElement.id, {
        styles: {
          ...selectedElement.styles,
          layout: [],
        },
      });
    } else if (bp === 'sm' || bp === 'md' || bp === 'lg') {
      const responsiveStyles = selectedElement.styles.responsive || { sm: [], md: [], lg: [] };
      updateElement(selectedElement.id, {
        styles: {
          ...selectedElement.styles,
          responsive: {
            ...responsiveStyles,
            [bp]: [],
          },
        },
      });
    }
  };

  const handleViewportPreview = () => {
    const bp = activeBreakpoint;
    if (bp === 'default' || bp === 'xl' || bp === '2xl') {
      setViewport('desktop');
    } else if (bp === 'sm' || bp === 'md') {
      setViewport('tablet');
    }
  };

  return (
    <div className="space-y-4">
      {/* Breakpoint Tabs */}
      <div className="flex gap-1 p-1 bg-gray-800/50 rounded-lg overflow-x-auto">
        {BREAKPOINTS.map((bp) => (
          <BreakpointTab
            key={bp.id}
            breakpoint={bp}
            isActive={activeBreakpoint === bp.id}
            onClick={() => setActiveBreakpoint(bp.id)}
          />
        ))}
      </div>

      {/* Breakpoint Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleBreakpointIndicator()}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              showBreakpointIndicator
                ? 'bg-blue-600/20 text-blue-400'
                : 'text-gray-500 hover:text-white hover:bg-gray-800'
            )}
            title="Toggle breakpoint indicator"
          >
            {showBreakpointIndicator ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleViewportPreview}
            className={cn(
              'p-1.5 rounded-md text-gray-500',
              'hover:text-white hover:bg-gray-800 transition-colors'
            )}
            title="Preview at this breakpoint"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const prevIndex = BREAKPOINTS.findIndex((b) => b.id === activeBreakpoint) - 1;
              if (prevIndex >= 0) {
                handleCopyToBreakpoint(BREAKPOINTS[prevIndex].id, activeBreakpoint);
              }
            }}
            className={cn(
              'p-1.5 rounded-md text-gray-500',
              'hover:text-white hover:bg-gray-800 transition-colors'
            )}
            title="Copy from previous breakpoint"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleClearBreakpoint(activeBreakpoint)}
            className={cn(
              'p-1.5 rounded-md text-gray-500',
              'hover:text-red-400 hover:bg-gray-800 transition-colors'
            )}
            title="Clear this breakpoint"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Breakpoint Info */}
      <div className="p-3 bg-gray-800/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">
              {BREAKPOINTS.find((b) => b.id === activeBreakpoint)?.name}
            </p>
            <p className="text-xs text-gray-500">
              {BREAKPOINTS.find((b) => b.id === activeBreakpoint)?.minWidth}px and up
            </p>
          </div>
          <div
            className={cn(
              'w-3 h-3 rounded-full',
              BREAKPOINTS.find((b) => b.id === activeBreakpoint)?.color.replace('text-', 'bg-')
            )}
          />
        </div>
      </div>

      {/* Responsive Properties */}
      {selectedElement ? (
        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
          {RESPONSIVE_PROPERTIES.map(({ category, options }) => (
            <ResponsivePropertyRow
              key={category}
              category={category}
              options={options}
              currentValue={responsiveValues[activeBreakpoint]?.[category] || ''}
              breakpoint={activeBreakpoint}
              onChange={(value) => handlePropertyChange(category, value)}
            />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 text-center py-4">
          Select an element to configure responsive styles
        </p>
      )}

      {/* Active Classes Preview */}
      {selectedElement && Object.keys(responsiveValues[activeBreakpoint] || {}).length > 0 && (
        <div className="p-3 bg-gray-800/30 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">Active Classes</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(responsiveValues[activeBreakpoint] || {}).map(([key, value]) => {
              const prefix = activeBreakpoint === 'default' ? '' : `${activeBreakpoint}:`;
              return (
                <span
                  key={key}
                  className="px-2 py-0.5 text-xs bg-blue-600/20 text-blue-400 rounded"
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

export default ResponsivePanel;
