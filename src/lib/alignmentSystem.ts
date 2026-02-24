/**
 * Alignment System - Comprehensive alignment tools for visual builders
 *
 * Features:
 * - Align left, center, right
 * - Align top, middle, bottom
 * - Distribute horizontally/vertically
 * - Space evenly
 * - Match sizes (width, height, both)
 * - Align to grid
 * - Align to parent
 * - Align to selection
 */

// ============================================================================
// TYPES
// ============================================================================

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface AlignmentResult {
  id: string;
  originalRect: Rect;
  newRect: Rect;
  delta: Point;
}

export type HorizontalAlignment = 'left' | 'center' | 'right';
export type VerticalAlignment = 'top' | 'middle' | 'bottom';
export type DistributionType = 'horizontal' | 'vertical';
export type SpacingType = 'between' | 'around' | 'evenly';
export type SizeMatchType = 'width' | 'height' | 'both' | 'smallest' | 'largest';

export interface AlignmentOptions {
  alignToParent?: boolean;
  alignToSelection?: boolean;
  alignToGrid?: boolean;
  gridSize?: number;
  referenceRect?: Rect;
}

export interface DistributionOptions {
  spacing?: number;
  direction: DistributionType;
  type: SpacingType;
}

export interface GridConfig {
  cellWidth: number;
  cellHeight: number;
  offsetX?: number;
  offsetY?: number;
}

// ============================================================================
// ALIGNMENT CALCULATIONS
// ============================================================================

/**
 * Get the bounding box that encompasses all given rectangles
 */
export function getBoundingRect(rects: Rect[]): Rect {
  if (rects.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const rect of rects) {
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + rect.width);
    maxY = Math.max(maxY, rect.y + rect.height);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Get the center point of a rectangle
 */
export function getRectCenter(rect: Rect): Point {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

/**
 * Check if two rectangles intersect
 */
export function rectsIntersect(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}

// ============================================================================
// HORIZONTAL ALIGNMENT
// ============================================================================

/**
 * Align elements horizontally (left, center, right)
 */
export function alignHorizontal(
  elements: Array<{ id: string; rect: Rect }>,
  alignment: HorizontalAlignment,
  options: AlignmentOptions = {}
): AlignmentResult[] {
  if (elements.length === 0) return [];

  const referenceRect = options.referenceRect ?? getBoundingRect(elements.map(e => e.rect));

  return elements.map(element => {
    let newX: number;

    switch (alignment) {
      case 'left':
        newX = referenceRect.x;
        break;
      case 'center':
        newX = referenceRect.x + (referenceRect.width - element.rect.width) / 2;
        break;
      case 'right':
        newX = referenceRect.x + referenceRect.width - element.rect.width;
        break;
      default:
        newX = element.rect.x;
    }

    if (options.alignToGrid && options.gridSize) {
      newX = snapToGrid(newX, options.gridSize);
    }

    const newRect: Rect = {
      ...element.rect,
      x: newX,
    };

    return {
      id: element.id,
      originalRect: element.rect,
      newRect,
      delta: { x: newX - element.rect.x, y: 0 },
    };
  });
}

/**
 * Align to left edge
 */
export function alignLeft(
  elements: Array<{ id: string; rect: Rect }>,
  options?: AlignmentOptions
): AlignmentResult[] {
  return alignHorizontal(elements, 'left', options);
}

/**
 * Align to horizontal center
 */
export function alignCenter(
  elements: Array<{ id: string; rect: Rect }>,
  options?: AlignmentOptions
): AlignmentResult[] {
  return alignHorizontal(elements, 'center', options);
}

/**
 * Align to right edge
 */
export function alignRight(
  elements: Array<{ id: string; rect: Rect }>,
  options?: AlignmentOptions
): AlignmentResult[] {
  return alignHorizontal(elements, 'right', options);
}

// ============================================================================
// VERTICAL ALIGNMENT
// ============================================================================

/**
 * Align elements vertically (top, middle, bottom)
 */
export function alignVertical(
  elements: Array<{ id: string; rect: Rect }>,
  alignment: VerticalAlignment,
  options: AlignmentOptions = {}
): AlignmentResult[] {
  if (elements.length === 0) return [];

  const referenceRect = options.referenceRect ?? getBoundingRect(elements.map(e => e.rect));

  return elements.map(element => {
    let newY: number;

    switch (alignment) {
      case 'top':
        newY = referenceRect.y;
        break;
      case 'middle':
        newY = referenceRect.y + (referenceRect.height - element.rect.height) / 2;
        break;
      case 'bottom':
        newY = referenceRect.y + referenceRect.height - element.rect.height;
        break;
      default:
        newY = element.rect.y;
    }

    if (options.alignToGrid && options.gridSize) {
      newY = snapToGrid(newY, options.gridSize);
    }

    const newRect: Rect = {
      ...element.rect,
      y: newY,
    };

    return {
      id: element.id,
      originalRect: element.rect,
      newRect,
      delta: { x: 0, y: newY - element.rect.y },
    };
  });
}

/**
 * Align to top edge
 */
export function alignTop(
  elements: Array<{ id: string; rect: Rect }>,
  options?: AlignmentOptions
): AlignmentResult[] {
  return alignVertical(elements, 'top', options);
}

/**
 * Align to vertical middle
 */
export function alignMiddle(
  elements: Array<{ id: string; rect: Rect }>,
  options?: AlignmentOptions
): AlignmentResult[] {
  return alignVertical(elements, 'middle', options);
}

/**
 * Align to bottom edge
 */
export function alignBottom(
  elements: Array<{ id: string; rect: Rect }>,
  options?: AlignmentOptions
): AlignmentResult[] {
  return alignVertical(elements, 'bottom', options);
}

// ============================================================================
// DISTRIBUTION
// ============================================================================

/**
 * Distribute elements horizontally with equal spacing
 */
export function distributeHorizontal(
  elements: Array<{ id: string; rect: Rect }>,
  options: Partial<DistributionOptions> = {}
): AlignmentResult[] {
  if (elements.length < 2) return elements.map(e => ({
    id: e.id,
    originalRect: e.rect,
    newRect: e.rect,
    delta: { x: 0, y: 0 },
  }));

  const { spacing, type = 'between' } = options;

  // Sort by x position
  const sorted = [...elements].sort((a, b) => a.rect.x - b.rect.x);

  const boundingRect = getBoundingRect(sorted.map(e => e.rect));
  const totalElementWidth = sorted.reduce((sum, e) => sum + e.rect.width, 0);
  const availableSpace = boundingRect.width - totalElementWidth;

  let gaps: number[];
  const elementCount = sorted.length;

  if (spacing !== undefined) {
    gaps = new Array(elementCount - 1).fill(spacing);
  } else {
    switch (type) {
      case 'between':
        const spaceBetween = availableSpace / (elementCount - 1);
        gaps = new Array(elementCount - 1).fill(spaceBetween);
        break;
      case 'around':
        const spaceAround = availableSpace / elementCount;
        gaps = new Array(elementCount - 1).fill(spaceAround);
        break;
      case 'evenly':
        const spaceEvenly = availableSpace / (elementCount + 1);
        gaps = new Array(elementCount - 1).fill(spaceEvenly);
        break;
      default:
        gaps = new Array(elementCount - 1).fill(0);
    }
  }

  const results: AlignmentResult[] = [];
  let currentX = type === 'evenly' && spacing === undefined
    ? boundingRect.x + (availableSpace / (elementCount + 1))
    : type === 'around' && spacing === undefined
      ? boundingRect.x + (availableSpace / elementCount / 2)
      : boundingRect.x;

  for (let i = 0; i < sorted.length; i++) {
    const element = sorted[i];
    const newRect: Rect = {
      ...element.rect,
      x: currentX,
    };

    results.push({
      id: element.id,
      originalRect: element.rect,
      newRect,
      delta: { x: currentX - element.rect.x, y: 0 },
    });

    currentX += element.rect.width + (gaps[i] ?? 0);
  }

  return results;
}

/**
 * Distribute elements vertically with equal spacing
 */
export function distributeVertical(
  elements: Array<{ id: string; rect: Rect }>,
  options: Partial<DistributionOptions> = {}
): AlignmentResult[] {
  if (elements.length < 2) return elements.map(e => ({
    id: e.id,
    originalRect: e.rect,
    newRect: e.rect,
    delta: { x: 0, y: 0 },
  }));

  const { spacing, type = 'between' } = options;

  // Sort by y position
  const sorted = [...elements].sort((a, b) => a.rect.y - b.rect.y);

  const boundingRect = getBoundingRect(sorted.map(e => e.rect));
  const totalElementHeight = sorted.reduce((sum, e) => sum + e.rect.height, 0);
  const availableSpace = boundingRect.height - totalElementHeight;

  let gaps: number[];
  const elementCount = sorted.length;

  if (spacing !== undefined) {
    gaps = new Array(elementCount - 1).fill(spacing);
  } else {
    switch (type) {
      case 'between':
        const spaceBetween = availableSpace / (elementCount - 1);
        gaps = new Array(elementCount - 1).fill(spaceBetween);
        break;
      case 'around':
        const spaceAround = availableSpace / elementCount;
        gaps = new Array(elementCount - 1).fill(spaceAround);
        break;
      case 'evenly':
        const spaceEvenly = availableSpace / (elementCount + 1);
        gaps = new Array(elementCount - 1).fill(spaceEvenly);
        break;
      default:
        gaps = new Array(elementCount - 1).fill(0);
    }
  }

  const results: AlignmentResult[] = [];
  let currentY = type === 'evenly' && spacing === undefined
    ? boundingRect.y + (availableSpace / (elementCount + 1))
    : type === 'around' && spacing === undefined
      ? boundingRect.y + (availableSpace / elementCount / 2)
      : boundingRect.y;

  for (let i = 0; i < sorted.length; i++) {
    const element = sorted[i];
    const newRect: Rect = {
      ...element.rect,
      y: currentY,
    };

    results.push({
      id: element.id,
      originalRect: element.rect,
      newRect,
      delta: { x: 0, y: currentY - element.rect.y },
    });

    currentY += element.rect.height + (gaps[i] ?? 0);
  }

  return results;
}

/**
 * Space elements evenly (combination of distribute)
 */
export function spaceEvenly(
  elements: Array<{ id: string; rect: Rect }>,
  direction: DistributionType
): AlignmentResult[] {
  return direction === 'horizontal'
    ? distributeHorizontal(elements, { type: 'evenly' })
    : distributeVertical(elements, { type: 'evenly' });
}

// ============================================================================
// SIZE MATCHING
// ============================================================================

/**
 * Match sizes of elements
 */
export function matchSize(
  elements: Array<{ id: string; rect: Rect }>,
  matchType: SizeMatchType,
  referenceRect?: Rect
): AlignmentResult[] {
  if (elements.length === 0) return [];

  let targetWidth: number;
  let targetHeight: number;

  if (referenceRect) {
    targetWidth = referenceRect.width;
    targetHeight = referenceRect.height;
  } else {
    const widths = elements.map(e => e.rect.width);
    const heights = elements.map(e => e.rect.height);

    switch (matchType) {
      case 'smallest':
        targetWidth = Math.min(...widths);
        targetHeight = Math.min(...heights);
        break;
      case 'largest':
        targetWidth = Math.max(...widths);
        targetHeight = Math.max(...heights);
        break;
      default:
        targetWidth = widths[0];
        targetHeight = heights[0];
    }
  }

  return elements.map(element => {
    let newWidth = element.rect.width;
    let newHeight = element.rect.height;

    switch (matchType) {
      case 'width':
      case 'smallest':
      case 'largest':
        newWidth = targetWidth;
        if (matchType === 'smallest' || matchType === 'largest') {
          newHeight = targetHeight;
        }
        break;
      case 'height':
        newHeight = targetHeight;
        break;
      case 'both':
        newWidth = targetWidth;
        newHeight = targetHeight;
        break;
    }

    const newRect: Rect = {
      ...element.rect,
      width: newWidth,
      height: newHeight,
    };

    return {
      id: element.id,
      originalRect: element.rect,
      newRect,
      delta: { x: 0, y: 0 },
    };
  });
}

/**
 * Match widths of elements to reference
 */
export function matchWidth(
  elements: Array<{ id: string; rect: Rect }>,
  referenceWidth?: number
): AlignmentResult[] {
  const width = referenceWidth ?? Math.max(...elements.map(e => e.rect.width));
  return matchSize(elements, 'width', { x: 0, y: 0, width, height: 0 });
}

/**
 * Match heights of elements to reference
 */
export function matchHeight(
  elements: Array<{ id: string; rect: Rect }>,
  referenceHeight?: number
): AlignmentResult[] {
  const height = referenceHeight ?? Math.max(...elements.map(e => e.rect.height));
  return matchSize(elements, 'height', { x: 0, y: 0, width: 0, height });
}

// ============================================================================
// GRID ALIGNMENT
// ============================================================================

/**
 * Snap a value to the nearest grid line
 */
export function snapToGrid(value: number, gridSize: number, offset: number = 0): number {
  const adjusted = value - offset;
  const snapped = Math.round(adjusted / gridSize) * gridSize;
  return snapped + offset;
}

/**
 * Snap a rectangle to the grid
 */
export function snapRectToGrid(
  rect: Rect,
  grid: GridConfig
): Rect {
  return {
    x: snapToGrid(rect.x, grid.cellWidth, grid.offsetX ?? 0),
    y: snapToGrid(rect.y, grid.cellHeight, grid.offsetY ?? 0),
    width: snapToGrid(rect.width, grid.cellWidth),
    height: snapToGrid(rect.height, grid.cellHeight),
  };
}

/**
 * Align elements to grid
 */
export function alignToGrid(
  elements: Array<{ id: string; rect: Rect }>,
  grid: GridConfig
): AlignmentResult[] {
  return elements.map(element => {
    const newRect = snapRectToGrid(element.rect, grid);

    return {
      id: element.id,
      originalRect: element.rect,
      newRect,
      delta: {
        x: newRect.x - element.rect.x,
        y: newRect.y - element.rect.y,
      },
    };
  });
}

// ============================================================================
// PARENT ALIGNMENT
// ============================================================================

/**
 * Align element to parent container
 */
export function alignToParent(
  element: { id: string; rect: Rect },
  parentRect: Rect,
  horizontal: HorizontalAlignment | null,
  vertical: VerticalAlignment | null
): AlignmentResult {
  let newX = element.rect.x;
  let newY = element.rect.y;

  if (horizontal) {
    switch (horizontal) {
      case 'left':
        newX = parentRect.x;
        break;
      case 'center':
        newX = parentRect.x + (parentRect.width - element.rect.width) / 2;
        break;
      case 'right':
        newX = parentRect.x + parentRect.width - element.rect.width;
        break;
    }
  }

  if (vertical) {
    switch (vertical) {
      case 'top':
        newY = parentRect.y;
        break;
      case 'middle':
        newY = parentRect.y + (parentRect.height - element.rect.height) / 2;
        break;
      case 'bottom':
        newY = parentRect.y + parentRect.height - element.rect.height;
        break;
    }
  }

  const newRect: Rect = {
    ...element.rect,
    x: newX,
    y: newY,
  };

  return {
    id: element.id,
    originalRect: element.rect,
    newRect,
    delta: { x: newX - element.rect.x, y: newY - element.rect.y },
  };
}

/**
 * Center element within parent
 */
export function centerInParent(
  element: { id: string; rect: Rect },
  parentRect: Rect
): AlignmentResult {
  return alignToParent(element, parentRect, 'center', 'middle');
}

// ============================================================================
// SELECTION ALIGNMENT
// ============================================================================

/**
 * Align elements to a reference element (key object)
 */
export function alignToReference(
  elements: Array<{ id: string; rect: Rect }>,
  referenceId: string,
  horizontal?: HorizontalAlignment,
  vertical?: VerticalAlignment
): AlignmentResult[] {
  const reference = elements.find(e => e.id === referenceId);
  if (!reference) return [];

  const others = elements.filter(e => e.id !== referenceId);

  const results: AlignmentResult[] = [{
    id: reference.id,
    originalRect: reference.rect,
    newRect: reference.rect,
    delta: { x: 0, y: 0 },
  }];

  for (const element of others) {
    let newX = element.rect.x;
    let newY = element.rect.y;

    if (horizontal) {
      switch (horizontal) {
        case 'left':
          newX = reference.rect.x;
          break;
        case 'center':
          newX = reference.rect.x + (reference.rect.width - element.rect.width) / 2;
          break;
        case 'right':
          newX = reference.rect.x + reference.rect.width - element.rect.width;
          break;
      }
    }

    if (vertical) {
      switch (vertical) {
        case 'top':
          newY = reference.rect.y;
          break;
        case 'middle':
          newY = reference.rect.y + (reference.rect.height - element.rect.height) / 2;
          break;
        case 'bottom':
          newY = reference.rect.y + reference.rect.height - element.rect.height;
          break;
      }
    }

    const newRect: Rect = {
      ...element.rect,
      x: newX,
      y: newY,
    };

    results.push({
      id: element.id,
      originalRect: element.rect,
      newRect,
      delta: { x: newX - element.rect.x, y: newY - element.rect.y },
    });
  }

  return results;
}

// ============================================================================
// TAILWIND ALIGNMENT CLASSES
// ============================================================================

/**
 * Get Tailwind classes for flex alignment
 */
export function getFlexAlignmentClasses(
  horizontal: HorizontalAlignment,
  vertical: VerticalAlignment
): string[] {
  const classes: string[] = ['flex'];

  // Justify content (horizontal alignment in row)
  switch (horizontal) {
    case 'left':
      classes.push('justify-start');
      break;
    case 'center':
      classes.push('justify-center');
      break;
    case 'right':
      classes.push('justify-end');
      break;
  }

  // Align items (vertical alignment in row)
  switch (vertical) {
    case 'top':
      classes.push('items-start');
      break;
    case 'middle':
      classes.push('items-center');
      break;
    case 'bottom':
      classes.push('items-end');
      break;
  }

  return classes;
}

/**
 * Get Tailwind classes for grid alignment
 */
export function getGridAlignmentClasses(
  horizontal: HorizontalAlignment,
  vertical: VerticalAlignment
): string[] {
  const classes: string[] = ['grid'];

  // Place items
  const placeMap: Record<string, Record<string, string>> = {
    left: { top: 'place-items-start', middle: 'place-items-start', bottom: 'place-items-start' },
    center: { top: 'place-items-center', middle: 'place-items-center', bottom: 'place-items-center' },
    right: { top: 'place-items-end', middle: 'place-items-end', bottom: 'place-items-end' },
  };

  const placeClass = placeMap[horizontal]?.[vertical];
  if (placeClass) {
    classes.push(placeClass);
  }

  return classes;
}

/**
 * Get Tailwind classes for text alignment
 */
export function getTextAlignmentClass(alignment: HorizontalAlignment): string {
  switch (alignment) {
    case 'left':
      return 'text-left';
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const alignmentSystem = {
  // Utilities
  getBoundingRect,
  getRectCenter,
  rectsIntersect,

  // Horizontal
  alignHorizontal,
  alignLeft,
  alignCenter,
  alignRight,

  // Vertical
  alignVertical,
  alignTop,
  alignMiddle,
  alignBottom,

  // Distribution
  distributeHorizontal,
  distributeVertical,
  spaceEvenly,

  // Size
  matchSize,
  matchWidth,
  matchHeight,

  // Grid
  snapToGrid,
  snapRectToGrid,
  alignToGrid,

  // Parent
  alignToParent,
  centerInParent,

  // Selection
  alignToReference,

  // Tailwind
  getFlexAlignmentClasses,
  getGridAlignmentClasses,
  getTextAlignmentClass,
};

export default alignmentSystem;
