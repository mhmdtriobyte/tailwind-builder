'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Search,
  ChevronDown,
  Layout,
  Box,
  Palette,
  Type,
  Sparkles,
  Layers,
} from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Popover from '@radix-ui/react-popover';
import { useBuilderStore } from '@/store/builderStore';
import { cn } from '@/utils/cn';
import { copyToClipboard } from '@/utils/export';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES
// ============================================================================

interface ClassInfo {
  name: string;
  category: keyof typeof CATEGORY_ICONS;
  enabled: boolean;
}

interface BoxModelValues {
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  width: string;
  height: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CATEGORY_ICONS = {
  layout: Layout,
  spacing: Box,
  typography: Type,
  colors: Palette,
  borders: Layers,
  effects: Sparkles,
} as const;

const CATEGORY_LABELS: Record<keyof typeof CATEGORY_ICONS, string> = {
  layout: 'Layout',
  spacing: 'Spacing',
  typography: 'Typography',
  colors: 'Colors',
  borders: 'Borders & Radius',
  effects: 'Effects',
};

const COMMON_CLASSES = {
  layout: [
    'flex', 'inline-flex', 'block', 'inline-block', 'hidden', 'grid',
    'flex-row', 'flex-col', 'flex-wrap', 'flex-nowrap',
    'items-start', 'items-center', 'items-end', 'items-stretch',
    'justify-start', 'justify-center', 'justify-end', 'justify-between',
    'gap-2', 'gap-4', 'gap-6', 'gap-8',
    'w-full', 'w-auto', 'w-1/2', 'w-1/3', 'w-1/4',
    'h-full', 'h-auto', 'h-screen', 'min-h-screen',
    'relative', 'absolute', 'fixed', 'sticky',
  ],
  spacing: [
    'p-0', 'p-1', 'p-2', 'p-4', 'p-6', 'p-8', 'p-12',
    'px-2', 'px-4', 'px-6', 'px-8',
    'py-2', 'py-4', 'py-6', 'py-8',
    'm-0', 'm-1', 'm-2', 'm-4', 'm-6', 'm-8', 'm-auto',
    'mx-auto', 'mx-2', 'mx-4',
    'my-2', 'my-4', 'my-6', 'my-8',
  ],
  typography: [
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
    'font-normal', 'font-medium', 'font-semibold', 'font-bold',
    'text-left', 'text-center', 'text-right',
    'leading-tight', 'leading-normal', 'leading-relaxed',
    'tracking-tight', 'tracking-normal', 'tracking-wide',
    'italic', 'uppercase', 'lowercase', 'capitalize',
    'truncate', 'line-clamp-2', 'line-clamp-3',
  ],
  colors: [
    'text-white', 'text-black', 'text-gray-900', 'text-gray-700', 'text-gray-500',
    'text-blue-500', 'text-blue-600', 'text-red-500', 'text-green-500',
    'bg-white', 'bg-black', 'bg-gray-50', 'bg-gray-100', 'bg-gray-900',
    'bg-blue-500', 'bg-blue-600', 'bg-transparent',
  ],
  borders: [
    'border', 'border-0', 'border-2', 'border-4',
    'border-gray-200', 'border-gray-300', 'border-gray-700',
    'rounded', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-full', 'rounded-none',
  ],
  effects: [
    'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-none',
    'opacity-0', 'opacity-50', 'opacity-75', 'opacity-100',
    'transition', 'transition-all', 'transition-colors',
    'duration-150', 'duration-300', 'duration-500',
    'hover:scale-105', 'hover:opacity-80',
  ],
};

// ============================================================================
// COMPONENT
// ============================================================================

interface StyleInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StyleInspector({ isOpen, onClose }: StyleInspectorProps) {
  const { selectedId, getElementById, updateElementStyles } = useBuilderStore();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [disabledClasses, setDisabledClasses] = useState<Set<string>>(new Set());
  const [newClassInput, setNewClassInput] = useState('');
  const [showAddPopover, setShowAddPopover] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get selected element
  const selectedElement = selectedId ? getElementById(selectedId) : null;

  // Get all classes with metadata
  const classesWithInfo = useMemo((): ClassInfo[] => {
    if (!selectedElement) return [];

    const styles = selectedElement.styles;
    const result: ClassInfo[] = [];

    // Process each category
    (['layout', 'spacing', 'typography', 'colors', 'borders', 'effects'] as const).forEach(
      (category) => {
        styles[category].forEach((cls) => {
          result.push({
            name: cls,
            category,
            enabled: !disabledClasses.has(cls),
          });
        });
      }
    );

    return result;
  }, [selectedElement, disabledClasses]);

  // Filter classes by search
  const filteredClasses = useMemo(() => {
    if (!searchQuery.trim()) return classesWithInfo;
    const query = searchQuery.toLowerCase();
    return classesWithInfo.filter((c) => c.name.toLowerCase().includes(query));
  }, [classesWithInfo, searchQuery]);

  // Group classes by category
  const groupedClasses = useMemo(() => {
    const groups: Record<string, ClassInfo[]> = {};
    filteredClasses.forEach((cls) => {
      if (!groups[cls.category]) {
        groups[cls.category] = [];
      }
      groups[cls.category].push(cls);
    });
    return groups;
  }, [filteredClasses]);

  // Calculate box model values
  const boxModelValues = useMemo((): BoxModelValues => {
    if (!selectedElement) {
      return {
        marginTop: '-',
        marginRight: '-',
        marginBottom: '-',
        marginLeft: '-',
        paddingTop: '-',
        paddingRight: '-',
        paddingBottom: '-',
        paddingLeft: '-',
        width: 'auto',
        height: 'auto',
      };
    }

    const { spacing, layout } = selectedElement.styles;
    const values: BoxModelValues = {
      marginTop: '-',
      marginRight: '-',
      marginBottom: '-',
      marginLeft: '-',
      paddingTop: '-',
      paddingRight: '-',
      paddingBottom: '-',
      paddingLeft: '-',
      width: 'auto',
      height: 'auto',
    };

    // Parse spacing classes
    spacing.forEach((cls) => {
      // Margin
      if (cls.startsWith('m-')) values.marginTop = values.marginRight = values.marginBottom = values.marginLeft = cls.slice(2);
      if (cls.startsWith('mt-')) values.marginTop = cls.slice(3);
      if (cls.startsWith('mr-')) values.marginRight = cls.slice(3);
      if (cls.startsWith('mb-')) values.marginBottom = cls.slice(3);
      if (cls.startsWith('ml-')) values.marginLeft = cls.slice(3);
      if (cls.startsWith('mx-')) {
        const val = cls.slice(3);
        values.marginLeft = values.marginRight = val;
      }
      if (cls.startsWith('my-')) {
        const val = cls.slice(3);
        values.marginTop = values.marginBottom = val;
      }

      // Padding
      if (cls.startsWith('p-') && !cls.startsWith('px-') && !cls.startsWith('py-')) {
        const val = cls.slice(2);
        values.paddingTop = values.paddingRight = values.paddingBottom = values.paddingLeft = val;
      }
      if (cls.startsWith('pt-')) values.paddingTop = cls.slice(3);
      if (cls.startsWith('pr-')) values.paddingRight = cls.slice(3);
      if (cls.startsWith('pb-')) values.paddingBottom = cls.slice(3);
      if (cls.startsWith('pl-')) values.paddingLeft = cls.slice(3);
      if (cls.startsWith('px-')) {
        const val = cls.slice(3);
        values.paddingLeft = values.paddingRight = val;
      }
      if (cls.startsWith('py-')) {
        const val = cls.slice(3);
        values.paddingTop = values.paddingBottom = val;
      }
    });

    // Parse layout classes for width/height
    layout.forEach((cls) => {
      if (cls.startsWith('w-')) values.width = cls.slice(2);
      if (cls.startsWith('h-')) values.height = cls.slice(2);
    });

    return values;
  }, [selectedElement]);

  // Toggle class enabled state
  const handleToggleClass = useCallback(
    (className: string) => {
      setDisabledClasses((prev) => {
        const next = new Set(prev);
        if (next.has(className)) {
          next.delete(className);
        } else {
          next.add(className);
        }
        return next;
      });
    },
    []
  );

  // Remove class from element
  const handleRemoveClass = useCallback(
    (className: string, category: keyof typeof CATEGORY_ICONS) => {
      if (!selectedElement || !selectedId) return;

      const currentClasses = selectedElement.styles[category];
      const newClasses = currentClasses.filter((c) => c !== className);
      updateElementStyles(selectedId, category, newClasses);

      toast.success(`Removed ${className}`);
    },
    [selectedElement, selectedId, updateElementStyles]
  );

  // Add new class
  const handleAddClass = useCallback(
    (className: string, category: keyof typeof CATEGORY_ICONS) => {
      if (!selectedElement || !selectedId) return;

      const currentClasses = selectedElement.styles[category];
      if (currentClasses.includes(className)) {
        toast.error('Class already exists');
        return;
      }

      const newClasses = [...currentClasses, className];
      updateElementStyles(selectedId, category, newClasses);

      setNewClassInput('');
      setShowAddPopover(false);
      toast.success(`Added ${className}`);
    },
    [selectedElement, selectedId, updateElementStyles]
  );

  // Copy all classes
  const handleCopyAll = useCallback(async () => {
    const allClasses = classesWithInfo
      .filter((c) => c.enabled)
      .map((c) => c.name)
      .join(' ');

    try {
      await copyToClipboard(allClasses);
      setCopied(true);
      toast.success('Classes copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy classes');
    }
  }, [classesWithInfo]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-14 bottom-0 w-[400px] bg-gray-900 border-l border-gray-800 flex flex-col z-50 shadow-2xl"
        role="dialog"
        aria-label="Style Inspector"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-white">Style Inspector</h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyAll}
              className={cn(
                'p-2 rounded transition-colors',
                copied
                  ? 'text-green-500 bg-green-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
              title="Copy all classes"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {selectedElement ? (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            {/* Element info */}
            <div className="px-4 py-3 border-b border-gray-800 shrink-0">
              <h3 className="text-sm font-medium text-white">{selectedElement.name}</h3>
              <p className="text-xs text-gray-500">{selectedElement.type}</p>
            </div>

            {/* Box model visualization */}
            <div className="px-4 py-4 border-b border-gray-800 shrink-0">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Box Model
              </h4>
              <div className="relative">
                {/* Margin box */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-2">
                  <div className="text-[10px] text-orange-400 text-center mb-1">margin</div>
                  <div className="flex items-center justify-center">
                    <span className="text-[10px] text-orange-300">{boxModelValues.marginLeft}</span>
                    <div className="mx-2 flex-1">
                      <div className="text-[10px] text-orange-300 text-center mb-1">
                        {boxModelValues.marginTop}
                      </div>

                      {/* Padding box */}
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                        <div className="text-[10px] text-green-400 text-center mb-1">padding</div>
                        <div className="flex items-center justify-center">
                          <span className="text-[10px] text-green-300">
                            {boxModelValues.paddingLeft}
                          </span>
                          <div className="mx-2 flex-1">
                            <div className="text-[10px] text-green-300 text-center mb-1">
                              {boxModelValues.paddingTop}
                            </div>

                            {/* Content box */}
                            <div className="bg-blue-500/20 border border-blue-500/50 rounded py-3 px-6 text-center">
                              <span className="text-xs text-blue-300">
                                {boxModelValues.width} x {boxModelValues.height}
                              </span>
                            </div>

                            <div className="text-[10px] text-green-300 text-center mt-1">
                              {boxModelValues.paddingBottom}
                            </div>
                          </div>
                          <span className="text-[10px] text-green-300">
                            {boxModelValues.paddingRight}
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-orange-300 text-center mt-1">
                        {boxModelValues.marginBottom}
                      </div>
                    </div>
                    <span className="text-[10px] text-orange-300">{boxModelValues.marginRight}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-gray-800 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search classes..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Classes by category */}
            <div className="flex-1 overflow-y-auto">
              <Accordion.Root type="multiple" defaultValue={Object.keys(groupedClasses)}>
                {Object.entries(groupedClasses).map(([category, classes]) => {
                  const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
                  return (
                    <Accordion.Item key={category} value={category}>
                      <Accordion.Header>
                        <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors group">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-white">
                              {CATEGORY_LABELS[category as keyof typeof CATEGORY_ICONS]}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({classes.length})
                            </span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-data-[state=open]:rotate-180" />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className="border-b border-gray-800">
                        <div className="px-4 py-3 space-y-2">
                          {classes.map((cls) => (
                            <div
                              key={cls.name}
                              className={cn(
                                'flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                                cls.enabled ? 'bg-gray-800' : 'bg-gray-800/50'
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleToggleClass(cls.name)}
                                  className={cn(
                                    'p-1 rounded transition-colors',
                                    cls.enabled
                                      ? 'text-blue-400 hover:text-blue-300'
                                      : 'text-gray-600 hover:text-gray-500'
                                  )}
                                  title={cls.enabled ? 'Disable class' : 'Enable class'}
                                >
                                  {cls.enabled ? (
                                    <Eye className="w-4 h-4" />
                                  ) : (
                                    <EyeOff className="w-4 h-4" />
                                  )}
                                </button>
                                <span
                                  className={cn(
                                    'text-sm font-mono',
                                    cls.enabled ? 'text-gray-200' : 'text-gray-500 line-through'
                                  )}
                                >
                                  {cls.name}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveClass(cls.name, cls.category)
                                }
                                className="p-1 text-gray-600 hover:text-red-400 rounded transition-colors"
                                title="Remove class"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  );
                })}
              </Accordion.Root>
            </div>

            {/* Add class */}
            <div className="px-4 py-3 border-t border-gray-800 shrink-0">
              <Popover.Root open={showAddPopover} onOpenChange={setShowAddPopover}>
                <Popover.Trigger asChild>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Class
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-4 z-[60]"
                    sideOffset={8}
                    align="center"
                  >
                    <div className="mb-3">
                      <input
                        type="text"
                        value={newClassInput}
                        onChange={(e) => setNewClassInput(e.target.value)}
                        placeholder="Enter class name..."
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        autoFocus
                      />
                    </div>

                    {newClassInput.trim() && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-2">Add to category:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(CATEGORY_LABELS).map((cat) => (
                            <button
                              key={cat}
                              onClick={() =>
                                handleAddClass(
                                  newClassInput.trim(),
                                  cat as keyof typeof CATEGORY_ICONS
                                )
                              }
                              className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                            >
                              {CATEGORY_LABELS[cat as keyof typeof CATEGORY_ICONS]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-gray-500 mb-2">Quick add:</p>
                      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                        {COMMON_CLASSES.layout.slice(0, 12).map((cls) => (
                          <button
                            key={cls}
                            onClick={() => handleAddClass(cls, 'layout')}
                            className="px-2 py-1 text-[11px] font-mono bg-gray-700/50 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Popover.Arrow className="fill-gray-700" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Layers className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">Select an element to inspect styles</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================================
// STYLE INSPECTOR TOGGLE BUTTON
// ============================================================================

export function StyleInspectorButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
      >
        <Layers className="w-4 h-4" />
        Inspect
      </button>
      <StyleInspector isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
