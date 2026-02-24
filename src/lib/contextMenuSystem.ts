/**
 * Context Menu System
 *
 * A comprehensive type-safe context menu system for the Visual Tailwind Builder.
 * Supports nested submenus, conditional visibility, keyboard shortcuts, and
 * dynamic menu generation based on context.
 */

import type { BuilderElement } from '@/types/builder';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Context types that determine which menu to show
 */
export type ContextMenuType = 'element' | 'canvas' | 'sidebar';

/**
 * Context data passed to menu items for conditional logic
 */
export interface MenuContext {
  /** The type of context menu being displayed */
  type: ContextMenuType;
  /** The currently selected element (if any) */
  selectedElement: BuilderElement | null;
  /** The element that was right-clicked (may differ from selected) */
  targetElement: BuilderElement | null;
  /** Parent element of the target (if any) */
  parentElement: BuilderElement | null;
  /** Whether there is content in the clipboard */
  hasClipboard: boolean;
  /** Current zoom level */
  zoom: number;
  /** Whether grid is currently shown */
  showGrid: boolean;
  /** Number of elements on canvas */
  elementCount: number;
  /** Whether the target is a container element */
  isContainer: boolean;
  /** Whether the target element is locked */
  isLocked: boolean;
  /** Whether the target element is hidden */
  isHidden: boolean;
  /** Whether the element can move up in its sibling list */
  canMoveUp: boolean;
  /** Whether the element can move down in its sibling list */
  canMoveDown: boolean;
  /** Depth of the element in the tree */
  depth: number;
  /** Siblings count */
  siblingsCount: number;
  /** Index in siblings */
  siblingIndex: number;
  /** Custom data for specific contexts */
  customData?: Record<string, unknown>;
}

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  /** Display text (e.g., "Ctrl+C") */
  display: string;
  /** Key combination for matching */
  key: string;
  /** Whether Ctrl/Cmd is required */
  ctrlKey?: boolean;
  /** Whether Shift is required */
  shiftKey?: boolean;
  /** Whether Alt is required */
  altKey?: boolean;
  /** Whether Meta (Cmd on Mac) is required */
  metaKey?: boolean;
}

/**
 * Base menu item interface
 */
export interface BaseMenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Display label */
  label: string;
  /** Optional icon (Lucide icon name or component) */
  icon?: string | LucideIcon;
  /** Optional keyboard shortcut */
  shortcut?: KeyboardShortcut;
  /** Whether the item is disabled */
  disabled?: boolean | ((context: MenuContext) => boolean);
  /** Whether the item is visible */
  visible?: boolean | ((context: MenuContext) => boolean);
  /** Danger/destructive action styling */
  danger?: boolean;
  /** Optional description/tooltip */
  description?: string;
}

/**
 * Action menu item - executes an action when clicked
 */
export interface ActionMenuItem extends BaseMenuItem {
  type: 'action';
  /** Action to execute */
  action: string;
  /** Optional action parameters */
  actionParams?: Record<string, unknown>;
}

/**
 * Submenu item - contains nested menu items
 */
export interface SubmenuItem extends BaseMenuItem {
  type: 'submenu';
  /** Nested menu items */
  items: MenuItem[];
}

/**
 * Separator/divider item
 */
export interface SeparatorItem {
  type: 'separator';
  id: string;
  /** Whether the separator is visible */
  visible?: boolean | ((context: MenuContext) => boolean);
}

/**
 * Group label item
 */
export interface GroupLabelItem {
  type: 'group-label';
  id: string;
  label: string;
  /** Whether the label is visible */
  visible?: boolean | ((context: MenuContext) => boolean);
}

/**
 * Checkbox menu item
 */
export interface CheckboxMenuItem extends BaseMenuItem {
  type: 'checkbox';
  /** Whether the checkbox is checked */
  checked: boolean | ((context: MenuContext) => boolean);
  /** Action to toggle */
  action: string;
}

/**
 * Radio group menu item
 */
export interface RadioGroupItem extends BaseMenuItem {
  type: 'radio-group';
  /** Current value */
  value: string | ((context: MenuContext) => string);
  /** Available options */
  options: Array<{
    label: string;
    value: string;
    icon?: string | LucideIcon;
  }>;
  /** Action to change value */
  action: string;
}

/**
 * Union type for all menu items
 */
export type MenuItem =
  | ActionMenuItem
  | SubmenuItem
  | SeparatorItem
  | GroupLabelItem
  | CheckboxMenuItem
  | RadioGroupItem;

/**
 * Menu definition
 */
export interface MenuDefinition {
  /** Unique identifier for the menu */
  id: string;
  /** Menu type */
  type: ContextMenuType;
  /** Menu items */
  items: MenuItem[];
  /** Optional dynamic item generator */
  dynamicItems?: (context: MenuContext) => MenuItem[];
}

/**
 * Action handler function type
 */
export type ActionHandler = (
  action: string,
  context: MenuContext,
  params?: Record<string, unknown>
) => void | Promise<void>;

// ============================================================================
// MENU REGISTRY
// ============================================================================

/**
 * Registry for storing menu definitions
 */
class ContextMenuRegistry {
  private menus: Map<string, MenuDefinition> = new Map();
  private actionHandlers: Map<string, ActionHandler> = new Map();

  /**
   * Register a menu definition
   */
  registerMenu(menu: MenuDefinition): void {
    this.menus.set(menu.id, menu);
  }

  /**
   * Unregister a menu definition
   */
  unregisterMenu(menuId: string): void {
    this.menus.delete(menuId);
  }

  /**
   * Get a menu definition by ID
   */
  getMenu(menuId: string): MenuDefinition | undefined {
    return this.menus.get(menuId);
  }

  /**
   * Get menu by type
   */
  getMenuByType(type: ContextMenuType): MenuDefinition | undefined {
    for (const menu of this.menus.values()) {
      if (menu.type === type) {
        return menu;
      }
    }
    return undefined;
  }

  /**
   * Register an action handler
   */
  registerActionHandler(action: string, handler: ActionHandler): void {
    this.actionHandlers.set(action, handler);
  }

  /**
   * Unregister an action handler
   */
  unregisterActionHandler(action: string): void {
    this.actionHandlers.delete(action);
  }

  /**
   * Get an action handler
   */
  getActionHandler(action: string): ActionHandler | undefined {
    return this.actionHandlers.get(action);
  }

  /**
   * Execute an action
   */
  async executeAction(
    action: string,
    context: MenuContext,
    params?: Record<string, unknown>
  ): Promise<void> {
    const handler = this.actionHandlers.get(action);
    if (handler) {
      await handler(action, context, params);
    } else {
      console.warn(`No handler registered for action: ${action}`);
    }
  }

  /**
   * Get all registered menus
   */
  getAllMenus(): MenuDefinition[] {
    return Array.from(this.menus.values());
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.menus.clear();
    this.actionHandlers.clear();
  }
}

// Global registry instance
export const contextMenuRegistry = new ContextMenuRegistry();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Evaluates a conditional value (function or static)
 */
export function evaluateCondition<T>(
  value: T | ((context: MenuContext) => T),
  context: MenuContext
): T {
  if (typeof value === 'function') {
    return (value as (context: MenuContext) => T)(context);
  }
  return value;
}

/**
 * Checks if a menu item should be visible
 */
export function isMenuItemVisible(item: MenuItem, context: MenuContext): boolean {
  if ('visible' in item && item.visible !== undefined) {
    return evaluateCondition(item.visible, context);
  }
  return true;
}

/**
 * Checks if a menu item should be disabled
 */
export function isMenuItemDisabled(item: MenuItem, context: MenuContext): boolean {
  if ('disabled' in item && item.disabled !== undefined) {
    return evaluateCondition(item.disabled, context);
  }
  return false;
}

/**
 * Filters menu items based on visibility
 */
export function filterVisibleItems(items: MenuItem[], context: MenuContext): MenuItem[] {
  return items.filter((item) => isMenuItemVisible(item, context));
}

/**
 * Processes a menu definition and returns visible items
 */
export function processMenuItems(
  menu: MenuDefinition,
  context: MenuContext
): MenuItem[] {
  let items = [...menu.items];

  // Add dynamic items if generator is provided
  if (menu.dynamicItems) {
    const dynamicItems = menu.dynamicItems(context);
    items = [...items, ...dynamicItems];
  }

  // Filter visible items
  items = filterVisibleItems(items, context);

  // Process submenus recursively
  items = items.map((item) => {
    if (item.type === 'submenu') {
      return {
        ...item,
        items: filterVisibleItems(item.items, context),
      };
    }
    return item;
  });

  // Remove consecutive separators and trailing/leading separators
  items = cleanupSeparators(items);

  return items;
}

/**
 * Removes consecutive, leading, and trailing separators
 */
export function cleanupSeparators(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = [];
  let lastWasSeparator = true; // Treat start as separator to remove leading

  for (const item of items) {
    if (item.type === 'separator') {
      if (!lastWasSeparator) {
        result.push(item);
        lastWasSeparator = true;
      }
    } else {
      result.push(item);
      lastWasSeparator = false;
    }
  }

  // Remove trailing separator
  while (result.length > 0 && result[result.length - 1].type === 'separator') {
    result.pop();
  }

  return result;
}

/**
 * Creates a default context from the current state
 */
export function createMenuContext(params: {
  type: ContextMenuType;
  selectedElement: BuilderElement | null;
  targetElement: BuilderElement | null;
  parentElement: BuilderElement | null;
  hasClipboard: boolean;
  zoom: number;
  showGrid: boolean;
  elementCount: number;
  elements: BuilderElement[];
  customData?: Record<string, unknown>;
}): MenuContext {
  const {
    type,
    selectedElement,
    targetElement,
    parentElement,
    hasClipboard,
    zoom,
    showGrid,
    elementCount,
    elements,
    customData,
  } = params;

  // Calculate element position in siblings
  let siblingIndex = -1;
  let siblingsCount = 0;

  if (targetElement && parentElement) {
    siblingIndex = parentElement.children.findIndex(
      (child) => child.id === targetElement.id
    );
    siblingsCount = parentElement.children.length;
  } else if (targetElement) {
    siblingIndex = elements.findIndex((el) => el.id === targetElement.id);
    siblingsCount = elements.length;
  }

  // Calculate depth
  let depth = 0;
  if (targetElement) {
    let current: BuilderElement | null = targetElement;
    while (current?.parentId) {
      depth++;
      current = elements.find((el) => el.id === current?.parentId) || null;
    }
  }

  // Check container status
  const containerTypes = [
    'container',
    'grid-2-col',
    'grid-3-col',
    'grid-4-col',
    'flex-row',
    'flex-column',
    'button-group',
    'navbar',
    'footer',
    'tabs',
    'hero-section',
    'hero-with-image',
    'feature-section',
    'cta-section',
    'stats-section',
    'testimonials-section',
    'team-section',
    'faq-section',
    'pricing-section',
    'contact-section',
    'simple-card',
    'mobile-menu',
    'login-form',
    'signup-form',
    'contact-form',
  ];

  const isContainer = targetElement
    ? containerTypes.includes(targetElement.type)
    : false;

  // Check locked/hidden status from element props
  const isLocked = targetElement?.props?.locked === true;
  const isHidden = targetElement?.props?.hidden === true;

  return {
    type,
    selectedElement,
    targetElement,
    parentElement,
    hasClipboard,
    zoom,
    showGrid,
    elementCount,
    isContainer,
    isLocked,
    isHidden,
    canMoveUp: siblingIndex > 0,
    canMoveDown: siblingIndex < siblingsCount - 1 && siblingIndex >= 0,
    depth,
    siblingsCount,
    siblingIndex,
    customData,
  };
}

/**
 * Parses a keyboard shortcut string into a KeyboardShortcut object
 */
export function parseShortcut(shortcutString: string): KeyboardShortcut {
  const parts = shortcutString.split('+').map((p) => p.trim().toLowerCase());
  const key = parts[parts.length - 1];

  return {
    display: shortcutString,
    key: key.toUpperCase(),
    ctrlKey: parts.includes('ctrl') || parts.includes('cmd'),
    shiftKey: parts.includes('shift'),
    altKey: parts.includes('alt'),
    metaKey: parts.includes('meta') || parts.includes('cmd'),
  };
}

/**
 * Creates a shortcut with automatic platform detection
 */
export function createShortcut(
  key: string,
  options: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  } = {}
): KeyboardShortcut {
  const { ctrl = false, shift = false, alt = false } = options;
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

  const parts: string[] = [];
  if (ctrl) parts.push(isMac ? 'Cmd' : 'Ctrl');
  if (shift) parts.push('Shift');
  if (alt) parts.push('Alt');
  parts.push(key.toUpperCase());

  return {
    display: parts.join('+'),
    key: key.toUpperCase(),
    ctrlKey: !isMac && ctrl,
    metaKey: isMac && ctrl,
    shiftKey: shift,
    altKey: alt,
  };
}

// ============================================================================
// MENU ITEM BUILDERS
// ============================================================================

/**
 * Creates an action menu item
 */
export function createActionItem(
  id: string,
  label: string,
  action: string,
  options: Partial<Omit<ActionMenuItem, 'type' | 'id' | 'label' | 'action'>> = {}
): ActionMenuItem {
  return {
    type: 'action',
    id,
    label,
    action,
    ...options,
  };
}

/**
 * Creates a submenu item
 */
export function createSubmenuItem(
  id: string,
  label: string,
  items: MenuItem[],
  options: Partial<Omit<SubmenuItem, 'type' | 'id' | 'label' | 'items'>> = {}
): SubmenuItem {
  return {
    type: 'submenu',
    id,
    label,
    items,
    ...options,
  };
}

/**
 * Creates a separator item
 */
export function createSeparator(id: string): SeparatorItem {
  return {
    type: 'separator',
    id,
  };
}

/**
 * Creates a group label item
 */
export function createGroupLabel(id: string, label: string): GroupLabelItem {
  return {
    type: 'group-label',
    id,
    label,
  };
}

/**
 * Creates a checkbox menu item
 */
export function createCheckboxItem(
  id: string,
  label: string,
  action: string,
  checked: boolean | ((context: MenuContext) => boolean),
  options: Partial<Omit<CheckboxMenuItem, 'type' | 'id' | 'label' | 'action' | 'checked'>> = {}
): CheckboxMenuItem {
  return {
    type: 'checkbox',
    id,
    label,
    action,
    checked,
    ...options,
  };
}

/**
 * Creates a radio group menu item
 */
export function createRadioGroup(
  id: string,
  label: string,
  action: string,
  value: string | ((context: MenuContext) => string),
  options: Array<{ label: string; value: string; icon?: string | LucideIcon }>,
  extra: Partial<Omit<RadioGroupItem, 'type' | 'id' | 'label' | 'action' | 'value' | 'options'>> = {}
): RadioGroupItem {
  return {
    type: 'radio-group',
    id,
    label,
    action,
    value,
    options,
    ...extra,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default contextMenuRegistry;
