'use client';

import { useEffect, useCallback, useState, useMemo } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import toast from 'react-hot-toast';
import {
  getShortcutManager,
  type ShortcutContext,
} from '@/lib/keyboardShortcuts';
import {
  getCommandRegistry,
  createDefaultCommands,
  type Command,
} from '@/lib/commandPalette';

// ============================================================================
// TYPES
// ============================================================================

interface UseKeyboardShortcutsOptions {
  /**
   * Whether shortcuts are enabled
   */
  enabled?: boolean;

  /**
   * Current context for context-aware shortcuts
   */
  context?: ShortcutContext;

  /**
   * Callback when command palette should open
   */
  onOpenCommandPalette?: () => void;

  /**
   * Callback when shortcuts modal should open
   */
  onOpenShortcutsModal?: () => void;

  /**
   * Callback when export modal should open
   */
  onExport?: () => void;

  /**
   * Callback when preview should toggle
   */
  onPreview?: () => void;
}

interface UseKeyboardShortcutsReturn {
  /**
   * All registered commands
   */
  commands: Command[];

  /**
   * Whether user is currently in an input field
   */
  isTyping: boolean;

  /**
   * Current shortcut context
   */
  currentContext: ShortcutContext;

  /**
   * Navigate to sibling/parent/child element
   */
  navigateToElement: (direction: 'up' | 'down' | 'left' | 'right' | 'parent' | 'child') => void;

  /**
   * Move element in a direction
   */
  moveElement: (direction: 'up' | 'down' | 'left' | 'right') => void;

  /**
   * Bring element forward in z-order
   */
  bringForward: () => void;

  /**
   * Send element backward in z-order
   */
  sendBackward: () => void;

  /**
   * Bring element to front
   */
  bringToFront: () => void;

  /**
   * Send element to back
   */
  sendToBack: () => void;
}

// ============================================================================
// TYPING DETECTION
// ============================================================================

/**
 * Checks if the event target is an input element
 */
function isInputElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toUpperCase();
  if (tagName === 'INPUT' || tagName === 'TEXTAREA') return true;
  if (target.isContentEditable) return true;

  // Check for input elements in shadow DOM
  const role = target.getAttribute('role');
  if (role === 'textbox' || role === 'searchbox') return true;

  return false;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useKeyboardShortcuts(
  options: UseKeyboardShortcutsOptions = {}
): UseKeyboardShortcutsReturn {
  const {
    enabled = true,
    context: providedContext,
    onOpenCommandPalette,
    onOpenShortcutsModal,
    onExport,
    onPreview,
  } = options;

  // Store actions
  const {
    elements,
    selectedId,
    clipboard,
    undo,
    redo,
    copyElement,
    pasteElement,
    removeElement,
    duplicateElement,
    toggleCodePreview,
    toggleGrid,
    toggleSidebar,
    // togglePropertiesPanel is available but not used yet
    selectElement,
    setZoom,
    zoom,
    moveElement: moveElementInTree,
    clearCanvas,
    getElementById,
    getParentElement,
    saveToStorage,
  } = useBuilderStore();

  // State
  const [isTyping, setIsTyping] = useState(false);
  const shortcutManager = useMemo(() => getShortcutManager(), []);
  const commandRegistry = useMemo(() => getCommandRegistry(), []);

  // Determine current context
  const currentContext = useMemo<ShortcutContext>(() => {
    if (providedContext) return providedContext;
    if (selectedId) return 'element';
    return 'canvas';
  }, [providedContext, selectedId]);

  // =========================================================================
  // ELEMENT NAVIGATION
  // =========================================================================

  /**
   * Flattens the element tree into a list for navigation
   */
  const flattenElements = useCallback(() => {
    const result: string[] = [];

    function traverse(els: typeof elements) {
      for (const el of els) {
        result.push(el.id);
        if (el.children.length > 0) {
          traverse(el.children);
        }
      }
    }

    traverse(elements);
    return result;
  }, [elements]);

  /**
   * Navigate to a sibling, parent, or child element
   */
  const navigateToElement = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right' | 'parent' | 'child') => {
      if (!elements.length) return;

      const flatList = flattenElements();

      if (!selectedId) {
        // Select first element if nothing selected
        if (flatList.length > 0) {
          selectElement(flatList[0]);
        }
        return;
      }

      const currentIndex = flatList.indexOf(selectedId);
      if (currentIndex === -1) return;

      switch (direction) {
        case 'up':
        case 'left':
          if (currentIndex > 0) {
            selectElement(flatList[currentIndex - 1]);
          }
          break;

        case 'down':
        case 'right':
          if (currentIndex < flatList.length - 1) {
            selectElement(flatList[currentIndex + 1]);
          }
          break;

        case 'parent': {
          const parent = getParentElement(selectedId);
          if (parent) {
            selectElement(parent.id);
          } else {
            selectElement(null);
          }
          break;
        }

        case 'child': {
          const element = getElementById(selectedId);
          if (element && element.children.length > 0) {
            selectElement(element.children[0].id);
          }
          break;
        }
      }
    },
    [elements, selectedId, flattenElements, selectElement, getElementById, getParentElement]
  );

  // =========================================================================
  // ELEMENT ORDERING (Z-INDEX)
  // =========================================================================

  const bringForward = useCallback(() => {
    if (!selectedId) return;

    const parent = getParentElement(selectedId);
    const siblings = parent ? parent.children : elements;
    const index = siblings.findIndex((el) => el.id === selectedId);

    if (index < siblings.length - 1) {
      const nextId = siblings[index + 1].id;
      moveElementInTree(selectedId, nextId, 'after');
      toast.success('Brought forward', { duration: 1000 });
    }
  }, [selectedId, elements, getParentElement, moveElementInTree]);

  const sendBackward = useCallback(() => {
    if (!selectedId) return;

    const parent = getParentElement(selectedId);
    const siblings = parent ? parent.children : elements;
    const index = siblings.findIndex((el) => el.id === selectedId);

    if (index > 0) {
      const prevId = siblings[index - 1].id;
      moveElementInTree(selectedId, prevId, 'before');
      toast.success('Sent backward', { duration: 1000 });
    }
  }, [selectedId, elements, getParentElement, moveElementInTree]);

  const bringToFront = useCallback(() => {
    if (!selectedId) return;

    const parent = getParentElement(selectedId);
    const siblings = parent ? parent.children : elements;

    if (siblings.length > 1) {
      const lastId = siblings[siblings.length - 1].id;
      if (lastId !== selectedId) {
        moveElementInTree(selectedId, lastId, 'after');
        toast.success('Brought to front', { duration: 1000 });
      }
    }
  }, [selectedId, elements, getParentElement, moveElementInTree]);

  const sendToBack = useCallback(() => {
    if (!selectedId) return;

    const parent = getParentElement(selectedId);
    const siblings = parent ? parent.children : elements;

    if (siblings.length > 1) {
      const firstId = siblings[0].id;
      if (firstId !== selectedId) {
        moveElementInTree(selectedId, firstId, 'before');
        toast.success('Sent to back', { duration: 1000 });
      }
    }
  }, [selectedId, elements, getParentElement, moveElementInTree]);

  // =========================================================================
  // ELEMENT MOVEMENT (PLACEHOLDER - would need position-based layout)
  // =========================================================================

  const moveElement = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (!selectedId) return;

      // For now, reorder in tree based on direction
      // In a position-based layout, this would adjust x/y coordinates
      switch (direction) {
        case 'up':
          sendBackward();
          break;
        case 'down':
          bringForward();
          break;
        case 'left':
          sendBackward();
          break;
        case 'right':
          bringForward();
          break;
      }
    },
    [selectedId, sendBackward, bringForward]
  );

  // =========================================================================
  // ZOOM CONTROLS
  // =========================================================================

  const zoomIn = useCallback(() => {
    const newZoom = Math.min(zoom + 10, 200);
    setZoom(newZoom);
    toast.success(`Zoom: ${newZoom}%`, { duration: 1000 });
  }, [zoom, setZoom]);

  const zoomOut = useCallback(() => {
    const newZoom = Math.max(zoom - 10, 25);
    setZoom(newZoom);
    toast.success(`Zoom: ${newZoom}%`, { duration: 1000 });
  }, [zoom, setZoom]);

  const resetZoom = useCallback(() => {
    setZoom(100);
    toast.success('Zoom: 100%', { duration: 1000 });
  }, [setZoom]);

  // =========================================================================
  // CUT OPERATION
  // =========================================================================

  const cutElement = useCallback(() => {
    if (!selectedId) return;
    copyElement(selectedId);
    removeElement(selectedId);
    toast.success('Cut to clipboard', { duration: 1000 });
  }, [selectedId, copyElement, removeElement]);

  // =========================================================================
  // GROUP/UNGROUP (PLACEHOLDER)
  // =========================================================================

  const groupElements = useCallback(() => {
    if (!selectedId) return;
    // In a multi-select system, this would wrap selected elements in a container
    toast('Group functionality coming soon', { duration: 2000 });
  }, [selectedId]);

  const ungroupElements = useCallback(() => {
    if (!selectedId) return;
    // This would unwrap a container element
    toast('Ungroup functionality coming soon', { duration: 2000 });
  }, [selectedId]);

  // =========================================================================
  // SELECT ALL
  // =========================================================================

  const selectAll = useCallback(() => {
    if (elements.length > 0) {
      // For now, select first element (would need multi-select support)
      selectElement(elements[0].id);
      toast('Select All: Multi-select coming soon', { duration: 2000 });
    }
  }, [elements, selectElement]);

  // =========================================================================
  // COMMAND REGISTRATION
  // =========================================================================

  const commands = useMemo(() => {
    return createDefaultCommands({
      undo: () => {
        undo();
        toast.success('Undo', { duration: 1000 });
      },
      redo: () => {
        redo();
        toast.success('Redo', { duration: 1000 });
      },
      copy: () => {
        if (selectedId) {
          copyElement(selectedId);
          toast.success('Copied to clipboard', { duration: 1000 });
        }
      },
      paste: () => {
        pasteElement(null);
        toast.success('Pasted', { duration: 1000 });
      },
      cut: cutElement,
      duplicate: () => {
        if (selectedId) {
          duplicateElement(selectedId);
          toast.success('Duplicated', { duration: 1000 });
        }
      },
      delete: () => {
        if (selectedId) {
          removeElement(selectedId);
          toast.success('Deleted', { duration: 1000 });
        }
      },
      selectAll,
      save: () => {
        saveToStorage();
        toast.success('Saved', { duration: 1000 });
      },
      export: () => {
        if (onExport) {
          onExport();
        } else {
          toggleCodePreview();
        }
      },
      preview: () => {
        if (onPreview) {
          onPreview();
        } else {
          toggleCodePreview();
        }
      },
      toggleGrid: () => {
        toggleGrid();
        toast.success('Grid toggled', { duration: 1000 });
      },
      toggleSidebar: () => {
        toggleSidebar();
        toast.success('Sidebar toggled', { duration: 1000 });
      },
      toggleCodePreview,
      zoomIn,
      zoomOut,
      resetZoom,
      openShortcuts: () => {
        if (onOpenShortcutsModal) {
          onOpenShortcutsModal();
        }
      },
      openCommandPalette: () => {
        if (onOpenCommandPalette) {
          onOpenCommandPalette();
        }
      },
      navigateUp: () => navigateToElement('up'),
      navigateDown: () => navigateToElement('down'),
      navigateLeft: () => navigateToElement('left'),
      navigateRight: () => navigateToElement('right'),
      navigateParent: () => navigateToElement('parent'),
      navigateChild: () => navigateToElement('child'),
      bringForward,
      sendBackward,
      bringToFront,
      sendToBack,
      group: groupElements,
      ungroup: ungroupElements,
      clearCanvas: () => {
        clearCanvas();
        toast.success('Canvas cleared', { duration: 1000 });
      },
      hasSelection: () => !!selectedId,
      hasClipboard: () => !!clipboard,
    });
  }, [
    selectedId,
    clipboard,
    undo,
    redo,
    copyElement,
    pasteElement,
    cutElement,
    duplicateElement,
    removeElement,
    selectAll,
    saveToStorage,
    toggleCodePreview,
    toggleGrid,
    toggleSidebar,
    zoomIn,
    zoomOut,
    resetZoom,
    navigateToElement,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    groupElements,
    ungroupElements,
    clearCanvas,
    onOpenCommandPalette,
    onOpenShortcutsModal,
    onExport,
    onPreview,
  ]);

  // Register commands with registry
  useEffect(() => {
    commandRegistry.registerMany(commands);

    return () => {
      for (const command of commands) {
        commandRegistry.unregister(command.id);
      }
    };
  }, [commands, commandRegistry]);

  // =========================================================================
  // KEYBOARD EVENT HANDLER
  // =========================================================================

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if user is typing
      if (isInputElement(event.target)) {
        setIsTyping(true);
        return;
      }
      setIsTyping(false);

      if (!enabled) return;

      // Find matching shortcut
      const matchedShortcut = shortcutManager.findMatchingShortcut(
        event,
        currentContext
      );

      if (!matchedShortcut) return;

      // Find and execute corresponding command
      const commandId = `cmd:${matchedShortcut.id}`;
      const command = commands.find(
        (c) => c.id === commandId || c.shortcutId === matchedShortcut.id
      );

      if (command) {
        // Check if command is enabled
        if (command.enabled !== undefined) {
          const isEnabled =
            typeof command.enabled === 'function'
              ? command.enabled()
              : command.enabled;
          if (!isEnabled) return;
        }

        event.preventDefault();
        event.stopPropagation();
        command.execute();
        shortcutManager.trigger(matchedShortcut.id, event);
      }
    },
    [enabled, currentContext, shortcutManager, commands]
  );

  // =========================================================================
  // EVENT LISTENERS
  // =========================================================================

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  // Track typing state changes
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      setIsTyping(isInputElement(e.target));
    };

    const handleFocusOut = () => {
      setIsTyping(false);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return {
    commands,
    isTyping,
    currentContext,
    navigateToElement,
    moveElement,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  };
}

// ============================================================================
// SIMPLE HOOK FOR BASIC SHORTCUTS (BACKWARDS COMPATIBLE)
// ============================================================================

/**
 * Simple hook that just enables keyboard shortcuts without options
 * Maintains backwards compatibility with existing usage
 */
export function useSimpleKeyboardShortcuts(): void {
  useKeyboardShortcuts({ enabled: true });
}

export default useKeyboardShortcuts;
