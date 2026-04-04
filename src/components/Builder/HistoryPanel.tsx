'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';
import {
  getHistorySystem,
  type HistoryEntry,
  type ActionType,
} from '@/lib/historySystem';
import { getDiffEngine, type DiffResult } from '@/lib/diffEngine';
import {
  History,
  X,
  Flag,
  Trash2,
  RotateCcw,
  ChevronRight,
  Plus,
  Minus,
  Edit3,
  Move,
  Copy,
  Palette,
  Layers,
  XCircle,
  Download,
  Clipboard,
  GitBranch,
  GitMerge,
  Circle,
  Clock,
  AlertTriangle,
  Save,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CheckpointDialogState {
  isOpen: boolean;
  name: string;
  description: string;
}

// ============================================================================
// ICON MAPPING
// ============================================================================

const ACTION_ICONS: Record<ActionType, React.ElementType> = {
  add_element: Plus,
  remove_element: Trash2,
  update_element: Edit3,
  move_element: Move,
  duplicate_element: Copy,
  update_styles: Palette,
  batch_update: Layers,
  clear_canvas: XCircle,
  import: Download,
  paste: Clipboard,
  checkpoint: Flag,
  branch_create: GitBranch,
  branch_merge: GitMerge,
};

const ACTION_COLORS: Record<ActionType, string> = {
  add_element: 'text-green-400 bg-green-400/10',
  remove_element: 'text-red-400 bg-red-400/10',
  update_element: 'text-blue-400 bg-blue-400/10',
  move_element: 'text-purple-400 bg-purple-400/10',
  duplicate_element: 'text-cyan-400 bg-cyan-400/10',
  update_styles: 'text-yellow-400 bg-yellow-400/10',
  batch_update: 'text-orange-400 bg-orange-400/10',
  clear_canvas: 'text-red-400 bg-red-400/10',
  import: 'text-green-400 bg-green-400/10',
  paste: 'text-blue-400 bg-blue-400/10',
  checkpoint: 'text-amber-400 bg-amber-400/10',
  branch_create: 'text-purple-400 bg-purple-400/10',
  branch_merge: 'text-purple-400 bg-purple-400/10',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - timestamp;

  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }

  // Same year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Different year
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getActionIconComponent(type: ActionType): React.ElementType {
  return ACTION_ICONS[type] || Circle;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface HistoryEntryItemProps {
  entry: HistoryEntry;
  index: number;
  isCurrent: boolean;
  isSelected: boolean;
  onJump: (index: number) => void;
  onSelect: (entry: HistoryEntry) => void;
}

function HistoryEntryItem({
  entry,
  index,
  isCurrent,
  isSelected,
  onJump,
  onSelect,
}: HistoryEntryItemProps) {
  const Icon = getActionIconComponent(entry.metadata.type);
  const colorClass = ACTION_COLORS[entry.metadata.type] || 'text-gray-400 bg-gray-400/10';

  return (
    <div
      className={cn(
        'relative group',
        'border-l-2 ml-4 pl-4 pb-4',
        isCurrent ? 'border-blue-500' : 'border-gray-700'
      )}
    >
      {/* Timeline dot */}
      <div
        className={cn(
          'absolute -left-[9px] top-0 w-4 h-4 rounded-full',
          'flex items-center justify-center',
          isCurrent
            ? 'bg-blue-500 ring-4 ring-blue-500/20'
            : entry.isCheckpoint
            ? 'bg-amber-500 ring-2 ring-amber-500/20'
            : 'bg-gray-700'
        )}
      >
        {isCurrent && <div className="w-2 h-2 bg-white rounded-full" />}
        {entry.isCheckpoint && !isCurrent && (
          <Flag className="w-2 h-2 text-white" />
        )}
      </div>

      {/* Entry content */}
      <div
        onClick={() => onSelect(entry)}
        className={cn(
          'relative p-3 rounded-lg cursor-pointer',
          'transition-all duration-150',
          isSelected
            ? 'bg-gray-700 ring-2 ring-blue-500/50'
            : 'bg-gray-800/50 hover:bg-gray-800',
          isCurrent && 'ring-2 ring-blue-500/30'
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={cn('p-1.5 rounded-md', colorClass)}>
            <Icon className="w-3.5 h-3.5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white text-sm truncate">
                {entry.metadata.description}
              </span>
              {entry.isCheckpoint && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-400">
                  Checkpoint
                </span>
              )}
              {entry.isAutoSave && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-600 text-gray-300">
                  Auto-save
                </span>
              )}
            </div>

            {entry.checkpointName && (
              <p className="text-xs text-amber-400 mt-0.5">
                {entry.checkpointName}
              </p>
            )}

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">
                <Clock className="w-3 h-3 inline mr-1" />
                {formatTime(entry.metadata.timestamp)}
              </span>
              {entry.metadata.elementType && (
                <span className="text-xs text-gray-500">
                  {entry.metadata.elementType}
                </span>
              )}
            </div>
          </div>

          {/* Current indicator */}
          {isCurrent && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500 text-white">
              Current
            </span>
          )}
        </div>

        {/* Jump to state button */}
        {!isCurrent && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJump(index);
            }}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'px-2 py-1 rounded-md text-xs font-medium',
              'bg-blue-600 text-white',
              'opacity-0 group-hover:opacity-100',
              'transition-opacity'
            )}
          >
            Restore
          </button>
        )}
      </div>
    </div>
  );
}

interface DiffViewProps {
  diff: DiffResult | null;
  fromEntry: HistoryEntry | null;
  toEntry: HistoryEntry | null;
}

function DiffView({ diff, fromEntry, toEntry }: DiffViewProps) {
  if (!diff || !fromEntry || !toEntry) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <History className="w-8 h-8 text-gray-500 mb-2" />
        <p className="text-gray-400 text-sm">
          Select an entry to view changes
        </p>
      </div>
    );
  }

  const { summary, humanReadable } = diff;

  return (
    <div className="p-4 space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-green-500/10 rounded-lg p-2 text-center">
          <Plus className="w-4 h-4 text-green-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-green-400">{summary.added}</div>
          <div className="text-[10px] text-green-400/70">Added</div>
        </div>
        <div className="bg-red-500/10 rounded-lg p-2 text-center">
          <Minus className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-red-400">{summary.removed}</div>
          <div className="text-[10px] text-red-400/70">Removed</div>
        </div>
        <div className="bg-yellow-500/10 rounded-lg p-2 text-center">
          <Edit3 className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-yellow-400">
            {summary.modified}
          </div>
          <div className="text-[10px] text-yellow-400/70">Modified</div>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-2 text-center">
          <Move className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-blue-400">{summary.moved}</div>
          <div className="text-[10px] text-blue-400/70">Moved</div>
        </div>
      </div>

      {/* Comparison header */}
      <div className="flex items-center gap-2 text-sm">
        <div className="flex-1 px-3 py-2 bg-gray-800 rounded-lg">
          <span className="text-gray-400">From:</span>{' '}
          <span className="text-white">{fromEntry.metadata.description}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500" />
        <div className="flex-1 px-3 py-2 bg-gray-800 rounded-lg">
          <span className="text-gray-400">To:</span>{' '}
          <span className="text-white">{toEntry.metadata.description}</span>
        </div>
      </div>

      {/* Changes list */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-700">
          <h4 className="text-xs font-medium text-gray-400 uppercase">
            Changes ({summary.totalChanges})
          </h4>
        </div>
        <div className="max-h-[300px] overflow-auto">
          {humanReadable.length > 0 ? (
            <div className="p-2 space-y-1 font-mono text-xs">
              {humanReadable.map((line, idx) => {
                const isAddition = line.startsWith('+');
                const isRemoval = line.startsWith('-');
                const isModification = line.startsWith('*');
                const isMove = line.startsWith('>');

                return (
                  <div
                    key={idx}
                    className={cn(
                      'px-2 py-1 rounded',
                      isAddition && 'bg-green-500/10 text-green-400',
                      isRemoval && 'bg-red-500/10 text-red-400',
                      isModification && 'bg-yellow-500/10 text-yellow-400',
                      isMove && 'bg-blue-500/10 text-blue-400',
                      !isAddition &&
                        !isRemoval &&
                        !isModification &&
                        !isMove &&
                        'text-gray-400 pl-4'
                    )}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No changes detected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CheckpointDialogProps {
  state: CheckpointDialogState;
  onStateChange: (state: CheckpointDialogState) => void;
  onSubmit: () => void;
}

function CheckpointDialog({
  state,
  onStateChange,
  onSubmit,
}: CheckpointDialogProps) {
  return (
    <Dialog.Root
      open={state.isOpen}
      onOpenChange={(open) =>
        onStateChange({ ...state, isOpen: open })
      }
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-md',
            'bg-gray-900 rounded-xl shadow-2xl',
            'border border-gray-700 z-50',
            'p-6'
          )}
        >
          <Dialog.Title className="text-lg font-semibold text-white mb-1">
            Create Checkpoint
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-400 mb-4">
            Save the current state with a name for easy reference later.
          </Dialog.Description>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Checkpoint Name
              </label>
              <input
                type="text"
                value={state.name}
                onChange={(e) =>
                  onStateChange({ ...state, name: e.target.value })
                }
                placeholder="e.g., Before header redesign"
                className={cn(
                  'w-full px-3 py-2 rounded-lg',
                  'bg-gray-800 border border-gray-700',
                  'text-white placeholder-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
                )}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description (optional)
              </label>
              <textarea
                value={state.description}
                onChange={(e) =>
                  onStateChange({ ...state, description: e.target.value })
                }
                placeholder="Add any notes about this checkpoint..."
                rows={3}
                className={cn(
                  'w-full px-3 py-2 rounded-lg resize-none',
                  'bg-gray-800 border border-gray-700',
                  'text-white placeholder-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Dialog.Close asChild>
              <button
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  'bg-gray-700 hover:bg-gray-600 text-white',
                  'transition-colors'
                )}
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={onSubmit}
              disabled={!state.name.trim()}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'bg-amber-500 hover:bg-amber-400 text-white',
                'transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center gap-2'
              )}
            >
              <Flag className="w-4 h-4" />
              Create Checkpoint
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface ClearHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

function ClearHistoryDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: ClearHistoryDialogProps) {
  return (
    <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <AlertDialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-md',
            'bg-gray-900 rounded-xl shadow-2xl',
            'border border-gray-700 z-50',
            'p-6'
          )}
        >
          <AlertDialog.Title className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Clear History
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-gray-400 mb-6">
            This will permanently delete all history entries including
            checkpoints. This action cannot be undone.
          </AlertDialog.Description>

          <div className="flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  'bg-gray-700 hover:bg-gray-600 text-white',
                  'transition-colors'
                )}
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={onConfirm}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  'bg-red-600 hover:bg-red-500 text-white',
                  'transition-colors',
                  'flex items-center gap-2'
                )}
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const { undo, redo, history, historyIndex } = useBuilderStore();

  // State
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [checkpointDialog, setCheckpointDialog] = useState<CheckpointDialogState>({
    isOpen: false,
    name: '',
    description: '',
  });
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [historySystemState, setHistorySystemState] = useState<{
    entries: HistoryEntry[];
    currentIndex: number;
  }>({ entries: [], currentIndex: -1 });

  // Get history system
  const historySystem = useMemo(() => getHistorySystem(), []);
  const diffEngine = useMemo(() => getDiffEngine(), []);

  // Subscribe to history changes
  useEffect(() => {
    const unsubscribe = historySystem.subscribe((state) => {
      setHistorySystemState({
        entries: state.entries,
        currentIndex: state.currentEntryIndex,
      });
    });

    // Initial state
    const state = historySystem.getState();
    setHistorySystemState({
      entries: state.entries,
      currentIndex: state.currentEntryIndex,
    });

    return unsubscribe;
  }, [historySystem]);

  // Calculate diff when entry is selected
  const diff = useMemo(() => {
    if (!selectedEntry) return null;

    const currentEntry = historySystem.getCurrentEntry();
    if (!currentEntry || currentEntry.id === selectedEntry.id) return null;

    return diffEngine.compare(selectedEntry.elements, currentEntry.elements);
  }, [selectedEntry, historySystem, diffEngine]);

  // Get entries in reverse order (newest first)
  const reversedEntries = useMemo(() => {
    return [...historySystemState.entries].reverse();
  }, [historySystemState.entries]);

  // Handlers
  const handleJumpToState = useCallback(
    (index: number) => {
      // Convert reversed index to actual index
      const actualIndex = historySystemState.entries.length - 1 - index;
      historySystem.jumpToState(actualIndex);
    },
    [historySystem, historySystemState.entries.length]
  );

  const handleCreateCheckpoint = useCallback(() => {
    if (!checkpointDialog.name.trim()) return;

    historySystem.createCheckpoint(
      checkpointDialog.name.trim(),
      checkpointDialog.description.trim() || undefined
    );

    setCheckpointDialog({
      isOpen: false,
      name: '',
      description: '',
    });
  }, [historySystem, checkpointDialog]);

  const handleClearHistory = useCallback(() => {
    historySystem.clearHistory();
    setSelectedEntry(null);
    setClearDialogOpen(false);
  }, [historySystem]);

  // Calculate statistics
  const stats = useMemo(() => {
    const checkpoints = historySystemState.entries.filter(
      (e) => e.isCheckpoint
    ).length;
    const total = historySystemState.entries.length;
    return { checkpoints, total };
  }, [historySystemState.entries]);

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <Dialog.Content
            className={cn(
              'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-[95vw] max-w-5xl h-[85vh]',
              'bg-gray-900 rounded-2xl shadow-2xl',
              'border border-gray-700 z-40',
              'flex flex-col overflow-hidden'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <History className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold text-white">
                    History
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-gray-400">
                    {stats.total} entries, {stats.checkpoints} checkpoints
                  </Dialog.Description>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCheckpointDialog({ ...checkpointDialog, isOpen: true })
                  }
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium',
                    'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400',
                    'transition-colors flex items-center gap-1.5'
                  )}
                >
                  <Flag className="w-4 h-4" />
                  Create Checkpoint
                </button>
                <button
                  onClick={() => setClearDialogOpen(true)}
                  disabled={stats.total === 0}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium',
                    'bg-red-500/20 hover:bg-red-500/30 text-red-400',
                    'transition-colors flex items-center gap-1.5',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
                <Dialog.Close asChild>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Timeline */}
              <div className="w-1/2 border-r border-gray-700 flex flex-col">
                <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">
                    Timeline
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className={cn(
                        'p-1.5 rounded-md',
                        'hover:bg-gray-800 text-gray-400 hover:text-white',
                        'transition-colors',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                      title="Undo"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className={cn(
                        'p-1.5 rounded-md',
                        'hover:bg-gray-800 text-gray-400 hover:text-white',
                        'transition-colors',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                      title="Redo"
                    >
                      <RotateCcw className="w-4 h-4 transform scale-x-[-1]" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                  {reversedEntries.length > 0 ? (
                    <div className="space-y-0">
                      {reversedEntries.map((entry, index) => {
                        const actualIndex =
                          historySystemState.entries.length - 1 - index;
                        return (
                          <HistoryEntryItem
                            key={entry.id}
                            entry={entry}
                            index={index}
                            isCurrent={
                              actualIndex === historySystemState.currentIndex
                            }
                            isSelected={selectedEntry?.id === entry.id}
                            onJump={handleJumpToState}
                            onSelect={setSelectedEntry}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="p-4 rounded-full bg-gray-800 mb-4">
                        <History className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        No history yet
                      </h3>
                      <p className="text-gray-400 text-sm max-w-xs">
                        Make changes to your canvas and they will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Diff view */}
              <div className="w-1/2 flex flex-col">
                <div className="p-3 border-b border-gray-700">
                  <span className="text-sm font-medium text-gray-300">
                    Changes
                  </span>
                </div>

                <div className="flex-1 overflow-auto">
                  <DiffView
                    diff={diff}
                    fromEntry={selectedEntry}
                    toEntry={historySystem.getCurrentEntry()}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-700 bg-gray-800/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Current state
                  </span>
                  <span className="flex items-center gap-1">
                    <Flag className="w-3 h-3 text-amber-500" />
                    Checkpoint
                  </span>
                  <span className="flex items-center gap-1">
                    <Save className="w-3 h-3 text-gray-400" />
                    Auto-save
                  </span>
                </div>
                <span>
                  Click on an entry to view changes from that point
                </span>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Checkpoint dialog */}
      <CheckpointDialog
        state={checkpointDialog}
        onStateChange={setCheckpointDialog}
        onSubmit={handleCreateCheckpoint}
      />

      {/* Clear history confirmation */}
      <ClearHistoryDialog
        isOpen={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
        onConfirm={handleClearHistory}
      />
    </>
  );
}

export default HistoryPanel;
