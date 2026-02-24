/**
 * Plugin Store
 *
 * Zustand store for managing plugin state in the UI.
 * This store tracks installed plugins, their activation status, and settings.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PluginManager, Plugin, PluginState, PluginLifecycleState } from '@/lib/pluginSystem';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Persisted plugin configuration
 */
interface PersistedPluginConfig {
  pluginId: string;
  enabled: boolean;
  settings: Record<string, unknown>;
  installedAt: number;
  lastUpdated?: number;
}

/**
 * Plugin store state
 */
interface PluginStoreState {
  // Persisted state
  installedPlugins: PersistedPluginConfig[];
  autoActivatePlugins: boolean;
  showBuiltInPlugins: boolean;

  // UI state (not persisted)
  selectedPluginId: string | null;
  isPluginManagerOpen: boolean;
  searchQuery: string;
  categoryFilter: string | null;

  // Actions
  installPlugin: (plugin: Plugin) => Promise<void>;
  uninstallPlugin: (pluginId: string) => Promise<void>;
  enablePlugin: (pluginId: string) => Promise<void>;
  disablePlugin: (pluginId: string) => Promise<void>;
  togglePlugin: (pluginId: string) => Promise<void>;
  updatePluginSettings: (pluginId: string, settings: Record<string, unknown>) => void;
  getPluginSettings: (pluginId: string) => Record<string, unknown>;
  isPluginEnabled: (pluginId: string) => boolean;
  isPluginInstalled: (pluginId: string) => boolean;
  setAutoActivate: (autoActivate: boolean) => void;
  setShowBuiltIn: (showBuiltIn: boolean) => void;

  // UI actions
  selectPlugin: (pluginId: string | null) => void;
  setPluginManagerOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string | null) => void;

  // Sync with plugin manager
  syncWithPluginManager: () => void;
  initializePlugins: () => Promise<void>;

  // Bulk actions
  enableAllPlugins: () => Promise<void>;
  disableAllPlugins: () => Promise<void>;
  resetAllPluginSettings: () => void;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const usePluginStore = create<PluginStoreState>()(
  persist(
    (set, get) => ({
      // Initial persisted state
      installedPlugins: [],
      autoActivatePlugins: true,
      showBuiltInPlugins: true,

      // Initial UI state
      selectedPluginId: null,
      isPluginManagerOpen: false,
      searchQuery: '',
      categoryFilter: null,

      // Install a new plugin
      installPlugin: async (plugin: Plugin) => {
        const { installedPlugins, autoActivatePlugins } = get();
        const pluginId = plugin.metadata.id;

        // Check if already installed
        if (installedPlugins.some((p) => p.pluginId === pluginId)) {
          console.warn(`Plugin "${pluginId}" is already installed`);
          return;
        }

        // Register with plugin manager
        PluginManager.register(plugin);

        // Create config
        const config: PersistedPluginConfig = {
          pluginId,
          enabled: autoActivatePlugins,
          settings: {},
          installedAt: Date.now(),
        };

        // Initialize default settings
        if (plugin.settingsSchema) {
          for (const field of plugin.settingsSchema.fields) {
            config.settings[field.key] = field.defaultValue;
          }
        }

        // Add to installed list
        set({
          installedPlugins: [...installedPlugins, config],
        });

        // Auto-activate if enabled
        if (autoActivatePlugins) {
          try {
            await PluginManager.activate(pluginId);
          } catch (error) {
            console.error(`Failed to activate plugin "${pluginId}":`, error);
          }
        }
      },

      // Uninstall a plugin
      uninstallPlugin: async (pluginId: string) => {
        const { installedPlugins } = get();

        // Unregister from plugin manager
        try {
          await PluginManager.unregister(pluginId);
        } catch (error) {
          console.error(`Failed to unregister plugin "${pluginId}":`, error);
        }

        // Remove from installed list
        set({
          installedPlugins: installedPlugins.filter((p) => p.pluginId !== pluginId),
          selectedPluginId: get().selectedPluginId === pluginId ? null : get().selectedPluginId,
        });
      },

      // Enable a plugin
      enablePlugin: async (pluginId: string) => {
        const { installedPlugins } = get();
        const config = installedPlugins.find((p) => p.pluginId === pluginId);

        if (!config) {
          console.error(`Plugin "${pluginId}" is not installed`);
          return;
        }

        try {
          await PluginManager.activate(pluginId);

          set({
            installedPlugins: installedPlugins.map((p) =>
              p.pluginId === pluginId
                ? { ...p, enabled: true, lastUpdated: Date.now() }
                : p
            ),
          });
        } catch (error) {
          console.error(`Failed to enable plugin "${pluginId}":`, error);
          throw error;
        }
      },

      // Disable a plugin
      disablePlugin: async (pluginId: string) => {
        const { installedPlugins } = get();
        const config = installedPlugins.find((p) => p.pluginId === pluginId);

        if (!config) {
          console.error(`Plugin "${pluginId}" is not installed`);
          return;
        }

        try {
          await PluginManager.deactivate(pluginId);

          set({
            installedPlugins: installedPlugins.map((p) =>
              p.pluginId === pluginId
                ? { ...p, enabled: false, lastUpdated: Date.now() }
                : p
            ),
          });
        } catch (error) {
          console.error(`Failed to disable plugin "${pluginId}":`, error);
          throw error;
        }
      },

      // Toggle plugin enabled state
      togglePlugin: async (pluginId: string) => {
        const { isPluginEnabled, enablePlugin, disablePlugin } = get();

        if (isPluginEnabled(pluginId)) {
          await disablePlugin(pluginId);
        } else {
          await enablePlugin(pluginId);
        }
      },

      // Update plugin settings
      updatePluginSettings: (pluginId: string, settings: Record<string, unknown>) => {
        const { installedPlugins } = get();

        // Update in plugin manager
        PluginManager.updatePluginSettings(pluginId, settings);

        // Update in store
        set({
          installedPlugins: installedPlugins.map((p) =>
            p.pluginId === pluginId
              ? { ...p, settings: { ...p.settings, ...settings }, lastUpdated: Date.now() }
              : p
          ),
        });
      },

      // Get plugin settings
      getPluginSettings: (pluginId: string) => {
        const { installedPlugins } = get();
        const config = installedPlugins.find((p) => p.pluginId === pluginId);
        return config?.settings || {};
      },

      // Check if plugin is enabled
      isPluginEnabled: (pluginId: string) => {
        const pluginState = PluginManager.getPlugin(pluginId);
        return pluginState?.state === 'activated';
      },

      // Check if plugin is installed
      isPluginInstalled: (pluginId: string) => {
        const { installedPlugins } = get();
        return installedPlugins.some((p) => p.pluginId === pluginId);
      },

      // Set auto-activate preference
      setAutoActivate: (autoActivate: boolean) => {
        set({ autoActivatePlugins: autoActivate });
      },

      // Set show built-in preference
      setShowBuiltIn: (showBuiltIn: boolean) => {
        set({ showBuiltInPlugins: showBuiltIn });
      },

      // UI actions
      selectPlugin: (pluginId: string | null) => {
        set({ selectedPluginId: pluginId });
      },

      setPluginManagerOpen: (open: boolean) => {
        set({ isPluginManagerOpen: open });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setCategoryFilter: (category: string | null) => {
        set({ categoryFilter: category });
      },

      // Sync store with plugin manager state
      syncWithPluginManager: () => {
        const { installedPlugins } = get();
        const plugins = PluginManager.getPlugins();

        // Update enabled status based on actual plugin state
        const updatedPlugins = installedPlugins.map((config) => {
          const pluginState = plugins.get(config.pluginId);
          return {
            ...config,
            enabled: pluginState?.state === 'activated',
          };
        });

        set({ installedPlugins: updatedPlugins });
      },

      // Initialize plugins on app start
      initializePlugins: async () => {
        const { installedPlugins } = get();

        for (const config of installedPlugins) {
          const pluginState = PluginManager.getPlugin(config.pluginId);

          if (!pluginState) {
            // Plugin not registered, skip
            continue;
          }

          // Apply persisted settings
          if (Object.keys(config.settings).length > 0) {
            PluginManager.updatePluginSettings(config.pluginId, config.settings);
          }

          // Activate if was enabled
          if (config.enabled && pluginState.state !== 'activated') {
            try {
              await PluginManager.activate(config.pluginId);
            } catch (error) {
              console.error(`Failed to activate plugin "${config.pluginId}":`, error);
            }
          }
        }
      },

      // Enable all installed plugins
      enableAllPlugins: async () => {
        const { installedPlugins, enablePlugin } = get();

        for (const config of installedPlugins) {
          if (!config.enabled) {
            try {
              await enablePlugin(config.pluginId);
            } catch (error) {
              console.error(`Failed to enable plugin "${config.pluginId}":`, error);
            }
          }
        }
      },

      // Disable all installed plugins
      disableAllPlugins: async () => {
        const { installedPlugins, disablePlugin } = get();

        for (const config of installedPlugins) {
          if (config.enabled) {
            try {
              await disablePlugin(config.pluginId);
            } catch (error) {
              console.error(`Failed to disable plugin "${config.pluginId}":`, error);
            }
          }
        }
      },

      // Reset all plugin settings to defaults
      resetAllPluginSettings: () => {
        const { installedPlugins } = get();
        const plugins = PluginManager.getPlugins();

        const updatedPlugins = installedPlugins.map((config) => {
          const pluginState = plugins.get(config.pluginId);
          const defaultSettings: Record<string, unknown> = {};

          if (pluginState?.plugin.settingsSchema) {
            for (const field of pluginState.plugin.settingsSchema.fields) {
              defaultSettings[field.key] = field.defaultValue;
            }
          }

          // Update in plugin manager
          PluginManager.updatePluginSettings(config.pluginId, defaultSettings);

          return {
            ...config,
            settings: defaultSettings,
            lastUpdated: Date.now(),
          };
        });

        set({ installedPlugins: updatedPlugins });
      },
    }),
    {
      name: 'tailwind-builder-plugins',
      partialize: (state) => ({
        installedPlugins: state.installedPlugins,
        autoActivatePlugins: state.autoActivatePlugins,
        showBuiltInPlugins: state.showBuiltInPlugins,
      }),
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Get installed plugins with full state
 */
export function getInstalledPluginsWithState(): Array<{
  config: PersistedPluginConfig;
  state: PluginState | undefined;
}> {
  const { installedPlugins } = usePluginStore.getState();
  const plugins = PluginManager.getPlugins();

  return installedPlugins.map((config) => ({
    config,
    state: plugins.get(config.pluginId),
  }));
}

/**
 * Get plugins filtered by category
 */
export function getPluginsByCategory(category: string | null): PluginState[] {
  const plugins = PluginManager.getPlugins();
  const pluginList = Array.from(plugins.values());

  if (!category) {
    return pluginList;
  }

  return pluginList.filter(
    (p) => p.plugin.metadata.category === category
  );
}

/**
 * Search plugins by name or description
 */
export function searchPlugins(query: string): PluginState[] {
  const plugins = PluginManager.getPlugins();
  const pluginList = Array.from(plugins.values());

  if (!query.trim()) {
    return pluginList;
  }

  const lowerQuery = query.toLowerCase();

  return pluginList.filter((p) => {
    const { name, description, tags } = p.plugin.metadata;
    return (
      name.toLowerCase().includes(lowerQuery) ||
      description.toLowerCase().includes(lowerQuery) ||
      tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to get filtered plugins based on store state
 */
export function useFilteredPlugins() {
  const searchQuery = usePluginStore((state) => state.searchQuery);
  const categoryFilter = usePluginStore((state) => state.categoryFilter);

  let plugins = Array.from(PluginManager.getPlugins().values());

  // Filter by search query
  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase();
    plugins = plugins.filter((p) => {
      const { name, description, tags } = p.plugin.metadata;
      return (
        name.toLowerCase().includes(lowerQuery) ||
        description.toLowerCase().includes(lowerQuery) ||
        tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }

  // Filter by category
  if (categoryFilter) {
    plugins = plugins.filter(
      (p) => p.plugin.metadata.category === categoryFilter
    );
  }

  return plugins;
}

/**
 * Hook to get selected plugin
 */
export function useSelectedPlugin() {
  const selectedPluginId = usePluginStore((state) => state.selectedPluginId);

  if (!selectedPluginId) {
    return null;
  }

  return PluginManager.getPlugin(selectedPluginId);
}
