'use client';

import React, { useState, useCallback } from 'react';
import { Link, Unlink, RotateCcw, Box } from 'lucide-react';
import { cn } from '@/utils/cn';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type BoxModelUnit = 'px' | 'rem' | 'em' | '%';

export interface BoxModelSides {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface BoxModelValues {
  margin: BoxModelSides;
  border: BoxModelSides;
  padding: BoxModelSides;
  width: number | 'auto';
  height: number | 'auto';
}

export interface BoxModelEditorProps {
  values: BoxModelValues;
  onChange: (values: BoxModelValues) => void;
  unit?: BoxModelUnit;
  onUnitChange?: (unit: BoxModelUnit) => void;
  computedStyles?: {
    width: number;
    height: number;
    margin: BoxModelSides;
    padding: BoxModelSides;
    border: BoxModelSides;
  } | null;
  className?: string;
}

type BoxSection = 'margin' | 'border' | 'padding' | 'content';
type SectionSide = 'top' | 'right' | 'bottom' | 'left' | 'all';

// ============================================================================
// CONSTANTS
// ============================================================================

const UNITS: BoxModelUnit[] = ['px', 'rem', 'em', '%'];

const SECTION_COLORS = {
  margin: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/40',
    text: 'text-orange-400',
    label: 'Margin',
  },
  border: {
    bg: 'bg-gray-700/50',
    border: 'border-gray-500/50',
    text: 'text-gray-300',
    label: 'Border',
  },
  padding: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/40',
    text: 'text-green-400',
    label: 'Padding',
  },
  content: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
    label: 'Content',
  },
};

// Spacing presets for quick selection (reserved for future use)

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface ValueInputProps {
  value: number;
  onChange: (value: number) => void;
  side: SectionSide;
  section: BoxSection;
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
  unit: BoxModelUnit;
  compact?: boolean;
}

function ValueInput({
  value,
  onChange,
  side,
  section,
  isEditing,
  onStartEdit,
  onEndEdit,
  unit,
  compact = false,
}: ValueInputProps) {
  const [inputValue, setInputValue] = useState(String(value));

  const handleBlur = useCallback(() => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    } else {
      setInputValue(String(value));
    }
    onEndEdit();
  }, [inputValue, value, onChange, onEndEdit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleBlur();
      } else if (e.key === 'Escape') {
        setInputValue(String(value));
        onEndEdit();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const newValue = value + step;
        onChange(newValue);
        setInputValue(String(newValue));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const newValue = Math.max(0, value - step);
        onChange(newValue);
        setInputValue(String(newValue));
      }
    },
    [handleBlur, value, onChange, onEndEdit]
  );

  React.useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const colors = SECTION_COLORS[section];

  if (isEditing) {
    return (
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className={cn(
          'w-12 px-1 py-0.5 text-center text-xs font-mono',
          'bg-gray-900 border rounded focus:outline-none focus:ring-1',
          colors.border,
          colors.text,
          'focus:ring-blue-500'
        )}
      />
    );
  }

  return (
    <button
      onClick={onStartEdit}
      className={cn(
        'min-w-[28px] px-1 py-0.5 text-center text-xs font-mono rounded',
        'hover:bg-white/10 transition-colors',
        compact ? 'text-[10px]' : 'text-xs',
        colors.text
      )}
      title={`${section} ${side}: ${value}${unit}`}
    >
      {value}
    </button>
  );
}

interface LinkedToggleProps {
  linked: boolean;
  onChange: (linked: boolean) => void;
  section: BoxSection;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LinkedToggle({ linked, onChange, section }: LinkedToggleProps) {
  return (
    <button
      onClick={() => onChange(!linked)}
      className={cn(
        'p-1 rounded transition-colors',
        linked
          ? 'bg-blue-600 text-white'
          : 'bg-gray-800 text-gray-400 hover:text-white'
      )}
      title={linked ? 'Unlink sides' : 'Link all sides'}
    >
      {linked ? (
        <Link className="w-3 h-3" />
      ) : (
        <Unlink className="w-3 h-3" />
      )}
    </button>
  );
}

// ============================================================================
// VISUAL BOX MODEL COMPONENT
// ============================================================================

interface VisualBoxModelProps {
  values: BoxModelValues;
  onChange: (values: BoxModelValues) => void;
  unit: BoxModelUnit;
  computedStyles: BoxModelEditorProps['computedStyles'];
}

function VisualBoxModel({ values, onChange, unit, computedStyles }: VisualBoxModelProps) {
  const [editingField, setEditingField] = useState<{
    section: BoxSection;
    side: SectionSide;
  } | null>(null);
  const [linkedSections, setLinkedSections] = useState<Record<BoxSection, boolean>>({
    margin: false,
    border: false,
    padding: false,
    content: false,
  });

  const handleSideChange = useCallback(
    (section: 'margin' | 'border' | 'padding', side: SectionSide, value: number) => {
      if (linkedSections[section]) {
        // Update all sides when linked
        onChange({
          ...values,
          [section]: {
            top: value,
            right: value,
            bottom: value,
            left: value,
          },
        });
      } else if (side !== 'all') {
        onChange({
          ...values,
          [section]: {
            ...values[section],
            [side]: value,
          },
        });
      }
    },
    [values, onChange, linkedSections]
  );

  const handleLinkChange = useCallback(
    (section: BoxSection, linked: boolean) => {
      setLinkedSections((prev) => ({ ...prev, [section]: linked }));
      if (linked && section !== 'content') {
        // When linking, use the top value for all sides
        const topValue = values[section].top;
        onChange({
          ...values,
          [section]: {
            top: topValue,
            right: topValue,
            bottom: topValue,
            left: topValue,
          },
        });
      }
    },
    [values, onChange]
  );

  const isEditing = useCallback(
    (section: BoxSection, side: SectionSide) => {
      return editingField?.section === section && editingField?.side === side;
    },
    [editingField]
  );

  const renderSideInput = (
    section: 'margin' | 'border' | 'padding',
    side: 'top' | 'right' | 'bottom' | 'left'
  ) => (
    <ValueInput
      value={values[section][side]}
      onChange={(v) => handleSideChange(section, side, v)}
      side={side}
      section={section}
      isEditing={isEditing(section, side)}
      onStartEdit={() => setEditingField({ section, side })}
      onEndEdit={() => setEditingField(null)}
      unit={unit}
      compact
    />
  );

  const contentWidth = typeof values.width === 'number' ? values.width : computedStyles?.width ?? 100;
  const contentHeight = typeof values.height === 'number' ? values.height : computedStyles?.height ?? 80;

  return (
    <div className="relative select-none">
      {/* Margin Box (outermost) */}
      <div
        className={cn(
          'relative p-2',
          SECTION_COLORS.margin.bg,
          'border border-dashed',
          SECTION_COLORS.margin.border,
          'rounded-lg'
        )}
      >
        {/* Margin Label */}
        <div className="absolute -top-2 left-2 px-1 bg-gray-900 text-[10px] text-orange-400 font-medium">
          margin
        </div>

        {/* Margin Values */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5">
          {renderSideInput('margin', 'top')}
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0.5">
          {renderSideInput('margin', 'right')}
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-0.5">
          {renderSideInput('margin', 'bottom')}
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5">
          {renderSideInput('margin', 'left')}
        </div>

        {/* Border Box */}
        <div
          className={cn(
            'relative p-2 m-4',
            SECTION_COLORS.border.bg,
            'border',
            SECTION_COLORS.border.border,
            'rounded-md'
          )}
        >
          {/* Border Label */}
          <div className="absolute -top-2 left-2 px-1 bg-gray-900 text-[10px] text-gray-400 font-medium">
            border
          </div>

          {/* Border Values */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5">
            {renderSideInput('border', 'top')}
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0.5">
            {renderSideInput('border', 'right')}
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-0.5">
            {renderSideInput('border', 'bottom')}
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5">
            {renderSideInput('border', 'left')}
          </div>

          {/* Padding Box */}
          <div
            className={cn(
              'relative p-2 m-4',
              SECTION_COLORS.padding.bg,
              'border border-dashed',
              SECTION_COLORS.padding.border,
              'rounded'
            )}
          >
            {/* Padding Label */}
            <div className="absolute -top-2 left-2 px-1 bg-gray-900 text-[10px] text-green-400 font-medium">
              padding
            </div>

            {/* Padding Values */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5">
              {renderSideInput('padding', 'top')}
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0.5">
              {renderSideInput('padding', 'right')}
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-0.5">
              {renderSideInput('padding', 'bottom')}
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5">
              {renderSideInput('padding', 'left')}
            </div>

            {/* Content Box (innermost) */}
            <div
              className={cn(
                'flex items-center justify-center m-4',
                SECTION_COLORS.content.bg,
                'border',
                SECTION_COLORS.content.border,
                'rounded-sm'
              )}
              style={{
                minWidth: '60px',
                minHeight: '40px',
              }}
            >
              <span className="text-[10px] text-blue-400 font-medium">
                {contentWidth} x {contentHeight}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Link Toggles */}
      <div className="absolute -right-8 top-2 flex flex-col gap-1">
        <LinkedToggle
          linked={linkedSections.margin}
          onChange={(linked) => handleLinkChange('margin', linked)}
          section="margin"
        />
        <LinkedToggle
          linked={linkedSections.border}
          onChange={(linked) => handleLinkChange('border', linked)}
          section="border"
        />
        <LinkedToggle
          linked={linkedSections.padding}
          onChange={(linked) => handleLinkChange('padding', linked)}
          section="padding"
        />
      </div>
    </div>
  );
}

// ============================================================================
// SIDE INPUT PANEL COMPONENT
// ============================================================================

interface SideInputPanelProps {
  section: 'margin' | 'border' | 'padding';
  values: BoxModelSides;
  onChange: (values: BoxModelSides) => void;
  unit: BoxModelUnit;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SideInputPanel({ section, values, onChange, unit }: SideInputPanelProps) {
  const [linked, setLinked] = useState(
    values.top === values.right &&
    values.right === values.bottom &&
    values.bottom === values.left
  );

  const handleChange = useCallback(
    (side: keyof BoxModelSides, value: number) => {
      if (linked) {
        onChange({ top: value, right: value, bottom: value, left: value });
      } else {
        onChange({ ...values, [side]: value });
      }
    },
    [linked, onChange, values]
  );

  const handleLinkToggle = useCallback(() => {
    const newLinked = !linked;
    setLinked(newLinked);
    if (newLinked) {
      onChange({
        top: values.top,
        right: values.top,
        bottom: values.top,
        left: values.top,
      });
    }
  }, [linked, onChange, values.top]);

  const colors = SECTION_COLORS[section];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={cn('text-xs font-medium capitalize', colors.text)}>
          {colors.label}
        </span>
        <button
          onClick={handleLinkToggle}
          className={cn(
            'p-1 rounded transition-colors',
            linked
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          )}
          title={linked ? 'Unlink sides' : 'Link all sides'}
        >
          {linked ? (
            <Link className="w-3 h-3" />
          ) : (
            <Unlink className="w-3 h-3" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <div key={side} className="space-y-1">
            <label className="block text-[10px] text-gray-500 uppercase text-center">
              {side[0]}
            </label>
            <input
              type="number"
              value={values[side]}
              onChange={(e) => handleChange(side, parseFloat(e.target.value) || 0)}
              min={0}
              className={cn(
                'w-full px-1 py-1 text-center text-xs',
                'bg-gray-800 border border-gray-700 rounded',
                'text-white',
                'focus:outline-none focus:ring-1 focus:ring-blue-500'
              )}
            />
          </div>
        ))}
      </div>

      {/* Preset Values */}
      <div className="flex flex-wrap gap-1">
        {[0, 4, 8, 16, 24].map((preset) => (
          <button
            key={preset}
            onClick={() => {
              if (linked) {
                onChange({ top: preset, right: preset, bottom: preset, left: preset });
              }
            }}
            className={cn(
              'px-2 py-0.5 text-[10px] rounded',
              'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white',
              'transition-colors'
            )}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function BoxModelEditor({
  values,
  onChange,
  unit = 'px',
  onUnitChange,
  computedStyles,
  className,
}: BoxModelEditorProps) {
  const [activeView, setActiveView] = useState<'visual' | 'inputs'>('visual');

  const handleReset = useCallback(() => {
    onChange({
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      border: { top: 0, right: 0, bottom: 0, left: 0 },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      width: 'auto',
      height: 'auto',
    });
  }, [onChange]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">Box Model</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Unit Selector */}
          <select
            value={unit}
            onChange={(e) => onUnitChange?.(e.target.value as BoxModelUnit)}
            className={cn(
              'px-2 py-1 text-xs',
              'bg-gray-800 border border-gray-700 rounded',
              'text-white',
              'focus:outline-none focus:ring-1 focus:ring-blue-500'
            )}
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className={cn(
              'p-1.5 rounded',
              'text-gray-400 hover:text-white hover:bg-gray-800',
              'transition-colors'
            )}
            title="Reset all values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-1 p-1 bg-gray-800 rounded-lg">
        <button
          onClick={() => setActiveView('visual')}
          className={cn(
            'flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors',
            activeView === 'visual'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          )}
        >
          Visual
        </button>
        <button
          onClick={() => setActiveView('inputs')}
          className={cn(
            'flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors',
            activeView === 'inputs'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          )}
        >
          Inputs
        </button>
      </div>

      {/* Visual Box Model View */}
      {activeView === 'visual' && (
        <div className="p-4 pr-12">
          <VisualBoxModel
            values={values}
            onChange={onChange}
            unit={unit}
            computedStyles={computedStyles}
          />
        </div>
      )}

      {/* Input Panels View */}
      {activeView === 'inputs' && (
        <div className="space-y-4">
          <SideInputPanel
            section="margin"
            values={values.margin}
            onChange={(margin) => onChange({ ...values, margin })}
            unit={unit}
          />
          <SideInputPanel
            section="border"
            values={values.border}
            onChange={(border) => onChange({ ...values, border })}
            unit={unit}
          />
          <SideInputPanel
            section="padding"
            values={values.padding}
            onChange={(padding) => onChange({ ...values, padding })}
            unit={unit}
          />

          {/* Dimensions */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-blue-400">Dimensions</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] text-gray-500 uppercase">
                  Width
                </label>
                <input
                  type="text"
                  value={values.width === 'auto' ? 'auto' : values.width}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'auto' || val === '') {
                      onChange({ ...values, width: 'auto' });
                    } else {
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        onChange({ ...values, width: num });
                      }
                    }
                  }}
                  className={cn(
                    'w-full px-2 py-1.5 text-xs',
                    'bg-gray-800 border border-gray-700 rounded',
                    'text-white',
                    'focus:outline-none focus:ring-1 focus:ring-blue-500'
                  )}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-gray-500 uppercase">
                  Height
                </label>
                <input
                  type="text"
                  value={values.height === 'auto' ? 'auto' : values.height}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'auto' || val === '') {
                      onChange({ ...values, height: 'auto' });
                    } else {
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        onChange({ ...values, height: num });
                      }
                    }
                  }}
                  className={cn(
                    'w-full px-2 py-1.5 text-xs',
                    'bg-gray-800 border border-gray-700 rounded',
                    'text-white',
                    'focus:outline-none focus:ring-1 focus:ring-blue-500'
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Computed Values (if available) */}
      {computedStyles && (
        <div className="pt-3 border-t border-gray-800">
          <div className="text-[10px] text-gray-500 uppercase mb-2">
            Computed Values
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Width:</span>
              <span className="text-gray-300">{computedStyles.width}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Height:</span>
              <span className="text-gray-300">{computedStyles.height}px</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-800">
        {(['margin', 'border', 'padding', 'content'] as const).map((section) => {
          const colors = SECTION_COLORS[section];
          return (
            <div key={section} className="flex items-center gap-1.5">
              <div
                className={cn(
                  'w-3 h-3 rounded-sm',
                  colors.bg,
                  'border',
                  colors.border
                )}
              />
              <span className="text-[10px] text-gray-400 capitalize">
                {section}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BoxModelEditor;
