'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';
import {
  X,
  Settings,
  Grid3X3,
  Save,
  Download,
  Keyboard,
  Palette,
  Info,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCustomizationStore } from '@/store/customizationStore';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES
// ============================================================================

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingsRow({ label, description, children }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
      <div>
        <p className="text-sm text-white">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function ToggleSwitch({ checked, onCheckedChange }: ToggleSwitchProps) {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        'w-11 h-6 rounded-full relative transition-colors',
        checked ? 'bg-blue-600' : 'bg-gray-700'
      )}
    >
      <Switch.Thumb
        className={cn(
          'block w-5 h-5 rounded-full bg-white transition-transform',
          'translate-x-0.5',
          checked && 'translate-x-[22px]'
        )}
      />
    </Switch.Root>
  );
}

// ============================================================================
// TAB CONTENT COMPONENTS
// ============================================================================

function GeneralSettings() {
  const {
    projectSettings,
    updateProjectSettings,
    isDarkMode,
    setDarkMode,
  } = useCustomizationStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Project Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Project Name</label>
            <input
              type="text"
              value={projectSettings.name}
              onChange={(e) => updateProjectSettings({ name: e.target.value })}
              className={cn(
                'w-full px-3 py-2 text-sm',
                'bg-gray-800 border border-gray-700 rounded-lg',
                'text-white placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
              )}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              value={projectSettings.description}
              onChange={(e) => updateProjectSettings({ description: e.target.value })}
              rows={2}
              className={cn(
                'w-full px-3 py-2 text-sm resize-none',
                'bg-gray-800 border border-gray-700 rounded-lg',
                'text-white placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
              )}
              placeholder="Project description..."
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Appearance
        </h3>
        <SettingsRow
          label="Dark Mode"
          description="Use dark theme for the builder interface"
        >
          <ToggleSwitch checked={isDarkMode} onCheckedChange={setDarkMode} />
        </SettingsRow>
      </div>
    </div>
  );
}

function GridSettings() {
  const { projectSettings, updateGridSettings } = useCustomizationStore();
  const { grid } = projectSettings;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
        <Grid3X3 className="w-4 h-4" />
        Grid Configuration
      </h3>

      <SettingsRow label="Show Grid" description="Display grid overlay on canvas">
        <ToggleSwitch
          checked={grid.enabled}
          onCheckedChange={(enabled) => updateGridSettings({ enabled })}
        />
      </SettingsRow>

      <SettingsRow label="Snap to Grid" description="Automatically align elements to grid">
        <ToggleSwitch
          checked={grid.snap}
          onCheckedChange={(snap) => updateGridSettings({ snap })}
        />
      </SettingsRow>

      <div className="space-y-2">
        <label className="text-xs text-gray-400">Grid Size (px)</label>
        <input
          type="number"
          value={grid.size}
          onChange={(e) => updateGridSettings({ size: Number(e.target.value) })}
          min={4}
          max={64}
          step={4}
          className={cn(
            'w-24 px-3 py-2 text-sm',
            'bg-gray-800 border border-gray-700 rounded-lg',
            'text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400">Grid Opacity</label>
        <input
          type="range"
          value={grid.opacity * 100}
          onChange={(e) => updateGridSettings({ opacity: Number(e.target.value) / 100 })}
          min={5}
          max={50}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{Math.round(grid.opacity * 100)}%</span>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400">Grid Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={grid.color}
            onChange={(e) => updateGridSettings({ color: e.target.value })}
            className="w-10 h-10 rounded border border-gray-700 cursor-pointer"
          />
          <input
            type="text"
            value={grid.color}
            onChange={(e) => updateGridSettings({ color: e.target.value })}
            className={cn(
              'w-24 px-3 py-2 text-sm font-mono',
              'bg-gray-800 border border-gray-700 rounded-lg',
              'text-white',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
            )}
          />
        </div>
      </div>
    </div>
  );
}

function AutosaveSettings() {
  const { projectSettings, updateAutosaveSettings } = useCustomizationStore();
  const { autosave } = projectSettings;

  const intervalOptions = [
    { value: 15000, label: '15 seconds' },
    { value: 30000, label: '30 seconds' },
    { value: 60000, label: '1 minute' },
    { value: 120000, label: '2 minutes' },
    { value: 300000, label: '5 minutes' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
        <Save className="w-4 h-4" />
        Autosave Settings
      </h3>

      <SettingsRow label="Enable Autosave" description="Automatically save your work">
        <ToggleSwitch
          checked={autosave.enabled}
          onCheckedChange={(enabled) => updateAutosaveSettings({ enabled })}
        />
      </SettingsRow>

      <div className="space-y-2">
        <label className="text-xs text-gray-400">Save Interval</label>
        <select
          value={autosave.interval}
          onChange={(e) => updateAutosaveSettings({ interval: Number(e.target.value) })}
          disabled={!autosave.enabled}
          className={cn(
            'w-full px-3 py-2 text-sm',
            'bg-gray-800 border border-gray-700 rounded-lg',
            'text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
            !autosave.enabled && 'opacity-50'
          )}
        >
          {intervalOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400">Max History Snapshots</label>
        <input
          type="number"
          value={autosave.maxSnapshots}
          onChange={(e) => updateAutosaveSettings({ maxSnapshots: Number(e.target.value) })}
          min={5}
          max={50}
          disabled={!autosave.enabled}
          className={cn(
            'w-24 px-3 py-2 text-sm',
            'bg-gray-800 border border-gray-700 rounded-lg',
            'text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
            !autosave.enabled && 'opacity-50'
          )}
        />
      </div>
    </div>
  );
}

function ExportSettings() {
  const { projectSettings, updateExportSettings } = useCustomizationStore();
  const { export: exportConfig } = projectSettings;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
        <Download className="w-4 h-4" />
        Export Settings
      </h3>

      <div className="space-y-2">
        <label className="text-xs text-gray-400">Default Format</label>
        <select
          value={exportConfig.defaultFormat}
          onChange={(e) =>
            updateExportSettings({ defaultFormat: e.target.value as 'jsx' | 'tsx' })
          }
          className={cn(
            'w-full px-3 py-2 text-sm',
            'bg-gray-800 border border-gray-700 rounded-lg',
            'text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
          )}
        >
          <option value="jsx">JSX (React)</option>
          <option value="tsx">TSX (TypeScript React)</option>
        </select>
      </div>

      <SettingsRow
        label="Include Comments"
        description="Add helpful comments to exported code"
      >
        <ToggleSwitch
          checked={exportConfig.includeComments}
          onCheckedChange={(includeComments) => updateExportSettings({ includeComments })}
        />
      </SettingsRow>

      <SettingsRow label="Minify Output" description="Remove whitespace from exported code">
        <ToggleSwitch
          checked={exportConfig.minify}
          onCheckedChange={(minify) => updateExportSettings({ minify })}
        />
      </SettingsRow>

      <div className="space-y-2">
        <label className="text-xs text-gray-400">Component Prefix</label>
        <input
          type="text"
          value={exportConfig.componentPrefix}
          onChange={(e) => updateExportSettings({ componentPrefix: e.target.value })}
          placeholder="e.g., My, App, UI"
          className={cn(
            'w-full px-3 py-2 text-sm',
            'bg-gray-800 border border-gray-700 rounded-lg',
            'text-white placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
          )}
        />
        <p className="text-[10px] text-gray-500">
          Prefix added to component names (e.g., MyButton, AppCard)
        </p>
      </div>
    </div>
  );
}

function ShortcutsSettings() {
  const shortcuts = [
    { action: 'Undo', keys: 'Ctrl+Z' },
    { action: 'Redo', keys: 'Ctrl+Shift+Z' },
    { action: 'Save', keys: 'Ctrl+S' },
    { action: 'Copy', keys: 'Ctrl+C' },
    { action: 'Paste', keys: 'Ctrl+V' },
    { action: 'Cut', keys: 'Ctrl+X' },
    { action: 'Delete', keys: 'Del / Backspace' },
    { action: 'Duplicate', keys: 'Ctrl+D' },
    { action: 'Select All', keys: 'Ctrl+A' },
    { action: 'Toggle Grid', keys: 'Ctrl+G' },
    { action: 'Toggle Code', keys: 'Ctrl+Shift+C' },
    { action: 'Command Palette', keys: 'Ctrl+K' },
    { action: 'Zoom In', keys: 'Ctrl+=' },
    { action: 'Zoom Out', keys: 'Ctrl+-' },
    { action: 'Reset Zoom', keys: 'Ctrl+0' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
        <Keyboard className="w-4 h-4" />
        Keyboard Shortcuts
      </h3>

      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.action}
            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-800/50"
          >
            <span className="text-sm text-gray-300">{shortcut.action}</span>
            <kbd
              className={cn(
                'px-2 py-1 text-xs font-mono rounded',
                'bg-gray-800 text-gray-400 border border-gray-700'
              )}
            >
              {shortcut.keys}
            </kbd>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Shortcuts can be customized in a future update.
      </p>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('general');
  const { resetToDefaults } = useCustomizationStore();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      resetToDefaults();
      toast.success('Settings reset to defaults');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-2xl max-h-[85vh] bg-gray-900 rounded-xl shadow-2xl z-50',
            'flex flex-col overflow-hidden',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
        >
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <Dialog.Title className="flex items-center gap-2 text-lg font-semibold text-white">
                <Settings className="w-5 h-5" />
                Settings
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex overflow-hidden"
          >
            {/* Sidebar */}
            <Tabs.List className="w-48 flex-shrink-0 border-r border-gray-800 p-2 space-y-1">
              <Tabs.Trigger
                value="general"
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm',
                  'transition-colors',
                  activeTab === 'general'
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                )}
              >
                <Info className="w-4 h-4" />
                General
              </Tabs.Trigger>
              <Tabs.Trigger
                value="grid"
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm',
                  'transition-colors',
                  activeTab === 'grid'
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                )}
              >
                <Grid3X3 className="w-4 h-4" />
                Grid
              </Tabs.Trigger>
              <Tabs.Trigger
                value="autosave"
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm',
                  'transition-colors',
                  activeTab === 'autosave'
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                )}
              >
                <Save className="w-4 h-4" />
                Autosave
              </Tabs.Trigger>
              <Tabs.Trigger
                value="export"
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm',
                  'transition-colors',
                  activeTab === 'export'
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                )}
              >
                <Download className="w-4 h-4" />
                Export
              </Tabs.Trigger>
              <Tabs.Trigger
                value="shortcuts"
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm',
                  'transition-colors',
                  activeTab === 'shortcuts'
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                )}
              >
                <Keyboard className="w-4 h-4" />
                Shortcuts
              </Tabs.Trigger>
            </Tabs.List>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-6">
              <Tabs.Content value="general" className="focus:outline-none">
                <GeneralSettings />
              </Tabs.Content>
              <Tabs.Content value="grid" className="focus:outline-none">
                <GridSettings />
              </Tabs.Content>
              <Tabs.Content value="autosave" className="focus:outline-none">
                <AutosaveSettings />
              </Tabs.Content>
              <Tabs.Content value="export" className="focus:outline-none">
                <ExportSettings />
              </Tabs.Content>
              <Tabs.Content value="shortcuts" className="focus:outline-none">
                <ShortcutsSettings />
              </Tabs.Content>
            </div>
          </Tabs.Root>

          {/* Footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-800 bg-gray-900/50">
            <div className="flex items-center justify-between">
              <button
                onClick={handleReset}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                  'text-gray-400 hover:text-white hover:bg-gray-800',
                  'transition-colors'
                )}
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </button>

              <Dialog.Close asChild>
                <button
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    'bg-blue-600 text-white hover:bg-blue-500',
                    'transition-colors'
                  )}
                >
                  Done
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SettingsModal;
