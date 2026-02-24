/**
 * Plugin API Module
 *
 * This module provides a comprehensive API for plugins to interact with the builder.
 * It wraps the plugin system and provides React hooks and utilities.
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  PluginManager,
  Plugin,
  PluginState,
  PluginAPI,
  PluginHookType,
  HookContext,
  NotificationOptions,
  CustomPanel,
  ToolbarButton,
  ContextMenuItem,
  KeyboardShortcut,
  BuilderElementReadOnly,
} from './pluginSystem';
import { useBuilderStore } from '@/store/builderStore';
import toast from 'react-hot-toast';

// ============================================================================
// BUILDER STATE INTEGRATION
// ============================================================================

/**
 * Initialize plugin system with builder state accessors
 */
export function initializePluginSystem(): void {
  // Set up builder state accessors
  PluginManager.setBuilderStateAccessors({
    getElements: () => {
      const state = useBuilderStore.getState();
      return state.elements as BuilderElementReadOnly[];
    },
    getSelectedElement: () => {
      const state = useBuilderStore.getState();
      if (!state.selectedId) return null;
      return state.getElementById(state.selectedId) as BuilderElementReadOnly | null;
    },
    getViewport: () => {
      return useBuilderStore.getState().viewport;
    },
    getZoom: () => {
      return useBuilderStore.getState().zoom;
    },
  });

  // Set up notification handler
  PluginManager.setNotificationHandler((options: NotificationOptions) => {
    const { type, message, duration = 3000 } = options;

    switch (type) {
      case 'success':
        toast.success(message, { duration });
        break;
      case 'error':
        toast.error(message, { duration });
        break;
      case 'warning':
        toast(message, { duration, icon: '!' });
        break;
      case 'info':
      default:
        toast(message, { duration });
        break;
    }
  });
}

// ============================================================================
// REACT HOOKS FOR PLUGIN MANAGEMENT
// ============================================================================

/**
 * Hook to access plugin manager state
 */
export function usePluginManager() {
  const [plugins, setPlugins] = useState<Map<string, PluginState>>(PluginManager.getPlugins());
  const [panels, setPanels] = useState<CustomPanel[]>(PluginManager.getPanels());
  const [toolbarButtons, setToolbarButtons] = useState<ToolbarButton[]>(PluginManager.getToolbarButtons());
  const [contextMenuItems, setContextMenuItems] = useState<ContextMenuItem[]>(PluginManager.getContextMenuItems());
  const [keyboardShortcuts, setKeyboardShortcuts] = useState<KeyboardShortcut[]>(PluginManager.getKeyboardShortcuts());

  useEffect(() => {
    const unsubscribe = PluginManager.subscribe(() => {
      setPlugins(PluginManager.getPlugins());
      setPanels(PluginManager.getPanels());
      setToolbarButtons(PluginManager.getToolbarButtons());
      setContextMenuItems(PluginManager.getContextMenuItems());
      setKeyboardShortcuts(PluginManager.getKeyboardShortcuts());
    });

    return unsubscribe;
  }, []);

  const activePlugins = useMemo(() => {
    return Array.from(plugins.values()).filter(p => p.state === 'activated');
  }, [plugins]);

  const registeredPlugins = useMemo(() => {
    return Array.from(plugins.values());
  }, [plugins]);

  // Plugin actions
  const registerPlugin = useCallback((plugin: Plugin) => {
    PluginManager.register(plugin);
  }, []);

  const unregisterPlugin = useCallback(async (pluginId: string) => {
    await PluginManager.unregister(pluginId);
  }, []);

  const activatePlugin = useCallback(async (pluginId: string) => {
    await PluginManager.activate(pluginId);
  }, []);

  const deactivatePlugin = useCallback(async (pluginId: string) => {
    await PluginManager.deactivate(pluginId);
  }, []);

  const togglePlugin = useCallback(async (pluginId: string) => {
    await PluginManager.toggleActivation(pluginId);
  }, []);

  const updatePluginSettings = useCallback((pluginId: string, settings: Record<string, unknown>) => {
    PluginManager.updatePluginSettings(pluginId, settings);
  }, []);

  const getPluginSettings = useCallback((pluginId: string) => {
    const plugin = PluginManager.getPlugin(pluginId);
    return plugin?.settings || {};
  }, []);

  return {
    plugins,
    activePlugins,
    registeredPlugins,
    panels,
    toolbarButtons,
    contextMenuItems,
    keyboardShortcuts,
    registerPlugin,
    unregisterPlugin,
    activatePlugin,
    deactivatePlugin,
    togglePlugin,
    updatePluginSettings,
    getPluginSettings,
  };
}

/**
 * Hook to get a specific plugin's state
 */
export function usePlugin(pluginId: string) {
  const [pluginState, setPluginState] = useState<PluginState | undefined>(
    PluginManager.getPlugin(pluginId)
  );

  useEffect(() => {
    const unsubscribe = PluginManager.subscribe(() => {
      setPluginState(PluginManager.getPlugin(pluginId));
    });

    return unsubscribe;
  }, [pluginId]);

  return pluginState;
}

/**
 * Hook to use plugin panels
 */
export function usePluginPanels(position?: 'left' | 'right' | 'bottom') {
  const [panels, setPanels] = useState<CustomPanel[]>(PluginManager.getPanels());

  useEffect(() => {
    const unsubscribe = PluginManager.subscribe(() => {
      setPanels(PluginManager.getPanels());
    });

    return unsubscribe;
  }, []);

  return useMemo(() => {
    if (position) {
      return panels.filter(p => p.position === position);
    }
    return panels;
  }, [panels, position]);
}

/**
 * Hook to use plugin toolbar buttons
 */
export function usePluginToolbarButtons() {
  const [buttons, setButtons] = useState<ToolbarButton[]>(PluginManager.getToolbarButtons());

  useEffect(() => {
    const unsubscribe = PluginManager.subscribe(() => {
      setButtons(PluginManager.getToolbarButtons());
    });

    return unsubscribe;
  }, []);

  return buttons;
}

/**
 * Hook to use plugin context menu items
 */
export function usePluginContextMenuItems() {
  const [items, setItems] = useState<ContextMenuItem[]>(PluginManager.getContextMenuItems());

  useEffect(() => {
    const unsubscribe = PluginManager.subscribe(() => {
      setItems(PluginManager.getContextMenuItems());
    });

    return unsubscribe;
  }, []);

  return items;
}

/**
 * Hook to use plugin keyboard shortcuts
 */
export function usePluginKeyboardShortcuts() {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>(PluginManager.getKeyboardShortcuts());

  useEffect(() => {
    const unsubscribe = PluginManager.subscribe(() => {
      setShortcuts(PluginManager.getKeyboardShortcuts());
    });

    return unsubscribe;
  }, []);

  // Register keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (matchKeyboardShortcut(event, shortcut.keys)) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return shortcuts;
}

/**
 * Match keyboard event to shortcut string
 */
function matchKeyboardShortcut(event: KeyboardEvent, shortcutKeys: string): boolean {
  const keys = shortcutKeys.toLowerCase().split('+').map(k => k.trim());
  const pressedKeys: string[] = [];

  if (event.ctrlKey || event.metaKey) pressedKeys.push('ctrl');
  if (event.altKey) pressedKeys.push('alt');
  if (event.shiftKey) pressedKeys.push('shift');
  pressedKeys.push(event.key.toLowerCase());

  // Check if all required keys are pressed
  return keys.every(k => pressedKeys.includes(k)) && keys.length === pressedKeys.length;
}

// ============================================================================
// HOOK EXECUTION
// ============================================================================

/**
 * Execute plugin hooks with the given context
 */
export async function executePluginHooks(
  hookType: PluginHookType,
  context: Omit<HookContext, 'pluginId' | 'timestamp'>
): Promise<boolean> {
  return PluginManager.executeHooks(hookType, {
    ...context,
    timestamp: Date.now(),
  });
}

/**
 * Hook to automatically trigger plugin hooks on builder events
 */
export function usePluginHooks() {
  const { selectedId, elements, viewport } = useBuilderStore();
  const [prevSelectedId, setPrevSelectedId] = useState<string | null>(selectedId);
  const [prevViewport, setPrevViewport] = useState(viewport);

  // Selection change hook
  useEffect(() => {
    if (selectedId !== prevSelectedId) {
      executePluginHooks('onSelectionChange', {
        elementId: selectedId || undefined,
      });
      setPrevSelectedId(selectedId);
    }
  }, [selectedId, prevSelectedId]);

  // Viewport change hook
  useEffect(() => {
    if (viewport !== prevViewport) {
      executePluginHooks('onViewportChange', {
        data: { viewport },
      });
      setPrevViewport(viewport);
    }
  }, [viewport, prevViewport]);

  // Before render hook (called on every element change)
  useEffect(() => {
    executePluginHooks('beforeRender', {
      data: { elementCount: elements.length },
    });
  }, [elements]);

  return null;
}

// ============================================================================
// PLUGIN CREATION HELPERS
// ============================================================================

/**
 * Helper to create a plugin with proper typing
 */
export function createPlugin(plugin: Plugin): Plugin {
  return plugin;
}

/**
 * Helper to create a simple plugin with minimal configuration
 */
export function createSimplePlugin(
  id: string,
  name: string,
  description: string,
  activate: (api: PluginAPI) => void,
  deactivate?: (api: PluginAPI) => void
): Plugin {
  return {
    metadata: {
      id,
      name,
      version: '1.0.0',
      description,
      author: 'Built-in',
    },
    permissions: ['read:elements', 'ui:notifications'],
    activate,
    deactivate,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all classes from an element
 */
export function getElementClasses(element: BuilderElementReadOnly): string[] {
  const { styles } = element;
  return [
    ...styles.layout,
    ...styles.spacing,
    ...styles.typography,
    ...styles.colors,
    ...styles.borders,
    ...styles.effects,
  ];
}

/**
 * Check if element has a specific class
 */
export function elementHasClass(element: BuilderElementReadOnly, className: string): boolean {
  return getElementClasses(element).includes(className);
}

/**
 * Check if element has any class matching pattern
 */
export function elementHasClassPattern(element: BuilderElementReadOnly, pattern: RegExp): boolean {
  return getElementClasses(element).some(cls => pattern.test(cls));
}

/**
 * Get all elements recursively
 */
export function getAllElements(elements: BuilderElementReadOnly[]): BuilderElementReadOnly[] {
  const result: BuilderElementReadOnly[] = [];

  function traverse(els: BuilderElementReadOnly[]) {
    for (const el of els) {
      result.push(el);
      traverse(el.children);
    }
  }

  traverse(elements);
  return result;
}

/**
 * Find element by ID
 */
export function findElementById(
  elements: BuilderElementReadOnly[],
  id: string
): BuilderElementReadOnly | null {
  for (const el of elements) {
    if (el.id === id) return el;
    const found = findElementById(el.children, id);
    if (found) return found;
  }
  return null;
}

/**
 * Get element depth in tree
 */
export function getElementDepth(elements: BuilderElementReadOnly[], elementId: string): number {
  function findDepth(els: BuilderElementReadOnly[], depth: number): number {
    for (const el of els) {
      if (el.id === elementId) return depth;
      const childDepth = findDepth(el.children, depth + 1);
      if (childDepth > -1) return childDepth;
    }
    return -1;
  }

  return findDepth(elements, 0);
}

/**
 * Count total elements
 */
export function countElements(elements: BuilderElementReadOnly[]): number {
  let count = elements.length;
  for (const el of elements) {
    count += countElements(el.children);
  }
  return count;
}

/**
 * Get element ancestors
 */
export function getElementAncestors(
  elements: BuilderElementReadOnly[],
  elementId: string
): BuilderElementReadOnly[] {
  const ancestors: BuilderElementReadOnly[] = [];

  function findAncestors(els: BuilderElementReadOnly[], target: string): boolean {
    for (const el of els) {
      if (el.id === target) {
        return true;
      }
      if (findAncestors(el.children, target)) {
        ancestors.unshift(el);
        return true;
      }
    }
    return false;
  }

  findAncestors(elements, elementId);
  return ancestors;
}

// ============================================================================
// RE-EXPORTS
// ============================================================================

export {
  PluginManager,
  type Plugin,
  type PluginState,
  type PluginAPI,
  type PluginMetadata,
  type PluginPermission,
  type PluginCategory,
  type PluginSettingsSchema,
  type PluginSettingDefinition,
  type PluginHookType,
  type HookContext,
  type NotificationOptions,
  type CustomPanel,
  type ToolbarButton,
  type ContextMenuItem,
  type KeyboardShortcut,
  type BuilderElementReadOnly,
  type PluginLifecycleState,
} from './pluginSystem';
