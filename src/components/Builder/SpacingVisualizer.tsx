'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import {
  spacingSystem,
  SpacingScaleValue,
  SPACING_MAP,
} from '@/lib/spacingSystem';

// ============================================================================
// TYPES
// ============================================================================

export interface SpacingValues {
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  gapX?: number;
  gapY?: number;
}

export interface SpacingVisualizerProps {
  elementId: string;
  elementRef: React.RefObject<HTMLElement>;
  spacing: SpacingValues;
  onSpacingChange: (spacing: Partial<SpacingValues>) => void;
  isActive?: boolean;
  showLabels?: boolean;
  unit?: 'px' | 'rem';
  className?: string;
}

interface DragState {
  side: keyof SpacingValues;
  startValue: number;
  startPosition: number;
  axis: 'x' | 'y';
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SPACING_COLORS = {
  padding: {
    fill: 'rgba(34, 197, 94, 0.3)',     // Green
    stroke: 'rgb(34, 197, 94)',
    text: 'rgb(34, 197, 94)',
  },
  margin: {
    fill: 'rgba(249, 115, 22, 0.3)',    // Orange
    stroke: 'rgb(249, 115, 22)',
    text: 'rgb(249, 115, 22)',
  },
  gap: {
    fill: 'rgba(59, 130, 246, 0.3)',    // Blue
    stroke: 'rgb(59, 130, 246)',
    text: 'rgb(59, 130, 246)',
  },
};

const HANDLE_SIZE = 8;
const MIN_SPACING = 0;
const MAX_SPACING = 384; // 96 in Tailwind scale

// ============================================================================
// SPACING VISUALIZER COMPONENT
// ============================================================================

export function SpacingVisualizer({
  elementRef,
  spacing,
  onSpacingChange,
  isActive = false,
  showLabels = true,
  unit = 'px',
  className,
}: SpacingVisualizerProps) {
  const [dragState, setDragState] = useState<DragState | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hoveredSide, setHoveredSide] = useState<keyof SpacingValues | null>(null);
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);

  // Update element rect when element changes
  useEffect(() => {
    if (elementRef.current) {
      const updateRect = () => {
        const rect = elementRef.current?.getBoundingClientRect();
        if (rect) {
          setElementRect(rect);
        }
      };

      updateRect();

      const observer = new ResizeObserver(updateRect);
      observer.observe(elementRef.current);

      return () => observer.disconnect();
    }
  }, [elementRef]);

  // Format value for display
  const formatValue = useCallback(
    (value: number): string => {
      if (unit === 'rem') {
        const rem = value / 16;
        return `${rem.toFixed(rem % 1 === 0 ? 0 : 2)}rem`;
      }
      return `${Math.round(value)}px`;
    },
    [unit]
  );

  // Get Tailwind scale label
  const getScaleLabel = useCallback((value: number): string => {
    const scale = spacingSystem.pxToSpacingScale(value);
    return String(scale);
  }, []);

  // Handle drag start
  const handleDragStart = useCallback(
    (side: keyof SpacingValues, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const axis = side.includes('Left') || side.includes('Right') || side === 'gapX'
        ? 'x'
        : 'y';

      setDragState({
        side,
        startValue: spacing[side] ?? 0,
        startPosition: axis === 'x' ? e.clientX : e.clientY,
        axis,
      });
    },
    [spacing]
  );

  // Handle drag move
  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = dragState.axis === 'x'
        ? e.clientX - dragState.startPosition
        : e.clientY - dragState.startPosition;

      // Invert delta for left/top sides
      const isLeftOrTop = dragState.side.includes('Left') || dragState.side.includes('Top');
      const adjustedDelta = isLeftOrTop ? -delta : delta;

      let newValue = Math.max(
        MIN_SPACING,
        Math.min(MAX_SPACING, dragState.startValue + adjustedDelta)
      );

      // Snap to spacing scale
      const nearestScale = spacingSystem.pxToSpacingScale(newValue);
      const snappedValue = SPACING_MAP[nearestScale].px;

      // Only snap if close enough
      if (Math.abs(newValue - snappedValue) < 4) {
        newValue = snappedValue;
      }

      onSpacingChange({ [dragState.side]: newValue });
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, onSpacingChange]);

  if (!elementRect || !isActive) {
    return null;
  }

  // Calculate overlay positions
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: elementRect.left - spacing.marginLeft,
    top: elementRect.top - spacing.marginTop,
    width: elementRect.width + spacing.marginLeft + spacing.marginRight,
    height: elementRect.height + spacing.marginTop + spacing.marginBottom,
    pointerEvents: 'none',
    zIndex: 9999,
  };

  return (
    <div
      ref={visualizerRef}
      className={cn('spacing-visualizer', className)}
      style={containerStyle}
    >
      {/* Margin visualization */}
      <MarginOverlay
        spacing={spacing}
        elementRect={elementRect}
        hoveredSide={hoveredSide}
        dragState={dragState}
        onHover={setHoveredSide}
        onDragStart={handleDragStart}
        formatValue={formatValue}
        getScaleLabel={getScaleLabel}
        showLabels={showLabels}
      />

      {/* Padding visualization */}
      <PaddingOverlay
        spacing={spacing}
        elementRect={elementRect}
        marginOffset={{
          left: spacing.marginLeft,
          top: spacing.marginTop,
        }}
        hoveredSide={hoveredSide}
        dragState={dragState}
        onHover={setHoveredSide}
        onDragStart={handleDragStart}
        formatValue={formatValue}
        getScaleLabel={getScaleLabel}
        showLabels={showLabels}
      />

      {/* Gap visualization (for flex/grid containers) */}
      {(spacing.gapX !== undefined || spacing.gapY !== undefined) && (
        <GapOverlay
          spacing={spacing}
          elementRect={elementRect}
          marginOffset={{
            left: spacing.marginLeft,
            top: spacing.marginTop,
          }}
          paddingOffset={{
            left: spacing.paddingLeft,
            top: spacing.paddingTop,
          }}
          hoveredSide={hoveredSide}
          onHover={setHoveredSide}
          formatValue={formatValue}
          showLabels={showLabels}
        />
      )}
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface MarginOverlayProps {
  spacing: SpacingValues;
  elementRect: DOMRect;
  hoveredSide: keyof SpacingValues | null;
  dragState: DragState | null;
  onHover: (side: keyof SpacingValues | null) => void;
  onDragStart: (side: keyof SpacingValues, e: React.MouseEvent) => void;
  formatValue: (value: number) => string;
  getScaleLabel: (value: number) => string;
  showLabels: boolean;
}

function MarginOverlay({
  spacing,
  elementRect,
  hoveredSide,
  dragState,
  onHover,
  onDragStart,
  formatValue,
  getScaleLabel,
  showLabels,
}: MarginOverlayProps) {
  const { marginTop, marginRight, marginBottom, marginLeft } = spacing;
  const color = SPACING_COLORS.margin;

  return (
    <>
      {/* Top margin */}
      {marginTop > 0 && (
        <SpacingBox
          side="marginTop"
          value={marginTop}
          x={marginLeft}
          y={0}
          width={elementRect.width}
          height={marginTop}
          color={color}
          isHovered={hoveredSide === 'marginTop'}
          isDragging={dragState?.side === 'marginTop'}
          onHover={onHover}
          onDragStart={onDragStart}
          formatValue={formatValue}
          getScaleLabel={getScaleLabel}
          showLabels={showLabels}
        />
      )}

      {/* Right margin */}
      {marginRight > 0 && (
        <SpacingBox
          side="marginRight"
          value={marginRight}
          x={marginLeft + elementRect.width}
          y={marginTop}
          width={marginRight}
          height={elementRect.height}
          color={color}
          isHovered={hoveredSide === 'marginRight'}
          isDragging={dragState?.side === 'marginRight'}
          onHover={onHover}
          onDragStart={onDragStart}
          formatValue={formatValue}
          getScaleLabel={getScaleLabel}
          showLabels={showLabels}
        />
      )}

      {/* Bottom margin */}
      {marginBottom > 0 && (
        <SpacingBox
          side="marginBottom"
          value={marginBottom}
          x={marginLeft}
          y={marginTop + elementRect.height}
          width={elementRect.width}
          height={marginBottom}
          color={color}
          isHovered={hoveredSide === 'marginBottom'}
          isDragging={dragState?.side === 'marginBottom'}
          onHover={onHover}
          onDragStart={onDragStart}
          formatValue={formatValue}
          getScaleLabel={getScaleLabel}
          showLabels={showLabels}
        />
      )}

      {/* Left margin */}
      {marginLeft > 0 && (
        <SpacingBox
          side="marginLeft"
          value={marginLeft}
          x={0}
          y={marginTop}
          width={marginLeft}
          height={elementRect.height}
          color={color}
          isHovered={hoveredSide === 'marginLeft'}
          isDragging={dragState?.side === 'marginLeft'}
          onHover={onHover}
          onDragStart={onDragStart}
          formatValue={formatValue}
          getScaleLabel={getScaleLabel}
          showLabels={showLabels}
        />
      )}
    </>
  );
}

interface PaddingOverlayProps {
  spacing: SpacingValues;
  elementRect: DOMRect;
  marginOffset: { left: number; top: number };
  hoveredSide: keyof SpacingValues | null;
  dragState: DragState | null;
  onHover: (side: keyof SpacingValues | null) => void;
  onDragStart: (side: keyof SpacingValues, e: React.MouseEvent) => void;
  formatValue: (value: number) => string;
  getScaleLabel: (value: number) => string;
  showLabels: boolean;
}

function PaddingOverlay({
  spacing,
  elementRect,
  marginOffset,
  hoveredSide,
  dragState,
  onHover,
  onDragStart,
  formatValue,
  getScaleLabel,
  showLabels,
}: PaddingOverlayProps) {
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = spacing;
  const color = SPACING_COLORS.padding;
  const baseX = marginOffset.left;
  const baseY = marginOffset.top;

  return (
    <>
      {/* Top padding */}
      {paddingTop > 0 && (
        <SpacingBox
          side="paddingTop"
          value={paddingTop}
          x={baseX}
          y={baseY}
          width={elementRect.width}
          height={paddingTop}
          color={color}
          isHovered={hoveredSide === 'paddingTop'}
          isDragging={dragState?.side === 'paddingTop'}
          onHover={onHover}
          onDragStart={onDragStart}
          formatValue={formatValue}
          getScaleLabel={getScaleLabel}
          showLabels={showLabels}
        />
      )}

      {/* Right padding */}
      {paddingRight > 0 && (
        <SpacingBox
          side="paddingRight"
          value={paddingRight}
          x={baseX + elementRect.width - paddingRight}
          y={baseY + paddingTop}
          width={paddingRight}
          height={elementRect.height - paddingTop - paddingBottom}
          color={color}
          isHovered={hoveredSide === 'paddingRight'}
          isDragging={dragState?.side === 'paddingRight'}
          onHover={onHover}
          onDragStart={onDragStart}
          formatValue={formatValue}
          getScaleLabel={getScaleLabel}
          showLabels={showLabels}
        />
      )}

      {/* Bottom padding */}
      {paddingBottom > 0 && (
        <SpacingBox
          side="paddingBottom"
          value={paddingBottom}
          x={baseX}
          y={baseY + elementRect.height - paddingBottom}
          width={elementRect.width}
          height={paddingBottom}
          color={color}
          isHovered={hoveredSide === 'paddingBottom'}
          isDragging={dragState?.side === 'paddingBottom'}
          onHover={onHover}
          onDragStart={onDragStart}
          formatValue={formatValue}
          getScaleLabel={getScaleLabel}
          showLabels={showLabels}
        />
      )}

      {/* Left padding */}
      {paddingLeft > 0 && (
        <SpacingBox
          side="paddingLeft"
          value={paddingLeft}
          x={baseX}
          y={baseY + paddingTop}
          width={paddingLeft}
          height={elementRect.height - paddingTop - paddingBottom}
          color={color}
          isHovered={hoveredSide === 'paddingLeft'}
          isDragging={dragState?.side === 'paddingLeft'}
          onHover={onHover}
          onDragStart={onDragStart}
          formatValue={formatValue}
          getScaleLabel={getScaleLabel}
          showLabels={showLabels}
        />
      )}
    </>
  );
}

interface GapOverlayProps {
  spacing: SpacingValues;
  elementRect: DOMRect;
  marginOffset: { left: number; top: number };
  paddingOffset: { left: number; top: number };
  hoveredSide: keyof SpacingValues | null;
  onHover: (side: keyof SpacingValues | null) => void;
  formatValue: (value: number) => string;
  showLabels: boolean;
}

// Reserved for future gap display enhancements
function GapOverlay({
  spacing,
  elementRect,
  marginOffset,
  paddingOffset,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hoveredSide,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onHover,
  formatValue,
  showLabels,
}: GapOverlayProps) {
  const { gapX = 0, gapY = 0 } = spacing;
  const color = SPACING_COLORS.gap;

  const baseX = marginOffset.left + paddingOffset.left;
  const baseY = marginOffset.top + paddingOffset.top;
  const innerWidth = elementRect.width - spacing.paddingLeft - spacing.paddingRight;
  const innerHeight = elementRect.height - spacing.paddingTop - spacing.paddingBottom;

  return (
    <>
      {/* Horizontal gap indicator */}
      {gapX > 0 && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: baseX + innerWidth / 2 - gapX / 2,
            top: baseY,
            width: gapX,
            height: innerHeight,
            backgroundColor: color.fill,
            borderLeft: `1px dashed ${color.stroke}`,
            borderRight: `1px dashed ${color.stroke}`,
            pointerEvents: 'auto',
          }}
          onMouseEnter={() => onHover('gapX')}
          onMouseLeave={() => onHover(null)}
        >
          {showLabels && (
            <span
              className="text-[10px] font-mono px-1 rounded"
              style={{
                backgroundColor: color.stroke,
                color: 'white',
              }}
            >
              {formatValue(gapX)}
            </span>
          )}
        </div>
      )}

      {/* Vertical gap indicator */}
      {gapY > 0 && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: baseX,
            top: baseY + innerHeight / 2 - gapY / 2,
            width: innerWidth,
            height: gapY,
            backgroundColor: color.fill,
            borderTop: `1px dashed ${color.stroke}`,
            borderBottom: `1px dashed ${color.stroke}`,
            pointerEvents: 'auto',
          }}
          onMouseEnter={() => onHover('gapY')}
          onMouseLeave={() => onHover(null)}
        >
          {showLabels && (
            <span
              className="text-[10px] font-mono px-1 rounded"
              style={{
                backgroundColor: color.stroke,
                color: 'white',
              }}
            >
              {formatValue(gapY)}
            </span>
          )}
        </div>
      )}
    </>
  );
}

interface SpacingBoxProps {
  side: keyof SpacingValues;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: { fill: string; stroke: string; text: string };
  isHovered: boolean;
  isDragging: boolean;
  onHover: (side: keyof SpacingValues | null) => void;
  onDragStart: (side: keyof SpacingValues, e: React.MouseEvent) => void;
  formatValue: (value: number) => string;
  getScaleLabel: (value: number) => string;
  showLabels: boolean;
}

function SpacingBox({
  side,
  value,
  x,
  y,
  width,
  height,
  color,
  isHovered,
  isDragging,
  onHover,
  onDragStart,
  formatValue,
  getScaleLabel,
  showLabels,
}: SpacingBoxProps) {
  const isVertical = width < height;
  const minDimension = Math.min(width, height);
  const showLabel = showLabels && minDimension > 20;

  return (
    <div
      className={cn(
        'absolute flex items-center justify-center transition-colors',
        (isHovered || isDragging) && 'ring-2 ring-white/50'
      )}
      style={{
        left: x,
        top: y,
        width,
        height,
        backgroundColor: isHovered || isDragging ? color.fill.replace('0.3', '0.5') : color.fill,
        pointerEvents: 'auto',
        cursor: isDragging ? 'grabbing' : (isVertical ? 'ew-resize' : 'ns-resize'),
      }}
      onMouseEnter={() => onHover(side)}
      onMouseLeave={() => !isDragging && onHover(null)}
      onMouseDown={(e) => onDragStart(side, e)}
    >
      {showLabel && (
        <span
          className={cn(
            'text-[10px] font-mono px-1 rounded whitespace-nowrap',
            isVertical && 'transform -rotate-90'
          )}
          style={{
            backgroundColor: color.stroke,
            color: 'white',
          }}
        >
          {formatValue(value)}
          <span className="opacity-70 ml-0.5">
            ({getScaleLabel(value)})
          </span>
        </span>
      )}

      {/* Drag handle */}
      <div
        className={cn(
          'absolute rounded-full bg-white shadow-md border-2 transition-transform',
          (isHovered || isDragging) ? 'scale-100' : 'scale-0'
        )}
        style={{
          width: HANDLE_SIZE,
          height: HANDLE_SIZE,
          borderColor: color.stroke,
          ...(isVertical
            ? { top: '50%', transform: 'translateY(-50%)' }
            : { left: '50%', transform: 'translateX(-50%)' }
          ),
          ...(side.includes('Left') && { left: 0 }),
          ...(side.includes('Right') && { right: 0 }),
          ...(side.includes('Top') && { top: 0 }),
          ...(side.includes('Bottom') && { bottom: 0 }),
        }}
      />
    </div>
  );
}

// ============================================================================
// SPACING EDITOR COMPONENT (Click to Edit)
// ============================================================================

export interface SpacingEditorProps {
  value: number;
  onChange: (value: number) => void;
  unit?: 'px' | 'rem';
  label?: string;
  className?: string;
}

export function SpacingEditor({
  value,
  onChange,
  unit = 'px',
  label,
  className,
}: SpacingEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const pxValue = unit === 'rem' ? parsed * 16 : parsed;
      onChange(Math.max(MIN_SPACING, Math.min(MAX_SPACING, pxValue)));
    } else {
      setInputValue(String(value));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setInputValue(String(value));
      setIsEditing(false);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      onChange(Math.min(MAX_SPACING, value + step));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      onChange(Math.max(MIN_SPACING, value - step));
    }
  };

  const displayValue = unit === 'rem' ? (value / 16).toFixed(2) : String(Math.round(value));

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {label && (
        <span className="text-xs text-gray-500 w-8">{label}</span>
      )}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-16 px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="w-16 px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-white hover:border-gray-500 text-left"
        >
          {displayValue}
          <span className="text-gray-500 ml-0.5">{unit}</span>
        </button>
      )}

      {/* Quick scale buttons */}
      <div className="flex gap-0.5">
        {[0, 2, 4, 8].map((scale) => (
          <button
            key={scale}
            onClick={() => onChange(SPACING_MAP[scale as SpacingScaleValue]?.px ?? 0)}
            className={cn(
              'w-6 h-6 text-[10px] rounded border transition-colors',
              value === (SPACING_MAP[scale as SpacingScaleValue]?.px ?? 0)
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
            )}
          >
            {scale}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default SpacingVisualizer;
