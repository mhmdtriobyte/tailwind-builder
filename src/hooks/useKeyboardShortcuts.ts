'use client';

import { useEffect, useCallback } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import toast from 'react-hot-toast';

export function useKeyboardShortcuts() {
  const {
    selectedId,
    undo,
    redo,
    copyElement,
    pasteElement,
    removeElement,
    duplicateElement,
    toggleCodePreview,
    toggleGrid,
    selectElement,
  } = useBuilderStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? event.metaKey : event.ctrlKey;

      // Undo: Ctrl/Cmd + Z
      if (modifier && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
        toast.success('Undo', { duration: 1000 });
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if (
        (modifier && event.shiftKey && event.key === 'z') ||
        (modifier && event.key === 'y')
      ) {
        event.preventDefault();
        redo();
        toast.success('Redo', { duration: 1000 });
        return;
      }

      // Copy: Ctrl/Cmd + C
      if (modifier && event.key === 'c' && selectedId) {
        event.preventDefault();
        copyElement(selectedId);
        toast.success('Copied to clipboard', { duration: 1000 });
        return;
      }

      // Paste: Ctrl/Cmd + V
      if (modifier && event.key === 'v') {
        event.preventDefault();
        pasteElement(null);
        toast.success('Pasted', { duration: 1000 });
        return;
      }

      // Duplicate: Ctrl/Cmd + D
      if (modifier && event.key === 'd' && selectedId) {
        event.preventDefault();
        duplicateElement(selectedId);
        toast.success('Duplicated', { duration: 1000 });
        return;
      }

      // Delete: Delete or Backspace
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId) {
        event.preventDefault();
        removeElement(selectedId);
        toast.success('Deleted', { duration: 1000 });
        return;
      }

      // Toggle code preview: Ctrl/Cmd + Shift + C
      if (modifier && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        toggleCodePreview();
        return;
      }

      // Toggle grid: Ctrl/Cmd + G
      if (modifier && event.key === 'g') {
        event.preventDefault();
        toggleGrid();
        return;
      }

      // Deselect: Escape
      if (event.key === 'Escape') {
        event.preventDefault();
        selectElement(null);
        return;
      }

      // Save: Ctrl/Cmd + S (prevent default, handled elsewhere)
      if (modifier && event.key === 's') {
        event.preventDefault();
        toast.success('Auto-saved', { duration: 1000 });
        return;
      }
    },
    [
      selectedId,
      undo,
      redo,
      copyElement,
      pasteElement,
      removeElement,
      duplicateElement,
      toggleCodePreview,
      toggleGrid,
      selectElement,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
