/**
 * Keyboard Shortcuts System
 *
 * A comprehensive, customizable keyboard shortcuts system with:
 * - Platform-aware shortcuts (Mac: Cmd, Windows/Linux: Ctrl)
 * - Shortcut conflict detection
 * - Serialization/deserialization for storage
 * - Context-aware shortcut handling
 * - Full TypeScript type safety
 */

// ============================================================================
// TYPES
// ============================================================================

export type ShortcutContext = 'global' | 'canvas' | 'element' | 'panel' | 'modal';

export type ShortcutCategory =
  | 'editing'
  | 'navigation'
  | 'view'
  | 'elements'
  | 'history'
  | 'file'
  | 'tools';

export interface KeyCombo {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

export interface ShortcutDefinition {
  id: string;
  name: string;
  description: string;
  category: ShortcutCategory;
  contexts: ShortcutContext[];
  defaultShortcut: KeyCombo;
  customShortcut?: KeyCombo;
  enabled: boolean;
  allowOverride: boolean;
}

export interface ShortcutConflict {
  shortcutId1: string;
  shortcutId2: string;
  combo: KeyCombo;
  context: ShortcutContext;
}

export interface ShortcutConfig {
  shortcuts: Record<string, Partial<ShortcutDefinition>>;
  version: number;
}

// ============================================================================
// PLATFORM DETECTION
// ============================================================================

/**
 * Detects if the current platform is macOS
 */
export function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

/**
 * Gets the modifier key name based on platform
 */
export function getModifierKeyName(): string {
  return isMacPlatform() ? 'Cmd' : 'Ctrl';
}

/**
 * Gets the platform-specific modifier key symbol
 */
export function getModifierSymbol(): string {
  return isMacPlatform() ? '\u2318' : 'Ctrl';
}

// ============================================================================
// KEY COMBO UTILITIES
// ============================================================================

/**
 * Normalizes a key string to a standard format
 */
export function normalizeKey(key: string): string {
  const keyMap: Record<string, string> = {
    ' ': 'Space',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    '+': 'Plus',
    '-': 'Minus',
    '=': 'Equal',
    '[': 'BracketLeft',
    ']': 'BracketRight',
  };
  return keyMap[key] || key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
}

/**
 * Converts a KeyboardEvent to a KeyCombo
 */
export function eventToKeyCombo(event: KeyboardEvent): KeyCombo {
  return {
    key: normalizeKey(event.key),
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
    meta: event.metaKey,
  };
}

/**
 * Compares two KeyCombos for equality
 */
export function keyComboEquals(a: KeyCombo, b: KeyCombo): boolean {
  return (
    a.key.toLowerCase() === b.key.toLowerCase() &&
    !!a.ctrl === !!b.ctrl &&
    !!a.alt === !!b.alt &&
    !!a.shift === !!b.shift &&
    !!a.meta === !!b.meta
  );
}

/**
 * Checks if the event matches the key combo (platform-aware)
 */
export function matchesKeyCombo(event: KeyboardEvent, combo: KeyCombo): boolean {
  const isMac = isMacPlatform();
  const eventCombo = eventToKeyCombo(event);

  // Platform-aware modifier handling
  // On Mac, use meta (Cmd) as the primary modifier
  // On Windows/Linux, use ctrl as the primary modifier
  const useModifier = isMac ? combo.meta || combo.ctrl : combo.ctrl;
  const eventModifier = isMac ? event.metaKey : event.ctrlKey;

  if (useModifier && !eventModifier) return false;
  if (!useModifier && eventModifier) return false;

  return (
    eventCombo.key.toLowerCase() === combo.key.toLowerCase() &&
    !!combo.alt === event.altKey &&
    !!combo.shift === event.shiftKey
  );
}

/**
 * Formats a KeyCombo as a human-readable string
 */
export function formatKeyCombo(combo: KeyCombo): string {
  const isMac = isMacPlatform();
  const parts: string[] = [];

  if (combo.ctrl || combo.meta) {
    parts.push(isMac ? '\u2318' : 'Ctrl');
  }
  if (combo.alt) {
    parts.push(isMac ? '\u2325' : 'Alt');
  }
  if (combo.shift) {
    parts.push(isMac ? '\u21E7' : 'Shift');
  }

  // Format special keys
  const keyDisplay: Record<string, string> = {
    Delete: isMac ? '\u232B' : 'Del',
    Backspace: '\u232B',
    Enter: isMac ? '\u21A9' : 'Enter',
    Escape: 'Esc',
    Space: 'Space',
    Up: '\u2191',
    Down: '\u2193',
    Left: '\u2190',
    Right: '\u2192',
    Plus: '+',
    Minus: '-',
    Equal: '=',
    BracketLeft: '[',
    BracketRight: ']',
  };

  parts.push(keyDisplay[combo.key] || combo.key);

  return parts.join(isMac ? '' : '+');
}

/**
 * Parses a string representation into a KeyCombo
 */
export function parseKeyCombo(str: string): KeyCombo {
  const parts = str.split('+').map((p) => p.trim().toLowerCase());
  const combo: KeyCombo = {
    key: '',
    ctrl: false,
    alt: false,
    shift: false,
    meta: false,
  };

  for (const part of parts) {
    if (part === 'ctrl' || part === 'cmd' || part === '\u2318') {
      combo.ctrl = true;
    } else if (part === 'alt' || part === 'option' || part === '\u2325') {
      combo.alt = true;
    } else if (part === 'shift' || part === '\u21e7') {
      combo.shift = true;
    } else if (part === 'meta') {
      combo.meta = true;
    } else {
      combo.key = normalizeKey(part);
    }
  }

  return combo;
}

// ============================================================================
// DEFAULT SHORTCUTS
// ============================================================================

export const DEFAULT_SHORTCUTS: ShortcutDefinition[] = [
  // History
  {
    id: 'undo',
    name: 'Undo',
    description: 'Undo the last action',
    category: 'history',
    contexts: ['global'],
    defaultShortcut: { key: 'z', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'redo',
    name: 'Redo',
    description: 'Redo the last undone action',
    category: 'history',
    contexts: ['global'],
    defaultShortcut: { key: 'z', ctrl: true, shift: true },
    enabled: true,
    allowOverride: true,
  },

  // Editing
  {
    id: 'copy',
    name: 'Copy',
    description: 'Copy selected element',
    category: 'editing',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'c', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'paste',
    name: 'Paste',
    description: 'Paste copied element',
    category: 'editing',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'v', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'cut',
    name: 'Cut',
    description: 'Cut selected element',
    category: 'editing',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'x', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'duplicate',
    name: 'Duplicate',
    description: 'Duplicate selected element',
    category: 'editing',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'd', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'delete',
    name: 'Delete',
    description: 'Delete selected element',
    category: 'editing',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'Delete' },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'deleteBackspace',
    name: 'Delete (Backspace)',
    description: 'Delete selected element using backspace',
    category: 'editing',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'Backspace' },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'selectAll',
    name: 'Select All',
    description: 'Select all elements on canvas',
    category: 'editing',
    contexts: ['canvas'],
    defaultShortcut: { key: 'a', ctrl: true },
    enabled: true,
    allowOverride: true,
  },

  // File operations
  {
    id: 'save',
    name: 'Save',
    description: 'Save current project',
    category: 'file',
    contexts: ['global'],
    defaultShortcut: { key: 's', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'export',
    name: 'Export',
    description: 'Export project as code',
    category: 'file',
    contexts: ['global'],
    defaultShortcut: { key: 'e', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'preview',
    name: 'Preview',
    description: 'Toggle preview mode',
    category: 'file',
    contexts: ['global'],
    defaultShortcut: { key: 'p', ctrl: true },
    enabled: true,
    allowOverride: true,
  },

  // View
  {
    id: 'toggleGrid',
    name: 'Toggle Grid',
    description: 'Show/hide canvas grid',
    category: 'view',
    contexts: ['global', 'canvas'],
    defaultShortcut: { key: 'g', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'toggleSidebar',
    name: 'Toggle Sidebar',
    description: 'Show/hide component sidebar',
    category: 'view',
    contexts: ['global'],
    defaultShortcut: { key: 'b', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'toggleCodePreview',
    name: 'Toggle Code Preview',
    description: 'Show/hide code preview panel',
    category: 'view',
    contexts: ['global'],
    defaultShortcut: { key: 'c', ctrl: true, shift: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'zoomIn',
    name: 'Zoom In',
    description: 'Increase canvas zoom',
    category: 'view',
    contexts: ['global', 'canvas'],
    defaultShortcut: { key: 'Equal', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'zoomOut',
    name: 'Zoom Out',
    description: 'Decrease canvas zoom',
    category: 'view',
    contexts: ['global', 'canvas'],
    defaultShortcut: { key: 'Minus', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'resetZoom',
    name: 'Reset Zoom',
    description: 'Reset canvas zoom to 100%',
    category: 'view',
    contexts: ['global', 'canvas'],
    defaultShortcut: { key: '0', ctrl: true },
    enabled: true,
    allowOverride: true,
  },

  // Navigation
  {
    id: 'navigateUp',
    name: 'Navigate Up',
    description: 'Select element above',
    category: 'navigation',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'Up' },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'navigateDown',
    name: 'Navigate Down',
    description: 'Select element below',
    category: 'navigation',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'Down' },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'navigateLeft',
    name: 'Navigate Left',
    description: 'Select element to the left',
    category: 'navigation',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'Left' },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'navigateRight',
    name: 'Navigate Right',
    description: 'Select element to the right',
    category: 'navigation',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'Right' },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'navigateParent',
    name: 'Navigate to Parent',
    description: 'Select parent element',
    category: 'navigation',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'Escape' },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'navigateChild',
    name: 'Navigate to Child',
    description: 'Select first child element',
    category: 'navigation',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'Enter' },
    enabled: true,
    allowOverride: true,
  },

  // Element operations
  {
    id: 'moveUp',
    name: 'Move Up',
    description: 'Move element up by 1px',
    category: 'elements',
    contexts: ['element'],
    defaultShortcut: { key: 'Up', shift: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'moveDown',
    name: 'Move Down',
    description: 'Move element down by 1px',
    category: 'elements',
    contexts: ['element'],
    defaultShortcut: { key: 'Down', shift: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'moveLeft',
    name: 'Move Left',
    description: 'Move element left by 1px',
    category: 'elements',
    contexts: ['element'],
    defaultShortcut: { key: 'Left', shift: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'moveRight',
    name: 'Move Right',
    description: 'Move element right by 1px',
    category: 'elements',
    contexts: ['element'],
    defaultShortcut: { key: 'Right', shift: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'group',
    name: 'Group',
    description: 'Group selected elements',
    category: 'elements',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'g', ctrl: true, shift: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'ungroup',
    name: 'Ungroup',
    description: 'Ungroup selected group',
    category: 'elements',
    contexts: ['canvas', 'element'],
    defaultShortcut: { key: 'g', ctrl: true, shift: true, alt: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'bringForward',
    name: 'Bring Forward',
    description: 'Move element one level forward',
    category: 'elements',
    contexts: ['element'],
    defaultShortcut: { key: 'BracketRight', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'sendBackward',
    name: 'Send Backward',
    description: 'Move element one level backward',
    category: 'elements',
    contexts: ['element'],
    defaultShortcut: { key: 'BracketLeft', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'bringToFront',
    name: 'Bring to Front',
    description: 'Move element to front',
    category: 'elements',
    contexts: ['element'],
    defaultShortcut: { key: 'BracketRight', ctrl: true, shift: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'sendToBack',
    name: 'Send to Back',
    description: 'Move element to back',
    category: 'elements',
    contexts: ['element'],
    defaultShortcut: { key: 'BracketLeft', ctrl: true, shift: true },
    enabled: true,
    allowOverride: true,
  },

  // Tools
  {
    id: 'quickSearch',
    name: 'Quick Search',
    description: 'Open command palette',
    category: 'tools',
    contexts: ['global'],
    defaultShortcut: { key: 'k', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
  {
    id: 'escape',
    name: 'Cancel / Deselect',
    description: 'Cancel current action or deselect',
    category: 'tools',
    contexts: ['global'],
    defaultShortcut: { key: 'Escape' },
    enabled: true,
    allowOverride: false,
  },
  {
    id: 'showShortcuts',
    name: 'Show Shortcuts',
    description: 'Open keyboard shortcuts reference',
    category: 'tools',
    contexts: ['global'],
    defaultShortcut: { key: '/', ctrl: true },
    enabled: true,
    allowOverride: true,
  },
];

// ============================================================================
// SHORTCUT MANAGER
// ============================================================================

const STORAGE_KEY = 'tailwind-builder-shortcuts';
const CONFIG_VERSION = 1;

export class ShortcutManager {
  private shortcuts: Map<string, ShortcutDefinition> = new Map();
  private listeners: Map<string, Set<(event: KeyboardEvent) => void>> = new Map();
  private globalListeners: Set<(shortcutId: string, event: KeyboardEvent) => void> =
    new Set();

  constructor() {
    this.loadDefaults();
    this.loadFromStorage();
  }

  /**
   * Loads default shortcuts into the manager
   */
  private loadDefaults(): void {
    for (const shortcut of DEFAULT_SHORTCUTS) {
      this.shortcuts.set(shortcut.id, { ...shortcut });
    }
  }

  /**
   * Loads custom shortcuts from localStorage
   */
  loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const config: ShortcutConfig = JSON.parse(stored);

      if (config.version !== CONFIG_VERSION) {
        console.warn('Shortcut config version mismatch, using defaults');
        return;
      }

      for (const [id, customization] of Object.entries(config.shortcuts)) {
        const existing = this.shortcuts.get(id);
        if (existing && existing.allowOverride) {
          this.shortcuts.set(id, { ...existing, ...customization });
        }
      }
    } catch (error) {
      console.error('Failed to load shortcuts from storage:', error);
    }
  }

  /**
   * Saves current shortcuts to localStorage
   */
  saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const customizations: Record<string, Partial<ShortcutDefinition>> = {};

      for (const [id, shortcut] of this.shortcuts) {
        const defaultDef = DEFAULT_SHORTCUTS.find((s) => s.id === id);
        if (!defaultDef) continue;

        const changes: Partial<ShortcutDefinition> = {};

        if (shortcut.customShortcut) {
          changes.customShortcut = shortcut.customShortcut;
        }
        if (shortcut.enabled !== defaultDef.enabled) {
          changes.enabled = shortcut.enabled;
        }

        if (Object.keys(changes).length > 0) {
          customizations[id] = changes;
        }
      }

      const config: ShortcutConfig = {
        shortcuts: customizations,
        version: CONFIG_VERSION,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save shortcuts to storage:', error);
    }
  }

  /**
   * Gets a shortcut by ID
   */
  getShortcut(id: string): ShortcutDefinition | undefined {
    return this.shortcuts.get(id);
  }

  /**
   * Gets all shortcuts
   */
  getAllShortcuts(): ShortcutDefinition[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Gets shortcuts by category
   */
  getShortcutsByCategory(category: ShortcutCategory): ShortcutDefinition[] {
    return this.getAllShortcuts().filter((s) => s.category === category);
  }

  /**
   * Gets the active key combo for a shortcut (custom or default)
   */
  getActiveKeyCombo(shortcutId: string): KeyCombo | undefined {
    const shortcut = this.shortcuts.get(shortcutId);
    if (!shortcut) return undefined;
    return shortcut.customShortcut || shortcut.defaultShortcut;
  }

  /**
   * Updates a shortcut's custom key combo
   */
  setCustomShortcut(shortcutId: string, combo: KeyCombo | null): void {
    const shortcut = this.shortcuts.get(shortcutId);
    if (!shortcut || !shortcut.allowOverride) return;

    if (combo === null) {
      delete shortcut.customShortcut;
    } else {
      shortcut.customShortcut = combo;
    }

    this.shortcuts.set(shortcutId, shortcut);
    this.saveToStorage();
  }

  /**
   * Enables or disables a shortcut
   */
  setShortcutEnabled(shortcutId: string, enabled: boolean): void {
    const shortcut = this.shortcuts.get(shortcutId);
    if (!shortcut) return;

    shortcut.enabled = enabled;
    this.shortcuts.set(shortcutId, shortcut);
    this.saveToStorage();
  }

  /**
   * Resets a shortcut to its default
   */
  resetShortcut(shortcutId: string): void {
    const defaultDef = DEFAULT_SHORTCUTS.find((s) => s.id === shortcutId);
    if (!defaultDef) return;

    this.shortcuts.set(shortcutId, { ...defaultDef });
    this.saveToStorage();
  }

  /**
   * Resets all shortcuts to defaults
   */
  resetAllShortcuts(): void {
    this.shortcuts.clear();
    this.loadDefaults();
    this.saveToStorage();
  }

  /**
   * Detects conflicts between shortcuts in overlapping contexts
   */
  detectConflicts(): ShortcutConflict[] {
    const conflicts: ShortcutConflict[] = [];
    const shortcuts = this.getAllShortcuts().filter((s) => s.enabled);

    for (let i = 0; i < shortcuts.length; i++) {
      for (let j = i + 1; j < shortcuts.length; j++) {
        const s1 = shortcuts[i];
        const s2 = shortcuts[j];

        const combo1 = s1.customShortcut || s1.defaultShortcut;
        const combo2 = s2.customShortcut || s2.defaultShortcut;

        if (!keyComboEquals(combo1, combo2)) continue;

        // Check for overlapping contexts
        const overlappingContexts = s1.contexts.filter((c) =>
          s2.contexts.includes(c)
        );

        for (const context of overlappingContexts) {
          conflicts.push({
            shortcutId1: s1.id,
            shortcutId2: s2.id,
            combo: combo1,
            context,
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * Checks if a key combo would conflict with existing shortcuts
   */
  wouldConflict(
    shortcutId: string,
    combo: KeyCombo,
    contexts: ShortcutContext[]
  ): ShortcutDefinition[] {
    const conflicts: ShortcutDefinition[] = [];

    for (const shortcut of this.getAllShortcuts()) {
      if (shortcut.id === shortcutId) continue;
      if (!shortcut.enabled) continue;

      const existingCombo = shortcut.customShortcut || shortcut.defaultShortcut;
      if (!keyComboEquals(existingCombo, combo)) continue;

      const hasOverlap = shortcut.contexts.some((c) => contexts.includes(c));
      if (hasOverlap) {
        conflicts.push(shortcut);
      }
    }

    return conflicts;
  }

  /**
   * Finds which shortcut matches a keyboard event in the given context
   */
  findMatchingShortcut(
    event: KeyboardEvent,
    context: ShortcutContext
  ): ShortcutDefinition | undefined {
    for (const shortcut of this.shortcuts.values()) {
      if (!shortcut.enabled) continue;
      if (!shortcut.contexts.includes(context) && !shortcut.contexts.includes('global'))
        continue;

      const combo = shortcut.customShortcut || shortcut.defaultShortcut;
      if (matchesKeyCombo(event, combo)) {
        return shortcut;
      }
    }

    return undefined;
  }

  /**
   * Registers a listener for a specific shortcut
   */
  onShortcut(shortcutId: string, callback: (event: KeyboardEvent) => void): () => void {
    if (!this.listeners.has(shortcutId)) {
      this.listeners.set(shortcutId, new Set());
    }
    this.listeners.get(shortcutId)!.add(callback);

    return () => {
      this.listeners.get(shortcutId)?.delete(callback);
    };
  }

  /**
   * Registers a global listener for all shortcuts
   */
  onAnyShortcut(
    callback: (shortcutId: string, event: KeyboardEvent) => void
  ): () => void {
    this.globalListeners.add(callback);
    return () => {
      this.globalListeners.delete(callback);
    };
  }

  /**
   * Triggers listeners for a shortcut
   */
  trigger(shortcutId: string, event: KeyboardEvent): void {
    const listeners = this.listeners.get(shortcutId);
    if (listeners) {
      for (const callback of listeners) {
        callback(event);
      }
    }

    for (const callback of this.globalListeners) {
      callback(shortcutId, event);
    }
  }

  /**
   * Exports shortcuts configuration
   */
  exportConfig(): string {
    const customizations: Record<string, Partial<ShortcutDefinition>> = {};

    for (const [id, shortcut] of this.shortcuts) {
      if (shortcut.customShortcut || !shortcut.enabled) {
        customizations[id] = {
          customShortcut: shortcut.customShortcut,
          enabled: shortcut.enabled,
        };
      }
    }

    return JSON.stringify({ shortcuts: customizations, version: CONFIG_VERSION }, null, 2);
  }

  /**
   * Imports shortcuts configuration
   */
  importConfig(configJson: string): boolean {
    try {
      const config: ShortcutConfig = JSON.parse(configJson);

      if (config.version !== CONFIG_VERSION) {
        console.error('Invalid config version');
        return false;
      }

      for (const [id, customization] of Object.entries(config.shortcuts)) {
        const existing = this.shortcuts.get(id);
        if (existing && existing.allowOverride) {
          this.shortcuts.set(id, { ...existing, ...customization });
        }
      }

      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Failed to import shortcuts config:', error);
      return false;
    }
  }
}

// Singleton instance
let shortcutManagerInstance: ShortcutManager | null = null;

export function getShortcutManager(): ShortcutManager {
  if (!shortcutManagerInstance) {
    shortcutManagerInstance = new ShortcutManager();
  }
  return shortcutManagerInstance;
}

// ============================================================================
// CATEGORY METADATA
// ============================================================================

export const CATEGORY_INFO: Record<
  ShortcutCategory,
  { name: string; description: string; icon: string }
> = {
  editing: {
    name: 'Editing',
    description: 'Copy, paste, delete, and modify elements',
    icon: 'Edit3',
  },
  navigation: {
    name: 'Navigation',
    description: 'Navigate between elements',
    icon: 'Navigation',
  },
  view: {
    name: 'View',
    description: 'Control canvas and panel visibility',
    icon: 'Eye',
  },
  elements: {
    name: 'Elements',
    description: 'Manipulate element properties',
    icon: 'Layers',
  },
  history: {
    name: 'History',
    description: 'Undo and redo actions',
    icon: 'RotateCcw',
  },
  file: {
    name: 'File',
    description: 'Save, export, and preview',
    icon: 'File',
  },
  tools: {
    name: 'Tools',
    description: 'Access tools and utilities',
    icon: 'Settings',
  },
};
