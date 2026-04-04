'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Copy,
  ClipboardPaste,
  Bookmark,
  Trash2,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Star,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';
import type { ElementStyles } from '@/types/builder';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES
// ============================================================================

type StyleCategory = keyof Omit<ElementStyles, 'responsive'>;

interface CopiedStyle {
  id: string;
  name: string;
  timestamp: number;
  categories: StyleCategory[];
  styles: Partial<ElementStyles>;
}

interface StylePreset {
  id: string;
  name: string;
  categories: StyleCategory[];
  styles: Partial<ElementStyles>;
  createdAt: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STYLE_CATEGORIES: { key: StyleCategory; label: string; description: string }[] = [
  { key: 'layout', label: 'Layout', description: 'Display, flex, grid, position' },
  { key: 'spacing', label: 'Spacing', description: 'Padding, margin, gap' },
  { key: 'typography', label: 'Typography', description: 'Font, text, line-height' },
  { key: 'colors', label: 'Colors', description: 'Background, text color' },
  { key: 'borders', label: 'Borders', description: 'Border, radius, outline' },
  { key: 'effects', label: 'Effects', description: 'Shadow, opacity, blur' },
];

const MAX_RECENT_STYLES = 5;
const STORAGE_KEY_PRESETS = 'tailwind-builder-style-presets';
const STORAGE_KEY_RECENT = 'tailwind-builder-recent-styles';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return `style_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

function extractStylesFromElement(
  styles: ElementStyles,
  categories: StyleCategory[]
): Partial<ElementStyles> {
  const extracted: Partial<ElementStyles> = {};

  for (const category of categories) {
    if (styles[category] && styles[category].length > 0) {
      extracted[category] = [...styles[category]];
    }
  }

  return extracted;
}

function countTotalClasses(styles: Partial<ElementStyles>): number {
  return Object.values(styles).reduce((sum, classes) => {
    return sum + (Array.isArray(classes) ? classes.length : 0);
  }, 0);
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface CategoryCheckboxProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  classCount?: number;
}

function CategoryCheckbox({
  label,
  description,
  checked,
  onChange,
  classCount,
}: CategoryCheckboxProps) {
  return (
    <label
      className={cn(
        'flex items-start gap-3 p-2 rounded-md cursor-pointer',
        'hover:bg-gray-800/50 transition-colors duration-150',
        checked && 'bg-gray-800/80'
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            'w-4 h-4 rounded border-2 transition-colors duration-150',
            'flex items-center justify-center',
            checked
              ? 'bg-blue-600 border-blue-600'
              : 'bg-transparent border-gray-600 hover:border-gray-500'
          )}
        >
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{label}</span>
          {classCount !== undefined && classCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
              {classCount}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">{description}</span>
      </div>
    </label>
  );
}

interface RecentStyleItemProps {
  style: CopiedStyle;
  onApply: () => void;
  onSaveAsPreset: () => void;
}

function RecentStyleItem({ style, onApply, onSaveAsPreset }: RecentStyleItemProps) {
  const classCount = countTotalClasses(style.styles);

  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-2 rounded-md',
        'bg-gray-800/50 hover:bg-gray-800 transition-colors duration-150'
      )}
    >
      <div className="flex-shrink-0">
        <Clock className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300 truncate">
            {style.name}
          </span>
          <span className="text-xs text-gray-600">
            {classCount} {classCount === 1 ? 'class' : 'classes'}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {formatTimestamp(style.timestamp)}
        </span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onSaveAsPreset}
          className={cn(
            'p-1.5 rounded-md text-gray-400',
            'hover:text-yellow-400 hover:bg-gray-700',
            'transition-colors duration-150'
          )}
          title="Save as preset"
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onApply}
          className={cn(
            'p-1.5 rounded-md text-gray-400',
            'hover:text-blue-400 hover:bg-gray-700',
            'transition-colors duration-150'
          )}
          title="Apply styles"
        >
          <ClipboardPaste className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

interface PresetItemProps {
  preset: StylePreset;
  onApply: () => void;
  onDelete: () => void;
}

function PresetItem({ preset, onApply, onDelete }: PresetItemProps) {
  const classCount = countTotalClasses(preset.styles);

  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-2 rounded-md',
        'bg-gray-800/50 hover:bg-gray-800 transition-colors duration-150'
      )}
    >
      <div className="flex-shrink-0">
        <Star className="w-4 h-4 text-yellow-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300 truncate">
            {preset.name}
          </span>
          <span className="text-xs text-gray-600">
            {classCount} {classCount === 1 ? 'class' : 'classes'}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {preset.categories.map((cat) => (
            <span
              key={cat}
              className="px-1.5 py-0.5 text-[10px] bg-gray-700 text-gray-400 rounded"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onDelete}
          className={cn(
            'p-1.5 rounded-md text-gray-400',
            'hover:text-red-400 hover:bg-gray-700',
            'transition-colors duration-150'
          )}
          title="Delete preset"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onApply}
          className={cn(
            'p-1.5 rounded-md text-gray-400',
            'hover:text-blue-400 hover:bg-gray-700',
            'transition-colors duration-150'
          )}
          title="Apply preset"
        >
          <ClipboardPaste className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  count,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-800 first:border-t-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3',
          'text-sm font-medium text-gray-300',
          'hover:bg-gray-800/50 transition-colors duration-150'
        )}
      >
        <span className="flex items-center gap-2">
          {title}
          {count !== undefined && count > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-gray-700 text-gray-400 rounded">
              {count}
            </span>
          )}
        </span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function StyleClipboard() {
  const { selectedId, getElementById, updateElement } = useBuilderStore();

  // State
  const [selectedCategories, setSelectedCategories] = useState<Set<StyleCategory>>(
    new Set(['layout', 'spacing', 'typography', 'colors', 'borders', 'effects'] as StyleCategory[])
  );
  const [recentStyles, setRecentStyles] = useState<CopiedStyle[]>([]);
  const [presets, setPresets] = useState<StylePreset[]>([]);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [pendingPresetStyle, setPendingPresetStyle] = useState<CopiedStyle | null>(null);

  const selectedElement = selectedId ? getElementById(selectedId) : null;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedPresets = localStorage.getItem(STORAGE_KEY_PRESETS);
      if (storedPresets) {
        setPresets(JSON.parse(storedPresets));
      }

      const storedRecent = localStorage.getItem(STORAGE_KEY_RECENT);
      if (storedRecent) {
        setRecentStyles(JSON.parse(storedRecent));
      }
    } catch (error) {
      console.error('Failed to load style clipboard data:', error);
    }
  }, []);

  // Save presets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
    } catch (error) {
      console.error('Failed to save presets:', error);
    }
  }, [presets]);

  // Save recent styles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(recentStyles));
    } catch (error) {
      console.error('Failed to save recent styles:', error);
    }
  }, [recentStyles]);

  // Handlers
  const handleToggleCategory = useCallback((category: StyleCategory, checked: boolean) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(category);
      } else {
        next.delete(category);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedCategories(
      new Set(['layout', 'spacing', 'typography', 'colors', 'borders', 'effects'] as StyleCategory[])
    );
  }, []);

  const handleSelectNone = useCallback(() => {
    setSelectedCategories(new Set());
  }, []);

  const handleCopyStyles = useCallback(() => {
    if (!selectedElement) {
      toast.error('No element selected');
      return;
    }

    if (selectedCategories.size === 0) {
      toast.error('No categories selected');
      return;
    }

    const categories = Array.from(selectedCategories);
    const extractedStyles = extractStylesFromElement(selectedElement.styles, categories);

    if (countTotalClasses(extractedStyles) === 0) {
      toast.error('Selected element has no styles in chosen categories');
      return;
    }

    const copiedStyle: CopiedStyle = {
      id: generateId(),
      name: selectedElement.name || selectedElement.type,
      timestamp: Date.now(),
      categories,
      styles: extractedStyles,
    };

    setRecentStyles((prev) => {
      const newRecent = [copiedStyle, ...prev.slice(0, MAX_RECENT_STYLES - 1)];
      return newRecent;
    });

    toast.success(`Copied ${countTotalClasses(extractedStyles)} classes`);
  }, [selectedElement, selectedCategories]);

  const handlePasteStyles = useCallback((stylesToApply: Partial<ElementStyles>) => {
    if (!selectedElement || !selectedId) {
      toast.error('No element selected');
      return;
    }

    const newStyles: ElementStyles = { ...selectedElement.styles };

    for (const [category, classes] of Object.entries(stylesToApply)) {
      if (Array.isArray(classes) && classes.length > 0) {
        newStyles[category as StyleCategory] = classes;
      }
    }

    updateElement(selectedId, { styles: newStyles });
    toast.success(`Applied ${countTotalClasses(stylesToApply)} classes`);
  }, [selectedElement, selectedId, updateElement]);

  const handlePasteFromRecent = useCallback(() => {
    if (recentStyles.length === 0) {
      toast.error('No copied styles available');
      return;
    }

    handlePasteStyles(recentStyles[0].styles);
  }, [recentStyles, handlePasteStyles]);

  const handleSaveAsPreset = useCallback((style: CopiedStyle) => {
    setPendingPresetStyle(style);
    setPresetNameInput(style.name);
    setShowPresetInput(true);
  }, []);

  const handleConfirmSavePreset = useCallback(() => {
    if (!pendingPresetStyle) return;

    const name = presetNameInput.trim() || pendingPresetStyle.name;

    const newPreset: StylePreset = {
      id: generateId(),
      name,
      categories: pendingPresetStyle.categories,
      styles: pendingPresetStyle.styles,
      createdAt: Date.now(),
    };

    setPresets((prev) => [...prev, newPreset]);
    setShowPresetInput(false);
    setPendingPresetStyle(null);
    setPresetNameInput('');
    toast.success(`Saved preset "${name}"`);
  }, [pendingPresetStyle, presetNameInput]);

  const handleDeletePreset = useCallback((presetId: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== presetId));
    toast.success('Preset deleted');
  }, []);

  // Get class counts for selected element
  const getCategoryClassCount = useCallback((category: StyleCategory): number => {
    if (!selectedElement) return 0;
    const classes = selectedElement.styles[category];
    return Array.isArray(classes) ? classes.length : 0;
  }, [selectedElement]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-white">Style Clipboard</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Copy and paste styles between elements
        </p>
      </div>

      {/* Categories Selection */}
      <CollapsibleSection title="Categories" defaultOpen>
        <div className="space-y-1">
          <div className="flex items-center justify-end gap-2 mb-2">
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              All
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={handleSelectNone}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              None
            </button>
          </div>
          {STYLE_CATEGORIES.map(({ key, label, description }) => (
            <CategoryCheckbox
              key={key}
              label={label}
              description={description}
              checked={selectedCategories.has(key)}
              onChange={(checked) => handleToggleCategory(key, checked)}
              classCount={getCategoryClassCount(key)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Copy/Paste Actions */}
      <div className="px-4 py-3 border-t border-gray-800">
        <div className="flex gap-2">
          <button
            onClick={handleCopyStyles}
            disabled={!selectedElement || selectedCategories.size === 0}
            className={cn(
              'flex-1 flex items-center justify-center gap-2',
              'px-3 py-2 rounded-md text-sm font-medium',
              'bg-gray-800 text-gray-200',
              'hover:bg-gray-700 transition-colors duration-150',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
          >
            <Copy className="w-4 h-4" />
            Copy Styles
          </button>
          <button
            onClick={handlePasteFromRecent}
            disabled={!selectedElement || recentStyles.length === 0}
            className={cn(
              'flex-1 flex items-center justify-center gap-2',
              'px-3 py-2 rounded-md text-sm font-medium',
              'bg-blue-600 text-white',
              'hover:bg-blue-700 transition-colors duration-150',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
          >
            <ClipboardPaste className="w-4 h-4" />
            Paste Styles
          </button>
        </div>
      </div>

      {/* Recent Styles */}
      <CollapsibleSection title="Recent" count={recentStyles.length} defaultOpen>
        {recentStyles.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">
            No recently copied styles
          </p>
        ) : (
          <div className="space-y-1">
            {recentStyles.map((style) => (
              <RecentStyleItem
                key={style.id}
                style={style}
                onApply={() => handlePasteStyles(style.styles)}
                onSaveAsPreset={() => handleSaveAsPreset(style)}
              />
            ))}
          </div>
        )}
      </CollapsibleSection>

      {/* Saved Presets */}
      <CollapsibleSection title="Saved Presets" count={presets.length} defaultOpen={false}>
        {showPresetInput && (
          <div className="mb-3 p-2 bg-gray-800 rounded-md">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Preset Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={presetNameInput}
                onChange={(e) => setPresetNameInput(e.target.value)}
                placeholder="Enter preset name"
                className={cn(
                  'flex-1 px-2 py-1.5 text-sm',
                  'bg-gray-900 border border-gray-700 rounded',
                  'text-white placeholder-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmSavePreset();
                  if (e.key === 'Escape') {
                    setShowPresetInput(false);
                    setPendingPresetStyle(null);
                  }
                }}
              />
              <button
                onClick={handleConfirmSavePreset}
                className={cn(
                  'px-3 py-1.5 rounded text-sm font-medium',
                  'bg-blue-600 text-white hover:bg-blue-700',
                  'transition-colors duration-150'
                )}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {presets.length === 0 && !showPresetInput ? (
          <p className="text-xs text-gray-500 text-center py-4">
            No saved presets yet
          </p>
        ) : (
          <div className="space-y-1">
            {presets.map((preset) => (
              <PresetItem
                key={preset.id}
                preset={preset}
                onApply={() => handlePasteStyles(preset.styles)}
                onDelete={() => handleDeletePreset(preset.id)}
              />
            ))}
          </div>
        )}
      </CollapsibleSection>

      {/* No Element Selected Message */}
      {!selectedElement && (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-500 text-center">
            Select an element to copy or paste styles
          </p>
        </div>
      )}
    </div>
  );
}

export default StyleClipboard;
