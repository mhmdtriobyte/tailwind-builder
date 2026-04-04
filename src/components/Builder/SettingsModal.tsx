'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Monitor,
  Code2,
  Download,
  Keyboard,
  RotateCcw,
  Save,
  Command,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Modal, ModalButton } from '@/components/common/Modal';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES
// ============================================================================

type SettingsTab = 'general' | 'editor' | 'export' | 'shortcuts';

interface GeneralSettings {
  projectName: string;
  autosaveEnabled: boolean;
  autosaveInterval: number; // in seconds
}

interface EditorSettings {
  gridSize: number;
  snapToGrid: boolean;
  showGuides: boolean;
  showRulers: boolean;
  highlightOnHover: boolean;
}

interface ExportSettings {
  defaultFormat: 'jsx' | 'tsx';
  minifyOutput: boolean;
  includeComments: boolean;
  includeTailwindConfig: boolean;
  componentNamePrefix: string;
}

interface AppSettings {
  general: GeneralSettings;
  editor: EditorSettings;
  export: ExportSettings;
}

interface Shortcut {
  id: string;
  label: string;
  keys: string[];
  category: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'tailwind-builder-settings';

const DEFAULT_SETTINGS: AppSettings = {
  general: {
    projectName: 'My Project',
    autosaveEnabled: true,
    autosaveInterval: 30,
  },
  editor: {
    gridSize: 8,
    snapToGrid: true,
    showGuides: true,
    showRulers: false,
    highlightOnHover: true,
  },
  export: {
    defaultFormat: 'tsx',
    minifyOutput: false,
    includeComments: true,
    includeTailwindConfig: false,
    componentNamePrefix: '',
  },
};

const AUTOSAVE_INTERVALS = [
  { label: '15 seconds', value: 15 },
  { label: '30 seconds', value: 30 },
  { label: '1 minute', value: 60 },
  { label: '2 minutes', value: 120 },
  { label: '5 minutes', value: 300 },
];

const GRID_SIZES = [
  { label: '4px', value: 4 },
  { label: '8px', value: 8 },
  { label: '12px', value: 12 },
  { label: '16px', value: 16 },
  { label: '24px', value: 24 },
];

const SHORTCUTS: Shortcut[] = [
  // General
  { id: 'save', label: 'Save Canvas', keys: ['Ctrl', 'S'], category: 'General' },
  { id: 'undo', label: 'Undo', keys: ['Ctrl', 'Z'], category: 'General' },
  { id: 'redo', label: 'Redo', keys: ['Ctrl', 'Shift', 'Z'], category: 'General' },
  { id: 'copy', label: 'Copy Element', keys: ['Ctrl', 'C'], category: 'General' },
  { id: 'paste', label: 'Paste Element', keys: ['Ctrl', 'V'], category: 'General' },
  { id: 'duplicate', label: 'Duplicate Element', keys: ['Ctrl', 'D'], category: 'General' },
  { id: 'delete', label: 'Delete Element', keys: ['Delete'], category: 'General' },

  // View
  { id: 'toggle-grid', label: 'Toggle Grid', keys: ['Ctrl', 'G'], category: 'View' },
  { id: 'toggle-code', label: 'Toggle Code Preview', keys: ['Ctrl', 'Shift', 'C'], category: 'View' },
  { id: 'zoom-in', label: 'Zoom In', keys: ['Ctrl', '+'], category: 'View' },
  { id: 'zoom-out', label: 'Zoom Out', keys: ['Ctrl', '-'], category: 'View' },
  { id: 'zoom-reset', label: 'Reset Zoom', keys: ['Ctrl', '0'], category: 'View' },

  // Navigation
  { id: 'deselect', label: 'Deselect', keys: ['Escape'], category: 'Navigation' },
  { id: 'select-parent', label: 'Select Parent', keys: ['Ctrl', 'Up'], category: 'Navigation' },
  { id: 'select-next', label: 'Select Next Sibling', keys: ['Ctrl', 'Down'], category: 'Navigation' },
];

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Monitor },
  { id: 'editor', label: 'Editor', icon: Code2 },
  { id: 'export', label: 'Export', icon: Download },
  { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingsRow({ label, description, children }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <span className="text-sm text-gray-300">{label}</span>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full',
        'transition-colors duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
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

interface SelectInputProps {
  value: string | number;
  onChange: (value: string) => void;
  options: { label: string; value: string | number }[];
}

function SelectInput({ value, onChange, options }: SelectInputProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'px-3 py-1.5 text-sm rounded-md',
        'bg-gray-800 border border-gray-700 text-white',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        'cursor-pointer'
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function TextInput({ value, onChange, placeholder }: TextInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'px-3 py-1.5 text-sm rounded-md w-48',
        'bg-gray-800 border border-gray-700 text-white placeholder-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-blue-500'
      )}
    />
  );
}

interface ShortcutBadgeProps {
  keys: string[];
}

function ShortcutBadge({ keys }: ShortcutBadgeProps) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <span key={index}>
          <kbd
            className={cn(
              'inline-flex items-center justify-center',
              'min-w-[1.5rem] px-1.5 py-0.5',
              'text-xs font-medium text-gray-300',
              'bg-gray-800 border border-gray-700 rounded',
              'shadow-sm'
            )}
          >
            {key === 'Ctrl' ? (
              <Command className="w-3 h-3" />
            ) : (
              key
            )}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-gray-600 mx-0.5">+</span>
          )}
        </span>
      ))}
    </div>
  );
}

interface ShortcutItemProps {
  shortcut: Shortcut;
}

function ShortcutItem({ shortcut }: ShortcutItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-300">{shortcut.label}</span>
      <ShortcutBadge keys={shortcut.keys} />
    </div>
  );
}

// ============================================================================
// TAB CONTENT COMPONENTS
// ============================================================================

interface GeneralTabProps {
  settings: GeneralSettings;
  onChange: (settings: GeneralSettings) => void;
}

function GeneralTab({ settings, onChange }: GeneralTabProps) {
  return (
    <div className="space-y-6">
      <SettingsSection title="Project" description="Configure your project settings">
        <SettingsRow label="Project Name">
          <TextInput
            value={settings.projectName}
            onChange={(value) => onChange({ ...settings, projectName: value })}
            placeholder="My Project"
          />
        </SettingsRow>
      </SettingsSection>

      <div className="border-t border-gray-800" />

      <SettingsSection title="Autosave" description="Automatically save your work">
        <SettingsRow
          label="Enable Autosave"
          description="Automatically save canvas to local storage"
        >
          <ToggleSwitch
            enabled={settings.autosaveEnabled}
            onChange={(enabled) => onChange({ ...settings, autosaveEnabled: enabled })}
          />
        </SettingsRow>

        {settings.autosaveEnabled && (
          <SettingsRow label="Save Interval">
            <SelectInput
              value={settings.autosaveInterval}
              onChange={(value) =>
                onChange({ ...settings, autosaveInterval: parseInt(value) })
              }
              options={AUTOSAVE_INTERVALS}
            />
          </SettingsRow>
        )}
      </SettingsSection>
    </div>
  );
}

interface EditorTabProps {
  settings: EditorSettings;
  onChange: (settings: EditorSettings) => void;
}

function EditorTab({ settings, onChange }: EditorTabProps) {
  return (
    <div className="space-y-6">
      <SettingsSection title="Grid" description="Configure the canvas grid">
        <SettingsRow label="Grid Size">
          <SelectInput
            value={settings.gridSize}
            onChange={(value) =>
              onChange({ ...settings, gridSize: parseInt(value) })
            }
            options={GRID_SIZES}
          />
        </SettingsRow>

        <SettingsRow
          label="Snap to Grid"
          description="Elements will align to grid when dragging"
        >
          <ToggleSwitch
            enabled={settings.snapToGrid}
            onChange={(enabled) => onChange({ ...settings, snapToGrid: enabled })}
          />
        </SettingsRow>
      </SettingsSection>

      <div className="border-t border-gray-800" />

      <SettingsSection title="Visual Aids" description="Helpers for precise editing">
        <SettingsRow
          label="Show Guides"
          description="Display alignment guides when dragging"
        >
          <ToggleSwitch
            enabled={settings.showGuides}
            onChange={(enabled) => onChange({ ...settings, showGuides: enabled })}
          />
        </SettingsRow>

        <SettingsRow
          label="Show Rulers"
          description="Display rulers on canvas edges"
        >
          <ToggleSwitch
            enabled={settings.showRulers}
            onChange={(enabled) => onChange({ ...settings, showRulers: enabled })}
          />
        </SettingsRow>

        <SettingsRow
          label="Highlight on Hover"
          description="Highlight elements when hovering"
        >
          <ToggleSwitch
            enabled={settings.highlightOnHover}
            onChange={(enabled) =>
              onChange({ ...settings, highlightOnHover: enabled })
            }
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}

interface ExportTabProps {
  settings: ExportSettings;
  onChange: (settings: ExportSettings) => void;
}

function ExportTab({ settings, onChange }: ExportTabProps) {
  return (
    <div className="space-y-6">
      <SettingsSection title="Code Output" description="Configure generated code">
        <SettingsRow label="Default Format">
          <SelectInput
            value={settings.defaultFormat}
            onChange={(value) =>
              onChange({ ...settings, defaultFormat: value as 'jsx' | 'tsx' })
            }
            options={[
              { label: 'JSX', value: 'jsx' },
              { label: 'TSX (TypeScript)', value: 'tsx' },
            ]}
          />
        </SettingsRow>

        <SettingsRow
          label="Minify Output"
          description="Remove whitespace and optimize code size"
        >
          <ToggleSwitch
            enabled={settings.minifyOutput}
            onChange={(enabled) => onChange({ ...settings, minifyOutput: enabled })}
          />
        </SettingsRow>

        <SettingsRow
          label="Include Comments"
          description="Add helpful comments to generated code"
        >
          <ToggleSwitch
            enabled={settings.includeComments}
            onChange={(enabled) =>
              onChange({ ...settings, includeComments: enabled })
            }
          />
        </SettingsRow>
      </SettingsSection>

      <div className="border-t border-gray-800" />

      <SettingsSection title="Project Export" description="Settings for project downloads">
        <SettingsRow
          label="Include Tailwind Config"
          description="Add tailwind.config.js to project export"
        >
          <ToggleSwitch
            enabled={settings.includeTailwindConfig}
            onChange={(enabled) =>
              onChange({ ...settings, includeTailwindConfig: enabled })
            }
          />
        </SettingsRow>

        <SettingsRow
          label="Component Prefix"
          description="Prefix for generated component names"
        >
          <TextInput
            value={settings.componentNamePrefix}
            onChange={(value) =>
              onChange({ ...settings, componentNamePrefix: value })
            }
            placeholder="e.g., App, UI"
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}

function ShortcutsTab() {
  const groupedShortcuts = useMemo(() => {
    const groups: Record<string, Shortcut[]> = {};
    for (const shortcut of SHORTCUTS) {
      if (!groups[shortcut.category]) {
        groups[shortcut.category] = [];
      }
      groups[shortcut.category].push(shortcut);
    }
    return groups;
  }, []);

  return (
    <div className="space-y-6">
      {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
        <SettingsSection key={category} title={category}>
          <div className="divide-y divide-gray-800">
            {shortcuts.map((shortcut) => (
              <ShortcutItem key={shortcut.id} shortcut={shortcut} />
            ))}
          </div>
        </SettingsSection>
      ))}

      <div className="pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          Keyboard shortcuts are read-only and cannot be customized
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    if (open) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
      setHasChanges(false);
    }
  }, [open]);

  const handleGeneralChange = useCallback((general: GeneralSettings) => {
    setSettings((prev) => ({ ...prev, general }));
    setHasChanges(true);
  }, []);

  const handleEditorChange = useCallback((editor: EditorSettings) => {
    setSettings((prev) => ({ ...prev, editor }));
    setHasChanges(true);
  }, []);

  const handleExportChange = useCallback((exportSettings: ExportSettings) => {
    setSettings((prev) => ({ ...prev, export: exportSettings }));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      toast.success('Settings saved');
      setHasChanges(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    }
  }, [settings, onOpenChange]);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset all settings to defaults? This cannot be undone.')) {
      setSettings(DEFAULT_SETTINGS);
      setHasChanges(true);
      toast.success('Settings reset to defaults');
    }
  }, []);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      if (window.confirm('Discard unsaved changes?')) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  }, [hasChanges, onOpenChange]);

  return (
    <Modal
      open={open}
      onOpenChange={handleCancel}
      title="Settings"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={handleReset}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md',
              'text-sm text-gray-400 hover:text-white hover:bg-gray-800',
              'transition-colors duration-150'
            )}
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>

          <div className="flex items-center gap-2">
            <ModalButton variant="ghost" onClick={handleCancel}>
              Cancel
            </ModalButton>
            <ModalButton variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1.5" />
              Save Changes
            </ModalButton>
          </div>
        </div>
      }
    >
      <div className="flex gap-6 min-h-[400px]">
        {/* Tab Navigation */}
        <nav className="w-40 flex-shrink-0 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-md',
                  'text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-2">
          {activeTab === 'general' && (
            <GeneralTab settings={settings.general} onChange={handleGeneralChange} />
          )}
          {activeTab === 'editor' && (
            <EditorTab settings={settings.editor} onChange={handleEditorChange} />
          )}
          {activeTab === 'export' && (
            <ExportTab settings={settings.export} onChange={handleExportChange} />
          )}
          {activeTab === 'shortcuts' && <ShortcutsTab />}
        </div>
      </div>
    </Modal>
  );
}

export default SettingsModal;
