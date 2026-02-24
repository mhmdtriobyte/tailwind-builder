/**
 * Group Operations for Tailwind Builder
 *
 * Provides operations that work on multiple selected elements:
 * - Move, delete, duplicate multiple elements
 * - Apply styles to multiple elements
 * - Align and distribute elements
 * - Group/ungroup operations
 * - Lock/unlock and hide/show operations
 */

import type { BuilderElement, ElementStyles } from '@/types/builder';
import { findElementById, findParent, flattenElements } from './selectionSystem';

// ============================================================================
// Types
// ============================================================================

export type AlignmentType =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';

export type DistributionType =
  | 'horizontal'
  | 'vertical'
  | 'horizontal-spacing'
  | 'vertical-spacing';

export type SizeMatchType =
  | 'width'
  | 'height'
  | 'both';

export interface ElementPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GroupOperationResult<T = BuilderElement[]> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface StyleUpdate {
  category: keyof ElementStyles;
  classes: string[];
  mode: 'replace' | 'add' | 'remove';
}

export interface ElementMetadata {
  locked: boolean;
  hidden: boolean;
  collapsed: boolean;
}

// ============================================================================
// Batch Element Operations
// ============================================================================

/**
 * Deletes multiple elements from the tree
 */
export function deleteMultipleElements(
  elements: BuilderElement[],
  idsToDelete: string[]
): GroupOperationResult {
  if (idsToDelete.length === 0) {
    return { success: false, error: 'No elements to delete' };
  }

  const idsSet = new Set(idsToDelete);

  function removeElements(elements: BuilderElement[]): BuilderElement[] {
    return elements
      .filter(el => !idsSet.has(el.id))
      .map(el => ({
        ...el,
        children: removeElements(el.children),
      }));
  }

  const newElements = removeElements(elements);
  return { success: true, data: newElements };
}

/**
 * Duplicates multiple elements
 */
export function duplicateMultipleElements(
  elements: BuilderElement[],
  idsToDuplicate: string[],
  generateId: () => string
): GroupOperationResult<{ elements: BuilderElement[]; newIds: string[] }> {
  if (idsToDuplicate.length === 0) {
    return { success: false, error: 'No elements to duplicate' };
  }

  const newIds: string[] = [];
  let newElements = [...elements];

  // Sort by depth to duplicate in correct order (parents before children)
  const sortedIds = sortByDepth(elements, idsToDuplicate);

  for (const id of sortedIds) {
    const element = findElementById(newElements, id);
    if (!element) continue;

    const clone = deepCloneElement(element, generateId);
    newIds.push(clone.id);

    const parent = findParent(newElements, id);
    const siblings = parent ? parent.children : newElements;
    const index = siblings.findIndex(el => el.id === id);

    if (parent) {
      newElements = updateElementInTree(newElements, parent.id, {
        children: [
          ...parent.children.slice(0, index + 1),
          { ...clone, parentId: parent.id },
          ...parent.children.slice(index + 1),
        ],
      });
    } else {
      newElements = [
        ...newElements.slice(0, index + 1),
        { ...clone, parentId: null },
        ...newElements.slice(index + 1),
      ];
    }
  }

  return { success: true, data: { elements: newElements, newIds } };
}

/**
 * Moves multiple elements to a new parent
 */
export function moveMultipleElements(
  elements: BuilderElement[],
  idsToMove: string[],
  targetParentId: string | null,
  insertIndex?: number
): GroupOperationResult {
  if (idsToMove.length === 0) {
    return { success: false, error: 'No elements to move' };
  }

  // Prevent moving an element into its own descendant
  for (const id of idsToMove) {
    if (targetParentId && isDescendantOf(elements, id, targetParentId)) {
      return { success: false, error: 'Cannot move element into its own descendant' };
    }
  }

  // Extract elements to move
  const elementsToMove: BuilderElement[] = [];
  let newElements = [...elements];

  for (const id of idsToMove) {
    const element = findElementById(newElements, id);
    if (element) {
      elementsToMove.push(element);
      newElements = removeElementFromTree(newElements, id);
    }
  }

  // Insert into new location
  if (targetParentId) {
    const targetParent = findElementById(newElements, targetParentId);
    if (!targetParent) {
      return { success: false, error: 'Target parent not found' };
    }

    const updatedChildren = [...targetParent.children];
    const idx = typeof insertIndex === 'number'
      ? Math.min(insertIndex, updatedChildren.length)
      : updatedChildren.length;

    updatedChildren.splice(
      idx,
      0,
      ...elementsToMove.map(el => ({ ...el, parentId: targetParentId }))
    );

    newElements = updateElementInTree(newElements, targetParentId, {
      children: updatedChildren,
    });
  } else {
    const idx = typeof insertIndex === 'number'
      ? Math.min(insertIndex, newElements.length)
      : newElements.length;

    newElements.splice(
      idx,
      0,
      ...elementsToMove.map(el => ({ ...el, parentId: null }))
    );
  }

  return { success: true, data: newElements };
}

// ============================================================================
// Style Operations
// ============================================================================

/**
 * Applies style updates to multiple elements
 */
export function applyStylesToMultiple(
  elements: BuilderElement[],
  targetIds: string[],
  styleUpdate: StyleUpdate
): GroupOperationResult {
  if (targetIds.length === 0) {
    return { success: false, error: 'No elements to update' };
  }

  let newElements = [...elements];

  for (const id of targetIds) {
    const element = findElementById(newElements, id);
    if (!element) continue;

    let newClasses: string[];
    const currentClasses = element.styles[styleUpdate.category] as string[];

    switch (styleUpdate.mode) {
      case 'replace':
        newClasses = styleUpdate.classes;
        break;
      case 'add':
        newClasses = [...new Set([...currentClasses, ...styleUpdate.classes])];
        break;
      case 'remove':
        newClasses = currentClasses.filter(c => !styleUpdate.classes.includes(c));
        break;
    }

    newElements = updateElementInTree(newElements, id, {
      styles: {
        ...element.styles,
        [styleUpdate.category]: newClasses,
      },
    });
  }

  return { success: true, data: newElements };
}

/**
 * Copies styles from one element to multiple others
 */
export function copyStylesToMultiple(
  elements: BuilderElement[],
  sourceId: string,
  targetIds: string[],
  categories?: (keyof ElementStyles)[]
): GroupOperationResult {
  const source = findElementById(elements, sourceId);
  if (!source) {
    return { success: false, error: 'Source element not found' };
  }

  let newElements = [...elements];
  const categoriesToCopy = categories || [
    'layout',
    'spacing',
    'typography',
    'colors',
    'borders',
    'effects',
  ];

  for (const id of targetIds) {
    if (id === sourceId) continue;

    const element = findElementById(newElements, id);
    if (!element) continue;

    const newStyles = { ...element.styles };
    for (const category of categoriesToCopy) {
      if (category === 'responsive') {
        newStyles.responsive = { ...source.styles.responsive };
      } else {
        newStyles[category] = [...source.styles[category]];
      }
    }

    newElements = updateElementInTree(newElements, id, { styles: newStyles });
  }

  return { success: true, data: newElements };
}

// ============================================================================
// Alignment Operations
// ============================================================================

/**
 * Aligns multiple elements
 * Note: Returns Tailwind classes to apply for alignment
 */
export function alignElements(
  positions: ElementPosition[],
  alignment: AlignmentType
): Map<string, { x?: number; y?: number }> {
  if (positions.length < 2) {
    return new Map();
  }

  const adjustments = new Map<string, { x?: number; y?: number }>();

  // Calculate bounds
  const bounds = {
    left: Math.min(...positions.map(p => p.x)),
    right: Math.max(...positions.map(p => p.x + p.width)),
    top: Math.min(...positions.map(p => p.y)),
    bottom: Math.max(...positions.map(p => p.y + p.height)),
  };

  const centerX = (bounds.left + bounds.right) / 2;
  const centerY = (bounds.top + bounds.bottom) / 2;

  for (const pos of positions) {
    let adjustment: { x?: number; y?: number } = {};

    switch (alignment) {
      case 'left':
        adjustment.x = bounds.left;
        break;
      case 'center':
        adjustment.x = centerX - pos.width / 2;
        break;
      case 'right':
        adjustment.x = bounds.right - pos.width;
        break;
      case 'top':
        adjustment.y = bounds.top;
        break;
      case 'middle':
        adjustment.y = centerY - pos.height / 2;
        break;
      case 'bottom':
        adjustment.y = bounds.bottom - pos.height;
        break;
    }

    adjustments.set(pos.id, adjustment);
  }

  return adjustments;
}

/**
 * Gets Tailwind alignment classes for container-based alignment
 */
export function getAlignmentClasses(alignment: AlignmentType): string[] {
  switch (alignment) {
    case 'left':
      return ['items-start'];
    case 'center':
      return ['items-center'];
    case 'right':
      return ['items-end'];
    case 'top':
      return ['justify-start'];
    case 'middle':
      return ['justify-center'];
    case 'bottom':
      return ['justify-end'];
    default:
      return [];
  }
}

// ============================================================================
// Distribution Operations
// ============================================================================

/**
 * Distributes elements evenly
 */
export function distributeElements(
  positions: ElementPosition[],
  distribution: DistributionType
): Map<string, { x?: number; y?: number }> {
  if (positions.length < 3) {
    return new Map();
  }

  const adjustments = new Map<string, { x?: number; y?: number }>();
  const sorted = [...positions];

  if (distribution === 'horizontal' || distribution === 'horizontal-spacing') {
    sorted.sort((a, b) => a.x - b.x);

    if (distribution === 'horizontal') {
      // Distribute by center
      const totalWidth = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width - sorted[0].x;
      const totalElementWidth = sorted.reduce((sum, p) => sum + p.width, 0);
      const spacing = (totalWidth - totalElementWidth) / (sorted.length - 1);

      let currentX = sorted[0].x;
      for (const pos of sorted) {
        adjustments.set(pos.id, { x: currentX });
        currentX += pos.width + spacing;
      }
    } else {
      // Distribute with equal spacing
      const leftMost = sorted[0].x;
      const rightMost = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width;
      const totalSpace = rightMost - leftMost;
      const spacing = totalSpace / (sorted.length - 1);

      sorted.forEach((pos, index) => {
        adjustments.set(pos.id, { x: leftMost + spacing * index - pos.width / 2 });
      });
    }
  } else {
    sorted.sort((a, b) => a.y - b.y);

    if (distribution === 'vertical') {
      const totalHeight = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height - sorted[0].y;
      const totalElementHeight = sorted.reduce((sum, p) => sum + p.height, 0);
      const spacing = (totalHeight - totalElementHeight) / (sorted.length - 1);

      let currentY = sorted[0].y;
      for (const pos of sorted) {
        adjustments.set(pos.id, { y: currentY });
        currentY += pos.height + spacing;
      }
    } else {
      const topMost = sorted[0].y;
      const bottomMost = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height;
      const totalSpace = bottomMost - topMost;
      const spacing = totalSpace / (sorted.length - 1);

      sorted.forEach((pos, index) => {
        adjustments.set(pos.id, { y: topMost + spacing * index - pos.height / 2 });
      });
    }
  }

  return adjustments;
}

/**
 * Gets Tailwind gap/spacing classes for distribution
 */
export function getDistributionClasses(distribution: DistributionType): string[] {
  switch (distribution) {
    case 'horizontal':
      return ['flex', 'flex-row', 'justify-between'];
    case 'vertical':
      return ['flex', 'flex-col', 'justify-between'];
    case 'horizontal-spacing':
      return ['flex', 'flex-row', 'justify-evenly'];
    case 'vertical-spacing':
      return ['flex', 'flex-col', 'justify-evenly'];
    default:
      return [];
  }
}

// ============================================================================
// Size Matching Operations
// ============================================================================

/**
 * Matches sizes of selected elements to the first selected
 */
export function matchSizes(
  elements: BuilderElement[],
  selectedIds: string[],
  matchType: SizeMatchType
): GroupOperationResult {
  if (selectedIds.length < 2) {
    return { success: false, error: 'Need at least 2 elements to match sizes' };
  }

  const referenceElement = findElementById(elements, selectedIds[0]);
  if (!referenceElement) {
    return { success: false, error: 'Reference element not found' };
  }

  let newElements = [...elements];
  const refClasses = [...referenceElement.styles.layout];

  // Extract size classes from reference
  const widthClass = refClasses.find(c => c.startsWith('w-'));
  const heightClass = refClasses.find(c => c.startsWith('h-'));

  for (let i = 1; i < selectedIds.length; i++) {
    const element = findElementById(newElements, selectedIds[i]);
    if (!element) continue;

    let newLayoutClasses = [...element.styles.layout];

    if (matchType === 'width' || matchType === 'both') {
      newLayoutClasses = newLayoutClasses.filter(c => !c.startsWith('w-'));
      if (widthClass) {
        newLayoutClasses.push(widthClass);
      }
    }

    if (matchType === 'height' || matchType === 'both') {
      newLayoutClasses = newLayoutClasses.filter(c => !c.startsWith('h-'));
      if (heightClass) {
        newLayoutClasses.push(heightClass);
      }
    }

    newElements = updateElementInTree(newElements, selectedIds[i], {
      styles: {
        ...element.styles,
        layout: newLayoutClasses,
      },
    });
  }

  return { success: true, data: newElements };
}

// ============================================================================
// Group/Ungroup Operations
// ============================================================================

/**
 * Groups selected elements into a container
 */
export function groupElements(
  elements: BuilderElement[],
  selectedIds: string[],
  generateId: () => string,
  containerType: string = 'container'
): GroupOperationResult<{ elements: BuilderElement[]; groupId: string }> {
  if (selectedIds.length < 2) {
    return { success: false, error: 'Need at least 2 elements to group' };
  }

  // Find common parent
  const parents = selectedIds.map(id => findParent(elements, id));
  const commonParentId = parents[0]?.id || null;

  // Verify all elements share the same parent
  const allSameParent = parents.every(p => (p?.id || null) === commonParentId);
  if (!allSameParent) {
    return { success: false, error: 'All elements must have the same parent to group' };
  }

  // Get elements to group in order
  const siblings = commonParentId
    ? findElementById(elements, commonParentId)?.children || []
    : elements;

  const elementsToGroup: BuilderElement[] = [];
  let insertIndex = siblings.length;

  for (let i = 0; i < siblings.length; i++) {
    if (selectedIds.includes(siblings[i].id)) {
      elementsToGroup.push(siblings[i]);
      insertIndex = Math.min(insertIndex, i);
    }
  }

  // Remove elements from their current position
  let newElements = [...elements];
  for (const id of selectedIds) {
    newElements = removeElementFromTree(newElements, id);
  }

  // Create group container
  const groupId = generateId();
  const group: BuilderElement = {
    id: groupId,
    type: containerType,
    name: `Group (${elementsToGroup.length} items)`,
    props: {},
    styles: {
      layout: ['flex', 'flex-col', 'gap-2'],
      spacing: ['p-2'],
      typography: [],
      colors: [],
      borders: ['border', 'border-dashed', 'border-gray-300'],
      effects: [],
      responsive: { sm: [], md: [], lg: [] },
    },
    children: elementsToGroup.map(el => ({ ...el, parentId: groupId })),
    parentId: commonParentId,
  };

  // Insert group at the position of first element
  if (commonParentId) {
    const parent = findElementById(newElements, commonParentId);
    if (parent) {
      const updatedChildren = [...parent.children];
      updatedChildren.splice(insertIndex, 0, group);
      newElements = updateElementInTree(newElements, commonParentId, {
        children: updatedChildren,
      });
    }
  } else {
    newElements.splice(insertIndex, 0, group);
  }

  return { success: true, data: { elements: newElements, groupId } };
}

/**
 * Ungroups a container, moving its children to the parent level
 */
export function ungroupElement(
  elements: BuilderElement[],
  groupId: string
): GroupOperationResult<{ elements: BuilderElement[]; childIds: string[] }> {
  const group = findElementById(elements, groupId);
  if (!group) {
    return { success: false, error: 'Group element not found' };
  }

  if (group.children.length === 0) {
    return { success: false, error: 'Element has no children to ungroup' };
  }

  const parent = findParent(elements, groupId);
  const siblings = parent ? parent.children : elements;
  const groupIndex = siblings.findIndex(el => el.id === groupId);

  // Remove the group
  let newElements = removeElementFromTree(elements, groupId);

  // Insert children at group's position
  const childIds = group.children.map(child => child.id);
  const childrenToInsert = group.children.map(child => ({
    ...child,
    parentId: parent?.id || null,
  }));

  if (parent) {
    const parentElement = findElementById(newElements, parent.id);
    if (parentElement) {
      const updatedChildren = [...parentElement.children];
      updatedChildren.splice(groupIndex, 0, ...childrenToInsert);
      newElements = updateElementInTree(newElements, parent.id, {
        children: updatedChildren,
      });
    }
  } else {
    newElements.splice(groupIndex, 0, ...childrenToInsert);
  }

  return { success: true, data: { elements: newElements, childIds } };
}

// ============================================================================
// Lock/Unlock Operations
// ============================================================================

/**
 * Updates metadata for multiple elements
 * Note: This assumes metadata is stored in element props
 */
export function updateMultipleMetadata(
  elements: BuilderElement[],
  targetIds: string[],
  metadata: Partial<ElementMetadata>
): GroupOperationResult {
  if (targetIds.length === 0) {
    return { success: false, error: 'No elements to update' };
  }

  let newElements = [...elements];

  for (const id of targetIds) {
    const element = findElementById(newElements, id);
    if (!element) continue;

    newElements = updateElementInTree(newElements, id, {
      props: {
        ...element.props,
        _metadata: {
          ...(element.props._metadata as ElementMetadata || {}),
          ...metadata,
        },
      },
    });
  }

  return { success: true, data: newElements };
}

/**
 * Locks multiple elements
 */
export function lockMultipleElements(
  elements: BuilderElement[],
  targetIds: string[]
): GroupOperationResult {
  return updateMultipleMetadata(elements, targetIds, { locked: true });
}

/**
 * Unlocks multiple elements
 */
export function unlockMultipleElements(
  elements: BuilderElement[],
  targetIds: string[]
): GroupOperationResult {
  return updateMultipleMetadata(elements, targetIds, { locked: false });
}

/**
 * Hides multiple elements
 */
export function hideMultipleElements(
  elements: BuilderElement[],
  targetIds: string[]
): GroupOperationResult {
  return updateMultipleMetadata(elements, targetIds, { hidden: true });
}

/**
 * Shows multiple elements
 */
export function showMultipleElements(
  elements: BuilderElement[],
  targetIds: string[]
): GroupOperationResult {
  return updateMultipleMetadata(elements, targetIds, { hidden: false });
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Deep clones an element with new IDs
 */
export function deepCloneElement(
  element: BuilderElement,
  generateId: () => string
): BuilderElement {
  const newId = generateId();
  return {
    ...element,
    id: newId,
    name: `${element.name} (copy)`,
    children: element.children.map(child => ({
      ...deepCloneElement(child, generateId),
      parentId: newId,
    })),
    parentId: null,
  };
}

/**
 * Updates an element in the tree
 */
export function updateElementInTree(
  elements: BuilderElement[],
  id: string,
  updates: Partial<BuilderElement>
): BuilderElement[] {
  return elements.map(el => {
    if (el.id === id) {
      return { ...el, ...updates };
    }
    return {
      ...el,
      children: updateElementInTree(el.children, id, updates),
    };
  });
}

/**
 * Removes an element from the tree
 */
export function removeElementFromTree(
  elements: BuilderElement[],
  id: string
): BuilderElement[] {
  return elements
    .filter(el => el.id !== id)
    .map(el => ({
      ...el,
      children: removeElementFromTree(el.children, id),
    }));
}

/**
 * Checks if ancestorId is an ancestor of descendantId
 */
export function isDescendantOf(
  elements: BuilderElement[],
  ancestorId: string,
  descendantId: string
): boolean {
  const ancestor = findElementById(elements, ancestorId);
  if (!ancestor) return false;

  const checkDescendants = (children: BuilderElement[]): boolean => {
    for (const child of children) {
      if (child.id === descendantId) return true;
      if (checkDescendants(child.children)) return true;
    }
    return false;
  };

  return checkDescendants(ancestor.children);
}

/**
 * Sorts element IDs by depth (shallow first)
 */
export function sortByDepth(
  elements: BuilderElement[],
  ids: string[]
): string[] {
  const flat = flattenElements(elements);
  const indexMap = new Map(flat.map((el, i) => [el.id, i]));

  return [...ids].sort((a, b) => {
    const indexA = indexMap.get(a) ?? Infinity;
    const indexB = indexMap.get(b) ?? Infinity;
    return indexA - indexB;
  });
}

/**
 * Gets the topmost selected elements (filters out descendants)
 */
export function getTopmostElements(
  elements: BuilderElement[],
  selectedIds: string[]
): string[] {
  return selectedIds.filter(id => {
    // Check if any other selected element is an ancestor
    return !selectedIds.some(otherId =>
      otherId !== id && isDescendantOf(elements, otherId, id)
    );
  });
}

/**
 * Reorders elements within their parent
 */
export function reorderElements(
  elements: BuilderElement[],
  idsToReorder: string[],
  direction: 'up' | 'down' | 'top' | 'bottom'
): GroupOperationResult {
  if (idsToReorder.length === 0) {
    return { success: false, error: 'No elements to reorder' };
  }

  // Group elements by parent
  const byParent = new Map<string | null, string[]>();

  for (const id of idsToReorder) {
    const parent = findParent(elements, id);
    const parentId = parent?.id || null;

    if (!byParent.has(parentId)) {
      byParent.set(parentId, []);
    }
    byParent.get(parentId)!.push(id);
  }

  let newElements = [...elements];

  for (const [parentId, ids] of byParent) {
    const siblings = parentId
      ? findElementById(newElements, parentId)?.children || []
      : newElements;

    const reordered = reorderSiblings(siblings, ids, direction);

    if (parentId) {
      newElements = updateElementInTree(newElements, parentId, {
        children: reordered,
      });
    } else {
      newElements = reordered;
    }
  }

  return { success: true, data: newElements };
}

/**
 * Reorders siblings within an array
 */
function reorderSiblings(
  siblings: BuilderElement[],
  idsToMove: string[],
  direction: 'up' | 'down' | 'top' | 'bottom'
): BuilderElement[] {
  const result = [...siblings];
  const idsSet = new Set(idsToMove);

  // Get indices of elements to move
  const indices = siblings
    .map((el, i) => idsSet.has(el.id) ? i : -1)
    .filter(i => i !== -1);

  if (indices.length === 0) return result;

  switch (direction) {
    case 'top': {
      // Move all to top
      const toMove = indices.map(i => result[i]);
      const remaining = result.filter((_, i) => !indices.includes(i));
      return [...toMove, ...remaining];
    }
    case 'bottom': {
      // Move all to bottom
      const toMove = indices.map(i => result[i]);
      const remaining = result.filter((_, i) => !indices.includes(i));
      return [...remaining, ...toMove];
    }
    case 'up': {
      // Move each up by one (process from top to bottom)
      for (const idx of indices.sort((a, b) => a - b)) {
        if (idx > 0 && !idsSet.has(result[idx - 1].id)) {
          [result[idx - 1], result[idx]] = [result[idx], result[idx - 1]];
        }
      }
      return result;
    }
    case 'down': {
      // Move each down by one (process from bottom to top)
      for (const idx of indices.sort((a, b) => b - a)) {
        if (idx < result.length - 1 && !idsSet.has(result[idx + 1].id)) {
          [result[idx], result[idx + 1]] = [result[idx + 1], result[idx]];
        }
      }
      return result;
    }
  }
}

/**
 * Wraps selected elements in a container
 */
export function wrapInContainer(
  elements: BuilderElement[],
  selectedIds: string[],
  generateId: () => string,
  containerType: string = 'container'
): GroupOperationResult<{ elements: BuilderElement[]; containerId: string }> {
  return groupElements(elements, selectedIds, generateId, containerType);
}

/**
 * Flattens nested structure (opposite of wrap)
 */
export function flattenStructure(
  elements: BuilderElement[],
  containerId: string
): GroupOperationResult<{ elements: BuilderElement[]; childIds: string[] }> {
  return ungroupElement(elements, containerId);
}
