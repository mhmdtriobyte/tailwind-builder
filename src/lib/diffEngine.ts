/**
 * diffEngine.ts - Visual Diff System for Builder Elements
 *
 * A comprehensive diffing system that:
 * - Compares two element states
 * - Detects added, removed, and changed elements
 * - Highlights property differences
 * - Generates human-readable change descriptions
 * - Produces structured diff output for UI rendering
 */

import type { BuilderElement, ElementStyles } from '@/types/builder';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

/**
 * Type of change detected
 */
export type ChangeType = 'added' | 'removed' | 'modified' | 'moved' | 'unchanged';

/**
 * Severity/importance of a change
 */
export type ChangeSeverity = 'major' | 'minor' | 'trivial';

/**
 * A single property change
 */
export interface PropertyChange {
  path: string;
  property: string;
  oldValue: unknown;
  newValue: unknown;
  changeType: ChangeType;
  severity: ChangeSeverity;
  description: string;
}

/**
 * Changes for a single element
 */
export interface ElementDiff {
  elementId: string;
  elementType: string;
  elementName: string;
  changeType: ChangeType;
  propertyChanges: PropertyChange[];
  styleChanges: PropertyChange[];
  childChanges: ElementDiff[];
  oldElement?: BuilderElement;
  newElement?: BuilderElement;
  oldIndex?: number;
  newIndex?: number;
  parentId: string | null;
}

/**
 * Summary of all changes
 */
export interface DiffSummary {
  totalChanges: number;
  added: number;
  removed: number;
  modified: number;
  moved: number;
  majorChanges: number;
  minorChanges: number;
  affectedElements: string[];
}

/**
 * Complete diff result
 */
export interface DiffResult {
  timestamp: number;
  fromTimestamp?: number;
  toTimestamp?: number;
  elements: ElementDiff[];
  summary: DiffSummary;
  humanReadable: string[];
}

/**
 * Options for diff generation
 */
export interface DiffOptions {
  /** Include unchanged elements in output */
  includeUnchanged?: boolean;
  /** Deep compare children */
  deepCompare?: boolean;
  /** Include style changes */
  includeStyles?: boolean;
  /** Maximum depth to compare */
  maxDepth?: number;
  /** Ignore specific properties */
  ignoreProperties?: string[];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if two values are deeply equal
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b) return false;

  if (typeof a === 'object') {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => deepEqual(item, b[index]));
    }

    if (Array.isArray(a) || Array.isArray(b)) return false;

    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);

    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every((key) => deepEqual(aObj[key], bObj[key]));
  }

  return false;
}

/**
 * Get a human-readable label for a property
 */
function getPropertyLabel(property: string): string {
  const labels: Record<string, string> = {
    // Common props
    text: 'Text content',
    href: 'Link URL',
    src: 'Image source',
    alt: 'Alt text',
    placeholder: 'Placeholder',
    label: 'Label',
    title: 'Title',
    description: 'Description',
    name: 'Name',
    type: 'Type',
    variant: 'Variant',
    size: 'Size',
    color: 'Color',
    disabled: 'Disabled state',
    required: 'Required',
    checked: 'Checked state',

    // Styles
    layout: 'Layout styles',
    spacing: 'Spacing',
    typography: 'Typography',
    colors: 'Colors',
    borders: 'Borders',
    effects: 'Effects',
    responsive: 'Responsive styles',
  };

  return labels[property] || property.replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Format a value for display
 */
function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.length <= 3) return `[${value.map(formatValue).join(', ')}]`;
    return `[${value.slice(0, 2).map(formatValue).join(', ')}, ... +${value.length - 2}]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    if (keys.length <= 2) {
      return `{${keys.map((k) => `${k}: ${formatValue((value as Record<string, unknown>)[k])}`).join(', ')}}`;
    }
    return `{${keys.slice(0, 2).join(', ')}, ... +${keys.length - 2}}`;
  }
  return String(value);
}

/**
 * Determine the severity of a property change
 */
function determineSeverity(property: string, oldValue: unknown, newValue: unknown): ChangeSeverity {
  // Major changes - structural or very visible
  const majorProperties = ['type', 'children', 'parentId', 'src', 'href', 'text'];
  if (majorProperties.includes(property)) return 'major';

  // Minor changes - visible but less impactful
  const minorProperties = ['variant', 'size', 'color', 'label', 'placeholder'];
  if (minorProperties.includes(property)) return 'minor';

  // Style changes
  if (['layout', 'spacing', 'typography', 'colors', 'borders', 'effects'].includes(property)) {
    // Large style changes are major
    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      const diff = Math.abs(oldValue.length - newValue.length);
      if (diff > 3) return 'major';
    }
    return 'minor';
  }

  return 'trivial';
}

/**
 * Create a map of elements by ID
 */
function createElementMap(elements: BuilderElement[]): Map<string, BuilderElement> {
  const map = new Map<string, BuilderElement>();

  function addToMap(element: BuilderElement) {
    map.set(element.id, element);
    element.children.forEach(addToMap);
  }

  elements.forEach(addToMap);
  return map;
}

/**
 * Get the index of an element in a list
 */
function findElementIndex(elements: BuilderElement[], id: string): number {
  return elements.findIndex((e) => e.id === id);
}

/**
 * Flatten element tree to array
 */
function flattenElements(elements: BuilderElement[]): BuilderElement[] {
  const result: BuilderElement[] = [];

  function flatten(element: BuilderElement) {
    result.push(element);
    element.children.forEach(flatten);
  }

  elements.forEach(flatten);
  return result;
}

// ============================================================================
// DIFF ENGINE CLASS
// ============================================================================

/**
 * DiffEngine - Compares element states and generates detailed diffs
 */
export class DiffEngine {
  private options: DiffOptions;

  constructor(options?: DiffOptions) {
    this.options = {
      includeUnchanged: false,
      deepCompare: true,
      includeStyles: true,
      maxDepth: 10,
      ignoreProperties: ['id', 'parentId'],
      ...options,
    };
  }

  /**
   * Compare two element states and generate diff
   */
  compare(oldElements: BuilderElement[], newElements: BuilderElement[]): DiffResult {
    const oldMap = createElementMap(oldElements);
    const newMap = createElementMap(newElements);

    const elementDiffs: ElementDiff[] = [];
    const processedIds = new Set<string>();

    // Process all elements from both states
    const allIds = new Set([...Array.from(oldMap.keys()), ...Array.from(newMap.keys())]);

    allIds.forEach((id) => {
      if (processedIds.has(id)) return;

      const oldElement = oldMap.get(id);
      const newElement = newMap.get(id);

      const diff = this.compareElement(
        oldElement || null,
        newElement || null,
        oldElements,
        newElements,
        0
      );

      if (diff && (this.options.includeUnchanged || diff.changeType !== 'unchanged')) {
        elementDiffs.push(diff);
      }

      processedIds.add(id);
    });

    // Generate summary
    const summary = this.generateSummary(elementDiffs);

    // Generate human-readable descriptions
    const humanReadable = this.generateHumanReadable(elementDiffs);

    return {
      timestamp: Date.now(),
      elements: elementDiffs,
      summary,
      humanReadable,
    };
  }

  /**
   * Compare a single element
   */
  private compareElement(
    oldElement: BuilderElement | null,
    newElement: BuilderElement | null,
    oldRootElements: BuilderElement[],
    newRootElements: BuilderElement[],
    depth: number
  ): ElementDiff | null {
    if (depth > (this.options.maxDepth || 10)) {
      return null;
    }

    // Element added
    if (!oldElement && newElement) {
      return {
        elementId: newElement.id,
        elementType: newElement.type,
        elementName: newElement.name,
        changeType: 'added',
        propertyChanges: [],
        styleChanges: [],
        childChanges: [],
        newElement,
        newIndex: this.findElementIndex(newRootElements, newElement.id),
        parentId: newElement.parentId,
      };
    }

    // Element removed
    if (oldElement && !newElement) {
      return {
        elementId: oldElement.id,
        elementType: oldElement.type,
        elementName: oldElement.name,
        changeType: 'removed',
        propertyChanges: [],
        styleChanges: [],
        childChanges: [],
        oldElement,
        oldIndex: this.findElementIndex(oldRootElements, oldElement.id),
        parentId: oldElement.parentId,
      };
    }

    // Both exist - compare properties
    if (oldElement && newElement) {
      const propertyChanges = this.compareProperties(oldElement, newElement);
      const styleChanges = this.options.includeStyles
        ? this.compareStyles(oldElement.styles, newElement.styles)
        : [];
      const childChanges = this.options.deepCompare
        ? this.compareChildren(
            oldElement.children,
            newElement.children,
            oldRootElements,
            newRootElements,
            depth + 1
          )
        : [];

      // Check if element was moved
      const oldIndex = this.findElementIndex(oldRootElements, oldElement.id);
      const newIndex = this.findElementIndex(newRootElements, newElement.id);
      const wasMoved =
        oldIndex !== newIndex || oldElement.parentId !== newElement.parentId;

      const hasChanges =
        propertyChanges.length > 0 ||
        styleChanges.length > 0 ||
        childChanges.some((c) => c.changeType !== 'unchanged');

      let changeType: ChangeType = 'unchanged';
      if (hasChanges && wasMoved) {
        changeType = 'moved';
      } else if (hasChanges) {
        changeType = 'modified';
      } else if (wasMoved) {
        changeType = 'moved';
      }

      return {
        elementId: newElement.id,
        elementType: newElement.type,
        elementName: newElement.name,
        changeType,
        propertyChanges,
        styleChanges,
        childChanges,
        oldElement,
        newElement,
        oldIndex,
        newIndex,
        parentId: newElement.parentId,
      };
    }

    return null;
  }

  /**
   * Compare element properties
   */
  private compareProperties(
    oldElement: BuilderElement,
    newElement: BuilderElement
  ): PropertyChange[] {
    const changes: PropertyChange[] = [];
    const allKeys = new Set([
      ...Object.keys(oldElement.props),
      ...Object.keys(newElement.props),
    ]);

    allKeys.forEach((key) => {
      if (this.options.ignoreProperties?.includes(key)) return;

      const oldValue = oldElement.props[key];
      const newValue = newElement.props[key];

      if (!deepEqual(oldValue, newValue)) {
        const changeType: ChangeType =
          oldValue === undefined ? 'added' : newValue === undefined ? 'removed' : 'modified';

        changes.push({
          path: `props.${key}`,
          property: key,
          oldValue,
          newValue,
          changeType,
          severity: determineSeverity(key, oldValue, newValue),
          description: this.generatePropertyChangeDescription(key, oldValue, newValue, changeType),
        });
      }
    });

    return changes;
  }

  /**
   * Compare element styles
   */
  private compareStyles(
    oldStyles: ElementStyles,
    newStyles: ElementStyles
  ): PropertyChange[] {
    const changes: PropertyChange[] = [];
    const styleCategories: (keyof ElementStyles)[] = [
      'layout',
      'spacing',
      'typography',
      'colors',
      'borders',
      'effects',
    ];

    styleCategories.forEach((category) => {
      const oldValue = oldStyles[category] as string[];
      const newValue = newStyles[category] as string[];

      if (!deepEqual(oldValue, newValue)) {
        const added = newValue.filter((v) => !oldValue.includes(v));
        const removed = oldValue.filter((v) => !newValue.includes(v));

        if (added.length > 0 || removed.length > 0) {
          changes.push({
            path: `styles.${category}`,
            property: category,
            oldValue,
            newValue,
            changeType: 'modified',
            severity: determineSeverity(category, oldValue, newValue),
            description: this.generateStyleChangeDescription(category, added, removed),
          });
        }
      }
    });

    // Compare responsive styles
    if (!deepEqual(oldStyles.responsive, newStyles.responsive)) {
      changes.push({
        path: 'styles.responsive',
        property: 'responsive',
        oldValue: oldStyles.responsive,
        newValue: newStyles.responsive,
        changeType: 'modified',
        severity: 'minor',
        description: 'Changed responsive styles',
      });
    }

    return changes;
  }

  /**
   * Compare children elements
   */
  private compareChildren(
    oldChildren: BuilderElement[],
    newChildren: BuilderElement[],
    oldRootElements: BuilderElement[],
    newRootElements: BuilderElement[],
    depth: number
  ): ElementDiff[] {
    const diffs: ElementDiff[] = [];
    const oldIds = new Set(oldChildren.map((c) => c.id));
    const newIds = new Set(newChildren.map((c) => c.id));
    const processedIds = new Set<string>();

    // Compare existing elements
    newChildren.forEach((newChild) => {
      const oldChild = oldChildren.find((c) => c.id === newChild.id);
      const diff = this.compareElement(
        oldChild || null,
        newChild,
        oldRootElements,
        newRootElements,
        depth
      );
      if (diff) {
        diffs.push(diff);
        processedIds.add(newChild.id);
      }
    });

    // Find removed elements
    oldChildren.forEach((oldChild) => {
      if (!processedIds.has(oldChild.id) && !newIds.has(oldChild.id)) {
        const diff = this.compareElement(
          oldChild,
          null,
          oldRootElements,
          newRootElements,
          depth
        );
        if (diff) {
          diffs.push(diff);
        }
      }
    });

    return diffs;
  }

  /**
   * Find element index considering nesting
   */
  private findElementIndex(elements: BuilderElement[], id: string): number {
    const flat = flattenElements(elements);
    return flat.findIndex((e) => e.id === id);
  }

  /**
   * Generate property change description
   */
  private generatePropertyChangeDescription(
    property: string,
    oldValue: unknown,
    newValue: unknown,
    changeType: ChangeType
  ): string {
    const label = getPropertyLabel(property);

    switch (changeType) {
      case 'added':
        return `Added ${label}: ${formatValue(newValue)}`;
      case 'removed':
        return `Removed ${label}`;
      case 'modified':
        return `Changed ${label} from ${formatValue(oldValue)} to ${formatValue(newValue)}`;
      default:
        return `${label} unchanged`;
    }
  }

  /**
   * Generate style change description
   */
  private generateStyleChangeDescription(
    category: string,
    added: string[],
    removed: string[]
  ): string {
    const parts: string[] = [];
    const label = getPropertyLabel(category);

    if (added.length > 0) {
      parts.push(`added ${added.slice(0, 3).join(', ')}${added.length > 3 ? ` +${added.length - 3} more` : ''}`);
    }
    if (removed.length > 0) {
      parts.push(`removed ${removed.slice(0, 3).join(', ')}${removed.length > 3 ? ` +${removed.length - 3} more` : ''}`);
    }

    return `${label}: ${parts.join('; ')}`;
  }

  /**
   * Generate summary of all changes
   */
  private generateSummary(diffs: ElementDiff[]): DiffSummary {
    let totalChanges = 0;
    let added = 0;
    let removed = 0;
    let modified = 0;
    let moved = 0;
    let majorChanges = 0;
    let minorChanges = 0;
    const affectedElements: string[] = [];

    const processDiff = (diff: ElementDiff) => {
      if (diff.changeType !== 'unchanged') {
        totalChanges++;
        affectedElements.push(diff.elementId);

        switch (diff.changeType) {
          case 'added':
            added++;
            majorChanges++;
            break;
          case 'removed':
            removed++;
            majorChanges++;
            break;
          case 'modified':
            modified++;
            break;
          case 'moved':
            moved++;
            minorChanges++;
            break;
        }
      }

      // Count property changes
      diff.propertyChanges.forEach((change) => {
        if (change.severity === 'major') majorChanges++;
        else if (change.severity === 'minor') minorChanges++;
      });

      diff.styleChanges.forEach((change) => {
        if (change.severity === 'major') majorChanges++;
        else if (change.severity === 'minor') minorChanges++;
      });

      // Process child diffs
      diff.childChanges.forEach(processDiff);
    };

    diffs.forEach(processDiff);

    return {
      totalChanges,
      added,
      removed,
      modified,
      moved,
      majorChanges,
      minorChanges,
      affectedElements: Array.from(new Set(affectedElements)),
    };
  }

  /**
   * Generate human-readable change descriptions
   */
  private generateHumanReadable(diffs: ElementDiff[]): string[] {
    const descriptions: string[] = [];

    const processDiff = (diff: ElementDiff, indent: number = 0) => {
      const prefix = '  '.repeat(indent);
      const elementDesc = `${diff.elementType} "${diff.elementName}"`;

      switch (diff.changeType) {
        case 'added':
          descriptions.push(`${prefix}+ Added ${elementDesc}`);
          break;
        case 'removed':
          descriptions.push(`${prefix}- Removed ${elementDesc}`);
          break;
        case 'modified':
          descriptions.push(`${prefix}* Modified ${elementDesc}:`);
          diff.propertyChanges.forEach((change) => {
            descriptions.push(`${prefix}  - ${change.description}`);
          });
          diff.styleChanges.forEach((change) => {
            descriptions.push(`${prefix}  - ${change.description}`);
          });
          break;
        case 'moved':
          descriptions.push(`${prefix}> Moved ${elementDesc}`);
          if (diff.oldIndex !== undefined && diff.newIndex !== undefined) {
            descriptions.push(
              `${prefix}  from position ${diff.oldIndex + 1} to ${diff.newIndex + 1}`
            );
          }
          break;
      }

      // Process children
      diff.childChanges.forEach((childDiff) => {
        if (childDiff.changeType !== 'unchanged') {
          processDiff(childDiff, indent + 1);
        }
      });
    };

    diffs.forEach((diff) => processDiff(diff));

    return descriptions;
  }

  /**
   * Get visual diff data for UI rendering
   */
  getVisualDiff(diffResult: DiffResult): {
    addedElements: BuilderElement[];
    removedElements: BuilderElement[];
    modifiedElements: { element: BuilderElement; changes: PropertyChange[] }[];
    movedElements: { element: BuilderElement; fromIndex: number; toIndex: number }[];
  } {
    const addedElements: BuilderElement[] = [];
    const removedElements: BuilderElement[] = [];
    const modifiedElements: { element: BuilderElement; changes: PropertyChange[] }[] = [];
    const movedElements: { element: BuilderElement; fromIndex: number; toIndex: number }[] = [];

    const processDiff = (diff: ElementDiff) => {
      switch (diff.changeType) {
        case 'added':
          if (diff.newElement) addedElements.push(diff.newElement);
          break;
        case 'removed':
          if (diff.oldElement) removedElements.push(diff.oldElement);
          break;
        case 'modified':
          if (diff.newElement) {
            modifiedElements.push({
              element: diff.newElement,
              changes: [...diff.propertyChanges, ...diff.styleChanges],
            });
          }
          break;
        case 'moved':
          if (diff.newElement && diff.oldIndex !== undefined && diff.newIndex !== undefined) {
            movedElements.push({
              element: diff.newElement,
              fromIndex: diff.oldIndex,
              toIndex: diff.newIndex,
            });
          }
          break;
      }

      diff.childChanges.forEach(processDiff);
    };

    diffResult.elements.forEach(processDiff);

    return { addedElements, removedElements, modifiedElements, movedElements };
  }

  /**
   * Generate CSS classes for diff highlighting
   */
  getDiffHighlightClass(changeType: ChangeType): string {
    const classes: Record<ChangeType, string> = {
      added: 'bg-green-500/20 border-green-500 ring-2 ring-green-500/30',
      removed: 'bg-red-500/20 border-red-500 ring-2 ring-red-500/30 opacity-50',
      modified: 'bg-yellow-500/20 border-yellow-500 ring-2 ring-yellow-500/30',
      moved: 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/30',
      unchanged: '',
    };
    return classes[changeType];
  }

  /**
   * Get icon for change type
   */
  getChangeIcon(changeType: ChangeType): string {
    const icons: Record<ChangeType, string> = {
      added: 'Plus',
      removed: 'Minus',
      modified: 'Edit',
      moved: 'ArrowRight',
      unchanged: 'Minus',
    };
    return icons[changeType];
  }

  /**
   * Get color for change type
   */
  getChangeColor(changeType: ChangeType): string {
    const colors: Record<ChangeType, string> = {
      added: '#10B981', // green
      removed: '#EF4444', // red
      modified: '#F59E0B', // yellow
      moved: '#3B82F6', // blue
      unchanged: '#6B7280', // gray
    };
    return colors[changeType];
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let diffEngineInstance: DiffEngine | null = null;

/**
 * Get or create singleton DiffEngine instance
 */
export function getDiffEngine(options?: DiffOptions): DiffEngine {
  if (!diffEngineInstance) {
    diffEngineInstance = new DiffEngine(options);
  }
  return diffEngineInstance;
}

export default DiffEngine;
