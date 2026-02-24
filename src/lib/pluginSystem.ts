/**
 * Plugin System Architecture
 *
 * This module provides a comprehensive plugin architecture for the Tailwind Builder.
 * It supports plugin lifecycle management, hooks, events, permissions, and storage.
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Plugin lifecycle states
 */
export type PluginLifecycleState =
  | 'registered'
  | 'initialized'
  | 'activated'
  | 'deactivated'
  | 'destroyed'
  | 'error';

/**
 * Plugin permission types
 */
export type PluginPermission =
  | 'read:elements'      // Read access to canvas elements
  | 'write:elements'     // Write access to canvas elements (requires API)
  | 'read:settings'      // Read global builder settings
  | 'write:settings'     // Write to global builder settings
  | 'ui:panels'          // Add custom panels
  | 'ui:toolbar'         // Add toolbar buttons
  | 'ui:contextmenu'     // Add context menu items
  | 'ui:notifications'   // Show notifications
  | 'storage:local'      // Access to plugin-specific localStorage
  | 'keyboard:shortcuts' // Register keyboard shortcuts
  | 'export:modify'      // Modify exported code
  | 'network:fetch';     // Make network requests

/**
 * Plugin setting field types
 */
export type PluginSettingType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'color'
  | 'range';

/**
 * Plugin setting definition
 */
export interface PluginSettingDefinition {
  key: string;
  label: string;
  type: PluginSettingType;
  defaultValue: string | number | boolean;
  description?: string;
  options?: { label: string; value: string | number }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

/**
 * Plugin settings schema
 */
export interface PluginSettingsSchema {
  fields: PluginSettingDefinition[];
}

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  repository?: string;
  license?: string;
  icon?: string;
  category?: PluginCategory;
  tags?: string[];
  minBuilderVersion?: string;
}

/**
 * Plugin categories for organization
 */
export type PluginCategory =
  | 'accessibility'
  | 'design'
  | 'development'
  | 'export'
  | 'optimization'
  | 'seo'
  | 'utilities'
  | 'other';

/**
 * Hook types available for plugins
 */
export type PluginHookType =
  | 'beforeElementAdd'
  | 'afterElementAdd'
  | 'beforeElementRemove'
  | 'afterElementRemove'
  | 'beforeElementUpdate'
  | 'afterElementUpdate'
  | 'beforeRender'
  | 'afterRender'
  | 'beforeExport'
  | 'afterExport'
  | 'onSelectionChange'
  | 'onViewportChange'
  | 'onCanvasClear'
  | 'onSave'
  | 'onLoad';

/**
 * Hook context passed to hook handlers
 */
export interface HookContext {
  elementId?: string;
  elementType?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  timestamp: number;
  pluginId: string;
}

/**
 * Hook handler function type
 */
export type HookHandler = (context: HookContext) => void | Promise<void> | boolean | Promise<boolean>;

/**
 * Registered hook entry
 */
interface RegisteredHook {
  pluginId: string;
  hookType: PluginHookType;
  handler: HookHandler;
  priority: number;
}

/**
 * Plugin event types
 */
export type PluginEventType =
  | 'plugin:message'
  | 'plugin:broadcast'
  | 'plugin:error'
  | 'plugin:warning'
  | 'plugin:info';

/**
 * Plugin event data
 */
export interface PluginEvent {
  type: PluginEventType;
  sourcePluginId: string;
  targetPluginId?: string; // undefined means broadcast
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  timestamp: number;
}

/**
 * Event listener function type
 */
export type EventListener = (event: PluginEvent) => void;

/**
 * Custom panel definition
 */
export interface CustomPanel {
  id: string;
  pluginId: string;
  title: string;
  icon?: string;
  position: 'left' | 'right' | 'bottom';
  render: () => React.ReactNode;
  order?: number;
}

/**
 * Toolbar button definition
 */
export interface ToolbarButton {
  id: string;
  pluginId: string;
  icon: string;
  label: string;
  tooltip?: string;
  shortcut?: string;
  onClick: () => void;
  isActive?: () => boolean;
  isDisabled?: () => boolean;
  order?: number;
}

/**
 * Context menu item definition
 */
export interface ContextMenuItem {
  id: string;
  pluginId: string;
  label: string;
  icon?: string;
  shortcut?: string;
  onClick: (elementId: string) => void;
  isVisible?: (elementId: string) => boolean;
  isDisabled?: (elementId: string) => boolean;
  separator?: boolean;
  order?: number;
}

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  id: string;
  pluginId: string;
  keys: string; // e.g., "ctrl+shift+p"
  description: string;
  handler: () => void;
  preventDefault?: boolean;
}

/**
 * Notification options
 */
export interface NotificationOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Plugin instance interface - what plugins must implement
 */
export interface Plugin {
  metadata: PluginMetadata;
  permissions: PluginPermission[];
  settingsSchema?: PluginSettingsSchema;

  // Lifecycle methods
  init?: (api: PluginAPI) => void | Promise<void>;
  activate?: (api: PluginAPI) => void | Promise<void>;
  deactivate?: (api: PluginAPI) => void | Promise<void>;
  destroy?: (api: PluginAPI) => void | Promise<void>;

  // Settings change handler
  onSettingsChange?: (settings: Record<string, unknown>) => void;
}

/**
 * Plugin state tracked by the system
 */
export interface PluginState {
  plugin: Plugin;
  state: PluginLifecycleState;
  settings: Record<string, unknown>;
  error?: string;
  activatedAt?: number;
  api?: PluginAPI;
}

/**
 * Plugin API provided to plugins
 */
export interface PluginAPI {
  // Metadata
  pluginId: string;

  // Builder state (read-only)
  getElements: () => BuilderElementReadOnly[];
  getSelectedElement: () => BuilderElementReadOnly | null;
  getViewport: () => string;
  getZoom: () => number;

  // UI extensions
  addPanel: (panel: Omit<CustomPanel, 'pluginId'>) => void;
  removePanel: (panelId: string) => void;
  addToolbarButton: (button: Omit<ToolbarButton, 'pluginId'>) => void;
  removeToolbarButton: (buttonId: string) => void;
  addContextMenuItem: (item: Omit<ContextMenuItem, 'pluginId'>) => void;
  removeContextMenuItem: (itemId: string) => void;
  addKeyboardShortcut: (shortcut: Omit<KeyboardShortcut, 'pluginId'>) => void;
  removeKeyboardShortcut: (shortcutId: string) => void;

  // Notifications
  showNotification: (options: NotificationOptions) => void;

  // Hooks
  registerHook: (hookType: PluginHookType, handler: HookHandler, priority?: number) => void;
  unregisterHook: (hookType: PluginHookType, handler: HookHandler) => void;

  // Events (plugin communication)
  sendMessage: (targetPluginId: string, payload: unknown) => void;
  broadcast: (payload: unknown) => void;
  onMessage: (listener: EventListener) => () => void;

  // Storage
  getStorage: <T>(key: string) => T | null;
  setStorage: <T>(key: string, value: T) => void;
  removeStorage: (key: string) => void;
  clearStorage: () => void;

  // Settings
  getSettings: () => Record<string, unknown>;
  updateSettings: (settings: Partial<Record<string, unknown>>) => void;

  // Logging
  log: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

/**
 * Read-only builder element for plugin access
 */
export interface BuilderElementReadOnly {
  id: string;
  type: string;
  name: string;
  props: Record<string, unknown>;
  styles: {
    layout: string[];
    spacing: string[];
    typography: string[];
    colors: string[];
    borders: string[];
    effects: string[];
    responsive: { sm: string[]; md: string[]; lg: string[] };
  };
  children: BuilderElementReadOnly[];
  parentId: string | null;
}

// ============================================================================
// PLUGIN MANAGER CLASS
// ============================================================================

/**
 * Central plugin manager that handles all plugin operations
 */
class PluginManagerClass {
  private plugins: Map<string, PluginState> = new Map();
  private hooks: Map<PluginHookType, RegisteredHook[]> = new Map();
  private eventListeners: Map<string, EventListener[]> = new Map();
  private panels: Map<string, CustomPanel> = new Map();
  private toolbarButtons: Map<string, ToolbarButton> = new Map();
  private contextMenuItems: Map<string, ContextMenuItem> = new Map();
  private keyboardShortcuts: Map<string, KeyboardShortcut> = new Map();

  // Builder state accessors (to be set by the builder)
  private builderStateAccessors: {
    getElements: () => BuilderElementReadOnly[];
    getSelectedElement: () => BuilderElementReadOnly | null;
    getViewport: () => string;
    getZoom: () => number;
  } | null = null;

  // Notification handler (to be set by the UI)
  private notificationHandler: ((options: NotificationOptions) => void) | null = null;

  // Change listeners for UI updates
  private changeListeners: Set<() => void> = new Set();

  /**
   * Set the builder state accessors
   */
  setBuilderStateAccessors(accessors: typeof this.builderStateAccessors): void {
    this.builderStateAccessors = accessors;
  }

  /**
   * Set the notification handler
   */
  setNotificationHandler(handler: (options: NotificationOptions) => void): void {
    this.notificationHandler = handler;
  }

  /**
   * Subscribe to plugin system changes
   */
  subscribe(listener: () => void): () => void {
    this.changeListeners.add(listener);
    return () => this.changeListeners.delete(listener);
  }

  /**
   * Notify all listeners of changes
   */
  private notifyChange(): void {
    this.changeListeners.forEach(listener => listener());
  }

  /**
   * Register a plugin
   */
  register(plugin: Plugin): void {
    const { id } = plugin.metadata;

    if (this.plugins.has(id)) {
      throw new Error(`Plugin "${id}" is already registered`);
    }

    // Validate plugin
    this.validatePlugin(plugin);

    // Initialize settings with defaults
    const settings: Record<string, unknown> = {};
    if (plugin.settingsSchema) {
      for (const field of plugin.settingsSchema.fields) {
        settings[field.key] = field.defaultValue;
      }
    }

    // Load persisted settings
    const persistedSettings = this.loadPluginSettings(id);
    Object.assign(settings, persistedSettings);

    this.plugins.set(id, {
      plugin,
      state: 'registered',
      settings,
    });

    this.notifyChange();
    this.logPluginAction(id, 'Registered');
  }

  /**
   * Unregister a plugin
   */
  async unregister(pluginId: string): Promise<void> {
    const pluginState = this.plugins.get(pluginId);
    if (!pluginState) {
      throw new Error(`Plugin "${pluginId}" is not registered`);
    }

    // Deactivate and destroy if necessary
    if (pluginState.state === 'activated') {
      await this.deactivate(pluginId);
    }

    if (pluginState.state !== 'destroyed') {
      await this.destroy(pluginId);
    }

    // Clean up all registrations
    this.cleanupPluginRegistrations(pluginId);

    this.plugins.delete(pluginId);
    this.notifyChange();
    this.logPluginAction(pluginId, 'Unregistered');
  }

  /**
   * Initialize a plugin
   */
  async init(pluginId: string): Promise<void> {
    const pluginState = this.plugins.get(pluginId);
    if (!pluginState) {
      throw new Error(`Plugin "${pluginId}" is not registered`);
    }

    if (pluginState.state !== 'registered') {
      throw new Error(`Plugin "${pluginId}" cannot be initialized from state "${pluginState.state}"`);
    }

    try {
      const api = this.createPluginAPI(pluginId);
      pluginState.api = api;

      if (pluginState.plugin.init) {
        await pluginState.plugin.init(api);
      }

      pluginState.state = 'initialized';
      this.notifyChange();
      this.logPluginAction(pluginId, 'Initialized');
    } catch (error) {
      pluginState.state = 'error';
      pluginState.error = error instanceof Error ? error.message : 'Unknown error';
      this.notifyChange();
      throw error;
    }
  }

  /**
   * Activate a plugin
   */
  async activate(pluginId: string): Promise<void> {
    const pluginState = this.plugins.get(pluginId);
    if (!pluginState) {
      throw new Error(`Plugin "${pluginId}" is not registered`);
    }

    // Auto-initialize if needed
    if (pluginState.state === 'registered') {
      await this.init(pluginId);
    }

    if (pluginState.state !== 'initialized' && pluginState.state !== 'deactivated') {
      throw new Error(`Plugin "${pluginId}" cannot be activated from state "${pluginState.state}"`);
    }

    try {
      const api = pluginState.api || this.createPluginAPI(pluginId);
      pluginState.api = api;

      if (pluginState.plugin.activate) {
        await pluginState.plugin.activate(api);
      }

      pluginState.state = 'activated';
      pluginState.activatedAt = Date.now();
      this.notifyChange();
      this.logPluginAction(pluginId, 'Activated');
    } catch (error) {
      pluginState.state = 'error';
      pluginState.error = error instanceof Error ? error.message : 'Unknown error';
      this.notifyChange();
      throw error;
    }
  }

  /**
   * Deactivate a plugin
   */
  async deactivate(pluginId: string): Promise<void> {
    const pluginState = this.plugins.get(pluginId);
    if (!pluginState) {
      throw new Error(`Plugin "${pluginId}" is not registered`);
    }

    if (pluginState.state !== 'activated') {
      throw new Error(`Plugin "${pluginId}" cannot be deactivated from state "${pluginState.state}"`);
    }

    try {
      if (pluginState.plugin.deactivate && pluginState.api) {
        await pluginState.plugin.deactivate(pluginState.api);
      }

      // Clean up UI registrations but keep hooks
      this.cleanupPluginUI(pluginId);

      pluginState.state = 'deactivated';
      pluginState.activatedAt = undefined;
      this.notifyChange();
      this.logPluginAction(pluginId, 'Deactivated');
    } catch (error) {
      pluginState.state = 'error';
      pluginState.error = error instanceof Error ? error.message : 'Unknown error';
      this.notifyChange();
      throw error;
    }
  }

  /**
   * Destroy a plugin
   */
  async destroy(pluginId: string): Promise<void> {
    const pluginState = this.plugins.get(pluginId);
    if (!pluginState) {
      throw new Error(`Plugin "${pluginId}" is not registered`);
    }

    // Deactivate first if active
    if (pluginState.state === 'activated') {
      await this.deactivate(pluginId);
    }

    try {
      if (pluginState.plugin.destroy && pluginState.api) {
        await pluginState.plugin.destroy(pluginState.api);
      }

      // Clean up all registrations
      this.cleanupPluginRegistrations(pluginId);

      pluginState.state = 'destroyed';
      pluginState.api = undefined;
      this.notifyChange();
      this.logPluginAction(pluginId, 'Destroyed');
    } catch (error) {
      pluginState.state = 'error';
      pluginState.error = error instanceof Error ? error.message : 'Unknown error';
      this.notifyChange();
      throw error;
    }
  }

  /**
   * Toggle plugin activation state
   */
  async toggleActivation(pluginId: string): Promise<void> {
    const pluginState = this.plugins.get(pluginId);
    if (!pluginState) {
      throw new Error(`Plugin "${pluginId}" is not registered`);
    }

    if (pluginState.state === 'activated') {
      await this.deactivate(pluginId);
    } else {
      await this.activate(pluginId);
    }
  }

  /**
   * Get all registered plugins
   */
  getPlugins(): Map<string, PluginState> {
    return new Map(this.plugins);
  }

  /**
   * Get a specific plugin
   */
  getPlugin(pluginId: string): PluginState | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * Get active plugins only
   */
  getActivePlugins(): PluginState[] {
    return Array.from(this.plugins.values()).filter(p => p.state === 'activated');
  }

  /**
   * Update plugin settings
   */
  updatePluginSettings(pluginId: string, settings: Partial<Record<string, unknown>>): void {
    const pluginState = this.plugins.get(pluginId);
    if (!pluginState) {
      throw new Error(`Plugin "${pluginId}" is not registered`);
    }

    Object.assign(pluginState.settings, settings);
    this.savePluginSettings(pluginId, pluginState.settings);

    if (pluginState.plugin.onSettingsChange) {
      pluginState.plugin.onSettingsChange(pluginState.settings);
    }

    this.notifyChange();
  }

  /**
   * Execute hooks for a given hook type
   */
  async executeHooks(hookType: PluginHookType, context: Omit<HookContext, 'pluginId'>): Promise<boolean> {
    const hooks = this.hooks.get(hookType) || [];
    const sortedHooks = [...hooks].sort((a, b) => b.priority - a.priority);

    for (const hook of sortedHooks) {
      const pluginState = this.plugins.get(hook.pluginId);
      if (!pluginState || pluginState.state !== 'activated') {
        continue;
      }

      try {
        const result = await hook.handler({ ...context, pluginId: hook.pluginId });
        // If handler returns false, stop execution chain
        if (result === false) {
          return false;
        }
      } catch (error) {
        console.error(`Plugin "${hook.pluginId}" hook "${hookType}" error:`, error);
      }
    }

    return true;
  }

  /**
   * Broadcast an event to all plugins
   */
  broadcastEvent(sourcePluginId: string, payload: unknown): void {
    const event: PluginEvent = {
      type: 'plugin:broadcast',
      sourcePluginId,
      payload,
      timestamp: Date.now(),
    };

    this.eventListeners.forEach((listeners) => {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error('Event listener error:', error);
        }
      });
    });
  }

  /**
   * Send a message to a specific plugin
   */
  sendMessage(sourcePluginId: string, targetPluginId: string, payload: unknown): void {
    const listeners = this.eventListeners.get(targetPluginId);
    if (!listeners) return;

    const event: PluginEvent = {
      type: 'plugin:message',
      sourcePluginId,
      targetPluginId,
      payload,
      timestamp: Date.now(),
    };

    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Event listener error:', error);
      }
    });
  }

  /**
   * Get all custom panels
   */
  getPanels(): CustomPanel[] {
    return Array.from(this.panels.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * Get all toolbar buttons
   */
  getToolbarButtons(): ToolbarButton[] {
    return Array.from(this.toolbarButtons.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * Get all context menu items
   */
  getContextMenuItems(): ContextMenuItem[] {
    return Array.from(this.contextMenuItems.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * Get all keyboard shortcuts
   */
  getKeyboardShortcuts(): KeyboardShortcut[] {
    return Array.from(this.keyboardShortcuts.values());
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Create plugin API instance
   */
  private createPluginAPI(pluginId: string): PluginAPI {
    const pluginState = this.plugins.get(pluginId);
    if (!pluginState) {
      throw new Error(`Plugin "${pluginId}" is not registered`);
    }

    const permissions = new Set(pluginState.plugin.permissions);

    const requirePermission = (permission: PluginPermission): void => {
      if (!permissions.has(permission)) {
        throw new Error(`Plugin "${pluginId}" does not have permission "${permission}"`);
      }
    };

    return {
      pluginId,

      // Builder state
      getElements: () => {
        requirePermission('read:elements');
        return this.builderStateAccessors?.getElements() || [];
      },

      getSelectedElement: () => {
        requirePermission('read:elements');
        return this.builderStateAccessors?.getSelectedElement() || null;
      },

      getViewport: () => {
        requirePermission('read:settings');
        return this.builderStateAccessors?.getViewport() || 'desktop';
      },

      getZoom: () => {
        requirePermission('read:settings');
        return this.builderStateAccessors?.getZoom() || 100;
      },

      // UI extensions
      addPanel: (panel) => {
        requirePermission('ui:panels');
        const fullPanel: CustomPanel = { ...panel, pluginId };
        this.panels.set(panel.id, fullPanel);
        this.notifyChange();
      },

      removePanel: (panelId) => {
        const panel = this.panels.get(panelId);
        if (panel && panel.pluginId === pluginId) {
          this.panels.delete(panelId);
          this.notifyChange();
        }
      },

      addToolbarButton: (button) => {
        requirePermission('ui:toolbar');
        const fullButton: ToolbarButton = { ...button, pluginId };
        this.toolbarButtons.set(button.id, fullButton);
        this.notifyChange();
      },

      removeToolbarButton: (buttonId) => {
        const button = this.toolbarButtons.get(buttonId);
        if (button && button.pluginId === pluginId) {
          this.toolbarButtons.delete(buttonId);
          this.notifyChange();
        }
      },

      addContextMenuItem: (item) => {
        requirePermission('ui:contextmenu');
        const fullItem: ContextMenuItem = { ...item, pluginId };
        this.contextMenuItems.set(item.id, fullItem);
        this.notifyChange();
      },

      removeContextMenuItem: (itemId) => {
        const item = this.contextMenuItems.get(itemId);
        if (item && item.pluginId === pluginId) {
          this.contextMenuItems.delete(itemId);
          this.notifyChange();
        }
      },

      addKeyboardShortcut: (shortcut) => {
        requirePermission('keyboard:shortcuts');
        const fullShortcut: KeyboardShortcut = { ...shortcut, pluginId };
        this.keyboardShortcuts.set(shortcut.id, fullShortcut);
        this.notifyChange();
      },

      removeKeyboardShortcut: (shortcutId) => {
        const shortcut = this.keyboardShortcuts.get(shortcutId);
        if (shortcut && shortcut.pluginId === pluginId) {
          this.keyboardShortcuts.delete(shortcutId);
          this.notifyChange();
        }
      },

      // Notifications
      showNotification: (options) => {
        requirePermission('ui:notifications');
        if (this.notificationHandler) {
          this.notificationHandler(options);
        }
      },

      // Hooks
      registerHook: (hookType, handler, priority = 10) => {
        const hooks = this.hooks.get(hookType) || [];
        hooks.push({ pluginId, hookType, handler, priority });
        this.hooks.set(hookType, hooks);
      },

      unregisterHook: (hookType, handler) => {
        const hooks = this.hooks.get(hookType) || [];
        const filtered = hooks.filter(h => h.pluginId !== pluginId || h.handler !== handler);
        this.hooks.set(hookType, filtered);
      },

      // Events
      sendMessage: (targetPluginId, payload) => {
        this.sendMessage(pluginId, targetPluginId, payload);
      },

      broadcast: (payload) => {
        this.broadcastEvent(pluginId, payload);
      },

      onMessage: (listener) => {
        const listeners = this.eventListeners.get(pluginId) || [];
        listeners.push(listener);
        this.eventListeners.set(pluginId, listeners);

        return () => {
          const current = this.eventListeners.get(pluginId) || [];
          this.eventListeners.set(pluginId, current.filter(l => l !== listener));
        };
      },

      // Storage
      getStorage: <T>(key: string): T | null => {
        requirePermission('storage:local');
        const storageKey = `plugin:${pluginId}:${key}`;
        try {
          const value = localStorage.getItem(storageKey);
          return value ? JSON.parse(value) : null;
        } catch {
          return null;
        }
      },

      setStorage: <T>(key: string, value: T): void => {
        requirePermission('storage:local');
        const storageKey = `plugin:${pluginId}:${key}`;
        localStorage.setItem(storageKey, JSON.stringify(value));
      },

      removeStorage: (key: string): void => {
        requirePermission('storage:local');
        const storageKey = `plugin:${pluginId}:${key}`;
        localStorage.removeItem(storageKey);
      },

      clearStorage: (): void => {
        requirePermission('storage:local');
        const prefix = `plugin:${pluginId}:`;
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      },

      // Settings
      getSettings: () => {
        const state = this.plugins.get(pluginId);
        return state ? { ...state.settings } : {};
      },

      updateSettings: (settings) => {
        this.updatePluginSettings(pluginId, settings);
      },

      // Logging
      log: (message, ...args) => {
        console.log(`[Plugin:${pluginId}]`, message, ...args);
      },

      warn: (message, ...args) => {
        console.warn(`[Plugin:${pluginId}]`, message, ...args);
      },

      error: (message, ...args) => {
        console.error(`[Plugin:${pluginId}]`, message, ...args);
      },
    };
  }

  /**
   * Validate plugin structure
   */
  private validatePlugin(plugin: Plugin): void {
    const { metadata, permissions } = plugin;

    if (!metadata.id || typeof metadata.id !== 'string') {
      throw new Error('Plugin must have a valid id');
    }

    if (!metadata.name || typeof metadata.name !== 'string') {
      throw new Error('Plugin must have a valid name');
    }

    if (!metadata.version || typeof metadata.version !== 'string') {
      throw new Error('Plugin must have a valid version');
    }

    if (!Array.isArray(permissions)) {
      throw new Error('Plugin must have a permissions array');
    }

    // Validate permissions
    const validPermissions: PluginPermission[] = [
      'read:elements', 'write:elements', 'read:settings', 'write:settings',
      'ui:panels', 'ui:toolbar', 'ui:contextmenu', 'ui:notifications',
      'storage:local', 'keyboard:shortcuts', 'export:modify', 'network:fetch',
    ];

    for (const perm of permissions) {
      if (!validPermissions.includes(perm)) {
        throw new Error(`Invalid permission: ${perm}`);
      }
    }
  }

  /**
   * Clean up all plugin registrations
   */
  private cleanupPluginRegistrations(pluginId: string): void {
    // Clean up hooks
    this.hooks.forEach((hooks, hookType) => {
      this.hooks.set(hookType, hooks.filter(h => h.pluginId !== pluginId));
    });

    // Clean up event listeners
    this.eventListeners.delete(pluginId);

    // Clean up UI
    this.cleanupPluginUI(pluginId);
  }

  /**
   * Clean up plugin UI registrations
   */
  private cleanupPluginUI(pluginId: string): void {
    // Clean up panels
    this.panels.forEach((panel, id) => {
      if (panel.pluginId === pluginId) {
        this.panels.delete(id);
      }
    });

    // Clean up toolbar buttons
    this.toolbarButtons.forEach((button, id) => {
      if (button.pluginId === pluginId) {
        this.toolbarButtons.delete(id);
      }
    });

    // Clean up context menu items
    this.contextMenuItems.forEach((item, id) => {
      if (item.pluginId === pluginId) {
        this.contextMenuItems.delete(id);
      }
    });

    // Clean up keyboard shortcuts
    this.keyboardShortcuts.forEach((shortcut, id) => {
      if (shortcut.pluginId === pluginId) {
        this.keyboardShortcuts.delete(id);
      }
    });
  }

  /**
   * Load persisted plugin settings
   */
  private loadPluginSettings(pluginId: string): Record<string, unknown> {
    try {
      const stored = localStorage.getItem(`plugin:${pluginId}:settings`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Save plugin settings to storage
   */
  private savePluginSettings(pluginId: string, settings: Record<string, unknown>): void {
    localStorage.setItem(`plugin:${pluginId}:settings`, JSON.stringify(settings));
  }

  /**
   * Log plugin action for debugging
   */
  private logPluginAction(pluginId: string, action: string): void {
    console.log(`[PluginManager] ${action}: ${pluginId}`);
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const PluginManager = new PluginManagerClass();

// Export types for external use
export type { PluginManagerClass };
