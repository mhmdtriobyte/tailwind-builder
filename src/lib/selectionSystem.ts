/**
 * Selection System for Tailwind Builder
 *
 * Provides comprehensive multi-select functionality similar to design tools
 * like Figma and Sketch. Supports various selection modes including:
 * - Multi-select with Ctrl/Cmd+Click
 * - Range select with Shift+Click
 * - Marquee/lasso selection
 * - Selection filters by type and property
 */

import type { BuilderElement } from '@/types/builder';

// ============================================================================
// Types
// ============================================================================

export interface SelectionState {
  /** Currently selected element IDs */
  selectedIds: string[];
  /** Last selected element ID for range selection */
  lastSelectedId: string | null;
  /** Anchor element ID for range selection */
  anchorId: string | null;
  /** Selection mode */
  mode: SelectionMode;
  /** Whether selection is locked */
  locked: boolean;
}

export type SelectionMode =
  | 'single'      // Normal single selection
  | 'multi'       // Multi-select mode active
  | 'range'       // Range selection in progress
  | 'marquee';    // Marquee selection in progress

export interface SelectionBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface MarqueeRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export type SelectionFilter =
  | { type: 'byType'; elementType: string }
  | { type: 'byProperty'; property: string; value: unknown }
  | { type: 'byHasChildren'; hasChildren: boolean }
  | { type: 'byDepth'; depth: number; comparison: 'equal' | 'greater' | 'less' }
  | { type: 'custom'; predicate: (element: BuilderElement) => boolean };

// ============================================================================
// Selection State Factory
// ============================================================================

export function createSelectionState(): SelectionState {
  return {
    selectedIds: [],
    lastSelectedId: null,
    anchorId: null,
    mode: 'single',
    locked: false,
  };
}

// ============================================================================
// Core Selection Operations
// ============================================================================

/**
 * Handles click selection with modifier key support
 */
export function handleClickSelection(
  state: SelectionState,
  elementId: string,
  modifiers: { ctrl: boolean; shift: boolean; alt: boolean },
  flattenedElements: BuilderElement[]
): SelectionState {
  if (state.locked) {
    return state;
  }

  const { ctrl, shift, alt } = modifiers;

  // Alt+Click: Remove from selection
  if (alt && state.selectedIds.includes(elementId)) {
    return {
      ...state,
      selectedIds: state.selectedIds.filter(id => id !== elementId),
      lastSelectedId: state.selectedIds.length > 1 ? state.selectedIds[0] : null,
    };
  }

  // Shift+Click: Range selection
  if (shift && state.anchorId) {
    const rangeIds = getElementsInRange(flattenedElements, state.anchorId, elementId);

    if (ctrl) {
      // Add range to existing selection
      const uniqueIds = Array.from(new Set([...state.selectedIds, ...rangeIds]));
      return {
        ...state,
        selectedIds: uniqueIds,
        lastSelectedId: elementId,
        mode: 'range',
      };
    } else {
      // Replace selection with range
      return {
        ...state,
        selectedIds: rangeIds,
        lastSelectedId: elementId,
        mode: 'range',
      };
    }
  }

  // Ctrl/Cmd+Click: Toggle selection
  if (ctrl) {
    const isSelected = state.selectedIds.includes(elementId);

    if (isSelected) {
      return {
        ...state,
        selectedIds: state.selectedIds.filter(id => id !== elementId),
        lastSelectedId: state.selectedIds.length > 1 ? state.selectedIds[0] : null,
        mode: 'multi',
      };
    } else {
      return {
        ...state,
        selectedIds: [...state.selectedIds, elementId],
        lastSelectedId: elementId,
        anchorId: state.anchorId || elementId,
        mode: 'multi',
      };
    }
  }

  // Regular click: Single selection
  return {
    ...state,
    selectedIds: [elementId],
    lastSelectedId: elementId,
    anchorId: elementId,
    mode: 'single',
  };
}

/**
 * Gets all element IDs between two elements in a flattened list
 */
export function getElementsInRange(
  elements: BuilderElement[],
  startId: string,
  endId: string
): string[] {
  const flatList = flattenElements(elements);
  const startIndex = flatList.findIndex(el => el.id === startId);
  const endIndex = flatList.findIndex(el => el.id === endId);

  if (startIndex === -1 || endIndex === -1) {
    return [endId];
  }

  const minIndex = Math.min(startIndex, endIndex);
  const maxIndex = Math.max(startIndex, endIndex);

  return flatList.slice(minIndex, maxIndex + 1).map(el => el.id);
}

/**
 * Flattens the element tree into a single array preserving order
 */
export function flattenElements(elements: BuilderElement[]): BuilderElement[] {
  const result: BuilderElement[] = [];

  function traverse(elements: BuilderElement[]): void {
    for (const element of elements) {
      result.push(element);
      if (element.children.length > 0) {
        traverse(element.children);
      }
    }
  }

  traverse(elements);
  return result;
}

// ============================================================================
// Selection Expansion Operations
// ============================================================================

/**
 * Selects all elements
 */
export function selectAll(elements: BuilderElement[]): string[] {
  return flattenElements(elements).map(el => el.id);
}

/**
 * Clears all selections
 */
export function clearSelection(): SelectionState {
  return createSelectionState();
}

/**
 * Selects siblings of the first selected element
 */
export function selectSiblings(
  elements: BuilderElement[],
  selectedIds: string[]
): string[] {
  if (selectedIds.length === 0) {
    return [];
  }

  const firstSelectedId = selectedIds[0];
  const parent = findParent(elements, firstSelectedId);

  if (parent) {
    return parent.children.map(child => child.id);
  }

  // Top-level elements
  return elements.map(el => el.id);
}

/**
 * Selects all children of selected elements
 */
export function selectChildren(
  elements: BuilderElement[],
  selectedIds: string[]
): string[] {
  const result: string[] = [];

  for (const id of selectedIds) {
    const element = findElementById(elements, id);
    if (element && element.children.length > 0) {
      result.push(...element.children.map(child => child.id));
    }
  }

  return Array.from(new Set(result));
}

/**
 * Selects parent elements of selected elements
 */
export function selectParents(
  elements: BuilderElement[],
  selectedIds: string[]
): string[] {
  const result: string[] = [];

  for (const id of selectedIds) {
    const parent = findParent(elements, id);
    if (parent) {
      result.push(parent.id);
    }
  }

  return Array.from(new Set(result));
}

/**
 * Inverts the selection
 */
export function invertSelection(
  elements: BuilderElement[],
  selectedIds: string[]
): string[] {
  const allIds = flattenElements(elements).map(el => el.id);
  return allIds.filter(id => !selectedIds.includes(id));
}

/**
 * Selects all descendants of selected elements
 */
export function selectDescendants(
  elements: BuilderElement[],
  selectedIds: string[]
): string[] {
  const result: string[] = [];

  for (const id of selectedIds) {
    const element = findElementById(elements, id);
    if (element) {
      const descendants = flattenElements(element.children);
      result.push(...descendants.map(el => el.id));
    }
  }

  return Array.from(new Set(result));
}

// ============================================================================
// Selection Filters
// ============================================================================

/**
 * Filters selected elements based on criteria
 */
export function filterSelection(
  elements: BuilderElement[],
  selectedIds: string[],
  filter: SelectionFilter
): string[] {
  const selectedElements = selectedIds
    .map(id => findElementById(elements, id))
    .filter((el): el is BuilderElement => el !== null);

  let filtered: BuilderElement[] = [];

  switch (filter.type) {
    case 'byType':
      filtered = selectedElements.filter(el => el.type === filter.elementType);
      break;

    case 'byProperty':
      filtered = selectedElements.filter(
        el => el.props[filter.property] === filter.value
      );
      break;

    case 'byHasChildren':
      filtered = selectedElements.filter(
        el => (el.children.length > 0) === filter.hasChildren
      );
      break;

    case 'byDepth': {
      filtered = selectedElements.filter(el => {
        const depth = getElementDepth(elements, el.id);
        switch (filter.comparison) {
          case 'equal':
            return depth === filter.depth;
          case 'greater':
            return depth > filter.depth;
          case 'less':
            return depth < filter.depth;
        }
      });
      break;
    }

    case 'custom':
      filtered = selectedElements.filter(filter.predicate);
      break;
  }

  return filtered.map(el => el.id);
}

/**
 * Selects elements by type from all elements
 */
export function selectByType(
  elements: BuilderElement[],
  elementType: string
): string[] {
  return flattenElements(elements)
    .filter(el => el.type === elementType)
    .map(el => el.id);
}

/**
 * Selects elements matching a search pattern in name or type
 */
export function selectBySearch(
  elements: BuilderElement[],
  searchPattern: string
): string[] {
  const pattern = searchPattern.toLowerCase();
  return flattenElements(elements)
    .filter(el =>
      el.name.toLowerCase().includes(pattern) ||
      el.type.toLowerCase().includes(pattern)
    )
    .map(el => el.id);
}

// ============================================================================
// Marquee Selection
// ============================================================================

/**
 * Gets elements within a marquee rectangle
 */
export function getElementsInMarquee(
  elements: BuilderElement[],
  marqueeRect: MarqueeRect,
  elementBoundsMap: Map<string, DOMRect>
): string[] {
  const normalizedRect = normalizeMarqueeRect(marqueeRect);
  const result: string[] = [];

  for (const element of flattenElements(elements)) {
    const bounds = elementBoundsMap.get(element.id);
    if (bounds && rectsIntersect(normalizedRect, bounds)) {
      result.push(element.id);
    }
  }

  return result;
}

/**
 * Normalizes marquee rect to always have positive width/height
 */
export function normalizeMarqueeRect(rect: MarqueeRect): SelectionBounds {
  const left = Math.min(rect.startX, rect.endX);
  const right = Math.max(rect.startX, rect.endX);
  const top = Math.min(rect.startY, rect.endY);
  const bottom = Math.max(rect.startY, rect.endY);

  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}

/**
 * Checks if two rectangles intersect
 */
export function rectsIntersect(
  rect1: SelectionBounds,
  rect2: DOMRect
): boolean {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

// ============================================================================
// Selection Bounds Calculation
// ============================================================================

/**
 * Calculates the bounding box of selected elements
 */
export function calculateSelectionBounds(
  selectedIds: string[],
  elementBoundsMap: Map<string, DOMRect>
): SelectionBounds | null {
  if (selectedIds.length === 0) {
    return null;
  }

  let minLeft = Infinity;
  let minTop = Infinity;
  let maxRight = -Infinity;
  let maxBottom = -Infinity;

  for (const id of selectedIds) {
    const bounds = elementBoundsMap.get(id);
    if (bounds) {
      minLeft = Math.min(minLeft, bounds.left);
      minTop = Math.min(minTop, bounds.top);
      maxRight = Math.max(maxRight, bounds.right);
      maxBottom = Math.max(maxBottom, bounds.bottom);
    }
  }

  if (minLeft === Infinity) {
    return null;
  }

  return {
    left: minLeft,
    top: minTop,
    right: maxRight,
    bottom: maxBottom,
    width: maxRight - minLeft,
    height: maxBottom - minTop,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Finds an element by ID in the tree
 */
export function findElementById(
  elements: BuilderElement[],
  id: string
): BuilderElement | null {
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }
    const found = findElementById(element.children, id);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * Finds the parent of an element
 */
export function findParent(
  elements: BuilderElement[],
  id: string,
  parent: BuilderElement | null = null
): BuilderElement | null {
  for (const element of elements) {
    if (element.id === id) {
      return parent;
    }
    const found = findParent(element.children, id, element);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * Gets the depth of an element in the tree
 */
export function getElementDepth(
  elements: BuilderElement[],
  id: string,
  currentDepth: number = 0
): number {
  for (const element of elements) {
    if (element.id === id) {
      return currentDepth;
    }
    const depth = getElementDepth(element.children, id, currentDepth + 1);
    if (depth !== -1) {
      return depth;
    }
  }
  return -1;
}

/**
 * Checks if an element is a descendant of another
 */
export function isDescendant(
  elements: BuilderElement[],
  ancestorId: string,
  descendantId: string
): boolean {
  const ancestor = findElementById(elements, ancestorId);
  if (!ancestor) {
    return false;
  }

  const descendant = findElementById(ancestor.children, descendantId);
  return descendant !== null;
}

/**
 * Validates selection - removes IDs that no longer exist
 */
export function validateSelection(
  elements: BuilderElement[],
  selectedIds: string[]
): string[] {
  const allIds = new Set(flattenElements(elements).map(el => el.id));
  return selectedIds.filter(id => allIds.has(id));
}

/**
 * Gets common ancestors of selected elements
 */
export function getCommonAncestor(
  elements: BuilderElement[],
  selectedIds: string[]
): BuilderElement | null {
  if (selectedIds.length === 0) {
    return null;
  }

  if (selectedIds.length === 1) {
    return findParent(elements, selectedIds[0]);
  }

  // Get ancestor chains for all selected elements
  const ancestorChains = selectedIds.map(id => getAncestorChain(elements, id));

  // Find common ancestors
  const firstChain = ancestorChains[0];

  for (let i = firstChain.length - 1; i >= 0; i--) {
    const potentialAncestor = firstChain[i];
    const isCommon = ancestorChains.every(chain =>
      chain.some(el => el.id === potentialAncestor.id)
    );

    if (isCommon) {
      return potentialAncestor;
    }
  }

  return null;
}

/**
 * Gets the ancestor chain for an element
 */
export function getAncestorChain(
  elements: BuilderElement[],
  id: string
): BuilderElement[] {
  const chain: BuilderElement[] = [];
  let currentId: string | null = id;

  while (currentId) {
    const parent = findParent(elements, currentId);
    if (parent) {
      chain.push(parent);
      currentId = parent.id;
    } else {
      break;
    }
  }

  return chain;
}

// ============================================================================
// Keyboard Shortcuts Helpers
// ============================================================================

/**
 * Detects if the modifier key (Ctrl on Windows, Cmd on Mac) is pressed
 */
export function isModifierKey(event: KeyboardEvent | MouseEvent): boolean {
  const isMac = typeof navigator !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  return isMac ? event.metaKey : event.ctrlKey;
}

/**
 * Gets selection modifiers from an event
 */
export function getSelectionModifiers(event: KeyboardEvent | MouseEvent): {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
} {
  return {
    ctrl: isModifierKey(event),
    shift: event.shiftKey,
    alt: event.altKey,
  };
}

// ============================================================================
// Selection History for Undo/Redo
// ============================================================================

export interface SelectionHistory {
  past: string[][];
  present: string[];
  future: string[][];
}

export function createSelectionHistory(initial: string[] = []): SelectionHistory {
  return {
    past: [],
    present: initial,
    future: [],
  };
}

export function pushSelectionHistory(
  history: SelectionHistory,
  newSelection: string[]
): SelectionHistory {
  return {
    past: [...history.past, history.present],
    present: newSelection,
    future: [],
  };
}

export function undoSelection(history: SelectionHistory): SelectionHistory {
  if (history.past.length === 0) {
    return history;
  }

  const newPast = [...history.past];
  const previous = newPast.pop()!;

  return {
    past: newPast,
    present: previous,
    future: [history.present, ...history.future],
  };
}

export function redoSelection(history: SelectionHistory): SelectionHistory {
  if (history.future.length === 0) {
    return history;
  }

  const newFuture = [...history.future];
  const next = newFuture.shift()!;

  return {
    past: [...history.past, history.present],
    present: next,
    future: newFuture,
  };
}
