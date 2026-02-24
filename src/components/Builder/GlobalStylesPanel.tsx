'use client';

import { useState, useMemo, useCallback } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Accordion from '@radix-ui/react-accordion';
import {
  Settings,
  Type,
  Link,
  Table,
  FormInput,
  Palette,
  Mouse,
  Printer,
  Code,
  Variable,
  ChevronDown,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  Check,
  Copy,
  Download,
  Upload,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { SelectInput } from './SelectInput';
import { TextInput, TextAreaInput } from './TextInput';
import { ColorPicker } from '@/components/common/ColorPicker';
import {
  CSS_RESET_OPTIONS,
  DEFAULT_GLOBAL_STYLES_CONFIG,
  GLOBAL_STYLES_PRESETS,
  generateCompleteGlobalStylesCSS,
  applyPreset,
  type GlobalStylesConfig,
  type CSSResetType,
  type GlobalStylesPreset,
} from '@/lib/globalStyles';
import {
  POPULAR_GOOGLE_FONTS,
  FONT_PAIRINGS,
  SYSTEM_FONT_STACKS,
  FONT_DISPLAY_STRATEGIES,
  searchFonts,
  getFontsByCategory,
  generateGoogleFontsHTML,
  type GoogleFont,
  type FontPairing,
  type FontCategory,
  type FontDisplay,
} from '@/lib/fontSystem';

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface AccordionSectionProps {
  value: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function AccordionSection({ value, title, icon, children }: AccordionSectionProps) {
  return (
    <Accordion.Item value={value} className="border-b border-gray-800">
      <Accordion.Trigger className="flex items-center justify-between w-full py-3 px-4 text-left hover:bg-gray-800/50 transition-colors group">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{icon}</span>
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
      </Accordion.Trigger>
      <Accordion.Content className="px-4 pb-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
        {children}
      </Accordion.Content>
    </Accordion.Item>
  );
}

interface PropertyRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function PropertyRow({ label, children, className }: PropertyRowProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-xs font-medium text-gray-400">{label}</label>
      {children}
    </div>
  );
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <PropertyRow label={label}>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-8 rounded border border-gray-700 bg-gray-800 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
        />
      </div>
    </PropertyRow>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface GlobalStylesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: GlobalStylesConfig;
  onConfigChange: (config: GlobalStylesConfig) => void;
}

export function GlobalStylesPanel({
  isOpen,
  onClose,
  config,
  onConfigChange,
}: GlobalStylesPanelProps) {
  const [activeTab, setActiveTab] = useState('reset');
  const [fontSearch, setFontSearch] = useState('');
  const [selectedFontCategory, setSelectedFontCategory] = useState<FontCategory | 'all'>('all');
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [newVarName, setNewVarName] = useState('');
  const [newVarValue, setNewVarValue] = useState('');

  // Generate complete CSS
  const generatedCSS = useMemo(() => {
    return generateCompleteGlobalStylesCSS(config);
  }, [config]);

  // Filter fonts
  const filteredFonts = useMemo(() => {
    if (selectedFontCategory === 'all') {
      return fontSearch ? searchFonts(fontSearch) : POPULAR_GOOGLE_FONTS.slice(0, 50);
    }
    return fontSearch
      ? searchFonts(fontSearch, selectedFontCategory)
      : getFontsByCategory(selectedFontCategory).slice(0, 50);
  }, [fontSearch, selectedFontCategory]);

  // Update config helper
  const updateConfig = useCallback(
    <K extends keyof GlobalStylesConfig>(key: K, value: GlobalStylesConfig[K]) => {
      onConfigChange({ ...config, [key]: value });
    },
    [config, onConfigChange]
  );

  // Copy CSS to clipboard
  const handleCopyCSS = useCallback(async () => {
    await navigator.clipboard.writeText(generatedCSS);
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 2000);
  }, [generatedCSS]);

  // Export CSS file
  const handleExportCSS = useCallback(() => {
    const blob = new Blob([generatedCSS], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'global-styles.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generatedCSS]);

  // Add CSS variable
  const handleAddVariable = useCallback(() => {
    if (!newVarName || !newVarValue) return;
    const varName = newVarName.startsWith('--') ? newVarName : `--${newVarName}`;
    updateConfig('cssVariables', {
      ...config.cssVariables,
      [varName]: newVarValue,
    });
    setNewVarName('');
    setNewVarValue('');
  }, [newVarName, newVarValue, config.cssVariables, updateConfig]);

  // Remove CSS variable
  const handleRemoveVariable = useCallback(
    (varName: string) => {
      const newVars = { ...config.cssVariables };
      delete newVars[varName];
      updateConfig('cssVariables', newVars);
    },
    [config.cssVariables, updateConfig]
  );

  // Apply preset
  const handleApplyPreset = useCallback(
    (preset: GlobalStylesPreset) => {
      const newConfig = applyPreset(config, preset);
      onConfigChange(newConfig);
    },
    [config, onConfigChange]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[900px] max-h-[85vh] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Global Styles</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCSS}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                copiedCSS
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              )}
            >
              {copiedCSS ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedCSS ? 'Copied!' : 'Copy CSS'}
            </button>
            <button
              onClick={handleExportCSS}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex-1 flex overflow-hidden">
          <Tabs.List className="w-48 flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-900/50">
            {[
              { id: 'reset', label: 'CSS Reset', icon: <Settings className="w-4 h-4" /> },
              { id: 'typography', label: 'Typography', icon: <Type className="w-4 h-4" /> },
              { id: 'links', label: 'Links', icon: <Link className="w-4 h-4" /> },
              { id: 'forms', label: 'Forms', icon: <FormInput className="w-4 h-4" /> },
              { id: 'tables', label: 'Tables', icon: <Table className="w-4 h-4" /> },
              { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
              { id: 'focus', label: 'Focus & Selection', icon: <Mouse className="w-4 h-4" /> },
              { id: 'print', label: 'Print Styles', icon: <Printer className="w-4 h-4" /> },
              { id: 'fonts', label: 'Google Fonts', icon: <Type className="w-4 h-4" /> },
              { id: 'variables', label: 'CSS Variables', icon: <Variable className="w-4 h-4" /> },
              { id: 'custom', label: 'Custom CSS', icon: <Code className="w-4 h-4" /> },
            ].map((tab) => (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors',
                  'data-[state=active]:bg-gray-800 data-[state=active]:text-white',
                  'data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-300 data-[state=inactive]:hover:bg-gray-800/50'
                )}
              >
                {tab.icon}
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <div className="flex-1 overflow-y-auto p-6">
            {/* CSS Reset Tab */}
            <Tabs.Content value="reset" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">CSS Reset</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Choose a CSS reset to normalize browser default styles.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {CSS_RESET_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => updateConfig('cssReset', option.id as CSSResetType)}
                      className={cn(
                        'flex items-start gap-3 p-4 rounded-lg border transition-colors text-left',
                        config.cssReset === option.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      )}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0',
                          config.cssReset === option.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-600'
                        )}
                      >
                        {config.cssReset === option.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{option.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{option.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Style Presets</h3>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(GLOBAL_STYLES_PRESETS) as GlobalStylesPreset[]).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleApplyPreset(preset)}
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-300 hover:border-blue-500 hover:text-white transition-colors capitalize"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </Tabs.Content>

            {/* Typography Tab */}
            <Tabs.Content value="typography" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">HTML Base</h3>
                <div className="grid grid-cols-2 gap-4">
                  <PropertyRow label="Base Font Size">
                    <input
                      type="text"
                      value={config.baseStyles.html.fontSize}
                      onChange={(e) =>
                        updateConfig('baseStyles', {
                          ...config.baseStyles,
                          html: { ...config.baseStyles.html, fontSize: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                  <PropertyRow label="Scroll Behavior">
                    <select
                      value={config.baseStyles.html.scrollBehavior}
                      onChange={(e) =>
                        updateConfig('baseStyles', {
                          ...config.baseStyles,
                          html: {
                            ...config.baseStyles.html,
                            scrollBehavior: e.target.value as 'auto' | 'smooth',
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    >
                      <option value="auto">Auto</option>
                      <option value="smooth">Smooth</option>
                    </select>
                  </PropertyRow>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Body Styles</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Background Color"
                    value={config.baseStyles.body.backgroundColor}
                    onChange={(value) =>
                      updateConfig('baseStyles', {
                        ...config.baseStyles,
                        body: { ...config.baseStyles.body, backgroundColor: value },
                      })
                    }
                  />
                  <ColorInput
                    label="Text Color"
                    value={config.baseStyles.body.color}
                    onChange={(value) =>
                      updateConfig('baseStyles', {
                        ...config.baseStyles,
                        body: { ...config.baseStyles.body, color: value },
                      })
                    }
                  />
                  <PropertyRow label="Font Family">
                    <input
                      type="text"
                      value={config.baseStyles.body.fontFamily}
                      onChange={(e) =>
                        updateConfig('baseStyles', {
                          ...config.baseStyles,
                          body: { ...config.baseStyles.body, fontFamily: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                  <PropertyRow label="Line Height">
                    <input
                      type="text"
                      value={config.baseStyles.body.lineHeight}
                      onChange={(e) =>
                        updateConfig('baseStyles', {
                          ...config.baseStyles,
                          body: { ...config.baseStyles.body, lineHeight: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                  <PropertyRow label="Antialiased">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.baseStyles.body.antialiased}
                        onChange={(e) =>
                          updateConfig('baseStyles', {
                            ...config.baseStyles,
                            body: { ...config.baseStyles.body, antialiased: e.target.checked },
                          })
                        }
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                      />
                      <span className="text-sm text-gray-300">Enable font smoothing</span>
                    </label>
                  </PropertyRow>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Headings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <PropertyRow label="Heading Font">
                    <input
                      type="text"
                      value={config.baseStyles.typography.headingFontFamily}
                      onChange={(e) =>
                        updateConfig('baseStyles', {
                          ...config.baseStyles,
                          typography: { ...config.baseStyles.typography, headingFontFamily: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                  <PropertyRow label="Heading Weight">
                    <input
                      type="text"
                      value={config.baseStyles.typography.headingFontWeight}
                      onChange={(e) =>
                        updateConfig('baseStyles', {
                          ...config.baseStyles,
                          typography: { ...config.baseStyles.typography, headingFontWeight: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                  <PropertyRow label="Heading Line Height">
                    <input
                      type="text"
                      value={config.baseStyles.typography.headingLineHeight}
                      onChange={(e) =>
                        updateConfig('baseStyles', {
                          ...config.baseStyles,
                          typography: { ...config.baseStyles.typography, headingLineHeight: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                </div>
              </div>
            </Tabs.Content>

            {/* Links Tab */}
            <Tabs.Content value="links" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">Link Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Default Color"
                    value={config.linkStyles.color}
                    onChange={(value) =>
                      updateConfig('linkStyles', { ...config.linkStyles, color: value })
                    }
                  />
                  <ColorInput
                    label="Hover Color"
                    value={config.linkStyles.hoverColor}
                    onChange={(value) =>
                      updateConfig('linkStyles', { ...config.linkStyles, hoverColor: value })
                    }
                  />
                  <ColorInput
                    label="Visited Color"
                    value={config.linkStyles.visitedColor}
                    onChange={(value) =>
                      updateConfig('linkStyles', { ...config.linkStyles, visitedColor: value })
                    }
                  />
                  <ColorInput
                    label="Active Color"
                    value={config.linkStyles.activeColor}
                    onChange={(value) =>
                      updateConfig('linkStyles', { ...config.linkStyles, activeColor: value })
                    }
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Text Decoration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <PropertyRow label="Default Decoration">
                    <select
                      value={config.linkStyles.textDecoration}
                      onChange={(e) =>
                        updateConfig('linkStyles', {
                          ...config.linkStyles,
                          textDecoration: e.target.value as 'none' | 'underline' | 'underline-offset',
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    >
                      <option value="none">None</option>
                      <option value="underline">Underline</option>
                      <option value="underline-offset">Underline with Offset</option>
                    </select>
                  </PropertyRow>
                  <PropertyRow label="Hover Decoration">
                    <select
                      value={config.linkStyles.hoverTextDecoration}
                      onChange={(e) =>
                        updateConfig('linkStyles', {
                          ...config.linkStyles,
                          hoverTextDecoration: e.target.value as 'none' | 'underline' | 'underline-offset',
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    >
                      <option value="none">None</option>
                      <option value="underline">Underline</option>
                      <option value="underline-offset">Underline with Offset</option>
                    </select>
                  </PropertyRow>
                </div>
              </div>

              <PropertyRow label="Focus Outline">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.linkStyles.focusOutline}
                    onChange={(e) =>
                      updateConfig('linkStyles', { ...config.linkStyles, focusOutline: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                  />
                  <span className="text-sm text-gray-300">Show focus outline on links</span>
                </label>
              </PropertyRow>
            </Tabs.Content>

            {/* Forms Tab */}
            <Tabs.Content value="forms" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">Input Styles</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Background"
                    value={config.formStyles.inputBackgroundColor}
                    onChange={(value) =>
                      updateConfig('formStyles', { ...config.formStyles, inputBackgroundColor: value })
                    }
                  />
                  <ColorInput
                    label="Border Color"
                    value={config.formStyles.inputBorderColor}
                    onChange={(value) =>
                      updateConfig('formStyles', { ...config.formStyles, inputBorderColor: value })
                    }
                  />
                  <PropertyRow label="Border Radius">
                    <input
                      type="text"
                      value={config.formStyles.inputBorderRadius}
                      onChange={(e) =>
                        updateConfig('formStyles', { ...config.formStyles, inputBorderRadius: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                  <PropertyRow label="Padding">
                    <input
                      type="text"
                      value={config.formStyles.inputPadding}
                      onChange={(e) =>
                        updateConfig('formStyles', { ...config.formStyles, inputPadding: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                  <ColorInput
                    label="Focus Border"
                    value={config.formStyles.inputFocusBorderColor}
                    onChange={(value) =>
                      updateConfig('formStyles', { ...config.formStyles, inputFocusBorderColor: value })
                    }
                  />
                  <ColorInput
                    label="Placeholder Color"
                    value={config.formStyles.inputPlaceholderColor}
                    onChange={(value) =>
                      updateConfig('formStyles', { ...config.formStyles, inputPlaceholderColor: value })
                    }
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Label Styles</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Label Color"
                    value={config.formStyles.labelColor}
                    onChange={(value) =>
                      updateConfig('formStyles', { ...config.formStyles, labelColor: value })
                    }
                  />
                  <PropertyRow label="Label Font Size">
                    <input
                      type="text"
                      value={config.formStyles.labelFontSize}
                      onChange={(e) =>
                        updateConfig('formStyles', { ...config.formStyles, labelFontSize: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                </div>
              </div>
            </Tabs.Content>

            {/* Tables Tab */}
            <Tabs.Content value="tables" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">Table Styles</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Border Color"
                    value={config.tableStyles.borderColor}
                    onChange={(value) =>
                      updateConfig('tableStyles', { ...config.tableStyles, borderColor: value })
                    }
                  />
                  <PropertyRow label="Cell Padding">
                    <input
                      type="text"
                      value={config.tableStyles.cellPadding}
                      onChange={(e) =>
                        updateConfig('tableStyles', { ...config.tableStyles, cellPadding: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                  <ColorInput
                    label="Header Background"
                    value={config.tableStyles.headerBackgroundColor}
                    onChange={(value) =>
                      updateConfig('tableStyles', { ...config.tableStyles, headerBackgroundColor: value })
                    }
                  />
                  <ColorInput
                    label="Header Color"
                    value={config.tableStyles.headerColor}
                    onChange={(value) =>
                      updateConfig('tableStyles', { ...config.tableStyles, headerColor: value })
                    }
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Row Options</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.tableStyles.stripedRows}
                      onChange={(e) =>
                        updateConfig('tableStyles', { ...config.tableStyles, stripedRows: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                    />
                    <span className="text-sm text-gray-300">Striped rows</span>
                  </label>
                  {config.tableStyles.stripedRows && (
                    <ColorInput
                      label="Stripe Color"
                      value={config.tableStyles.stripedColor}
                      onChange={(value) =>
                        updateConfig('tableStyles', { ...config.tableStyles, stripedColor: value })
                      }
                    />
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.tableStyles.hoverRows}
                      onChange={(e) =>
                        updateConfig('tableStyles', { ...config.tableStyles, hoverRows: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                    />
                    <span className="text-sm text-gray-300">Hover effect on rows</span>
                  </label>
                  {config.tableStyles.hoverRows && (
                    <ColorInput
                      label="Hover Color"
                      value={config.tableStyles.hoverColor}
                      onChange={(value) =>
                        updateConfig('tableStyles', { ...config.tableStyles, hoverColor: value })
                      }
                    />
                  )}
                </div>
              </div>
            </Tabs.Content>

            {/* Appearance Tab */}
            <Tabs.Content value="appearance" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">Scrollbar</h3>
                <label className="flex items-center gap-2 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={config.scrollbarStyles.enabled}
                    onChange={(e) =>
                      updateConfig('scrollbarStyles', { ...config.scrollbarStyles, enabled: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                  />
                  <span className="text-sm text-gray-300">Custom scrollbar styling</span>
                </label>
                {config.scrollbarStyles.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <PropertyRow label="Scrollbar Width">
                      <input
                        type="text"
                        value={config.scrollbarStyles.width}
                        onChange={(e) =>
                          updateConfig('scrollbarStyles', { ...config.scrollbarStyles, width: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                      />
                    </PropertyRow>
                    <ColorInput
                      label="Track Color"
                      value={config.scrollbarStyles.trackColor}
                      onChange={(value) =>
                        updateConfig('scrollbarStyles', { ...config.scrollbarStyles, trackColor: value })
                      }
                    />
                    <ColorInput
                      label="Thumb Color"
                      value={config.scrollbarStyles.thumbColor}
                      onChange={(value) =>
                        updateConfig('scrollbarStyles', { ...config.scrollbarStyles, thumbColor: value })
                      }
                    />
                    <ColorInput
                      label="Thumb Hover"
                      value={config.scrollbarStyles.thumbHoverColor}
                      onChange={(value) =>
                        updateConfig('scrollbarStyles', { ...config.scrollbarStyles, thumbHoverColor: value })
                      }
                    />
                  </div>
                )}
              </div>
            </Tabs.Content>

            {/* Focus & Selection Tab */}
            <Tabs.Content value="focus" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">Focus Ring</h3>
                <div className="grid grid-cols-2 gap-4">
                  <PropertyRow label="Outline Style">
                    <select
                      value={config.focusStyles.outlineStyle}
                      onChange={(e) =>
                        updateConfig('focusStyles', {
                          ...config.focusStyles,
                          outlineStyle: e.target.value as 'solid' | 'dashed' | 'dotted' | 'double',
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                    </select>
                  </PropertyRow>
                  <PropertyRow label="Outline Width">
                    <input
                      type="text"
                      value={config.focusStyles.outlineWidth}
                      onChange={(e) =>
                        updateConfig('focusStyles', { ...config.focusStyles, outlineWidth: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                  <ColorInput
                    label="Outline Color"
                    value={config.focusStyles.outlineColor}
                    onChange={(value) =>
                      updateConfig('focusStyles', { ...config.focusStyles, outlineColor: value })
                    }
                  />
                  <PropertyRow label="Outline Offset">
                    <input
                      type="text"
                      value={config.focusStyles.outlineOffset}
                      onChange={(e) =>
                        updateConfig('focusStyles', { ...config.focusStyles, outlineOffset: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                </div>
                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.focusStyles.focusVisibleOnly}
                      onChange={(e) =>
                        updateConfig('focusStyles', { ...config.focusStyles, focusVisibleOnly: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                    />
                    <span className="text-sm text-gray-300">Only show on keyboard focus (:focus-visible)</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Selection</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Selection Background"
                    value={config.selectionStyles.backgroundColor}
                    onChange={(value) =>
                      updateConfig('selectionStyles', { ...config.selectionStyles, backgroundColor: value })
                    }
                  />
                  <ColorInput
                    label="Selection Text"
                    value={config.selectionStyles.color}
                    onChange={(value) =>
                      updateConfig('selectionStyles', { ...config.selectionStyles, color: value })
                    }
                  />
                </div>
              </div>
            </Tabs.Content>

            {/* Print Tab */}
            <Tabs.Content value="print" className="space-y-6">
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={config.printStyles.enabled}
                  onChange={(e) =>
                    updateConfig('printStyles', { ...config.printStyles, enabled: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                />
                <span className="text-sm text-gray-300">Enable print styles</span>
              </label>

              {config.printStyles.enabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <PropertyRow label="Page Size">
                      <select
                        value={config.printStyles.pageSize}
                        onChange={(e) =>
                          updateConfig('printStyles', { ...config.printStyles, pageSize: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                      >
                        <option value="A4">A4</option>
                        <option value="A3">A3</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                      </select>
                    </PropertyRow>
                    <PropertyRow label="Page Margins">
                      <input
                        type="text"
                        value={config.printStyles.pageMargins}
                        onChange={(e) =>
                          updateConfig('printStyles', { ...config.printStyles, pageMargins: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                      />
                    </PropertyRow>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.printStyles.removeBackgrounds}
                        onChange={(e) =>
                          updateConfig('printStyles', { ...config.printStyles, removeBackgrounds: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                      />
                      <span className="text-sm text-gray-300">Remove backgrounds</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.printStyles.blackText}
                        onChange={(e) =>
                          updateConfig('printStyles', { ...config.printStyles, blackText: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                      />
                      <span className="text-sm text-gray-300">Force black text</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.printStyles.showLinks}
                        onChange={(e) =>
                          updateConfig('printStyles', { ...config.printStyles, showLinks: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                      />
                      <span className="text-sm text-gray-300">Show link URLs</span>
                    </label>
                  </div>

                  <PropertyRow label="Hide Selectors (comma-separated)">
                    <input
                      type="text"
                      value={config.printStyles.hideSelectors.join(', ')}
                      onChange={(e) =>
                        updateConfig('printStyles', {
                          ...config.printStyles,
                          hideSelectors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="nav, footer, .no-print"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </PropertyRow>
                </>
              )}
            </Tabs.Content>

            {/* Google Fonts Tab */}
            <Tabs.Content value="fonts" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">Google Fonts</h3>
                <div className="flex gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={fontSearch}
                      onChange={(e) => setFontSearch(e.target.value)}
                      placeholder="Search fonts..."
                      className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                    />
                  </div>
                  <select
                    value={selectedFontCategory}
                    onChange={(e) => setSelectedFontCategory(e.target.value as FontCategory | 'all')}
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="sans-serif">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="display">Display</option>
                    <option value="handwriting">Handwriting</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                  {filteredFonts.map((font) => (
                    <button
                      key={font.family}
                      onClick={() =>
                        updateConfig('baseStyles', {
                          ...config.baseStyles,
                          body: { ...config.baseStyles.body, fontFamily: `'${font.family}', ${font.category}` },
                        })
                      }
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border transition-colors text-left',
                        config.baseStyles.body.fontFamily.includes(font.family)
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      )}
                    >
                      <div>
                        <div className="text-sm font-medium text-white">{font.family}</div>
                        <div className="text-xs text-gray-400 capitalize">{font.category}</div>
                      </div>
                      {font.trending && (
                        <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">Trending</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Font Pairings</h3>
                <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pr-2">
                  {FONT_PAIRINGS.slice(0, 6).map((pairing) => (
                    <button
                      key={pairing.id}
                      onClick={() => {
                        updateConfig('baseStyles', {
                          ...config.baseStyles,
                          body: { ...config.baseStyles.body, fontFamily: `'${pairing.body}', sans-serif` },
                          typography: {
                            ...config.baseStyles.typography,
                            headingFontFamily: `'${pairing.heading}', sans-serif`,
                          },
                        });
                      }}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-700 bg-gray-800/50 hover:border-gray-600 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{pairing.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{pairing.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Heading: {pairing.heading} / Body: {pairing.body}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">System Font Stacks</h3>
                <div className="grid grid-cols-2 gap-2">
                  {SYSTEM_FONT_STACKS.slice(0, 6).map((stack) => (
                    <button
                      key={stack.id}
                      onClick={() =>
                        updateConfig('baseStyles', {
                          ...config.baseStyles,
                          body: { ...config.baseStyles.body, fontFamily: stack.stack },
                        })
                      }
                      className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 hover:border-gray-600 transition-colors text-left"
                    >
                      <div className="text-sm font-medium text-white">{stack.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{stack.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </Tabs.Content>

            {/* CSS Variables Tab */}
            <Tabs.Content value="variables" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">CSS Variables</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Define custom CSS variables that can be used throughout your styles.
                </p>

                {/* Add new variable */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newVarName}
                    onChange={(e) => setNewVarName(e.target.value)}
                    placeholder="--variable-name"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                  />
                  <input
                    type="text"
                    value={newVarValue}
                    onChange={(e) => setNewVarValue(e.target.value)}
                    placeholder="value"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                  />
                  <button
                    onClick={handleAddVariable}
                    disabled={!newVarName || !newVarValue}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Variable list */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {Object.entries(config.cssVariables).map(([name, value]) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-md"
                    >
                      <code className="flex-1 text-sm text-blue-400 font-mono">{name}</code>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          updateConfig('cssVariables', { ...config.cssVariables, [name]: e.target.value })
                        }
                        className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white font-mono"
                      />
                      <button
                        onClick={() => handleRemoveVariable(name)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>

            {/* Custom CSS Tab */}
            <Tabs.Content value="custom" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-4">Custom CSS</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Add any custom CSS that will be included at the end of your global styles.
                </p>
                <textarea
                  value={config.customCSS}
                  onChange={(e) => updateConfig('customCSS', e.target.value)}
                  placeholder="/* Add your custom CSS here */&#10;&#10;.my-custom-class {&#10;  /* styles */&#10;}"
                  className="w-full h-64 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white font-mono resize-none"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Generated CSS Preview</h3>
                <pre className="w-full h-64 p-3 bg-gray-950 border border-gray-700 rounded-md text-xs text-gray-300 font-mono overflow-auto">
                  {generatedCSS}
                </pre>
              </div>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}

export default GlobalStylesPanel;
