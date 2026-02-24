/**
 * Command Palette System
 *
 * A comprehensive command system featuring:
 * - Command registry with categories
 * - Fuzzy search matching
 * - Command history
 * - Context-aware commands
 * - Keyboard shortcuts integration
 */

import {
  getShortcutManager,
  formatKeyCombo,
  type KeyCombo,
  type ShortcutContext,
} from './keyboardShortcuts';

// ============================================================================
// TYPES
// ============================================================================

export type CommandCategory =
  | 'file'
  | 'edit'
  | 'view'
  | 'element'
  | 'navigation'
  | 'help'
  | 'recent';

export interface Command {
  id: string;
  name: string;
  description?: string;
  category: CommandCategory;
  icon?: string;
  shortcutId?: string;
  keywords?: string[];
  contexts?: ShortcutContext[];
  enabled?: boolean | (() => boolean);
  execute: () => void | Promise<void>;
}

export interface CommandSearchResult {
  command: Command;
  score: number;
  matches: CommandMatch[];
}

export interface CommandMatch {
  field: 'name' | 'description' | 'keywords';
  indices: [number, number][];
}

export interface CommandHistoryEntry {
  commandId: string;
  timestamp: number;
}

// ============================================================================
// FUZZY MATCHING
// ============================================================================

/**
 * Calculates fuzzy match score between query and text
 * Returns score (higher is better) and matching indices
 */
function fuzzyMatch(
  query: string,
  text: string
): { score: number; indices: [number, number][] } | null {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Empty query matches everything
  if (!query) {
    return { score: 0, indices: [] };
  }

  // Check for exact match first
  const exactIndex = textLower.indexOf(queryLower);
  if (exactIndex !== -1) {
    return {
      score: 100 + (text.length - query.length),
      indices: [[exactIndex, exactIndex + query.length - 1]],
    };
  }

  // Fuzzy matching
  let queryIndex = 0;
  let score = 0;
  const indices: [number, number][] = [];
  let currentMatch: [number, number] | null = null;
  let consecutiveBonus = 0;

  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      // Start of word bonus
      if (i === 0 || /[\s_-]/.test(text[i - 1])) {
        score += 10;
      }

      // Consecutive character bonus
      if (currentMatch && currentMatch[1] === i - 1) {
        currentMatch[1] = i;
        consecutiveBonus += 5;
      } else {
        if (currentMatch) {
          indices.push(currentMatch);
        }
        currentMatch = [i, i];
        consecutiveBonus = 0;
      }

      score += 1 + consecutiveBonus;
      queryIndex++;
    }
  }

  if (currentMatch) {
    indices.push(currentMatch);
  }

  // All query characters must be found
  if (queryIndex < query.length) {
    return null;
  }

  // Bonus for shorter texts (more relevant)
  score += Math.max(0, 20 - text.length);

  return { score, indices };
}

/**
 * Searches commands using fuzzy matching
 */
export function searchCommands(
  commands: Command[],
  query: string,
  context?: ShortcutContext
): CommandSearchResult[] {
  const results: CommandSearchResult[] = [];

  for (const command of commands) {
    // Skip disabled commands
    if (command.enabled !== undefined) {
      const isEnabled =
        typeof command.enabled === 'function' ? command.enabled() : command.enabled;
      if (!isEnabled) continue;
    }

    // Skip commands not available in current context
    if (context && command.contexts && !command.contexts.includes(context)) {
      continue;
    }

    const matches: CommandMatch[] = [];
    let totalScore = 0;

    // Match against name
    const nameMatch = fuzzyMatch(query, command.name);
    if (nameMatch) {
      totalScore += nameMatch.score * 2; // Name has higher weight
      if (nameMatch.indices.length > 0) {
        matches.push({ field: 'name', indices: nameMatch.indices });
      }
    }

    // Match against description
    if (command.description) {
      const descMatch = fuzzyMatch(query, command.description);
      if (descMatch) {
        totalScore += descMatch.score;
        if (descMatch.indices.length > 0) {
          matches.push({ field: 'description', indices: descMatch.indices });
        }
      }
    }

    // Match against keywords
    if (command.keywords) {
      for (const keyword of command.keywords) {
        const keywordMatch = fuzzyMatch(query, keyword);
        if (keywordMatch) {
          totalScore += keywordMatch.score * 0.5;
          if (keywordMatch.indices.length > 0) {
            matches.push({ field: 'keywords', indices: keywordMatch.indices });
          }
        }
      }
    }

    // Include if there's any match or empty query
    if (!query || totalScore > 0) {
      results.push({
        command,
        score: totalScore,
        matches,
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}

// ============================================================================
// COMMAND REGISTRY
// ============================================================================

const HISTORY_STORAGE_KEY = 'tailwind-builder-command-history';
const MAX_HISTORY = 20;

export class CommandRegistry {
  private commands: Map<string, Command> = new Map();
  private history: CommandHistoryEntry[] = [];
  private categoryOrder: CommandCategory[] = [
    'recent',
    'file',
    'edit',
    'element',
    'view',
    'navigation',
    'help',
  ];

  constructor() {
    this.loadHistory();
  }

  /**
   * Loads command history from localStorage
   */
  private loadHistory(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load command history:', error);
    }
  }

  /**
   * Saves command history to localStorage
   */
  private saveHistory(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history));
    } catch (error) {
      console.error('Failed to save command history:', error);
    }
  }

  /**
   * Registers a command
   */
  register(command: Command): void {
    this.commands.set(command.id, command);
  }

  /**
   * Registers multiple commands
   */
  registerMany(commands: Command[]): void {
    for (const command of commands) {
      this.register(command);
    }
  }

  /**
   * Unregisters a command
   */
  unregister(commandId: string): void {
    this.commands.delete(commandId);
  }

  /**
   * Gets a command by ID
   */
  getCommand(id: string): Command | undefined {
    return this.commands.get(id);
  }

  /**
   * Gets all registered commands
   */
  getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  /**
   * Gets commands by category
   */
  getCommandsByCategory(category: CommandCategory): Command[] {
    return this.getAllCommands().filter((cmd) => cmd.category === category);
  }

  /**
   * Gets commands grouped by category (in display order)
   */
  getCommandsGroupedByCategory(): Map<CommandCategory, Command[]> {
    const grouped = new Map<CommandCategory, Command[]>();

    for (const category of this.categoryOrder) {
      const commands = this.getCommandsByCategory(category);
      if (commands.length > 0) {
        grouped.set(category, commands);
      }
    }

    return grouped;
  }

  /**
   * Searches commands with fuzzy matching
   */
  search(query: string, context?: ShortcutContext): CommandSearchResult[] {
    return searchCommands(this.getAllCommands(), query, context);
  }

  /**
   * Executes a command by ID
   */
  async execute(commandId: string): Promise<boolean> {
    const command = this.commands.get(commandId);
    if (!command) {
      console.warn(`Command not found: ${commandId}`);
      return false;
    }

    // Check if enabled
    if (command.enabled !== undefined) {
      const isEnabled =
        typeof command.enabled === 'function' ? command.enabled() : command.enabled;
      if (!isEnabled) {
        console.warn(`Command disabled: ${commandId}`);
        return false;
      }
    }

    try {
      await command.execute();
      this.addToHistory(commandId);
      return true;
    } catch (error) {
      console.error(`Command execution failed: ${commandId}`, error);
      return false;
    }
  }

  /**
   * Adds a command to history
   */
  addToHistory(commandId: string): void {
    // Remove existing entry for this command
    this.history = this.history.filter((entry) => entry.commandId !== commandId);

    // Add new entry at the beginning
    this.history.unshift({
      commandId,
      timestamp: Date.now(),
    });

    // Limit history size
    if (this.history.length > MAX_HISTORY) {
      this.history = this.history.slice(0, MAX_HISTORY);
    }

    this.saveHistory();
  }

  /**
   * Gets recent commands from history
   */
  getRecentCommands(limit: number = 5): Command[] {
    const recent: Command[] = [];

    for (const entry of this.history) {
      if (recent.length >= limit) break;

      const command = this.commands.get(entry.commandId);
      if (command) {
        recent.push(command);
      }
    }

    return recent;
  }

  /**
   * Clears command history
   */
  clearHistory(): void {
    this.history = [];
    this.saveHistory();
  }

  /**
   * Gets the shortcut display string for a command
   */
  getCommandShortcut(commandId: string): string | undefined {
    const command = this.commands.get(commandId);
    if (!command?.shortcutId) return undefined;

    const manager = getShortcutManager();
    const combo = manager.getActiveKeyCombo(command.shortcutId);
    if (!combo) return undefined;

    return formatKeyCombo(combo);
  }
}

// ============================================================================
// CATEGORY METADATA
// ============================================================================

export const CATEGORY_INFO: Record<
  CommandCategory,
  { name: string; icon: string }
> = {
  recent: { name: 'Recent', icon: 'Clock' },
  file: { name: 'File', icon: 'File' },
  edit: { name: 'Edit', icon: 'Edit3' },
  view: { name: 'View', icon: 'Eye' },
  element: { name: 'Element', icon: 'Layers' },
  navigation: { name: 'Navigation', icon: 'Navigation' },
  help: { name: 'Help', icon: 'HelpCircle' },
};

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let registryInstance: CommandRegistry | null = null;

export function getCommandRegistry(): CommandRegistry {
  if (!registryInstance) {
    registryInstance = new CommandRegistry();
  }
  return registryInstance;
}

// ============================================================================
// DEFAULT COMMANDS FACTORY
// ============================================================================

export interface CommandActions {
  undo: () => void;
  redo: () => void;
  copy: () => void;
  paste: () => void;
  cut: () => void;
  duplicate: () => void;
  delete: () => void;
  selectAll: () => void;
  save: () => void;
  export: () => void;
  preview: () => void;
  toggleGrid: () => void;
  toggleSidebar: () => void;
  toggleCodePreview: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  openShortcuts: () => void;
  openCommandPalette: () => void;
  navigateUp: () => void;
  navigateDown: () => void;
  navigateLeft: () => void;
  navigateRight: () => void;
  navigateParent: () => void;
  navigateChild: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  group: () => void;
  ungroup: () => void;
  clearCanvas: () => void;
  hasSelection: () => boolean;
  hasClipboard: () => boolean;
}

/**
 * Creates default commands with the provided action handlers
 */
export function createDefaultCommands(actions: CommandActions): Command[] {
  return [
    // History commands
    {
      id: 'cmd:undo',
      name: 'Undo',
      description: 'Undo the last action',
      category: 'edit',
      icon: 'RotateCcw',
      shortcutId: 'undo',
      keywords: ['back', 'revert'],
      execute: actions.undo,
    },
    {
      id: 'cmd:redo',
      name: 'Redo',
      description: 'Redo the last undone action',
      category: 'edit',
      icon: 'RotateCw',
      shortcutId: 'redo',
      keywords: ['forward'],
      execute: actions.redo,
    },

    // Edit commands
    {
      id: 'cmd:copy',
      name: 'Copy',
      description: 'Copy selected element to clipboard',
      category: 'edit',
      icon: 'Copy',
      shortcutId: 'copy',
      keywords: ['clipboard'],
      enabled: actions.hasSelection,
      execute: actions.copy,
    },
    {
      id: 'cmd:paste',
      name: 'Paste',
      description: 'Paste element from clipboard',
      category: 'edit',
      icon: 'Clipboard',
      shortcutId: 'paste',
      keywords: ['clipboard'],
      enabled: actions.hasClipboard,
      execute: actions.paste,
    },
    {
      id: 'cmd:cut',
      name: 'Cut',
      description: 'Cut selected element to clipboard',
      category: 'edit',
      icon: 'Scissors',
      shortcutId: 'cut',
      keywords: ['clipboard', 'remove'],
      enabled: actions.hasSelection,
      execute: actions.cut,
    },
    {
      id: 'cmd:duplicate',
      name: 'Duplicate',
      description: 'Duplicate selected element',
      category: 'edit',
      icon: 'Copy',
      shortcutId: 'duplicate',
      keywords: ['clone', 'copy'],
      enabled: actions.hasSelection,
      execute: actions.duplicate,
    },
    {
      id: 'cmd:delete',
      name: 'Delete',
      description: 'Delete selected element',
      category: 'edit',
      icon: 'Trash2',
      shortcutId: 'delete',
      keywords: ['remove', 'trash'],
      enabled: actions.hasSelection,
      execute: actions.delete,
    },
    {
      id: 'cmd:selectAll',
      name: 'Select All',
      description: 'Select all elements on canvas',
      category: 'edit',
      icon: 'CheckSquare',
      shortcutId: 'selectAll',
      execute: actions.selectAll,
    },
    {
      id: 'cmd:clearCanvas',
      name: 'Clear Canvas',
      description: 'Remove all elements from canvas',
      category: 'edit',
      icon: 'Trash',
      keywords: ['reset', 'empty'],
      execute: actions.clearCanvas,
    },

    // File commands
    {
      id: 'cmd:save',
      name: 'Save',
      description: 'Save current project',
      category: 'file',
      icon: 'Save',
      shortcutId: 'save',
      keywords: ['store'],
      execute: actions.save,
    },
    {
      id: 'cmd:export',
      name: 'Export Code',
      description: 'Export project as code',
      category: 'file',
      icon: 'Download',
      shortcutId: 'export',
      keywords: ['download', 'code', 'generate'],
      execute: actions.export,
    },
    {
      id: 'cmd:preview',
      name: 'Preview',
      description: 'Preview the design',
      category: 'file',
      icon: 'Eye',
      shortcutId: 'preview',
      keywords: ['view', 'show'],
      execute: actions.preview,
    },

    // View commands
    {
      id: 'cmd:toggleGrid',
      name: 'Toggle Grid',
      description: 'Show or hide the canvas grid',
      category: 'view',
      icon: 'Grid',
      shortcutId: 'toggleGrid',
      keywords: ['lines', 'guides'],
      execute: actions.toggleGrid,
    },
    {
      id: 'cmd:toggleSidebar',
      name: 'Toggle Sidebar',
      description: 'Show or hide the component sidebar',
      category: 'view',
      icon: 'Sidebar',
      shortcutId: 'toggleSidebar',
      keywords: ['panel', 'components'],
      execute: actions.toggleSidebar,
    },
    {
      id: 'cmd:toggleCodePreview',
      name: 'Toggle Code Preview',
      description: 'Show or hide the code preview panel',
      category: 'view',
      icon: 'Code',
      shortcutId: 'toggleCodePreview',
      keywords: ['source', 'jsx'],
      execute: actions.toggleCodePreview,
    },
    {
      id: 'cmd:zoomIn',
      name: 'Zoom In',
      description: 'Increase canvas zoom level',
      category: 'view',
      icon: 'ZoomIn',
      shortcutId: 'zoomIn',
      keywords: ['magnify', 'bigger'],
      execute: actions.zoomIn,
    },
    {
      id: 'cmd:zoomOut',
      name: 'Zoom Out',
      description: 'Decrease canvas zoom level',
      category: 'view',
      icon: 'ZoomOut',
      shortcutId: 'zoomOut',
      keywords: ['magnify', 'smaller'],
      execute: actions.zoomOut,
    },
    {
      id: 'cmd:resetZoom',
      name: 'Reset Zoom',
      description: 'Reset canvas zoom to 100%',
      category: 'view',
      icon: 'Maximize',
      shortcutId: 'resetZoom',
      keywords: ['100%', 'actual size'],
      execute: actions.resetZoom,
    },

    // Element commands
    {
      id: 'cmd:bringForward',
      name: 'Bring Forward',
      description: 'Move element one layer forward',
      category: 'element',
      icon: 'ArrowUp',
      shortcutId: 'bringForward',
      keywords: ['layer', 'z-index'],
      enabled: actions.hasSelection,
      execute: actions.bringForward,
    },
    {
      id: 'cmd:sendBackward',
      name: 'Send Backward',
      description: 'Move element one layer backward',
      category: 'element',
      icon: 'ArrowDown',
      shortcutId: 'sendBackward',
      keywords: ['layer', 'z-index'],
      enabled: actions.hasSelection,
      execute: actions.sendBackward,
    },
    {
      id: 'cmd:bringToFront',
      name: 'Bring to Front',
      description: 'Move element to the top layer',
      category: 'element',
      icon: 'ChevronsUp',
      shortcutId: 'bringToFront',
      keywords: ['layer', 'z-index', 'top'],
      enabled: actions.hasSelection,
      execute: actions.bringToFront,
    },
    {
      id: 'cmd:sendToBack',
      name: 'Send to Back',
      description: 'Move element to the bottom layer',
      category: 'element',
      icon: 'ChevronsDown',
      shortcutId: 'sendToBack',
      keywords: ['layer', 'z-index', 'bottom'],
      enabled: actions.hasSelection,
      execute: actions.sendToBack,
    },
    {
      id: 'cmd:group',
      name: 'Group Elements',
      description: 'Group selected elements together',
      category: 'element',
      icon: 'Folder',
      shortcutId: 'group',
      keywords: ['combine', 'container'],
      enabled: actions.hasSelection,
      execute: actions.group,
    },
    {
      id: 'cmd:ungroup',
      name: 'Ungroup Elements',
      description: 'Ungroup selected group',
      category: 'element',
      icon: 'FolderOpen',
      shortcutId: 'ungroup',
      keywords: ['separate', 'split'],
      enabled: actions.hasSelection,
      execute: actions.ungroup,
    },

    // Navigation commands
    {
      id: 'cmd:navigateUp',
      name: 'Navigate Up',
      description: 'Select the element above',
      category: 'navigation',
      icon: 'ArrowUp',
      shortcutId: 'navigateUp',
      execute: actions.navigateUp,
    },
    {
      id: 'cmd:navigateDown',
      name: 'Navigate Down',
      description: 'Select the element below',
      category: 'navigation',
      icon: 'ArrowDown',
      shortcutId: 'navigateDown',
      execute: actions.navigateDown,
    },
    {
      id: 'cmd:navigateLeft',
      name: 'Navigate Left',
      description: 'Select the element to the left',
      category: 'navigation',
      icon: 'ArrowLeft',
      shortcutId: 'navigateLeft',
      execute: actions.navigateLeft,
    },
    {
      id: 'cmd:navigateRight',
      name: 'Navigate Right',
      description: 'Select the element to the right',
      category: 'navigation',
      icon: 'ArrowRight',
      shortcutId: 'navigateRight',
      execute: actions.navigateRight,
    },
    {
      id: 'cmd:navigateParent',
      name: 'Select Parent',
      description: 'Select the parent element',
      category: 'navigation',
      icon: 'CornerLeftUp',
      shortcutId: 'navigateParent',
      enabled: actions.hasSelection,
      execute: actions.navigateParent,
    },
    {
      id: 'cmd:navigateChild',
      name: 'Select First Child',
      description: 'Select the first child element',
      category: 'navigation',
      icon: 'CornerRightDown',
      shortcutId: 'navigateChild',
      enabled: actions.hasSelection,
      execute: actions.navigateChild,
    },

    // Help commands
    {
      id: 'cmd:openShortcuts',
      name: 'Keyboard Shortcuts',
      description: 'View all keyboard shortcuts',
      category: 'help',
      icon: 'Keyboard',
      shortcutId: 'showShortcuts',
      keywords: ['hotkeys', 'keys', 'bindings'],
      execute: actions.openShortcuts,
    },
    {
      id: 'cmd:openCommandPalette',
      name: 'Command Palette',
      description: 'Open the command palette',
      category: 'help',
      icon: 'Command',
      shortcutId: 'quickSearch',
      keywords: ['search', 'find', 'commands'],
      execute: actions.openCommandPalette,
    },
  ];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Highlights matched characters in text
 */
export function highlightMatches(
  text: string,
  indices: [number, number][]
): { text: string; highlighted: boolean }[] {
  if (indices.length === 0) {
    return [{ text, highlighted: false }];
  }

  const result: { text: string; highlighted: boolean }[] = [];
  let lastIndex = 0;

  for (const [start, end] of indices) {
    // Add non-highlighted text before match
    if (start > lastIndex) {
      result.push({
        text: text.slice(lastIndex, start),
        highlighted: false,
      });
    }

    // Add highlighted match
    result.push({
      text: text.slice(start, end + 1),
      highlighted: true,
    });

    lastIndex = end + 1;
  }

  // Add remaining non-highlighted text
  if (lastIndex < text.length) {
    result.push({
      text: text.slice(lastIndex),
      highlighted: false,
    });
  }

  return result;
}
