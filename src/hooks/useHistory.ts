'use client';

import { useCallback, useMemo } from 'react';
import { useBuilderStore } from '@/store/builderStore';

/**
 * useHistory Hook
 *
 * Provides undo/redo functionality for the builder.
 * Wraps the store's history management with computed values
 * and keyboard shortcut handlers.
 */
export function useHistory() {
  const {
    history,
    historyIndex,
    undo,
    redo,
  } = useBuilderStore();

  /**
   * Whether undo is available (there's history to go back to)
   */
  const canUndo = useMemo(() => {
    return historyIndex > 0;
  }, [historyIndex]);

  /**
   * Whether redo is available (there's history to go forward to)
   */
  const canRedo = useMemo(() => {
    return historyIndex < history.length - 1;
  }, [historyIndex, history.length]);

  /**
   * Number of history states available
   */
  const historyLength = useMemo(() => {
    return history.length;
  }, [history.length]);

  /**
   * Current position in history (1-indexed for display)
   */
  const currentPosition = useMemo(() => {
    return historyIndex + 1;
  }, [historyIndex]);

  /**
   * Handle undo with validation
   */
  const handleUndo = useCallback(() => {
    if (canUndo) {
      undo();
      return true;
    }
    return false;
  }, [canUndo, undo]);

  /**
   * Handle redo with validation
   */
  const handleRedo = useCallback(() => {
    if (canRedo) {
      redo();
      return true;
    }
    return false;
  }, [canRedo, redo]);

  /**
   * Keyboard shortcut handler for undo/redo
   * Returns true if the event was handled
   */
  const handleKeyboardShortcut = useCallback(
    (event: KeyboardEvent): boolean => {
      // Check for Ctrl+Z (undo) or Cmd+Z on Mac
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        // Check for Shift key for redo
        if (event.shiftKey) {
          event.preventDefault();
          return handleRedo();
        } else {
          event.preventDefault();
          return handleUndo();
        }
      }

      // Alternative: Ctrl+Y for redo (Windows convention)
      if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault();
        return handleRedo();
      }

      return false;
    },
    [handleUndo, handleRedo]
  );

  return {
    // State
    canUndo,
    canRedo,
    historyLength,
    currentPosition,
    historyIndex,

    // Actions
    undo: handleUndo,
    redo: handleRedo,
    handleKeyboardShortcut,
  };
}

export default useHistory;
