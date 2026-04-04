'use client';

import { useState } from 'react';
import { Sun, Moon, Check, Plus, Trash2, Copy } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCustomizationStore } from '@/store/customizationStore';

// ============================================================================
// CONSTANTS
// ============================================================================

const PRESET_THEMES = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard Tailwind colors',
    colors: { primary: '#3B82F6', secondary: '#6366F1', accent: '#8B5CF6' },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green tones',
    colors: { primary: '#059669', secondary: '#10B981', accent: '#34D399' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange and red',
    colors: { primary: '#F59E0B', secondary: '#EF4444', accent: '#F97316' },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blue tones',
    colors: { primary: '#0EA5E9', secondary: '#06B6D4', accent: '#22D3EE' },
  },
  {
    id: 'grape',
    name: 'Grape',
    description: 'Rich purple palette',
    colors: { primary: '#8B5CF6', secondary: '#A855F7', accent: '#C084FC' },
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Elegant pink tones',
    colors: { primary: '#F43F5E', secondary: '#EC4899', accent: '#F472B6' },
  },
];

const COLOR_CATEGORIES = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'success', label: 'Success' },
  { key: 'warning', label: 'Warning' },
  { key: 'error', label: 'Error' },
] as const;

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface ThemePresetCardProps {
  preset: typeof PRESET_THEMES[0];
  isActive: boolean;
  onSelect: () => void;
}

function ThemePresetCard({ preset, isActive, onSelect }: ThemePresetCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative flex flex-col gap-2 p-3 rounded-lg border transition-all duration-200',
        isActive
          ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/50'
          : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
      )}
    >
      {/* Color preview */}
      <div className="flex gap-1">
        {Object.values(preset.colors).map((color, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-md shadow-inner"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Info */}
      <div className="text-left">
        <p className="text-sm font-medium text-white">{preset.name}</p>
        <p className="text-xs text-gray-500">{preset.description}</p>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </button>
  );
}

interface ColorPickerRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPickerRow({ label, value, onChange }: ColorPickerRowProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-md border border-gray-600 cursor-pointer"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-20 px-2 py-1 text-xs font-mono',
            'bg-gray-800 border border-gray-700 rounded',
            'text-gray-300 focus:outline-none focus:border-blue-500'
          )}
        />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ThemePanel() {
  const {
    currentTheme,
    setTheme,
    isDarkMode,
    setDarkMode,
    themePresets,
    addThemePreset,
    removeThemePreset,
  } = useCustomizationStore();

  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [customColors, setCustomColors] = useState({
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#8B5CF6',
    neutral: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  });

  const handlePresetSelect = (preset: typeof PRESET_THEMES[0]) => {
    setTheme({
      ...currentTheme,
      id: preset.id,
      name: preset.name,
      description: preset.description,
      palette: {
        ...currentTheme.palette,
        primary: [{ name: 'Primary', value: preset.colors.primary }],
        secondary: [{ name: 'Secondary', value: preset.colors.secondary }],
        accent: [{ name: 'Accent', value: preset.colors.accent }],
      },
    });
  };

  const handleSaveCustomTheme = () => {
    const newPreset = {
      id: `custom_${Date.now()}`,
      name: 'Custom Theme',
      preview: '',
      config: {
        ...currentTheme,
        palette: {
          ...currentTheme.palette,
          primary: [{ name: 'Primary', value: customColors.primary }],
          secondary: [{ name: 'Secondary', value: customColors.secondary }],
          accent: [{ name: 'Accent', value: customColors.accent }],
          neutral: [{ name: 'Neutral', value: customColors.neutral }],
          success: [{ name: 'Success', value: customColors.success }],
          warning: [{ name: 'Warning', value: customColors.warning }],
          error: [{ name: 'Error', value: customColors.error }],
          info: currentTheme.palette.info,
        },
      },
    };
    addThemePreset(newPreset);
  };

  return (
    <div className="space-y-4">
      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          {isDarkMode ? (
            <Moon className="w-4 h-4 text-blue-400" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-400" />
          )}
          <span className="text-sm text-gray-300">
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>
        <button
          onClick={() => setDarkMode(!isDarkMode)}
          className={cn(
            'relative w-11 h-6 rounded-full transition-colors duration-200',
            isDarkMode ? 'bg-blue-600' : 'bg-gray-600'
          )}
        >
          <span
            className={cn(
              'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200',
              isDarkMode ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-gray-800/50 rounded-lg">
        <button
          onClick={() => setActiveTab('presets')}
          className={cn(
            'flex-1 py-1.5 px-3 text-sm rounded-md transition-colors',
            activeTab === 'presets'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white'
          )}
        >
          Presets
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={cn(
            'flex-1 py-1.5 px-3 text-sm rounded-md transition-colors',
            activeTab === 'custom'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white'
          )}
        >
          Custom
        </button>
      </div>

      {/* Content */}
      {activeTab === 'presets' ? (
        <div className="space-y-4">
          {/* Built-in Presets */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Built-in Themes
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_THEMES.map((preset) => (
                <ThemePresetCard
                  key={preset.id}
                  preset={preset}
                  isActive={currentTheme.id === preset.id}
                  onSelect={() => handlePresetSelect(preset)}
                />
              ))}
            </div>
          </div>

          {/* Custom Presets */}
          {themePresets.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Custom Themes
              </h4>
              <div className="space-y-2">
                {themePresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {preset.config.palette.primary.map((c, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: c.value }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-300">{preset.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setTheme(preset.config)}
                        className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-700"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeThemePreset(preset.id)}
                        className="p-1 text-gray-400 hover:text-red-400 rounded hover:bg-gray-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Custom Color Pickers */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Color Palette
            </h4>
            <div className="space-y-3">
              {COLOR_CATEGORIES.map(({ key, label }) => (
                <ColorPickerRow
                  key={key}
                  label={label}
                  value={customColors[key as keyof typeof customColors]}
                  onChange={(value) =>
                    setCustomColors((prev) => ({ ...prev, [key]: value }))
                  }
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSaveCustomTheme}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg',
                'bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium',
                'transition-colors duration-200'
              )}
            >
              <Plus className="w-4 h-4" />
              Save Theme
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(customColors, null, 2));
              }}
              className={cn(
                'p-2 rounded-lg border border-gray-700',
                'text-gray-400 hover:text-white hover:bg-gray-800',
                'transition-colors duration-200'
              )}
              title="Copy colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemePanel;
