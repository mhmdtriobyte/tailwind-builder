/**
 * Filter System for Tailwind Builder
 *
 * A comprehensive filtering system that provides:
 * - Filter by element type
 * - Filter by visibility
 * - Filter by lock status
 * - Filter by has children
 * - Filter by style property
 * - Filter by responsive visibility
 * - Compound filters (AND/OR)
 * - Save and load filter presets
 */

import type { BuilderElement, ComponentCategory } from '@/types/builder';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Filter operators for comparison
 */
export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'matches'; // regex

/**
 * Filter logic for combining multiple filters
 */
export type FilterLogic = 'and' | 'or';

/**
 * Base filter definition
 */
export interface BaseFilter {
  id: string;
  enabled: boolean;
}

/**
 * Filter by element type
 */
export interface TypeFilter extends BaseFilter {
  type: 'type';
  value: string[];
  operator: 'includes' | 'excludes';
}

/**
 * Filter by element category
 */
export interface CategoryFilter extends BaseFilter {
  type: 'category';
  value: ComponentCategory[];
  operator: 'includes' | 'excludes';
}

/**
 * Filter by visibility (hidden class)
 */
export interface VisibilityFilter extends BaseFilter {
  type: 'visibility';
  value: 'visible' | 'hidden' | 'all';
}

/**
 * Filter by lock status (if element is locked)
 */
export interface LockFilter extends BaseFilter {
  type: 'lock';
  value: 'locked' | 'unlocked' | 'all';
}

/**
 * Filter by whether element has children
 */
export interface ChildrenFilter extends BaseFilter {
  type: 'children';
  value: 'hasChildren' | 'noChildren' | 'all';
}

/**
 * Filter by style property
 */
export interface StyleFilter extends BaseFilter {
  type: 'style';
  property: string;
  operator: FilterOperator;
  value: string;
}

/**
 * Filter by responsive visibility
 */
export interface ResponsiveFilter extends BaseFilter {
  type: 'responsive';
  breakpoint: 'sm' | 'md' | 'lg' | 'all';
  visibility: 'visible' | 'hidden' | 'modified';
}

/**
 * Filter by element name
 */
export interface NameFilter extends BaseFilter {
  type: 'name';
  operator: FilterOperator;
  value: string;
}

/**
 * Filter by element depth
 */
export interface DepthFilter extends BaseFilter {
  type: 'depth';
  operator: 'equals' | 'greaterThan' | 'lessThan';
  value: number;
}

/**
 * Filter by props
 */
export interface PropsFilter extends BaseFilter {
  type: 'props';
  property: string;
  operator: FilterOperator;
  value: string;
}

/**
 * Custom filter with callback
 */
export interface CustomFilter extends BaseFilter {
  type: 'custom';
  name: string;
  callback: (element: BuilderElement, depth: number) => boolean;
}

/**
 * Union type for all filters
 */
export type Filter =
  | TypeFilter
  | CategoryFilter
  | VisibilityFilter
  | LockFilter
  | ChildrenFilter
  | StyleFilter
  | ResponsiveFilter
  | NameFilter
  | DepthFilter
  | PropsFilter
  | CustomFilter;

/**
 * Compound filter group
 */
export interface FilterGroup {
  id: string;
  name: string;
  logic: FilterLogic;
  filters: Filter[];
  enabled: boolean;
}

/**
 * Filter preset for saving/loading
 */
export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  groups: FilterGroup[];
  quickFilters: QuickFilter[];
}

/**
 * Quick filter for toolbar buttons
 */
export interface QuickFilter {
  id: string;
  label: string;
  icon: string;
  filter: Filter;
  active: boolean;
}

/**
 * Filter result
 */
export interface FilterResult {
  element: BuilderElement;
  matchedFilters: string[];
  depth: number;
  visible: boolean;
}

/**
 * Filter statistics
 */
export interface FilterStats {
  total: number;
  matched: number;
  hidden: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const FILTER_PRESETS_KEY = 'tailwind-builder-filter-presets';
const MAX_PRESETS = 20;

/**
 * Default quick filters
 */
export const DEFAULT_QUICK_FILTERS: QuickFilter[] = [
  {
    id: 'containers',
    label: 'Containers',
    icon: 'Box',
    filter: {
      id: 'qf-containers',
      type: 'children',
      value: 'hasChildren',
      enabled: true,
    },
    active: false,
  },
  {
    id: 'buttons',
    label: 'Buttons',
    icon: 'MousePointer',
    filter: {
      id: 'qf-buttons',
      type: 'category',
      value: ['buttons'],
      operator: 'includes',
      enabled: true,
    },
    active: false,
  },
  {
    id: 'forms',
    label: 'Forms',
    icon: 'FormInput',
    filter: {
      id: 'qf-forms',
      type: 'category',
      value: ['forms'],
      operator: 'includes',
      enabled: true,
    },
    active: false,
  },
  {
    id: 'layout',
    label: 'Layout',
    icon: 'LayoutGrid',
    filter: {
      id: 'qf-layout',
      type: 'category',
      value: ['layout'],
      operator: 'includes',
      enabled: true,
    },
    active: false,
  },
  {
    id: 'hidden',
    label: 'Hidden',
    icon: 'EyeOff',
    filter: {
      id: 'qf-hidden',
      type: 'visibility',
      value: 'hidden',
      enabled: true,
    },
    active: false,
  },
  {
    id: 'responsive',
    label: 'Responsive',
    icon: 'Smartphone',
    filter: {
      id: 'qf-responsive',
      type: 'responsive',
      breakpoint: 'all',
      visibility: 'modified',
      enabled: true,
    },
    active: false,
  },
];

// ============================================================================
// FILTER EVALUATION
// ============================================================================

/**
 * Get all style classes from element as a single string
 */
function getAllStyles(element: BuilderElement): string[] {
  const classes: string[] = [];

  for (const category of Object.keys(element.styles) as (keyof typeof element.styles)[]) {
    const styles = element.styles[category];
    if (Array.isArray(styles)) {
      classes.push(...styles);
    } else if (typeof styles === 'object' && styles !== null) {
      for (const breakpoint of Object.keys(styles)) {
        const bpStyles = styles[breakpoint as keyof typeof styles];
        if (Array.isArray(bpStyles)) {
          classes.push(...bpStyles);
        }
      }
    }
  }

  return classes;
}

/**
 * Check if element is hidden via CSS class
 */
function isElementHidden(element: BuilderElement): boolean {
  const styles = getAllStyles(element);
  return styles.includes('hidden') || styles.includes('invisible');
}

/**
 * Check if element has responsive modifications
 */
function hasResponsiveStyles(element: BuilderElement, breakpoint?: 'sm' | 'md' | 'lg'): boolean {
  const responsive = element.styles.responsive;

  if (breakpoint) {
    return responsive[breakpoint].length > 0;
  }

  return responsive.sm.length > 0 || responsive.md.length > 0 || responsive.lg.length > 0;
}

/**
 * Evaluate string comparison with operator
 */
function evaluateStringComparison(
  value: string,
  operator: FilterOperator,
  target: string
): boolean {
  const normalizedValue = value.toLowerCase();
  const normalizedTarget = target.toLowerCase();

  switch (operator) {
    case 'equals':
      return normalizedValue === normalizedTarget;
    case 'notEquals':
      return normalizedValue !== normalizedTarget;
    case 'contains':
      return normalizedValue.includes(normalizedTarget);
    case 'notContains':
      return !normalizedValue.includes(normalizedTarget);
    case 'startsWith':
      return normalizedValue.startsWith(normalizedTarget);
    case 'endsWith':
      return normalizedValue.endsWith(normalizedTarget);
    case 'isEmpty':
      return !value || value.trim() === '';
    case 'isNotEmpty':
      return !!value && value.trim() !== '';
    case 'matches':
      try {
        const regex = new RegExp(target, 'i');
        return regex.test(value);
      } catch {
        return false;
      }
    default:
      return false;
  }
}

/**
 * Get element category from type
 */
function getElementCategory(type: string): ComponentCategory | null {
  // Map common type prefixes to categories
  const categoryMap: Record<string, ComponentCategory> = {
    'primary-button': 'buttons',
    'secondary-button': 'buttons',
    'outline-button': 'buttons',
    'ghost-button': 'buttons',
    'icon-button': 'buttons',
    'loading-button': 'buttons',
    'gradient-button': 'buttons',
    'button-group': 'buttons',
    'simple-card': 'cards',
    'product-card': 'cards',
    'pricing-card': 'cards',
    'testimonial-card': 'cards',
    'profile-card': 'cards',
    'blog-card': 'cards',
    'stats-card': 'cards',
    'feature-card': 'cards',
    'image-card': 'cards',
    'horizontal-card': 'cards',
    'navbar': 'navigation',
    'mobile-menu': 'navigation',
    'footer': 'navigation',
    'breadcrumb': 'navigation',
    'tabs': 'navigation',
    'pagination': 'navigation',
    'input-field': 'forms',
    'textarea': 'forms',
    'select-dropdown': 'forms',
    'checkbox': 'forms',
    'radio-group': 'forms',
    'toggle-switch': 'forms',
    'login-form': 'forms',
    'signup-form': 'forms',
    'contact-form': 'forms',
    'search-bar': 'forms',
    'newsletter-form': 'forms',
    'file-upload': 'forms',
    'hero-section': 'sections',
    'hero-with-image': 'sections',
    'feature-section': 'sections',
    'cta-section': 'sections',
    'stats-section': 'sections',
    'testimonials-section': 'sections',
    'team-section': 'sections',
    'faq-section': 'sections',
    'pricing-section': 'sections',
    'contact-section': 'sections',
    'container': 'layout',
    'grid-2-col': 'layout',
    'grid-3-col': 'layout',
    'grid-4-col': 'layout',
    'flex-row': 'layout',
    'flex-column': 'layout',
    'divider': 'layout',
    'spacer': 'layout',
    'image': 'media',
    'avatar': 'media',
    'icon': 'media',
    'video': 'media',
    'heading': 'text',
    'paragraph': 'text',
    'badge': 'text',
    'link': 'text',
    'list': 'text',
  };

  return categoryMap[type] || null;
}

/**
 * Evaluate a single filter against an element
 */
export function evaluateFilter(
  filter: Filter,
  element: BuilderElement,
  depth: number = 0
): boolean {
  if (!filter.enabled) {
    return true;
  }

  switch (filter.type) {
    case 'type': {
      const typeMatches = filter.value.includes(element.type);
      return filter.operator === 'includes' ? typeMatches : !typeMatches;
    }

    case 'category': {
      const category = getElementCategory(element.type);
      if (!category) return filter.operator === 'excludes';
      const categoryMatches = filter.value.includes(category);
      return filter.operator === 'includes' ? categoryMatches : !categoryMatches;
    }

    case 'visibility': {
      if (filter.value === 'all') return true;
      const hidden = isElementHidden(element);
      return filter.value === 'hidden' ? hidden : !hidden;
    }

    case 'lock': {
      if (filter.value === 'all') return true;
      const locked = element.props.locked === true;
      return filter.value === 'locked' ? locked : !locked;
    }

    case 'children': {
      if (filter.value === 'all') return true;
      const hasKids = element.children.length > 0;
      return filter.value === 'hasChildren' ? hasKids : !hasKids;
    }

    case 'style': {
      const styles = getAllStyles(element);
      const styleString = styles.join(' ');

      if (filter.operator === 'isEmpty') {
        return styles.length === 0;
      }
      if (filter.operator === 'isNotEmpty') {
        return styles.length > 0;
      }

      // Check if any style matches
      if (filter.operator === 'contains') {
        return styles.some((s) => s.includes(filter.value));
      }
      if (filter.operator === 'equals') {
        return styles.includes(filter.value);
      }

      return evaluateStringComparison(styleString, filter.operator, filter.value);
    }

    case 'responsive': {
      if (filter.breakpoint === 'all') {
        if (filter.visibility === 'modified') {
          return hasResponsiveStyles(element);
        }
        // Check all breakpoints
        const responsive = element.styles.responsive;
        const hasHiddenClasses =
          responsive.sm.includes('hidden') ||
          responsive.md.includes('hidden') ||
          responsive.lg.includes('hidden');

        return filter.visibility === 'hidden' ? hasHiddenClasses : !hasHiddenClasses;
      }

      if (filter.visibility === 'modified') {
        return hasResponsiveStyles(element, filter.breakpoint);
      }

      const bpStyles = element.styles.responsive[filter.breakpoint];
      const isHidden = bpStyles.includes('hidden');
      return filter.visibility === 'hidden' ? isHidden : !isHidden;
    }

    case 'name': {
      return evaluateStringComparison(element.name, filter.operator, filter.value);
    }

    case 'depth': {
      switch (filter.operator) {
        case 'equals':
          return depth === filter.value;
        case 'greaterThan':
          return depth > filter.value;
        case 'lessThan':
          return depth < filter.value;
        default:
          return true;
      }
    }

    case 'props': {
      const propValue = element.props[filter.property];
      if (propValue === undefined) {
        return filter.operator === 'isEmpty';
      }
      const stringValue = String(propValue);
      return evaluateStringComparison(stringValue, filter.operator, filter.value);
    }

    case 'custom': {
      return filter.callback(element, depth);
    }

    default:
      return true;
  }
}

/**
 * Evaluate a filter group against an element
 */
export function evaluateFilterGroup(
  group: FilterGroup,
  element: BuilderElement,
  depth: number = 0
): boolean {
  if (!group.enabled || group.filters.length === 0) {
    return true;
  }

  const enabledFilters = group.filters.filter((f) => f.enabled);
  if (enabledFilters.length === 0) {
    return true;
  }

  if (group.logic === 'and') {
    return enabledFilters.every((filter) => evaluateFilter(filter, element, depth));
  } else {
    return enabledFilters.some((filter) => evaluateFilter(filter, element, depth));
  }
}

/**
 * Evaluate multiple filter groups
 */
export function evaluateFilterGroups(
  groups: FilterGroup[],
  element: BuilderElement,
  depth: number = 0,
  groupLogic: FilterLogic = 'and'
): boolean {
  const enabledGroups = groups.filter((g) => g.enabled);
  if (enabledGroups.length === 0) {
    return true;
  }

  if (groupLogic === 'and') {
    return enabledGroups.every((group) => evaluateFilterGroup(group, element, depth));
  } else {
    return enabledGroups.some((group) => evaluateFilterGroup(group, element, depth));
  }
}

// ============================================================================
// FILTER APPLICATION
// ============================================================================

/**
 * Apply filters to elements and return filtered results
 */
export function filterElements(
  elements: BuilderElement[],
  groups: FilterGroup[],
  groupLogic: FilterLogic = 'and',
  depth: number = 0
): FilterResult[] {
  const results: FilterResult[] = [];

  for (const element of elements) {
    const matchedFilters: string[] = [];
    let visible = true;

    // Check each filter group
    for (const group of groups) {
      if (!group.enabled) continue;

      for (const filter of group.filters) {
        if (!filter.enabled) continue;

        const matches = evaluateFilter(filter, element, depth);
        if (matches) {
          matchedFilters.push(filter.id);
        }
      }
    }

    // Evaluate overall visibility
    visible = evaluateFilterGroups(groups, element, depth, groupLogic);

    results.push({
      element,
      matchedFilters,
      depth,
      visible,
    });

    // Recursively filter children
    if (element.children.length > 0) {
      const childResults = filterElements(element.children, groups, groupLogic, depth + 1);
      results.push(...childResults);
    }
  }

  return results;
}

/**
 * Get only visible elements after filtering
 */
export function getVisibleElements(
  elements: BuilderElement[],
  groups: FilterGroup[],
  groupLogic: FilterLogic = 'and'
): BuilderElement[] {
  function filterRecursive(els: BuilderElement[], depth: number): BuilderElement[] {
    return els
      .filter((el) => evaluateFilterGroups(groups, el, depth, groupLogic))
      .map((el) => ({
        ...el,
        children: filterRecursive(el.children, depth + 1),
      }));
  }

  return filterRecursive(elements, 0);
}

/**
 * Get element IDs that match filters
 */
export function getMatchingElementIds(
  elements: BuilderElement[],
  groups: FilterGroup[],
  groupLogic: FilterLogic = 'and'
): Set<string> {
  const ids = new Set<string>();

  function collectIds(els: BuilderElement[], depth: number): void {
    for (const el of els) {
      if (evaluateFilterGroups(groups, el, depth, groupLogic)) {
        ids.add(el.id);
      }
      collectIds(el.children, depth + 1);
    }
  }

  collectIds(elements, 0);
  return ids;
}

// ============================================================================
// FILTER STATISTICS
// ============================================================================

/**
 * Calculate filter statistics
 */
export function calculateFilterStats(
  elements: BuilderElement[],
  groups: FilterGroup[],
  groupLogic: FilterLogic = 'and'
): FilterStats {
  const stats: FilterStats = {
    total: 0,
    matched: 0,
    hidden: 0,
    byType: {},
    byCategory: {},
  };

  function countRecursive(els: BuilderElement[], depth: number): void {
    for (const el of els) {
      stats.total++;

      // Count by type
      stats.byType[el.type] = (stats.byType[el.type] || 0) + 1;

      // Count by category
      const category = getElementCategory(el.type);
      if (category) {
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      }

      // Check if matches
      if (evaluateFilterGroups(groups, el, depth, groupLogic)) {
        stats.matched++;
      }

      // Check if hidden
      if (isElementHidden(el)) {
        stats.hidden++;
      }

      countRecursive(el.children, depth + 1);
    }
  }

  countRecursive(elements, 0);
  return stats;
}

// ============================================================================
// FILTER PRESETS
// ============================================================================

/**
 * Get saved filter presets
 */
export function getFilterPresets(): FilterPreset[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(FILTER_PRESETS_KEY);
    if (!stored) {
      return [];
    }

    const presets = JSON.parse(stored) as FilterPreset[];

    // Filter out custom filters with callbacks (can't be serialized)
    return presets.map((preset) => ({
      ...preset,
      groups: preset.groups.map((group) => ({
        ...group,
        filters: group.filters.filter((f) => f.type !== 'custom'),
      })),
    }));
  } catch {
    return [];
  }
}

/**
 * Save filter preset
 */
export function saveFilterPreset(preset: FilterPreset): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const presets = getFilterPresets();

    // Remove custom filters before saving
    const cleanPreset: FilterPreset = {
      ...preset,
      updatedAt: Date.now(),
      groups: preset.groups.map((group) => ({
        ...group,
        filters: group.filters.filter((f) => f.type !== 'custom'),
      })),
    };

    // Find and update existing or add new
    const existingIndex = presets.findIndex((p) => p.id === preset.id);
    if (existingIndex !== -1) {
      presets[existingIndex] = cleanPreset;
    } else {
      presets.unshift(cleanPreset);
    }

    // Limit number of presets
    const limitedPresets = presets.slice(0, MAX_PRESETS);

    localStorage.setItem(FILTER_PRESETS_KEY, JSON.stringify(limitedPresets));
  } catch {
    // Silently fail
  }
}

/**
 * Delete filter preset
 */
export function deleteFilterPreset(presetId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const presets = getFilterPresets();
    const filtered = presets.filter((p) => p.id !== presetId);
    localStorage.setItem(FILTER_PRESETS_KEY, JSON.stringify(filtered));
  } catch {
    // Silently fail
  }
}

/**
 * Get preset by ID
 */
export function getFilterPresetById(presetId: string): FilterPreset | null {
  const presets = getFilterPresets();
  return presets.find((p) => p.id === presetId) || null;
}

// ============================================================================
// FILTER BUILDERS
// ============================================================================

/**
 * Create a type filter
 */
export function createTypeFilter(
  types: string[],
  operator: 'includes' | 'excludes' = 'includes'
): TypeFilter {
  return {
    id: `type-${Date.now()}`,
    type: 'type',
    value: types,
    operator,
    enabled: true,
  };
}

/**
 * Create a category filter
 */
export function createCategoryFilter(
  categories: ComponentCategory[],
  operator: 'includes' | 'excludes' = 'includes'
): CategoryFilter {
  return {
    id: `category-${Date.now()}`,
    type: 'category',
    value: categories,
    operator,
    enabled: true,
  };
}

/**
 * Create a visibility filter
 */
export function createVisibilityFilter(
  visibility: 'visible' | 'hidden' | 'all'
): VisibilityFilter {
  return {
    id: `visibility-${Date.now()}`,
    type: 'visibility',
    value: visibility,
    enabled: true,
  };
}

/**
 * Create a style filter
 */
export function createStyleFilter(
  property: string,
  operator: FilterOperator,
  value: string
): StyleFilter {
  return {
    id: `style-${Date.now()}`,
    type: 'style',
    property,
    operator,
    value,
    enabled: true,
  };
}

/**
 * Create a children filter
 */
export function createChildrenFilter(
  value: 'hasChildren' | 'noChildren' | 'all'
): ChildrenFilter {
  return {
    id: `children-${Date.now()}`,
    type: 'children',
    value,
    enabled: true,
  };
}

/**
 * Create a name filter
 */
export function createNameFilter(
  operator: FilterOperator,
  value: string
): NameFilter {
  return {
    id: `name-${Date.now()}`,
    type: 'name',
    operator,
    value,
    enabled: true,
  };
}

/**
 * Create a filter group
 */
export function createFilterGroup(
  name: string,
  filters: Filter[] = [],
  logic: FilterLogic = 'and'
): FilterGroup {
  return {
    id: `group-${Date.now()}`,
    name,
    logic,
    filters,
    enabled: true,
  };
}

/**
 * Create a filter preset
 */
export function createFilterPreset(
  name: string,
  groups: FilterGroup[] = [],
  description?: string
): FilterPreset {
  const now = Date.now();
  return {
    id: `preset-${now}`,
    name,
    description,
    createdAt: now,
    updatedAt: now,
    groups,
    quickFilters: [],
  };
}

// ============================================================================
// FILTER SYSTEM CLASS
// ============================================================================

/**
 * Filter System class for managing filter state
 */
export class FilterSystem {
  private groups: FilterGroup[] = [];
  private groupLogic: FilterLogic = 'and';
  private quickFilters: QuickFilter[] = [...DEFAULT_QUICK_FILTERS];

  constructor() {
    this.groups = [];
    this.quickFilters = [...DEFAULT_QUICK_FILTERS];
  }

  /**
   * Add a filter group
   */
  addGroup(group: FilterGroup): void {
    this.groups.push(group);
  }

  /**
   * Remove a filter group
   */
  removeGroup(groupId: string): void {
    this.groups = this.groups.filter((g) => g.id !== groupId);
  }

  /**
   * Update a filter group
   */
  updateGroup(groupId: string, updates: Partial<FilterGroup>): void {
    const index = this.groups.findIndex((g) => g.id === groupId);
    if (index !== -1) {
      this.groups[index] = { ...this.groups[index], ...updates };
    }
  }

  /**
   * Add filter to a group
   */
  addFilterToGroup(groupId: string, filter: Filter): void {
    const group = this.groups.find((g) => g.id === groupId);
    if (group) {
      group.filters.push(filter);
    }
  }

  /**
   * Remove filter from a group
   */
  removeFilterFromGroup(groupId: string, filterId: string): void {
    const group = this.groups.find((g) => g.id === groupId);
    if (group) {
      group.filters = group.filters.filter((f) => f.id !== filterId);
    }
  }

  /**
   * Toggle filter enabled state
   */
  toggleFilter(groupId: string, filterId: string): void {
    const group = this.groups.find((g) => g.id === groupId);
    if (group) {
      const filter = group.filters.find((f) => f.id === filterId);
      if (filter) {
        filter.enabled = !filter.enabled;
      }
    }
  }

  /**
   * Set group logic
   */
  setGroupLogic(logic: FilterLogic): void {
    this.groupLogic = logic;
  }

  /**
   * Get all groups
   */
  getGroups(): FilterGroup[] {
    return [...this.groups];
  }

  /**
   * Get active filters count
   */
  getActiveFiltersCount(): number {
    return this.groups.reduce((count, group) => {
      if (!group.enabled) return count;
      return count + group.filters.filter((f) => f.enabled).length;
    }, 0);
  }

  /**
   * Clear all filters
   */
  clearAll(): void {
    this.groups = [];
    this.quickFilters = this.quickFilters.map((qf) => ({ ...qf, active: false }));
  }

  /**
   * Toggle quick filter
   */
  toggleQuickFilter(quickFilterId: string): void {
    const index = this.quickFilters.findIndex((qf) => qf.id === quickFilterId);
    if (index !== -1) {
      this.quickFilters[index].active = !this.quickFilters[index].active;
    }
  }

  /**
   * Get quick filters
   */
  getQuickFilters(): QuickFilter[] {
    return [...this.quickFilters];
  }

  /**
   * Get active quick filters as a filter group
   */
  getActiveQuickFiltersGroup(): FilterGroup | null {
    const activeFilters = this.quickFilters
      .filter((qf) => qf.active)
      .map((qf) => qf.filter);

    if (activeFilters.length === 0) {
      return null;
    }

    return {
      id: 'quick-filters',
      name: 'Quick Filters',
      logic: 'or',
      filters: activeFilters,
      enabled: true,
    };
  }

  /**
   * Apply filters to elements
   */
  filter(elements: BuilderElement[]): FilterResult[] {
    const allGroups = [...this.groups];
    const quickGroup = this.getActiveQuickFiltersGroup();
    if (quickGroup) {
      allGroups.push(quickGroup);
    }

    return filterElements(elements, allGroups, this.groupLogic);
  }

  /**
   * Get visible elements
   */
  getVisibleElements(elements: BuilderElement[]): BuilderElement[] {
    const allGroups = [...this.groups];
    const quickGroup = this.getActiveQuickFiltersGroup();
    if (quickGroup) {
      allGroups.push(quickGroup);
    }

    return getVisibleElements(elements, allGroups, this.groupLogic);
  }

  /**
   * Get matching element IDs
   */
  getMatchingIds(elements: BuilderElement[]): Set<string> {
    const allGroups = [...this.groups];
    const quickGroup = this.getActiveQuickFiltersGroup();
    if (quickGroup) {
      allGroups.push(quickGroup);
    }

    return getMatchingElementIds(elements, allGroups, this.groupLogic);
  }

  /**
   * Get statistics
   */
  getStats(elements: BuilderElement[]): FilterStats {
    const allGroups = [...this.groups];
    const quickGroup = this.getActiveQuickFiltersGroup();
    if (quickGroup) {
      allGroups.push(quickGroup);
    }

    return calculateFilterStats(elements, allGroups, this.groupLogic);
  }

  /**
   * Save current state as preset
   */
  saveAsPreset(name: string, description?: string): FilterPreset {
    const preset = createFilterPreset(name, this.groups, description);
    preset.quickFilters = this.quickFilters.filter((qf) => qf.active);
    saveFilterPreset(preset);
    return preset;
  }

  /**
   * Load preset
   */
  loadPreset(preset: FilterPreset): void {
    this.groups = preset.groups.map((g) => ({ ...g }));
    this.quickFilters = this.quickFilters.map((qf) => ({
      ...qf,
      active: preset.quickFilters.some((pqf) => pqf.id === qf.id),
    }));
  }

  /**
   * Check if any filters are active
   */
  hasActiveFilters(): boolean {
    const hasGroupFilters = this.groups.some(
      (g) => g.enabled && g.filters.some((f) => f.enabled)
    );
    const hasQuickFilters = this.quickFilters.some((qf) => qf.active);
    return hasGroupFilters || hasQuickFilters;
  }
}

// Export default instance
export const defaultFilterSystem = new FilterSystem();
