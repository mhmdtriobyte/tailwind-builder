'use client';

import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import {
  HistorySystem,
  getHistorySystem,
  HistoryEntry,
  HistoryBranch,
  ActionType,
  HistorySystemState,
  HistoryOperationResult,
} from '@/lib/historySystem';
import { DiffResult } from '@/lib/diffEngine';
import type { BuilderElement } from '@/types/builder';

// ============================================================================
// TYPES
// ============================================================================

/**
 * History hook return type
 */
export interface UseHistoryReturn {
  // State
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  currentPosition: number;
  historyIndex: number;
  isGrouping: boolean;
  currentBranch: HistoryBranch | null;
  branches: HistoryBranch[];
  checkpoints: HistoryEntry[];

  // Core actions
  undo: () => HistoryOperationResult;
  redo: () => HistoryOperationResult;
  record: (action: ActionType, metadata?: Record<string, unknown>) => void;

  // Checkpoint actions
  createCheckpoint: (name: string, description?: string) => HistoryOperationResult;
  restoreCheckpoint: (name: string) => HistoryOperationResult;
  deleteCheckpoint: (name: string) => HistoryOperationResult;
  getCheckpoints: () => HistoryEntry[];

  // Navigation
  jumpToState: (index: number) => HistoryOperationResult;
  jumpToEntry: (entryId: string) => HistoryOperationResult;

  // Diff and comparison
  getDiff: (fromIndex: number, toIndex: number) => DiffResult | null;
  getDiffFromCurrent: (toIndex: number) => DiffResult | null;

  // History data
  getHistory: () => HistoryEntry[];
  getCurrentEntry: () => HistoryEntry | null;
  getEntry: (index: number) => HistoryEntry | null;
  searchHistory: (query: string) => HistoryEntry[];

  // Branching
  createBranch: (name: string, description?: string) => HistoryOperationResult;
  switchBranch: (branchId: string) => HistoryOperationResult;
  deleteBranch: (branchId: string) => HistoryOperationResult;
  mergeBranch: (sourceBranchId: string, targetBranchId?: string) => HistoryOperationResult;

  // Action grouping
  beginGroup: (name: string) => void;
  endGroup: () => HistoryOperationResult;
  cancelGroup: () => void;

  // Persistence
  exportHistory: () => string;
  importHistory: (json: string) => HistoryOperationResult;
  clearHistory: () => void;

  // Statistics
  getStatistics: () => ReturnType<HistorySystem['getStatistics']>;

  // Keyboard handler
  handleKeyboardShortcut: (event: KeyboardEvent) => boolean;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

/**
 * useHistory - Enhanced history management hook
 *
 * Provides comprehensive undo/redo functionality with:
 * - Unlimited history with configurable limits
 * - Named checkpoints and snapshots
 * - History branching (git-like)
 * - Diff between versions
 * - Action grouping for batch changes
 * - Persistence to localStorage/IndexedDB
 * - Keyboard shortcut handling
 */
export function useHistory(): UseHistoryReturn {
  // Get the builder store for syncing elements
  const {
    elements,
    history: legacyHistory,
    historyIndex: legacyHistoryIndex,
  } = useBuilderStore();

  // Initialize history system
  const historySystemRef = useRef<HistorySystem | null>(null);
  const [historyState, setHistoryState] = useState<HistorySystemState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get or create history system instance
  const getSystem = useCallback(() => {
    if (!historySystemRef.current) {
      historySystemRef.current = getHistorySystem({
        maxHistorySize: 100,
        autoSaveEnabled: true,
        autoSaveInterval: 30000,
        compressionEnabled: true,
        persistenceEnabled: true,
      });
    }
    return historySystemRef.current;
  }, []);

  // Initialize and subscribe to history changes
  useEffect(() => {
    const system = getSystem();

    // Subscribe to state changes
    const unsubscribe = system.subscribe((state) => {
      setHistoryState(state);
    });

    // Load persisted history
    system.load().then(() => {
      setHistoryState(system.getState());
      setIsInitialized(true);
    });

    return () => {
      unsubscribe();
    };
  }, [getSystem]);

  // Sync elements changes to history system
  const lastElementsRef = useRef<BuilderElement[]>([]);

  useEffect(() => {
    if (!isInitialized) return;

    // Only record if elements actually changed
    const elementsJson = JSON.stringify(elements);
    const lastJson = JSON.stringify(lastElementsRef.current);

    if (elementsJson !== lastJson && elements.length > 0) {
      lastElementsRef.current = elements;
      // The builder store already handles history,
      // so we just need to sync if needed
    }
  }, [elements, isInitialized]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const canUndo = useMemo(() => {
    if (historyState) {
      return historyState.currentEntryIndex > 0;
    }
    return legacyHistoryIndex > 0;
  }, [historyState, legacyHistoryIndex]);

  const canRedo = useMemo(() => {
    if (historyState) {
      return historyState.currentEntryIndex < historyState.entries.length - 1;
    }
    return legacyHistoryIndex < legacyHistory.length - 1;
  }, [historyState, legacyHistoryIndex, legacyHistory.length]);

  const historyLength = useMemo(() => {
    return historyState?.entries.length || legacyHistory.length;
  }, [historyState, legacyHistory.length]);

  const currentPosition = useMemo(() => {
    const index = historyState?.currentEntryIndex ?? legacyHistoryIndex;
    return index + 1;
  }, [historyState, legacyHistoryIndex]);

  const historyIndex = useMemo(() => {
    return historyState?.currentEntryIndex ?? legacyHistoryIndex;
  }, [historyState, legacyHistoryIndex]);

  const isGrouping = useMemo(() => {
    const system = getSystem();
    return system.isGrouping();
  }, [getSystem]);

  const currentBranch = useMemo(() => {
    const system = getSystem();
    return system.getCurrentBranch();
  }, [getSystem]);

  const branches = useMemo(() => {
    return historyState?.branches || [];
  }, [historyState]);

  const checkpoints = useMemo(() => {
    const system = getSystem();
    return system.getCheckpoints();
  }, [getSystem, historyState]); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================================================
  // CORE ACTIONS
  // ============================================================================

  const undo = useCallback((): HistoryOperationResult => {
    const system = getSystem();
    const result = system.undo();

    if (result.success && result.entry) {
      // Sync elements back to builder store
      useBuilderStore.setState({
        elements: result.entry.elements,
        selectedId: null,
      });
    }

    return result;
  }, [getSystem]);

  const redo = useCallback((): HistoryOperationResult => {
    const system = getSystem();
    const result = system.redo();

    if (result.success && result.entry) {
      // Sync elements back to builder store
      useBuilderStore.setState({
        elements: result.entry.elements,
        selectedId: null,
      });
    }

    return result;
  }, [getSystem]);

  const record = useCallback(
    (action: ActionType, metadata?: Record<string, unknown>) => {
      const system = getSystem();
      const currentElements = useBuilderStore.getState().elements;
      system.record(currentElements, action, metadata);
    },
    [getSystem]
  );

  // ============================================================================
  // CHECKPOINT ACTIONS
  // ============================================================================

  const createCheckpoint = useCallback(
    (name: string, description?: string): HistoryOperationResult => {
      const system = getSystem();
      return system.createCheckpoint(name, description);
    },
    [getSystem]
  );

  const restoreCheckpoint = useCallback(
    (name: string): HistoryOperationResult => {
      const system = getSystem();
      const result = system.restoreCheckpoint(name);

      if (result.success && result.entry) {
        useBuilderStore.setState({
          elements: result.entry.elements,
          selectedId: null,
        });
      }

      return result;
    },
    [getSystem]
  );

  const deleteCheckpoint = useCallback(
    (name: string): HistoryOperationResult => {
      const system = getSystem();
      return system.deleteCheckpoint(name);
    },
    [getSystem]
  );

  const getCheckpoints = useCallback((): HistoryEntry[] => {
    const system = getSystem();
    return system.getCheckpoints();
  }, [getSystem]);

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const jumpToState = useCallback(
    (index: number): HistoryOperationResult => {
      const system = getSystem();
      const result = system.jumpToState(index);

      if (result.success && result.entry) {
        useBuilderStore.setState({
          elements: result.entry.elements,
          selectedId: null,
        });
      }

      return result;
    },
    [getSystem]
  );

  const jumpToEntry = useCallback(
    (entryId: string): HistoryOperationResult => {
      const system = getSystem();
      const result = system.jumpToEntry(entryId);

      if (result.success && result.entry) {
        useBuilderStore.setState({
          elements: result.entry.elements,
          selectedId: null,
        });
      }

      return result;
    },
    [getSystem]
  );

  // ============================================================================
  // DIFF AND COMPARISON
  // ============================================================================

  const getDiff = useCallback(
    (fromIndex: number, toIndex: number): DiffResult | null => {
      const system = getSystem();
      return system.getDiff(fromIndex, toIndex);
    },
    [getSystem]
  );

  const getDiffFromCurrent = useCallback(
    (toIndex: number): DiffResult | null => {
      const system = getSystem();
      const currentIndex = system.getState().currentEntryIndex;
      return system.getDiff(currentIndex, toIndex);
    },
    [getSystem]
  );

  // ============================================================================
  // HISTORY DATA
  // ============================================================================

  const getHistory = useCallback((): HistoryEntry[] => {
    return historyState?.entries || [];
  }, [historyState]);

  const getCurrentEntry = useCallback((): HistoryEntry | null => {
    const system = getSystem();
    return system.getCurrentEntry();
  }, [getSystem]);

  const getEntry = useCallback(
    (index: number): HistoryEntry | null => {
      const system = getSystem();
      return system.getEntry(index);
    },
    [getSystem]
  );

  const searchHistory = useCallback(
    (query: string): HistoryEntry[] => {
      const system = getSystem();
      return system.search(query);
    },
    [getSystem]
  );

  // ============================================================================
  // BRANCHING
  // ============================================================================

  const createBranch = useCallback(
    (name: string, description?: string): HistoryOperationResult => {
      const system = getSystem();
      return system.createBranch(name, description);
    },
    [getSystem]
  );

  const switchBranch = useCallback(
    (branchId: string): HistoryOperationResult => {
      const system = getSystem();
      const result = system.switchBranch(branchId);

      if (result.success && result.entry) {
        useBuilderStore.setState({
          elements: result.entry.elements,
          selectedId: null,
        });
      }

      return result;
    },
    [getSystem]
  );

  const deleteBranch = useCallback(
    (branchId: string): HistoryOperationResult => {
      const system = getSystem();
      return system.deleteBranch(branchId);
    },
    [getSystem]
  );

  const mergeBranch = useCallback(
    (sourceBranchId: string, targetBranchId?: string): HistoryOperationResult => {
      const system = getSystem();
      const result = system.mergeBranch(sourceBranchId, targetBranchId);

      if (result.success && result.entry) {
        useBuilderStore.setState({
          elements: result.entry.elements,
          selectedId: null,
        });
      }

      return result;
    },
    [getSystem]
  );

  // ============================================================================
  // ACTION GROUPING
  // ============================================================================

  const beginGroup = useCallback(
    (name: string): void => {
      const system = getSystem();
      system.beginGroup(name);
    },
    [getSystem]
  );

  const endGroup = useCallback((): HistoryOperationResult => {
    const system = getSystem();
    return system.endGroup();
  }, [getSystem]);

  const cancelGroup = useCallback((): void => {
    const system = getSystem();
    system.cancelGroup();
  }, [getSystem]);

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  const exportHistory = useCallback((): string => {
    const system = getSystem();
    return system.exportHistory();
  }, [getSystem]);

  const importHistory = useCallback(
    (json: string): HistoryOperationResult => {
      const system = getSystem();
      const result = system.importHistory(json);

      if (result.success && result.entry) {
        useBuilderStore.setState({
          elements: result.entry.elements,
          selectedId: null,
        });
      }

      return result;
    },
    [getSystem]
  );

  const clearHistory = useCallback((): void => {
    const system = getSystem();
    system.clearHistory();
  }, [getSystem]);

  // ============================================================================
  // STATISTICS
  // ============================================================================

  const getStatistics = useCallback(() => {
    const system = getSystem();
    return system.getStatistics();
  }, [getSystem]);

  // ============================================================================
  // KEYBOARD SHORTCUTS
  // ============================================================================

  const handleKeyboardShortcut = useCallback(
    (event: KeyboardEvent): boolean => {
      const isCtrlOrMeta = event.ctrlKey || event.metaKey;

      // Undo: Ctrl+Z
      if (isCtrlOrMeta && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) {
          undo();
          return true;
        }
        return false;
      }

      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if (
        (isCtrlOrMeta && event.key === 'z' && event.shiftKey) ||
        (isCtrlOrMeta && event.key === 'y')
      ) {
        event.preventDefault();
        if (canRedo) {
          redo();
          return true;
        }
        return false;
      }

      // Create checkpoint: Ctrl+Shift+S
      if (isCtrlOrMeta && event.shiftKey && event.key === 's') {
        event.preventDefault();
        const name = prompt('Enter checkpoint name:');
        if (name) {
          createCheckpoint(name);
          return true;
        }
        return false;
      }

      return false;
    },
    [canUndo, canRedo, undo, redo, createCheckpoint]
  );

  // Register global keyboard shortcuts
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Only handle if not in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      handleKeyboardShortcut(event);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKeyboardShortcut]);

  // ============================================================================
  // RETURN VALUE
  // ============================================================================

  return {
    // State
    canUndo,
    canRedo,
    historyLength,
    currentPosition,
    historyIndex,
    isGrouping,
    currentBranch,
    branches,
    checkpoints,

    // Core actions
    undo,
    redo,
    record,

    // Checkpoint actions
    createCheckpoint,
    restoreCheckpoint,
    deleteCheckpoint,
    getCheckpoints,

    // Navigation
    jumpToState,
    jumpToEntry,

    // Diff and comparison
    getDiff,
    getDiffFromCurrent,

    // History data
    getHistory,
    getCurrentEntry,
    getEntry,
    searchHistory,

    // Branching
    createBranch,
    switchBranch,
    deleteBranch,
    mergeBranch,

    // Action grouping
    beginGroup,
    endGroup,
    cancelGroup,

    // Persistence
    exportHistory,
    importHistory,
    clearHistory,

    // Statistics
    getStatistics,

    // Keyboard handler
    handleKeyboardShortcut,
  };
}

export default useHistory;
