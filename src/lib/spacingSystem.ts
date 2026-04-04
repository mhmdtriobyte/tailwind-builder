/**
 * Spacing System - Comprehensive spacing utilities for visual builders
 *
 * Features:
 * - Tailwind-compatible spacing scale
 * - Unit conversions (px, rem, em, %)
 * - Vertical rhythm calculator
 * - Baseline grid calculator
 * - Auto spacing suggestions
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Tailwind CSS default spacing scale
 * Maps scale values to their rem equivalents
 */
export const SPACING_SCALE = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96
] as const;

export type SpacingScaleValue = typeof SPACING_SCALE[number];

/**
 * Spacing scale with pixel and rem values
 */
export const SPACING_MAP: Record<SpacingScaleValue, { px: number; rem: number }> = {
  0: { px: 0, rem: 0 },
  0.5: { px: 2, rem: 0.125 },
  1: { px: 4, rem: 0.25 },
  1.5: { px: 6, rem: 0.375 },
  2: { px: 8, rem: 0.5 },
  2.5: { px: 10, rem: 0.625 },
  3: { px: 12, rem: 0.75 },
  3.5: { px: 14, rem: 0.875 },
  4: { px: 16, rem: 1 },
  5: { px: 20, rem: 1.25 },
  6: { px: 24, rem: 1.5 },
  7: { px: 28, rem: 1.75 },
  8: { px: 32, rem: 2 },
  9: { px: 36, rem: 2.25 },
  10: { px: 40, rem: 2.5 },
  11: { px: 44, rem: 2.75 },
  12: { px: 48, rem: 3 },
  14: { px: 56, rem: 3.5 },
  16: { px: 64, rem: 4 },
  20: { px: 80, rem: 5 },
  24: { px: 96, rem: 6 },
  28: { px: 112, rem: 7 },
  32: { px: 128, rem: 8 },
  36: { px: 144, rem: 9 },
  40: { px: 160, rem: 10 },
  44: { px: 176, rem: 11 },
  48: { px: 192, rem: 12 },
  52: { px: 208, rem: 13 },
  56: { px: 224, rem: 14 },
  60: { px: 240, rem: 15 },
  64: { px: 256, rem: 16 },
  72: { px: 288, rem: 18 },
  80: { px: 320, rem: 20 },
  96: { px: 384, rem: 24 },
};

/**
 * Supported spacing units
 */
export type SpacingUnit = 'px' | 'rem' | 'em' | '%';

/**
 * Default base font size for rem calculations
 */
const DEFAULT_BASE_FONT_SIZE = 16;

// ============================================================================
// TYPES
// ============================================================================

export interface SpacingValue {
  value: number;
  unit: SpacingUnit;
}

export interface BoxSpacing {
  top: SpacingValue;
  right: SpacingValue;
  bottom: SpacingValue;
  left: SpacingValue;
}

export interface VerticalRhythm {
  baselineHeight: number;
  lineHeight: number;
  fontSize: number;
  spacingMultipliers: number[];
}

export interface BaselineGrid {
  baselineHeight: number;
  divisions: number;
  offset: number;
}

export interface SpacingSuggestion {
  scale: SpacingScaleValue;
  px: number;
  rem: number;
  reason: string;
  confidence: number;
}

export interface SpacingAnalysis {
  current: SpacingValue;
  nearestScale: SpacingScaleValue;
  suggestions: SpacingSuggestion[];
  isOnScale: boolean;
}

export interface ElementSpacingInfo {
  margin: BoxSpacing;
  padding: BoxSpacing;
  gap: SpacingValue | null;
  computedBounds: DOMRect | null;
}

// ============================================================================
// UNIT CONVERSION
// ============================================================================

/**
 * Convert a spacing value between units
 */
export function convertSpacingUnit(
  value: number,
  fromUnit: SpacingUnit,
  toUnit: SpacingUnit,
  baseFontSize: number = DEFAULT_BASE_FONT_SIZE,
  containerSize?: number
): number {
  if (fromUnit === toUnit) return value;

  // First convert to pixels
  let pxValue: number;

  switch (fromUnit) {
    case 'px':
      pxValue = value;
      break;
    case 'rem':
    case 'em':
      pxValue = value * baseFontSize;
      break;
    case '%':
      if (!containerSize) {
        throw new Error('Container size required for percentage conversion');
      }
      pxValue = (value / 100) * containerSize;
      break;
    default:
      pxValue = value;
  }

  // Then convert from pixels to target unit
  switch (toUnit) {
    case 'px':
      return Math.round(pxValue * 100) / 100;
    case 'rem':
    case 'em':
      return Math.round((pxValue / baseFontSize) * 1000) / 1000;
    case '%':
      if (!containerSize) {
        throw new Error('Container size required for percentage conversion');
      }
      return Math.round((pxValue / containerSize) * 10000) / 100;
    default:
      return pxValue;
  }
}

/**
 * Parse a CSS spacing value string into SpacingValue
 */
export function parseSpacingValue(cssValue: string): SpacingValue | null {
  if (!cssValue || cssValue === 'auto' || cssValue === 'none') {
    return null;
  }

  const match = cssValue.match(/^(-?\d*\.?\d+)(px|rem|em|%)$/);
  if (!match) {
    return null;
  }

  return {
    value: parseFloat(match[1]),
    unit: match[2] as SpacingUnit,
  };
}

/**
 * Format a SpacingValue to a CSS string
 */
export function formatSpacingValue(spacing: SpacingValue): string {
  return `${spacing.value}${spacing.unit}`;
}

/**
 * Convert a pixel value to the nearest Tailwind spacing scale value
 */
export function pxToSpacingScale(px: number): SpacingScaleValue {
  let closest: SpacingScaleValue = 0;
  let minDiff = Infinity;

  for (const scale of SPACING_SCALE) {
    const diff = Math.abs(SPACING_MAP[scale].px - px);
    if (diff < minDiff) {
      minDiff = diff;
      closest = scale;
    }
  }

  return closest;
}

/**
 * Convert a spacing scale value to pixels
 */
export function spacingScaleToPx(scale: SpacingScaleValue): number {
  return SPACING_MAP[scale]?.px ?? 0;
}

/**
 * Convert a spacing scale value to rem
 */
export function spacingScaleToRem(scale: SpacingScaleValue): number {
  return SPACING_MAP[scale]?.rem ?? 0;
}

// ============================================================================
// SPACING RECOMMENDATIONS
// ============================================================================

/**
 * Get spacing suggestions based on context
 */
export function getSpacingSuggestions(
  currentPx: number,
  context: 'padding' | 'margin' | 'gap' = 'padding',
  containerWidth?: number
): SpacingSuggestion[] {
  const suggestions: SpacingSuggestion[] = [];
  const nearestScale = pxToSpacingScale(currentPx);

  // Suggest the nearest scale value
  suggestions.push({
    scale: nearestScale,
    px: SPACING_MAP[nearestScale].px,
    rem: SPACING_MAP[nearestScale].rem,
    reason: 'Nearest value on the spacing scale',
    confidence: 0.9,
  });

  // Suggest contextual values
  const contextRecommendations: Record<string, SpacingScaleValue[]> = {
    padding: [4, 6, 8], // Common padding values
    margin: [4, 6, 8, 12], // Common margin values
    gap: [2, 4, 6, 8], // Common gap values
  };

  for (const scale of contextRecommendations[context]) {
    if (scale !== nearestScale) {
      suggestions.push({
        scale,
        px: SPACING_MAP[scale].px,
        rem: SPACING_MAP[scale].rem,
        reason: `Common ${context} value`,
        confidence: 0.7,
      });
    }
  }

  // If container width is provided, suggest proportional spacing
  if (containerWidth) {
    const proportions = [0.02, 0.04, 0.06, 0.08]; // 2%, 4%, 6%, 8%
    for (const proportion of proportions) {
      const proportionalPx = Math.round(containerWidth * proportion);
      const proportionalScale = pxToSpacingScale(proportionalPx);

      if (!suggestions.some(s => s.scale === proportionalScale)) {
        suggestions.push({
          scale: proportionalScale,
          px: SPACING_MAP[proportionalScale].px,
          rem: SPACING_MAP[proportionalScale].rem,
          reason: `${Math.round(proportion * 100)}% of container width`,
          confidence: 0.6,
        });
      }
    }
  }

  // Sort by confidence and remove duplicates
  return suggestions
    .filter((s, i, arr) => arr.findIndex(x => x.scale === s.scale) === i)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}

/**
 * Analyze current spacing and provide recommendations
 */
export function analyzeSpacing(
  currentValue: SpacingValue,
  baseFontSize: number = DEFAULT_BASE_FONT_SIZE
): SpacingAnalysis {
  const pxValue = convertSpacingUnit(
    currentValue.value,
    currentValue.unit,
    'px',
    baseFontSize
  );

  const nearestScale = pxToSpacingScale(pxValue);
  const isOnScale = Math.abs(SPACING_MAP[nearestScale].px - pxValue) < 0.5;

  return {
    current: currentValue,
    nearestScale,
    suggestions: getSpacingSuggestions(pxValue),
    isOnScale,
  };
}

// ============================================================================
// VERTICAL RHYTHM
// ============================================================================

/**
 * Calculate vertical rhythm values
 */
export function calculateVerticalRhythm(
  baseFontSize: number = 16,
  baseLineHeight: number = 1.5
): VerticalRhythm {
  const baselineHeight = baseFontSize * baseLineHeight;

  // Common multipliers for vertical rhythm
  const spacingMultipliers = [0.5, 1, 1.5, 2, 3, 4, 6, 8];

  return {
    baselineHeight,
    lineHeight: baseLineHeight,
    fontSize: baseFontSize,
    spacingMultipliers,
  };
}

/**
 * Get spacing values that maintain vertical rhythm
 */
export function getVerticalRhythmSpacing(
  rhythm: VerticalRhythm,
  multiplier: number = 1
): number {
  return rhythm.baselineHeight * multiplier;
}

/**
 * Find the nearest rhythm-aligned spacing value
 */
export function snapToVerticalRhythm(
  value: number,
  rhythm: VerticalRhythm
): number {
  const units = value / rhythm.baselineHeight;
  const snappedUnits = Math.round(units * 2) / 2; // Snap to half units
  return snappedUnits * rhythm.baselineHeight;
}

/**
 * Check if a value aligns with vertical rhythm
 */
export function isOnVerticalRhythm(
  value: number,
  rhythm: VerticalRhythm,
  tolerance: number = 0.5
): boolean {
  const units = value / rhythm.baselineHeight;
  const roundedUnits = Math.round(units * 2) / 2;
  return Math.abs(units - roundedUnits) * rhythm.baselineHeight < tolerance;
}

// ============================================================================
// BASELINE GRID
// ============================================================================

/**
 * Create a baseline grid configuration
 */
export function createBaselineGrid(
  baselineHeight: number = 8,
  divisions: number = 1,
  offset: number = 0
): BaselineGrid {
  return {
    baselineHeight,
    divisions,
    offset,
  };
}

/**
 * Snap a value to the baseline grid
 */
export function snapToBaselineGrid(
  value: number,
  grid: BaselineGrid
): number {
  const gridUnit = grid.baselineHeight / grid.divisions;
  const adjusted = value - grid.offset;
  const snapped = Math.round(adjusted / gridUnit) * gridUnit;
  return snapped + grid.offset;
}

/**
 * Generate baseline grid lines for rendering
 */
export function generateBaselineGridLines(
  containerHeight: number,
  grid: BaselineGrid
): number[] {
  const lines: number[] = [];
  const gridUnit = grid.baselineHeight / grid.divisions;

  let y = grid.offset;
  while (y < containerHeight) {
    lines.push(y);
    y += gridUnit;
  }

  return lines;
}

// ============================================================================
// AUTO SPACING SUGGESTIONS
// ============================================================================

export interface AutoSpacingContext {
  elementType: string;
  parentType?: string;
  siblingCount: number;
  isFirstChild: boolean;
  isLastChild: boolean;
  containerWidth?: number;
  containerHeight?: number;
}

/**
 * Get auto spacing suggestions based on element context
 */
export function getAutoSpacingSuggestions(
  context: AutoSpacingContext
): {
  padding: BoxSpacing;
  margin: BoxSpacing;
  gap: SpacingValue | null;
} {
  const defaultSpacing: SpacingValue = { value: 0, unit: 'px' };

  // Default padding based on element type
  const paddingMap: Record<string, SpacingScaleValue> = {
    container: 6,
    section: 12,
    card: 4,
    button: 2,
    input: 2,
    text: 0,
    heading: 0,
    image: 0,
    div: 4,
  };

  // Default margin based on element type
  const marginMap: Record<string, { top: SpacingScaleValue; bottom: SpacingScaleValue }> = {
    section: { top: 16, bottom: 16 },
    heading: { top: 6, bottom: 4 },
    paragraph: { top: 0, bottom: 4 },
    card: { top: 0, bottom: 4 },
    button: { top: 2, bottom: 2 },
    image: { top: 4, bottom: 4 },
  };

  // Default gap for container elements
  const gapMap: Record<string, SpacingScaleValue> = {
    container: 4,
    flexRow: 4,
    flexColumn: 4,
    grid: 4,
    buttonGroup: 2,
    cardGroup: 6,
  };

  const elementKey = context.elementType.toLowerCase().replace(/[^a-z]/g, '');

  // Calculate padding
  const paddingScale = paddingMap[elementKey] ?? 4;
  const paddingPx = spacingScaleToPx(paddingScale);
  const padding: BoxSpacing = {
    top: { value: paddingPx, unit: 'px' },
    right: { value: paddingPx, unit: 'px' },
    bottom: { value: paddingPx, unit: 'px' },
    left: { value: paddingPx, unit: 'px' },
  };

  // Calculate margin
  const marginConfig = marginMap[elementKey];
  const margin: BoxSpacing = {
    top: marginConfig
      ? { value: spacingScaleToPx(marginConfig.top), unit: 'px' }
      : { ...defaultSpacing },
    right: { ...defaultSpacing },
    bottom: marginConfig
      ? { value: spacingScaleToPx(marginConfig.bottom), unit: 'px' }
      : { ...defaultSpacing },
    left: { ...defaultSpacing },
  };

  // Adjust margins for first/last children
  if (context.isFirstChild) {
    margin.top = { ...defaultSpacing };
  }
  if (context.isLastChild) {
    margin.bottom = { ...defaultSpacing };
  }

  // Calculate gap
  const gapScale = gapMap[elementKey];
  const gap = gapScale
    ? { value: spacingScaleToPx(gapScale), unit: 'px' as SpacingUnit }
    : null;

  return { padding, margin, gap };
}

// ============================================================================
// SPACING UTILITIES
// ============================================================================

/**
 * Calculate consistent spacing between multiple elements
 */
export function calculateDistributedSpacing(
  containerSize: number,
  elementSizes: number[],
  distributeType: 'between' | 'around' | 'evenly'
): number[] {
  const totalElementSize = elementSizes.reduce((sum, size) => sum + size, 0);
  const remainingSpace = containerSize - totalElementSize;
  const elementCount = elementSizes.length;

  if (remainingSpace <= 0 || elementCount <= 1) {
    return new Array(elementCount).fill(0);
  }

  switch (distributeType) {
    case 'between':
      // Space between elements, none at edges
      const spaceBetween = remainingSpace / (elementCount - 1);
      return new Array(elementCount - 1).fill(spaceBetween).concat([0]);

    case 'around':
      // Equal space around each element (half at edges)
      const spaceAround = remainingSpace / elementCount;
      return new Array(elementCount).fill(spaceAround);

    case 'evenly':
      // Equal space including edges
      const spaceEvenly = remainingSpace / (elementCount + 1);
      return new Array(elementCount).fill(spaceEvenly);

    default:
      return new Array(elementCount).fill(0);
  }
}

/**
 * Generate Tailwind spacing classes from SpacingValue
 */
export function toTailwindSpacingClass(
  type: 'p' | 'm' | 'gap',
  side: 't' | 'r' | 'b' | 'l' | 'x' | 'y' | '' = '',
  value: SpacingValue
): string {
  const pxValue = value.unit === 'px'
    ? value.value
    : convertSpacingUnit(value.value, value.unit, 'px');

  const scale = pxToSpacingScale(pxValue);
  const prefix = type + side;

  // Handle fractional scale values
  if (scale === 0.5 || scale === 1.5 || scale === 2.5 || scale === 3.5) {
    return `${prefix}-[${SPACING_MAP[scale].rem}rem]`;
  }

  return `${prefix}-${scale}`;
}

/**
 * Parse Tailwind spacing class to SpacingValue
 */
export function parseTailwindSpacingClass(className: string): SpacingValue | null {
  // Match patterns like p-4, mx-8, gap-2, etc.
  const match = className.match(/^(?:p|m|gap|space)-?(?:t|r|b|l|x|y)?-(\d+(?:\.\d+)?|\[.*?\])$/);

  if (!match) {
    return null;
  }

  const scaleValue = match[1];

  // Handle arbitrary values like [1.5rem]
  if (scaleValue.startsWith('[') && scaleValue.endsWith(']')) {
    const innerValue = scaleValue.slice(1, -1);
    const parsed = parseSpacingValue(innerValue);
    return parsed;
  }

  const scale = parseFloat(scaleValue) as SpacingScaleValue;
  const mapping = SPACING_MAP[scale];

  if (!mapping) {
    return null;
  }

  return {
    value: mapping.px,
    unit: 'px',
  };
}

/**
 * Get all spacing scale options for UI dropdowns
 */
export function getSpacingScaleOptions(): Array<{
  label: string;
  value: string;
  px: number;
  rem: number;
}> {
  return SPACING_SCALE.map(scale => ({
    label: String(scale),
    value: String(scale),
    px: SPACING_MAP[scale].px,
    rem: SPACING_MAP[scale].rem,
  }));
}

/**
 * Calculate spacing to achieve specific alignment
 */
export function calculateAlignmentSpacing(
  elementSize: number,
  containerSize: number,
  alignment: 'start' | 'center' | 'end'
): { before: number; after: number } {
  const remainingSpace = containerSize - elementSize;

  if (remainingSpace <= 0) {
    return { before: 0, after: 0 };
  }

  switch (alignment) {
    case 'start':
      return { before: 0, after: remainingSpace };
    case 'center':
      return { before: remainingSpace / 2, after: remainingSpace / 2 };
    case 'end':
      return { before: remainingSpace, after: 0 };
    default:
      return { before: 0, after: 0 };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const spacingSystem = {
  // Constants
  SPACING_SCALE,
  SPACING_MAP,

  // Conversion
  convertSpacingUnit,
  parseSpacingValue,
  formatSpacingValue,
  pxToSpacingScale,
  spacingScaleToPx,
  spacingScaleToRem,

  // Recommendations
  getSpacingSuggestions,
  analyzeSpacing,

  // Vertical rhythm
  calculateVerticalRhythm,
  getVerticalRhythmSpacing,
  snapToVerticalRhythm,
  isOnVerticalRhythm,

  // Baseline grid
  createBaselineGrid,
  snapToBaselineGrid,
  generateBaselineGridLines,

  // Auto spacing
  getAutoSpacingSuggestions,

  // Utilities
  calculateDistributedSpacing,
  toTailwindSpacingClass,
  parseTailwindSpacingClass,
  getSpacingScaleOptions,
  calculateAlignmentSpacing,
};

export default spacingSystem;
