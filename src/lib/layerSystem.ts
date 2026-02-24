/**
 * Layer System for the Visual Builder
 *
 * This module provides a comprehensive layer management system similar to
 * Photoshop/Figma, with support for:
 * - Layer tree structure (mirrors elements)
 * - Layer naming and renaming
 * - Layer visibility (eye icon)
 * - Layer locking (lock icon)
 * - Layer ordering (z-index)
 * - Layer grouping
 * - Layer colors/labels
 * - Layer search/filter
 * - Collapse/expand groups
 */

import type { BuilderElement } from '@/types/builder';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Color labels for layers (similar to Photoshop/Figma)
 */
export type LayerColor =
  | 'none'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink';

/**
 * Layer state that extends the BuilderElement with layer-specific properties
 */
export interface LayerState {
  /** Whether the layer is visible */
  visible: boolean;
  /** Whether the layer is locked (not selectable/editable) */
  locked: boolean;
  /** Whether the layer/group is expanded in the tree view */
  expanded: boolean;
  /** Color label for visual organization */
  color: LayerColor;
  /** Custom name for the layer (overrides element name) */
  customName: string | null;
}

/**
 * Layer node representation combining element with layer state
 */
export interface LayerNode {
  /** Reference to the element ID */
  elementId: string;
  /** Element type */
  type: string;
  /** Display name (custom or element name) */
  name: string;
  /** Layer state */
  state: LayerState;
  /** Child layers */
  children: LayerNode[];
  /** Depth in the tree (0 = root) */
  depth: number;
  /** Whether this is a container element */
  isContainer: boolean;
  /** Parent element ID */
  parentId: string | null;
}

/**
 * Layer tree representing the entire layer structure
 */
export interface LayerTree {
  /** Root layer nodes */
  nodes: LayerNode[];
  /** Flattened list of all layer IDs for quick access */
  flatIds: string[];
  /** Total count of layers */
  count: number;
}

/**
 * Layer states map stored in the builder store
 */
export type LayerStatesMap = Record<string, LayerState>;

/**
 * Search/filter options for layers
 */
export interface LayerSearchOptions {
  /** Search query string */
  query: string;
  /** Filter by color label */
  colorFilter: LayerColor | 'all';
  /** Show only visible layers */
  visibleOnly: boolean;
  /** Show only locked layers */
  lockedOnly: boolean;
}

/**
 * Layer reorder operation
 */
export interface LayerReorderOperation {
  /** ID of the layer being moved */
  sourceId: string;
  /** ID of the target layer (drop location) */
  targetId: string;
  /** Position relative to target */
  position: 'before' | 'after' | 'inside';
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default layer state for new layers
 */
export const DEFAULT_LAYER_STATE: LayerState = {
  visible: true,
  locked: false,
  expanded: true,
  color: 'none',
  customName: null,
};

/**
 * Layer color definitions with CSS values
 */
export const LAYER_COLORS: Record<LayerColor, { bg: string; border: string; text: string }> = {
  none: { bg: 'transparent', border: 'transparent', text: 'text-gray-400' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' },
  orange: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400' },
  yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400' },
  green: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400' },
  pink: { bg: 'bg-pink-500/20', border: 'border-pink-500', text: 'text-pink-400' },
};

/**
 * Element type to icon mapping for layer display
 */
export const ELEMENT_TYPE_ICONS: Record<string, string> = {
  // Layout
  container: 'layout',
  'grid-2-col': 'grid',
  'grid-3-col': 'grid',
  'grid-4-col': 'grid',
  'flex-row': 'rows',
  'flex-column': 'columns',
  divider: 'minus',
  spacer: 'space',

  // Buttons
  'primary-button': 'button',
  'secondary-button': 'button',
  'outline-button': 'button',
  'ghost-button': 'button',
  'icon-button': 'button',
  'loading-button': 'button',
  'gradient-button': 'button',
  'button-group': 'buttons',

  // Cards
  'simple-card': 'card',
  'product-card': 'card',
  'pricing-card': 'card',
  'testimonial-card': 'card',
  'profile-card': 'card',
  'blog-card': 'card',
  'stats-card': 'card',
  'feature-card': 'card',
  'image-card': 'card',
  'horizontal-card': 'card',

  // Navigation
  navbar: 'navigation',
  'mobile-menu': 'menu',
  footer: 'footer',
  breadcrumb: 'breadcrumb',
  tabs: 'tabs',
  pagination: 'pagination',

  // Forms
  'input-field': 'input',
  textarea: 'text',
  'select-dropdown': 'select',
  checkbox: 'checkbox',
  'radio-group': 'radio',
  'toggle-switch': 'toggle',
  'search-bar': 'search',
  'login-form': 'form',
  'signup-form': 'form',
  'contact-form': 'form',
  'newsletter-form': 'form',
  'file-upload': 'upload',

  // Sections
  'hero-section': 'section',
  'hero-with-image': 'section',
  'feature-section': 'section',
  'cta-section': 'section',
  'stats-section': 'section',
  'testimonials-section': 'section',
  'team-section': 'section',
  'faq-section': 'section',
  'pricing-section': 'section',
  'contact-section': 'section',

  // Media
  image: 'image',
  avatar: 'avatar',
  icon: 'icon',
  video: 'video',

  // Text
  heading: 'heading',
  paragraph: 'paragraph',
  badge: 'badge',
  link: 'link',
  list: 'list',
};

/**
 * Container element types that can have children
 */
export const CONTAINER_TYPES = new Set([
  'container',
  'grid-2-col',
  'grid-3-col',
  'grid-4-col',
  'flex-row',
  'flex-column',
  'button-group',
]);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if an element type is a container
 */
export function isContainerType(type: string): boolean {
  return CONTAINER_TYPES.has(type);
}

/**
 * Get the icon name for an element type
 */
export function getElementIcon(type: string): string {
  return ELEMENT_TYPE_ICONS[type] || 'component';
}

/**
 * Create a default layer state for a new element
 */
export function createDefaultLayerState(): LayerState {
  return { ...DEFAULT_LAYER_STATE };
}

/**
 * Get or create layer state for an element
 */
export function getLayerState(
  layerStates: LayerStatesMap,
  elementId: string
): LayerState {
  return layerStates[elementId] || createDefaultLayerState();
}

/**
 * Build a layer node from an element
 */
export function buildLayerNode(
  element: BuilderElement,
  layerStates: LayerStatesMap,
  depth: number = 0
): LayerNode {
  const state = getLayerState(layerStates, element.id);
  const isContainer = isContainerType(element.type);

  return {
    elementId: element.id,
    type: element.type,
    name: state.customName || element.name,
    state,
    children: element.children.map((child) =>
      buildLayerNode(child, layerStates, depth + 1)
    ),
    depth,
    isContainer,
    parentId: element.parentId,
  };
}

/**
 * Build the complete layer tree from elements
 */
export function buildLayerTree(
  elements: BuilderElement[],
  layerStates: LayerStatesMap
): LayerTree {
  const nodes = elements.map((el) => buildLayerNode(el, layerStates, 0));

  // Flatten all IDs recursively
  const flatIds: string[] = [];
  function collectIds(layerNodes: LayerNode[]) {
    for (const node of layerNodes) {
      flatIds.push(node.elementId);
      collectIds(node.children);
    }
  }
  collectIds(nodes);

  return {
    nodes,
    flatIds,
    count: flatIds.length,
  };
}

/**
 * Flatten layer tree for virtualized rendering
 */
export function flattenLayerTree(
  nodes: LayerNode[],
  expandedIds: Set<string>
): LayerNode[] {
  const result: LayerNode[] = [];

  function traverse(layerNodes: LayerNode[]) {
    for (const node of layerNodes) {
      result.push(node);

      // Only traverse children if expanded
      if (node.isContainer && node.state.expanded && node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(nodes);
  return result;
}

/**
 * Search/filter layers based on options
 */
export function filterLayers(
  nodes: LayerNode[],
  options: LayerSearchOptions
): LayerNode[] {
  const { query, colorFilter, visibleOnly, lockedOnly } = options;
  const queryLower = query.toLowerCase().trim();

  function filterNode(node: LayerNode): LayerNode | null {
    // Apply filters
    if (visibleOnly && !node.state.visible) return null;
    if (lockedOnly && !node.state.locked) return null;
    if (colorFilter !== 'all' && node.state.color !== colorFilter) return null;

    // Check query match on this node
    const nameMatches = !queryLower || node.name.toLowerCase().includes(queryLower);
    const typeMatches = !queryLower || node.type.toLowerCase().includes(queryLower);

    // Filter children recursively
    const filteredChildren = node.children
      .map(filterNode)
      .filter((n): n is LayerNode => n !== null);

    // Include node if it matches or has matching children
    if (nameMatches || typeMatches || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      };
    }

    return null;
  }

  return nodes
    .map(filterNode)
    .filter((n): n is LayerNode => n !== null);
}

/**
 * Find a layer node by element ID
 */
export function findLayerNode(
  nodes: LayerNode[],
  elementId: string
): LayerNode | null {
  for (const node of nodes) {
    if (node.elementId === elementId) return node;
    const found = findLayerNode(node.children, elementId);
    if (found) return found;
  }
  return null;
}

/**
 * Get all descendant IDs of a layer
 */
export function getDescendantIds(node: LayerNode): string[] {
  const ids: string[] = [];

  function collect(n: LayerNode) {
    for (const child of n.children) {
      ids.push(child.elementId);
      collect(child);
    }
  }

  collect(node);
  return ids;
}

/**
 * Get all ancestor IDs of a layer
 */
export function getAncestorIds(
  nodes: LayerNode[],
  elementId: string,
  ancestors: string[] = []
): string[] {
  for (const node of nodes) {
    if (node.elementId === elementId) {
      return ancestors;
    }

    const result = getAncestorIds(
      node.children,
      elementId,
      [...ancestors, node.elementId]
    );

    if (result.length > 0 || node.children.some((c) => c.elementId === elementId)) {
      return [...ancestors, node.elementId];
    }
  }

  return [];
}

/**
 * Calculate the z-index for a layer based on its position
 */
export function calculateZIndex(
  nodes: LayerNode[],
  elementId: string,
  baseIndex: number = 0
): number {
  let index = baseIndex;

  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];
    if (node.elementId === elementId) {
      return index;
    }
    index++;

    if (node.children.length > 0) {
      const childIndex = calculateZIndex(node.children, elementId, index);
      if (childIndex >= 0) {
        return childIndex;
      }
      index += countNodes(node.children);
    }
  }

  return -1;
}

/**
 * Count total nodes in a layer tree
 */
export function countNodes(nodes: LayerNode[]): number {
  let count = nodes.length;
  for (const node of nodes) {
    count += countNodes(node.children);
  }
  return count;
}

/**
 * Toggle visibility for a layer and optionally its descendants
 */
export function toggleLayerVisibility(
  layerStates: LayerStatesMap,
  elementId: string,
  visible?: boolean,
  includeDescendants: boolean = false,
  tree?: LayerTree
): LayerStatesMap {
  const currentState = getLayerState(layerStates, elementId);
  const newVisible = visible !== undefined ? visible : !currentState.visible;

  const updates: LayerStatesMap = {
    ...layerStates,
    [elementId]: {
      ...currentState,
      visible: newVisible,
    },
  };

  // Apply to descendants if requested
  if (includeDescendants && tree) {
    const node = findLayerNode(tree.nodes, elementId);
    if (node) {
      const descendantIds = getDescendantIds(node);
      for (const id of descendantIds) {
        const state = getLayerState(updates, id);
        updates[id] = {
          ...state,
          visible: newVisible,
        };
      }
    }
  }

  return updates;
}

/**
 * Toggle lock for a layer and optionally its descendants
 */
export function toggleLayerLock(
  layerStates: LayerStatesMap,
  elementId: string,
  locked?: boolean,
  includeDescendants: boolean = false,
  tree?: LayerTree
): LayerStatesMap {
  const currentState = getLayerState(layerStates, elementId);
  const newLocked = locked !== undefined ? locked : !currentState.locked;

  const updates: LayerStatesMap = {
    ...layerStates,
    [elementId]: {
      ...currentState,
      locked: newLocked,
    },
  };

  // Apply to descendants if requested
  if (includeDescendants && tree) {
    const node = findLayerNode(tree.nodes, elementId);
    if (node) {
      const descendantIds = getDescendantIds(node);
      for (const id of descendantIds) {
        const state = getLayerState(updates, id);
        updates[id] = {
          ...state,
          locked: newLocked,
        };
      }
    }
  }

  return updates;
}

/**
 * Toggle expanded state for a layer
 */
export function toggleLayerExpanded(
  layerStates: LayerStatesMap,
  elementId: string,
  expanded?: boolean
): LayerStatesMap {
  const currentState = getLayerState(layerStates, elementId);
  const newExpanded = expanded !== undefined ? expanded : !currentState.expanded;

  return {
    ...layerStates,
    [elementId]: {
      ...currentState,
      expanded: newExpanded,
    },
  };
}

/**
 * Expand all layers
 */
export function expandAllLayers(
  layerStates: LayerStatesMap,
  tree: LayerTree
): LayerStatesMap {
  const updates = { ...layerStates };

  for (const id of tree.flatIds) {
    const state = getLayerState(updates, id);
    updates[id] = {
      ...state,
      expanded: true,
    };
  }

  return updates;
}

/**
 * Collapse all layers
 */
export function collapseAllLayers(
  layerStates: LayerStatesMap,
  tree: LayerTree
): LayerStatesMap {
  const updates = { ...layerStates };

  for (const id of tree.flatIds) {
    const state = getLayerState(updates, id);
    updates[id] = {
      ...state,
      expanded: false,
    };
  }

  return updates;
}

/**
 * Set color label for a layer
 */
export function setLayerColor(
  layerStates: LayerStatesMap,
  elementId: string,
  color: LayerColor
): LayerStatesMap {
  const currentState = getLayerState(layerStates, elementId);

  return {
    ...layerStates,
    [elementId]: {
      ...currentState,
      color,
    },
  };
}

/**
 * Set custom name for a layer
 */
export function setLayerName(
  layerStates: LayerStatesMap,
  elementId: string,
  name: string | null
): LayerStatesMap {
  const currentState = getLayerState(layerStates, elementId);

  return {
    ...layerStates,
    [elementId]: {
      ...currentState,
      customName: name,
    },
  };
}

/**
 * Check if a layer is visible (considering parent visibility)
 */
export function isLayerVisible(
  layerStates: LayerStatesMap,
  elementId: string,
  tree: LayerTree
): boolean {
  const state = getLayerState(layerStates, elementId);
  if (!state.visible) return false;

  // Check all ancestors
  const ancestorIds = getAncestorIds(tree.nodes, elementId);
  for (const ancestorId of ancestorIds) {
    const ancestorState = getLayerState(layerStates, ancestorId);
    if (!ancestorState.visible) return false;
  }

  return true;
}

/**
 * Check if a layer is locked (considering parent lock)
 */
export function isLayerLocked(
  layerStates: LayerStatesMap,
  elementId: string,
  tree: LayerTree
): boolean {
  const state = getLayerState(layerStates, elementId);
  if (state.locked) return true;

  // Check all ancestors
  const ancestorIds = getAncestorIds(tree.nodes, elementId);
  for (const ancestorId of ancestorIds) {
    const ancestorState = getLayerState(layerStates, ancestorId);
    if (ancestorState.locked) return true;
  }

  return false;
}

/**
 * Select multiple layers (for multi-select operations)
 */
export function selectMultipleLayers(
  currentSelection: string[],
  elementId: string,
  shiftKey: boolean,
  ctrlKey: boolean,
  flattenedNodes: LayerNode[]
): string[] {
  // Ctrl+Click: Toggle individual selection
  if (ctrlKey) {
    if (currentSelection.includes(elementId)) {
      return currentSelection.filter((id) => id !== elementId);
    }
    return [...currentSelection, elementId];
  }

  // Shift+Click: Range selection
  if (shiftKey && currentSelection.length > 0) {
    const nodeIds = flattenedNodes.map((n) => n.elementId);
    const lastSelectedIndex = nodeIds.findIndex(
      (id) => id === currentSelection[currentSelection.length - 1]
    );
    const currentIndex = nodeIds.findIndex((id) => id === elementId);

    if (lastSelectedIndex >= 0 && currentIndex >= 0) {
      const start = Math.min(lastSelectedIndex, currentIndex);
      const end = Math.max(lastSelectedIndex, currentIndex);
      const rangeIds = nodeIds.slice(start, end + 1);

      // Merge with existing selection (avoiding duplicates)
      const merged = new Set([...currentSelection, ...rangeIds]);
      return Array.from(merged);
    }
  }

  // Normal click: Single selection
  return [elementId];
}

/**
 * Generate a unique layer name for duplicates
 */
export function generateUniqueName(
  baseName: string,
  existingNames: Set<string>
): string {
  if (!existingNames.has(baseName)) {
    return baseName;
  }

  // Check for existing numbered suffix
  const match = baseName.match(/^(.+)\s+(\d+)$/);
  let prefix = baseName;
  let counter = 2;

  if (match) {
    prefix = match[1];
    counter = parseInt(match[2], 10) + 1;
  }

  while (existingNames.has(`${prefix} ${counter}`)) {
    counter++;
  }

  return `${prefix} ${counter}`;
}

/**
 * Clean up layer states for removed elements
 */
export function cleanupLayerStates(
  layerStates: LayerStatesMap,
  validIds: Set<string>
): LayerStatesMap {
  const cleaned: LayerStatesMap = {};

  for (const [id, state] of Object.entries(layerStates)) {
    if (validIds.has(id)) {
      cleaned[id] = state;
    }
  }

  return cleaned;
}
