'use client';

import { useMemo } from 'react';
import {
  History,
  RotateCcw,
  RotateCw,
  Trash2,
  Clock,
  Plus,
  Minus,
  Edit2,
  Move,
  Copy,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useBuilderStore } from '@/store/builderStore';

// ============================================================================
// TYPES
// ============================================================================

interface HistoryPanelProps {
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

interface HistoryEntry {
  index: number;
  type: 'add' | 'remove' | 'update' | 'move' | 'duplicate' | 'clear' | 'initial';
  description: string;
  timestamp: number;
  isCurrent: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================

function getActionIcon(type: HistoryEntry['type']) {
  switch (type) {
    case 'add':
      return Plus;
    case 'remove':
      return Minus;
    case 'update':
      return Edit2;
    case 'move':
      return Move;
    case 'duplicate':
      return Copy;
    case 'clear':
      return Trash2;
    default:
      return Clock;
  }
}

function getActionColor(type: HistoryEntry['type']) {
  switch (type) {
    case 'add':
      return 'text-green-400';
    case 'remove':
      return 'text-red-400';
    case 'update':
      return 'text-blue-400';
    case 'move':
      return 'text-purple-400';
    case 'duplicate':
      return 'text-yellow-400';
    case 'clear':
      return 'text-orange-400';
    default:
      return 'text-gray-400';
  }
}

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) {
    return 'Just now';
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  } else {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface HistoryItemProps {
  entry: HistoryEntry;
  onJumpTo: () => void;
}

function HistoryItem({ entry, onJumpTo }: HistoryItemProps) {
  const Icon = getActionIcon(entry.type);
  const colorClass = getActionColor(entry.type);

  return (
    <button
      onClick={onJumpTo}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left',
        'transition-colors',
        entry.isCurrent
          ? 'bg-blue-600/20 border border-blue-500/50'
          : 'hover:bg-gray-800/50 border border-transparent'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
          entry.isCurrent ? 'bg-blue-600' : 'bg-gray-800',
          entry.isCurrent ? 'text-white' : colorClass
        )}
      >
        <Icon className="w-3 h-3" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm truncate',
            entry.isCurrent ? 'text-white font-medium' : 'text-gray-300'
          )}
        >
          {entry.description}
        </p>
        <p className="text-[10px] text-gray-500">{formatTime(entry.timestamp)}</p>
      </div>

      {entry.isCurrent && (
        <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] bg-blue-600 text-white rounded">
          Current
        </span>
      )}
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function HistoryPanel({ collapsed = false, onToggle, className }: HistoryPanelProps) {
  const { history, historyIndex, undo, redo } = useBuilderStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Jump to specific history index by undoing/redoing multiple times
  const jumpToHistoryIndex = (targetIndex: number) => {
    const diff = targetIndex - historyIndex;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        redo();
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        undo();
      }
    }
  };

  // Convert history to display entries
  const historyEntries: HistoryEntry[] = useMemo(() => {
    return history.map((state, index) => {
      // Infer action type from state changes
      let type: HistoryEntry['type'] = 'update';
      let description = 'State change';

      if (index === 0) {
        type = 'initial';
        description = 'Initial state';
      } else {
        const prevState = history[index - 1];
        const currElements = state.elements.length;
        const prevElements = prevState.elements.length;

        if (currElements > prevElements) {
          type = 'add';
          description = `Added element`;
        } else if (currElements < prevElements) {
          if (currElements === 0) {
            type = 'clear';
            description = 'Cleared canvas';
          } else {
            type = 'remove';
            description = 'Removed element';
          }
        } else {
          type = 'update';
          description = 'Updated element';
        }
      }

      return {
        index,
        type,
        description,
        timestamp: Date.now() - (history.length - index) * 30000, // Simulated timestamps
        isCurrent: index === historyIndex,
      };
    });
  }, [history, historyIndex]);

  const handleJumpTo = (index: number) => {
    jumpToHistoryIndex(index);
  };

  // Collapsed state
  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg',
          'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700',
          'transition-colors',
          className
        )}
        title="Show History"
      >
        <History className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col bg-gray-900 border border-gray-800 rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">History</span>
          <span className="text-xs text-gray-500">
            ({historyIndex + 1}/{history.length})
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={cn(
              'p-1.5 rounded transition-colors',
              canUndo
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 cursor-not-allowed'
            )}
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={cn(
              'p-1.5 rounded transition-colors',
              canRedo
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 cursor-not-allowed'
            )}
            title="Redo (Ctrl+Shift+Z)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[300px]">
        {historyEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Clock className="w-8 h-8 mb-2" />
            <p className="text-sm">No history yet</p>
            <p className="text-xs mt-1">Make changes to see history</p>
          </div>
        ) : (
          [...historyEntries].reverse().map((entry) => (
            <HistoryItem
              key={entry.index}
              entry={entry}
              onJumpTo={() => handleJumpTo(entry.index)}
            />
          ))
        )}
      </div>

      {/* Footer info */}
      {historyEntries.length > 0 && (
        <div className="px-3 py-2 border-t border-gray-800 text-xs text-gray-500">
          Click on any state to jump to it
        </div>
      )}
    </div>
  );
}

export default HistoryPanel;
