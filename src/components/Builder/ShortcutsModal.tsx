'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  X,
  Search,
  RotateCcw,
  AlertTriangle,
  Download,
  Upload,
  Printer,
  Check,
  Edit3,
  Navigation,
  Eye,
  Layers,
  File,
  Settings,
  ChevronRight,
  Keyboard,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Modal, ModalButton } from '@/components/common/Modal';
import {
  getShortcutManager,
  formatKeyCombo,
  eventToKeyCombo,
  type ShortcutDefinition,
  type ShortcutCategory,
  type KeyCombo,
  type ShortcutConflict,
  CATEGORY_INFO,
} from '@/lib/keyboardShortcuts';

// ============================================================================
// TYPES
// ============================================================================

interface ShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============================================================================
// CATEGORY ICONS
// ============================================================================

const categoryIcons: Record<ShortcutCategory, React.ElementType> = {
  editing: Edit3,
  navigation: Navigation,
  view: Eye,
  elements: Layers,
  history: RotateCcw,
  file: File,
  tools: Settings,
};

// ============================================================================
// SHORTCUT KEY CAPTURE COMPONENT
// ============================================================================

interface ShortcutKeyCaptureProps {
  onCapture: (combo: KeyCombo) => void;
  onCancel: () => void;
}

function ShortcutKeyCapture({ onCapture, onCancel }: ShortcutKeyCaptureProps) {
  const [capturedCombo, setCapturedCombo] = useState<KeyCombo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Ignore modifier-only presses
      if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
        return;
      }

      // Cancel on Escape (without modifiers)
      if (e.key === 'Escape' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        onCancel();
        return;
      }

      const combo = eventToKeyCombo(e.nativeEvent);
      setCapturedCombo(combo);
    },
    [onCancel]
  );

  const handleConfirm = useCallback(() => {
    if (capturedCombo) {
      onCapture(capturedCombo);
    }
  }, [capturedCombo, onCapture]);

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          readOnly
          value={capturedCombo ? formatKeyCombo(capturedCombo) : ''}
          onKeyDown={handleKeyDown}
          placeholder="Press keys..."
          className={cn(
            'w-full px-3 py-1.5 text-sm rounded-md',
            'bg-gray-800 border border-blue-500 text-white',
            'placeholder-gray-500 outline-none',
            'focus:ring-2 focus:ring-blue-500/50'
          )}
        />
        {!capturedCombo && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
            Press any key combo
          </span>
        )}
      </div>
      {capturedCombo && (
        <button
          onClick={handleConfirm}
          className="p-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={onCancel}
        className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ============================================================================
// SHORTCUT ROW COMPONENT
// ============================================================================

interface ShortcutRowProps {
  shortcut: ShortcutDefinition;
  isEditing: boolean;
  conflict: ShortcutConflict | null;
  onEdit: () => void;
  onSave: (combo: KeyCombo) => void;
  onCancel: () => void;
  onReset: () => void;
  onToggleEnabled: () => void;
}

function ShortcutRow({
  shortcut,
  isEditing,
  conflict,
  onEdit,
  onSave,
  onCancel,
  onReset,
  onToggleEnabled,
}: ShortcutRowProps) {
  const activeCombo = shortcut.customShortcut || shortcut.defaultShortcut;
  const isCustomized = !!shortcut.customShortcut;
  const defaultCombo = shortcut.defaultShortcut;

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-3 rounded-lg',
        'hover:bg-gray-800/50 transition-colors',
        !shortcut.enabled && 'opacity-50'
      )}
    >
      {/* Enabled toggle */}
      <button
        onClick={onToggleEnabled}
        className={cn(
          'w-5 h-5 rounded flex items-center justify-center transition-colors',
          shortcut.enabled
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-500'
        )}
      >
        {shortcut.enabled && <Check className="w-3 h-3" />}
      </button>

      {/* Name and description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{shortcut.name}</span>
          {isCustomized && (
            <span className="px-1.5 py-0.5 text-xs rounded bg-blue-600/20 text-blue-400">
              Custom
            </span>
          )}
          {conflict && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 text-xs rounded bg-yellow-600/20 text-yellow-400">
              <AlertTriangle className="w-3 h-3" />
              Conflict
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">{shortcut.description}</p>
      </div>

      {/* Shortcut display/edit */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <ShortcutKeyCapture onCapture={onSave} onCancel={onCancel} />
        ) : (
          <>
            <button
              onClick={onEdit}
              disabled={!shortcut.allowOverride}
              className={cn(
                'px-3 py-1.5 text-sm font-mono rounded-md transition-colors',
                'bg-gray-800 border border-gray-700',
                shortcut.allowOverride
                  ? 'text-gray-200 hover:border-gray-600 hover:bg-gray-750'
                  : 'text-gray-500 cursor-not-allowed'
              )}
            >
              {formatKeyCombo(activeCombo)}
            </button>

            {/* Reset button (only for customized shortcuts) */}
            {isCustomized && (
              <button
                onClick={onReset}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                title={`Reset to ${formatKeyCombo(defaultCombo)}`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// CATEGORY GROUP COMPONENT
// ============================================================================

interface CategoryGroupProps {
  category: ShortcutCategory;
  shortcuts: ShortcutDefinition[];
  editingId: string | null;
  conflicts: ShortcutConflict[];
  onEdit: (id: string) => void;
  onSave: (id: string, combo: KeyCombo) => void;
  onCancel: () => void;
  onReset: (id: string) => void;
  onToggleEnabled: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function CategoryGroup({
  category,
  shortcuts,
  editingId,
  conflicts,
  onEdit,
  onSave,
  onCancel,
  onReset,
  onToggleEnabled,
  isExpanded,
  onToggleExpand,
}: CategoryGroupProps) {
  const info = CATEGORY_INFO[category];
  const Icon = categoryIcons[category];

  const getConflictForShortcut = (id: string): ShortcutConflict | null => {
    return conflicts.find((c) => c.shortcutId1 === id || c.shortcutId2 === id) || null;
  };

  return (
    <div className="mb-4">
      {/* Category header */}
      <button
        onClick={onToggleExpand}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
          'text-left transition-colors',
          'hover:bg-gray-800/50'
        )}
      >
        <ChevronRight
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform',
            isExpanded && 'rotate-90'
          )}
        />
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-200">{info.name}</span>
        <span className="text-xs text-gray-500">({shortcuts.length})</span>
      </button>

      {/* Shortcuts list */}
      {isExpanded && (
        <div className="mt-1 ml-6 space-y-1">
          {shortcuts.map((shortcut) => (
            <ShortcutRow
              key={shortcut.id}
              shortcut={shortcut}
              isEditing={editingId === shortcut.id}
              conflict={getConflictForShortcut(shortcut.id)}
              onEdit={() => onEdit(shortcut.id)}
              onSave={(combo) => onSave(shortcut.id, combo)}
              onCancel={onCancel}
              onReset={() => onReset(shortcut.id)}
              onToggleEnabled={() => onToggleEnabled(shortcut.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PRINT VIEW COMPONENT
// ============================================================================

interface PrintViewProps {
  shortcuts: ShortcutDefinition[];
}

function PrintView({ shortcuts }: PrintViewProps) {
  const grouped = useMemo(() => {
    const groups = new Map<ShortcutCategory, ShortcutDefinition[]>();

    for (const shortcut of shortcuts) {
      if (!shortcut.enabled) continue;

      const existing = groups.get(shortcut.category) || [];
      existing.push(shortcut);
      groups.set(shortcut.category, existing);
    }

    return groups;
  }, [shortcuts]);

  return (
    <div className="p-8 bg-white text-black print:block hidden">
      <h1 className="text-2xl font-bold mb-6">Tailwind Builder - Keyboard Shortcuts</h1>

      <div className="grid grid-cols-2 gap-8">
        {Array.from(grouped.entries()).map(([category, categoryShortcuts]) => (
          <div key={category}>
            <h2 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-1">
              {CATEGORY_INFO[category].name}
            </h2>
            <table className="w-full text-sm">
              <tbody>
                {categoryShortcuts.map((shortcut) => (
                  <tr key={shortcut.id} className="border-b border-gray-100">
                    <td className="py-1.5 pr-4">{shortcut.name}</td>
                    <td className="py-1.5 text-right font-mono">
                      {formatKeyCombo(shortcut.customShortcut || shortcut.defaultShortcut)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-gray-500">
        Generated on {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ShortcutsModal({ open, onOpenChange }: ShortcutsModalProps) {
  const manager = useMemo(() => getShortcutManager(), []);

  const [shortcuts, setShortcuts] = useState<ShortcutDefinition[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<ShortcutCategory>>(
    new Set(['editing', 'view', 'file'] as ShortcutCategory[])
  );
  const [conflicts, setConflicts] = useState<ShortcutConflict[]>([]);

  // Load shortcuts when modal opens
  useEffect(() => {
    if (open) {
      setShortcuts(manager.getAllShortcuts());
      setConflicts(manager.detectConflicts());
      setEditingId(null);
      setSearchQuery('');
    }
  }, [open, manager]);

  // Filter shortcuts by search
  const filteredShortcuts = useMemo(() => {
    if (!searchQuery.trim()) return shortcuts;

    const query = searchQuery.toLowerCase();
    return shortcuts.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        formatKeyCombo(s.customShortcut || s.defaultShortcut)
          .toLowerCase()
          .includes(query)
    );
  }, [shortcuts, searchQuery]);

  // Group filtered shortcuts by category
  const groupedShortcuts = useMemo(() => {
    const groups = new Map<ShortcutCategory, ShortcutDefinition[]>();
    const categoryOrder: ShortcutCategory[] = [
      'editing',
      'history',
      'file',
      'view',
      'navigation',
      'elements',
      'tools',
    ];

    for (const category of categoryOrder) {
      const categoryShortcuts = filteredShortcuts.filter(
        (s) => s.category === category
      );
      if (categoryShortcuts.length > 0) {
        groups.set(category, categoryShortcuts);
      }
    }

    return groups;
  }, [filteredShortcuts]);

  // Handlers
  const handleEdit = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const handleSave = useCallback(
    (id: string, combo: KeyCombo) => {
      manager.setCustomShortcut(id, combo);
      setShortcuts(manager.getAllShortcuts());
      setConflicts(manager.detectConflicts());
      setEditingId(null);
    },
    [manager]
  );

  const handleCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleReset = useCallback(
    (id: string) => {
      manager.resetShortcut(id);
      setShortcuts(manager.getAllShortcuts());
      setConflicts(manager.detectConflicts());
    },
    [manager]
  );

  const handleResetAll = useCallback(() => {
    if (window.confirm('Reset all shortcuts to defaults? This cannot be undone.')) {
      manager.resetAllShortcuts();
      setShortcuts(manager.getAllShortcuts());
      setConflicts(manager.detectConflicts());
    }
  }, [manager]);

  const handleToggleEnabled = useCallback(
    (id: string) => {
      const shortcut = manager.getShortcut(id);
      if (shortcut) {
        manager.setShortcutEnabled(id, !shortcut.enabled);
        setShortcuts(manager.getAllShortcuts());
        setConflicts(manager.detectConflicts());
      }
    },
    [manager]
  );

  const handleToggleCategory = useCallback((category: ShortcutCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const handleExport = useCallback(() => {
    const config = manager.exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tailwind-builder-shortcuts.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [manager]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const success = manager.importConfig(text);
        if (success) {
          setShortcuts(manager.getAllShortcuts());
          setConflicts(manager.detectConflicts());
        } else {
          alert('Failed to import shortcuts. Invalid file format.');
        }
      } catch {
        alert('Failed to read file.');
      }
    };
    input.click();
  }, [manager]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Keyboard Shortcuts"
        description="View and customize keyboard shortcuts"
        size="full"
        className="max-w-3xl"
      >
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shortcuts..."
              className={cn(
                'w-full pl-9 pr-4 py-2 text-sm rounded-md',
                'bg-gray-800 border border-gray-700 text-white',
                'placeholder-gray-500 outline-none',
                'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleImport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              title="Import shortcuts"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              title="Export shortcuts"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              title="Print shortcuts"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Conflicts warning */}
        {conflicts.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-900/20 border border-yellow-700/50">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {conflicts.length} shortcut conflict{conflicts.length !== 1 ? 's' : ''}{' '}
                detected
              </span>
            </div>
            <p className="mt-1 text-xs text-yellow-500/80">
              Some shortcuts have the same key combination. Only one will work at a
              time.
            </p>
          </div>
        )}

        {/* Shortcuts list */}
        <div className="max-h-[50vh] overflow-y-auto pr-2 -mr-2">
          {groupedShortcuts.size === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Keyboard className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No shortcuts found</p>
              {searchQuery && (
                <p className="text-xs mt-1">Try a different search term</p>
              )}
            </div>
          ) : (
            Array.from(groupedShortcuts.entries()).map(
              ([category, categoryShortcuts]) => (
                <CategoryGroup
                  key={category}
                  category={category}
                  shortcuts={categoryShortcuts}
                  editingId={editingId}
                  conflicts={conflicts}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onReset={handleReset}
                  onToggleEnabled={handleToggleEnabled}
                  isExpanded={expandedCategories.has(category)}
                  onToggleExpand={() => handleToggleCategory(category)}
                />
              )
            )
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
          <button
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All to Defaults
          </button>

          <ModalButton variant="primary" onClick={() => onOpenChange(false)}>
            Done
          </ModalButton>
        </div>
      </Modal>

      {/* Hidden print view */}
      <PrintView shortcuts={shortcuts} />
    </>
  );
}

// ============================================================================
// HOOK FOR USING SHORTCUTS MODAL
// ============================================================================

export function useShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}

export default ShortcutsModal;
