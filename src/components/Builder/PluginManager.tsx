'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Puzzle,
  Eye,
  EyeOff,
  Moon,
  Zap,
  Search,
  Settings,
  Info,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Modal, ModalButton } from '@/components/common/Modal';

// ============================================================================
// TYPES
// ============================================================================

type PluginStatus = 'active' | 'inactive' | 'loading' | 'error';

interface PluginSettings {
  [key: string]: string | number | boolean;
}

interface Plugin {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  version: string;
  author: string;
  enabled: boolean;
  status: PluginStatus;
  hasSettings: boolean;
  settings?: PluginSettings;
  settingsSchema?: PluginSettingField[];
}

interface PluginSettingField {
  key: string;
  label: string;
  type: 'toggle' | 'select' | 'number' | 'text';
  description?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  defaultValue: string | number | boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'tailwind-builder-plugins';

const DEFAULT_PLUGINS: Plugin[] = [
  {
    id: 'color-blindness-simulator',
    name: 'Color Blindness Simulator',
    description: 'Preview your design as seen by users with different types of color blindness. Supports protanopia, deuteranopia, tritanopia, and more.',
    icon: Eye,
    version: '1.0.0',
    author: 'Tailwind Builder',
    enabled: false,
    status: 'inactive',
    hasSettings: true,
    settings: {
      simulationType: 'protanopia',
      intensity: 100,
    },
    settingsSchema: [
      {
        key: 'simulationType',
        label: 'Simulation Type',
        type: 'select',
        description: 'Type of color blindness to simulate',
        options: [
          { label: 'Protanopia (Red-blind)', value: 'protanopia' },
          { label: 'Deuteranopia (Green-blind)', value: 'deuteranopia' },
          { label: 'Tritanopia (Blue-blind)', value: 'tritanopia' },
          { label: 'Achromatopsia (Monochrome)', value: 'achromatopsia' },
        ],
        defaultValue: 'protanopia',
      },
      {
        key: 'intensity',
        label: 'Intensity',
        type: 'number',
        description: 'Strength of the simulation (0-100%)',
        min: 0,
        max: 100,
        defaultValue: 100,
      },
    ],
  },
  {
    id: 'dark-mode-preview',
    name: 'Dark Mode Preview',
    description: 'Toggle between light and dark mode previews to ensure your design works well in both themes.',
    icon: Moon,
    version: '1.0.0',
    author: 'Tailwind Builder',
    enabled: false,
    status: 'inactive',
    hasSettings: true,
    settings: {
      defaultMode: 'system',
      transitionDuration: 200,
    },
    settingsSchema: [
      {
        key: 'defaultMode',
        label: 'Default Mode',
        type: 'select',
        description: 'Initial theme mode for preview',
        options: [
          { label: 'System', value: 'system' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ],
        defaultValue: 'system',
      },
      {
        key: 'transitionDuration',
        label: 'Transition Duration (ms)',
        type: 'number',
        description: 'Animation duration when switching modes',
        min: 0,
        max: 1000,
        defaultValue: 200,
      },
    ],
  },
  {
    id: 'performance-hints',
    name: 'Performance Hints',
    description: 'Get real-time suggestions to improve your design performance. Detects large images, excessive DOM depth, and more.',
    icon: Zap,
    version: '1.0.0',
    author: 'Tailwind Builder',
    enabled: false,
    status: 'inactive',
    hasSettings: true,
    settings: {
      showImageWarnings: true,
      showDOMWarnings: true,
      maxDOMDepth: 10,
    },
    settingsSchema: [
      {
        key: 'showImageWarnings',
        label: 'Image Warnings',
        type: 'toggle',
        description: 'Show warnings for large or unoptimized images',
        defaultValue: true,
      },
      {
        key: 'showDOMWarnings',
        label: 'DOM Warnings',
        type: 'toggle',
        description: 'Show warnings for excessive DOM depth',
        defaultValue: true,
      },
      {
        key: 'maxDOMDepth',
        label: 'Max DOM Depth',
        type: 'number',
        description: 'Maximum nesting level before warning',
        min: 5,
        max: 20,
        defaultValue: 10,
      },
    ],
  },
  {
    id: 'seo-checker',
    name: 'SEO Checker',
    description: 'Analyze your page structure for SEO best practices. Checks heading hierarchy, alt texts, meta information, and semantic HTML.',
    icon: Search,
    version: '1.0.0',
    author: 'Tailwind Builder',
    enabled: false,
    status: 'inactive',
    hasSettings: true,
    settings: {
      checkHeadings: true,
      checkAltTexts: true,
      checkSemantic: true,
      strictMode: false,
    },
    settingsSchema: [
      {
        key: 'checkHeadings',
        label: 'Check Headings',
        type: 'toggle',
        description: 'Validate heading hierarchy (H1-H6)',
        defaultValue: true,
      },
      {
        key: 'checkAltTexts',
        label: 'Check Alt Texts',
        type: 'toggle',
        description: 'Ensure all images have alt text',
        defaultValue: true,
      },
      {
        key: 'checkSemantic',
        label: 'Check Semantic HTML',
        type: 'toggle',
        description: 'Validate use of semantic elements',
        defaultValue: true,
      },
      {
        key: 'strictMode',
        label: 'Strict Mode',
        type: 'toggle',
        description: 'Enable stricter validation rules',
        defaultValue: false,
      },
    ],
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface StatusIndicatorProps {
  status: PluginStatus;
}

function StatusIndicator({ status }: StatusIndicatorProps) {
  const statusConfig = {
    active: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-500/20',
      label: 'Active',
    },
    inactive: {
      icon: EyeOff,
      color: 'text-gray-500',
      bg: 'bg-gray-500/20',
      label: 'Inactive',
    },
    loading: {
      icon: Loader2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/20',
      label: 'Loading',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/20',
      label: 'Error',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs',
        config.bg,
        config.color
      )}
    >
      <Icon className={cn('w-3 h-3', status === 'loading' && 'animate-spin')} />
      <span>{config.label}</span>
    </div>
  );
}

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ enabled, onChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full',
        'transition-colors duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        enabled ? 'bg-blue-600' : 'bg-gray-700'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full',
          'bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
          'translate-y-0.5',
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

interface PluginCardProps {
  plugin: Plugin;
  onToggle: (enabled: boolean) => void;
  onOpenSettings: () => void;
}

function PluginCard({ plugin, onToggle, onOpenSettings }: PluginCardProps) {
  const Icon = plugin.icon;

  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-all duration-200',
        plugin.enabled
          ? 'bg-gray-800/80 border-blue-500/30'
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            plugin.enabled
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-gray-700 text-gray-400'
          )}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-white truncate">
              {plugin.name}
            </h4>
            <ToggleSwitch
              enabled={plugin.enabled}
              onChange={onToggle}
              disabled={plugin.status === 'loading'}
            />
          </div>

          <p className="mt-1 text-xs text-gray-400 line-clamp-2">
            {plugin.description}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <StatusIndicator status={plugin.status} />

            {plugin.hasSettings && (
              <button
                onClick={onOpenSettings}
                disabled={!plugin.enabled}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded text-xs',
                  'transition-colors duration-150',
                  plugin.enabled
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 cursor-not-allowed'
                )}
              >
                <Settings className="w-3.5 h-3.5" />
                Settings
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PluginSettingsModalProps {
  plugin: Plugin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveSettings: (settings: PluginSettings) => void;
}

function PluginSettingsModal({
  plugin,
  open,
  onOpenChange,
  onSaveSettings,
}: PluginSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<PluginSettings>({});

  useEffect(() => {
    if (plugin?.settings) {
      setLocalSettings({ ...plugin.settings });
    }
  }, [plugin]);

  if (!plugin) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    onOpenChange(false);
  };

  const handleChange = (key: string, value: string | number | boolean) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const Icon = plugin.icon;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`${plugin.name} Settings`}
      size="md"
      footer={
        <>
          <ModalButton variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </ModalButton>
          <ModalButton variant="primary" onClick={handleSave}>
            Save Changes
          </ModalButton>
        </>
      }
    >
      <div className="space-y-4">
        {/* Plugin Info */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{plugin.name}</p>
            <p className="text-xs text-gray-500">
              v{plugin.version} by {plugin.author}
            </p>
          </div>
        </div>

        {/* Settings Fields */}
        {plugin.settingsSchema?.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                {field.label}
              </label>

              {field.type === 'toggle' && (
                <ToggleSwitch
                  enabled={Boolean(localSettings[field.key])}
                  onChange={(checked) => handleChange(field.key, checked)}
                />
              )}
            </div>

            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}

            {field.type === 'select' && (
              <select
                value={String(localSettings[field.key] || field.defaultValue)}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className={cn(
                  'w-full px-3 py-2 text-sm rounded-md',
                  'bg-gray-800 border border-gray-700 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'number' && (
              <input
                type="number"
                value={Number(localSettings[field.key] ?? field.defaultValue)}
                onChange={(e) => handleChange(field.key, Number(e.target.value))}
                min={field.min}
                max={field.max}
                className={cn(
                  'w-full px-3 py-2 text-sm rounded-md',
                  'bg-gray-800 border border-gray-700 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              />
            )}

            {field.type === 'text' && (
              <input
                type="text"
                value={String(localSettings[field.key] || field.defaultValue)}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className={cn(
                  'w-full px-3 py-2 text-sm rounded-md',
                  'bg-gray-800 border border-gray-700 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PluginManager() {
  const [plugins, setPlugins] = useState<Plugin[]>(DEFAULT_PLUGINS);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  // Load plugin states from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const savedStates = JSON.parse(stored) as Record<string, {
          enabled: boolean;
          settings?: PluginSettings;
        }>;

        setPlugins((prev) =>
          prev.map((plugin) => {
            const saved = savedStates[plugin.id];
            if (saved) {
              return {
                ...plugin,
                enabled: saved.enabled,
                status: saved.enabled ? 'active' : 'inactive',
                settings: saved.settings || plugin.settings,
              };
            }
            return plugin;
          })
        );
      }
    } catch (error) {
      console.error('Failed to load plugin states:', error);
    }
  }, []);

  // Save plugin states to localStorage
  const savePluginStates = useCallback((updatedPlugins: Plugin[]) => {
    try {
      const states: Record<string, { enabled: boolean; settings?: PluginSettings }> = {};
      for (const plugin of updatedPlugins) {
        states[plugin.id] = {
          enabled: plugin.enabled,
          settings: plugin.settings,
        };
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
    } catch (error) {
      console.error('Failed to save plugin states:', error);
    }
  }, []);

  const handleTogglePlugin = useCallback((pluginId: string, enabled: boolean) => {
    setPlugins((prev) => {
      const updated = prev.map((plugin) => {
        if (plugin.id === pluginId) {
          return {
            ...plugin,
            enabled,
            status: enabled ? 'active' : 'inactive',
          } as Plugin;
        }
        return plugin;
      });
      savePluginStates(updated);
      return updated;
    });
  }, [savePluginStates]);

  const handleOpenSettings = useCallback((plugin: Plugin) => {
    setSelectedPlugin(plugin);
    setSettingsModalOpen(true);
  }, []);

  const handleSaveSettings = useCallback((settings: PluginSettings) => {
    if (!selectedPlugin) return;

    setPlugins((prev) => {
      const updated = prev.map((plugin) => {
        if (plugin.id === selectedPlugin.id) {
          return { ...plugin, settings };
        }
        return plugin;
      });
      savePluginStates(updated);
      return updated;
    });
  }, [selectedPlugin, savePluginStates]);

  const enabledCount = plugins.filter((p) => p.enabled).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Puzzle className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Plugins</h3>
          {enabledCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
              {enabledCount} active
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          Extend builder functionality with plugins
        </p>
      </div>

      {/* Plugin List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {plugins.map((plugin) => (
          <PluginCard
            key={plugin.id}
            plugin={plugin}
            onToggle={(enabled) => handleTogglePlugin(plugin.id, enabled)}
            onOpenSettings={() => handleOpenSettings(plugin)}
          />
        ))}
      </div>

      {/* Info Footer */}
      <div className="px-4 py-3 border-t border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Info className="w-3.5 h-3.5" />
          <span>Plugin effects apply to the preview canvas</span>
        </div>
      </div>

      {/* Settings Modal */}
      <PluginSettingsModal
        plugin={selectedPlugin}
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}

export default PluginManager;
