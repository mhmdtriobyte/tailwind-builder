'use client';

/**
 * useContextMenu Hook
 *
 * A comprehensive hook for managing context menus in the Visual Tailwind Builder.
 * Handles menu registration, context creation, action execution, and integration
 * with the builder store.
 */

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import {
  contextMenuRegistry,
  createMenuContext,
  type ContextMenuType,
  type MenuContext,
  type MenuDefinition,
} from '@/lib/contextMenuSystem';
import {
  registerDefaultMenus,
  registerDefaultActionHandlers,
} from '@/lib/contextMenuItems';
import { componentRegistry } from '@/lib/componentRegistry';
import { defaultProps, createDefaultStyles } from '@/lib/defaultProps';
import type { BuilderElement } from '@/types/builder';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES
// ============================================================================

export interface UseContextMenuOptions {
  /** Whether to auto-register default menus on mount */
  autoRegister?: boolean;
}

export interface UseContextMenuReturn {
  /** Get the menu definition for a given type */
  getMenu: (type: ContextMenuType) => MenuDefinition | undefined;
  /** Create a context object for a given element */
  createContext: (
    type: ContextMenuType,
    targetElement?: BuilderElement | null,
    customData?: Record<string, unknown>
  ) => MenuContext;
  /** Execute an action with context */
  executeAction: (
    action: string,
    context: MenuContext,
    params?: Record<string, unknown>
  ) => Promise<void>;
  /** Register a custom menu */
  registerMenu: (menu: MenuDefinition) => void;
  /** Unregister a menu */
  unregisterMenu: (menuId: string) => void;
  /** Style clipboard state */
  hasStyleClipboard: boolean;
  /** Check if default menus are registered */
  isRegistered: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generates a unique element ID
 */
function generateId(): string {
  return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Finds an element by ID in the element tree
 */
function findElementById(elements: BuilderElement[], id: string): BuilderElement | null {
  for (const element of elements) {
    if (element.id === id) return element;
    const found = findElementById(element.children, id);
    if (found) return found;
  }
  return null;
}

/**
 * Finds the parent element of a given element
 */
function findParentElement(
  elements: BuilderElement[],
  id: string,
  parent: BuilderElement | null = null
): BuilderElement | null {
  for (const element of elements) {
    if (element.id === id) return parent;
    const found = findParentElement(element.children, id, element);
    if (found) return found;
  }
  return null;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useContextMenu(options: UseContextMenuOptions = {}): UseContextMenuReturn {
  const { autoRegister = true } = options;

  // Store references
  const store = useBuilderStore();
  const {
    elements,
    selectedId,
    clipboard,
    zoom,
    showGrid,
    selectElement,
    addElement,
    removeElement,
    updateElement,
    duplicateElement,
    copyElement,
    pasteElement,
    moveElement,
    clearCanvas,
    undo,
    redo,
    setZoom,
    toggleGrid,
    toggleCodePreview,
    getElementById,
    getParentElement,
  } = store;

  // Local state
  const [styleClipboard, setStyleClipboard] = useState<BuilderElement['styles'] | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const registrationRef = useRef(false);

  /**
   * Get the currently selected element
   */
  const selectedElement = useMemo(() => {
    return selectedId ? getElementById(selectedId) : null;
  }, [selectedId, getElementById]);

  /**
   * Register default menus and action handlers
   */
  useEffect(() => {
    if (!autoRegister || registrationRef.current) return;

    registrationRef.current = true;

    // Register menus
    registerDefaultMenus();

    // Register action handlers
    registerDefaultActionHandlers({
      // Clipboard
      cut: () => {
        if (selectedId) {
          copyElement(selectedId);
          removeElement(selectedId);
          toast.success('Element cut to clipboard');
        }
      },
      copy: () => {
        if (selectedId) {
          copyElement(selectedId);
          toast.success('Element copied to clipboard');
        }
      },
      paste: (parentId) => {
        pasteElement(parentId);
        toast.success('Element pasted');
      },
      duplicate: () => {
        if (selectedId) {
          duplicateElement(selectedId);
          toast.success('Element duplicated');
        }
      },
      delete: () => {
        if (selectedId) {
          removeElement(selectedId);
          toast.success('Element deleted');
        }
      },

      // Movement
      moveUp: () => {
        if (!selectedId) return;
        const element = getElementById(selectedId);
        if (!element) return;

        const parent = getParentElement(selectedId);
        const siblings = parent ? parent.children : elements;
        const currentIndex = siblings.findIndex((el) => el.id === selectedId);

        if (currentIndex > 0) {
          const targetId = siblings[currentIndex - 1].id;
          moveElement(selectedId, targetId, 'before');
          toast.success('Element moved up');
        }
      },
      moveDown: () => {
        if (!selectedId) return;
        const element = getElementById(selectedId);
        if (!element) return;

        const parent = getParentElement(selectedId);
        const siblings = parent ? parent.children : elements;
        const currentIndex = siblings.findIndex((el) => el.id === selectedId);

        if (currentIndex < siblings.length - 1) {
          const targetId = siblings[currentIndex + 1].id;
          moveElement(selectedId, targetId, 'after');
          toast.success('Element moved down');
        }
      },
      bringToFront: () => {
        if (!selectedId) return;
        const element = getElementById(selectedId);
        if (!element) return;

        const parent = getParentElement(selectedId);
        const siblings = parent ? parent.children : elements;

        if (siblings.length > 0) {
          const lastId = siblings[siblings.length - 1].id;
          if (lastId !== selectedId) {
            moveElement(selectedId, lastId, 'after');
            toast.success('Element brought to front');
          }
        }
      },
      sendToBack: () => {
        if (!selectedId) return;
        const element = getElementById(selectedId);
        if (!element) return;

        const parent = getParentElement(selectedId);
        const siblings = parent ? parent.children : elements;

        if (siblings.length > 0) {
          const firstId = siblings[0].id;
          if (firstId !== selectedId) {
            moveElement(selectedId, firstId, 'before');
            toast.success('Element sent to back');
          }
        }
      },

      // Structure
      wrapInContainer: (containerType: string) => {
        if (!selectedId) return;
        const element = getElementById(selectedId);
        if (!element) return;

        const parent = getParentElement(selectedId);
        const containerDef = componentRegistry[containerType];
        const containerDefaults = defaultProps[containerType] || {
          props: {},
          styles: createDefaultStyles(),
        };

        // Create container element
        const containerId = generateId();
        const containerElement: BuilderElement = {
          id: containerId,
          type: containerType,
          name: containerDef?.name || 'Container',
          props: containerDefaults.props,
          styles: containerDefaults.styles,
          children: [],
          parentId: parent?.id || null,
        };

        // Find index of current element
        const siblings = parent ? parent.children : elements;
        const currentIndex = siblings.findIndex((el) => el.id === selectedId);

        // Remove element from current position
        removeElement(selectedId);

        // Add container at the same position
        addElement(containerElement, parent?.id || null, currentIndex);

        // Move original element inside container
        const movedElement: BuilderElement = {
          ...element,
          parentId: containerId,
        };
        addElement(movedElement, containerId);

        // Select the container
        selectElement(containerId);
        toast.success(`Wrapped in ${containerDef?.name || 'container'}`);
      },
      unwrap: () => {
        if (!selectedId) return;
        const element = getElementById(selectedId);
        if (!element || element.children.length === 0) return;

        const parent = getParentElement(selectedId);
        const siblings = parent ? parent.children : elements;
        const currentIndex = siblings.findIndex((el) => el.id === selectedId);

        // Get children to unwrap
        const childrenToMove = [...element.children];

        // Remove the container
        removeElement(selectedId);

        // Add each child at the container's position
        childrenToMove.forEach((child, index) => {
          const movedChild: BuilderElement = {
            ...child,
            parentId: parent?.id || null,
          };
          addElement(movedChild, parent?.id || null, currentIndex + index);
        });

        // Select the first unwrapped child
        if (childrenToMove.length > 0) {
          selectElement(childrenToMove[0].id);
        }
        toast.success('Element unwrapped');
      },

      // Editing
      editContent: () => {
        // This would typically open an inline editor
        // For now, we'll just focus the properties panel
        toast('Use the properties panel to edit content', { icon: 'i' });
      },
      editStyles: (category: string) => {
        // This would typically scroll to or highlight the relevant style section
        toast(`Edit ${category} styles in the properties panel`, { icon: 'i' });
      },
      copyStyles: () => {
        if (!selectedId) return;
        const element = getElementById(selectedId);
        if (!element) return;

        setStyleClipboard(element.styles);
        toast.success('Styles copied');
      },
      pasteStyles: () => {
        if (!selectedId || !styleClipboard) return;

        updateElement(selectedId, { styles: styleClipboard });
        toast.success('Styles pasted');
      },

      // State
      toggleLock: () => {
        if (!selectedId) return;
        const element = getElementById(selectedId);
        if (!element) return;

        const isLocked = element.props?.locked === true;
        updateElement(selectedId, {
          props: { ...element.props, locked: !isLocked },
        });
        toast.success(isLocked ? 'Element unlocked' : 'Element locked');
      },
      toggleVisibility: () => {
        if (!selectedId) return;
        const element = getElementById(selectedId);
        if (!element) return;

        const isHidden = element.props?.hidden === true;
        updateElement(selectedId, {
          props: { ...element.props, hidden: !isHidden },
        });
        toast.success(isHidden ? 'Element visible' : 'Element hidden');
      },

      // Advanced
      addAnimation: () => {
        toast('Animation feature coming soon!', { icon: 'o' });
      },
      convertToComponent: () => {
        toast('Convert to component feature coming soon!', { icon: 'o' });
      },
      viewCode: () => {
        toggleCodePreview();
      },

      // Selection
      selectParent: () => {
        if (!selectedId) return;
        const parent = getParentElement(selectedId);
        if (parent) {
          selectElement(parent.id);
        } else {
          selectElement(null);
        }
      },
      selectChildren: () => {
        if (!selectedId) return;
        const element = getElementById(selectedId);
        if (element && element.children.length > 0) {
          selectElement(element.children[0].id);
        }
      },
      selectAll: () => {
        // Select first element (multi-select not implemented yet)
        if (elements.length > 0) {
          selectElement(elements[0].id);
          toast('Multi-select coming soon!', { icon: 'i' });
        }
      },
      deselectAll: () => {
        selectElement(null);
      },

      // Canvas
      addComponent: (type: string) => {
        const componentDef = componentRegistry[type];
        if (!componentDef) {
          toast.error(`Unknown component type: ${type}`);
          return;
        }

        const componentDefaults = defaultProps[type] || {
          props: {},
          styles: createDefaultStyles(),
        };

        const newElement: BuilderElement = {
          id: generateId(),
          type,
          name: componentDef.name,
          props: componentDefaults.props,
          styles: componentDefaults.styles,
          children: [],
          parentId: null,
        };

        addElement(newElement);
        toast.success(`Added ${componentDef.name}`);
      },
      clearCanvas: () => {
        if (elements.length === 0) return;

        // Could add confirmation dialog here
        clearCanvas();
        toast.success('Canvas cleared');
      },

      // Zoom
      zoomIn: () => {
        const newZoom = Math.min(zoom + 25, 200);
        setZoom(newZoom);
      },
      zoomOut: () => {
        const newZoom = Math.max(zoom - 25, 25);
        setZoom(newZoom);
      },
      setZoom: (newZoom: number) => {
        setZoom(newZoom);
      },
      zoomFit: () => {
        setZoom(100);
      },

      // View
      toggleGrid: () => {
        toggleGrid();
      },
      toggleRulers: () => {
        toast('Rulers feature coming soon!', { icon: 'o' });
      },
      toggleGuides: () => {
        toast('Guides feature coming soon!', { icon: 'o' });
      },

      // History
      undo: () => {
        undo();
        toast.success('Undo');
      },
      redo: () => {
        redo();
        toast.success('Redo');
      },

      // Export
      preview: () => {
        toast('Preview feature coming soon!', { icon: 'o' });
      },
      exportCode: () => {
        toggleCodePreview();
      },

      // Sidebar
      addToCanvas: (componentType: string) => {
        const componentDef = componentRegistry[componentType];
        if (!componentDef) return;

        const componentDefaults = defaultProps[componentType] || {
          props: {},
          styles: createDefaultStyles(),
        };

        const newElement: BuilderElement = {
          id: generateId(),
          type: componentType,
          name: componentDef.name,
          props: componentDefaults.props,
          styles: componentDefaults.styles,
          children: [],
          parentId: null,
        };

        addElement(newElement);
        toast.success(`Added ${componentDef.name}`);
      },
      addToFavorites: (componentType: string) => {
        toast.success('Added to favorites');
      },
      removeFromFavorites: (componentType: string) => {
        toast.success('Removed from favorites');
      },
      viewVariants: (componentType: string) => {
        toast('Variants panel coming soon!', { icon: 'o' });
      },
      viewDocumentation: (componentType: string) => {
        toast('Documentation coming soon!', { icon: 'o' });
      },
      copyAsCode: (componentType: string) => {
        const componentDef = componentRegistry[componentType];
        if (!componentDef) return;

        // Generate simple code snippet
        const code = `<${componentDef.name.replace(/\s+/g, '')} />`;
        navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard');
      },
    });

    setIsRegistered(true);
  }, [
    autoRegister,
    selectedId,
    elements,
    clipboard,
    zoom,
    showGrid,
    selectElement,
    addElement,
    removeElement,
    updateElement,
    duplicateElement,
    copyElement,
    pasteElement,
    moveElement,
    clearCanvas,
    undo,
    redo,
    setZoom,
    toggleGrid,
    toggleCodePreview,
    getElementById,
    getParentElement,
    styleClipboard,
  ]);

  /**
   * Get a menu definition by type
   */
  const getMenu = useCallback((type: ContextMenuType): MenuDefinition | undefined => {
    return contextMenuRegistry.getMenuByType(type);
  }, []);

  /**
   * Create a context object for menu rendering
   */
  const createContext = useCallback(
    (
      type: ContextMenuType,
      targetElement?: BuilderElement | null,
      customData?: Record<string, unknown>
    ): MenuContext => {
      const target = targetElement || selectedElement;
      const parent = target ? getParentElement(target.id) : null;

      return createMenuContext({
        type,
        selectedElement,
        targetElement: target,
        parentElement: parent,
        hasClipboard: clipboard !== null,
        zoom,
        showGrid,
        elementCount: elements.length,
        elements,
        customData: {
          ...customData,
          hasStyleClipboard: styleClipboard !== null,
        },
      });
    },
    [
      selectedElement,
      getParentElement,
      clipboard,
      zoom,
      showGrid,
      elements,
      styleClipboard,
    ]
  );

  /**
   * Execute an action
   */
  const executeAction = useCallback(
    async (
      action: string,
      context: MenuContext,
      params?: Record<string, unknown>
    ): Promise<void> => {
      await contextMenuRegistry.executeAction(action, context, params);
    },
    []
  );

  /**
   * Register a custom menu
   */
  const registerMenu = useCallback((menu: MenuDefinition): void => {
    contextMenuRegistry.registerMenu(menu);
  }, []);

  /**
   * Unregister a menu
   */
  const unregisterMenu = useCallback((menuId: string): void => {
    contextMenuRegistry.unregisterMenu(menuId);
  }, []);

  return {
    getMenu,
    createContext,
    executeAction,
    registerMenu,
    unregisterMenu,
    hasStyleClipboard: styleClipboard !== null,
    isRegistered,
  };
}

// ============================================================================
// SIMPLE HOOKS FOR SPECIFIC CONTEXTS
// ============================================================================

/**
 * Hook for element context menu
 */
export function useElementContextMenu() {
  const { getMenu, createContext, executeAction, hasStyleClipboard } = useContextMenu();

  const menu = useMemo(() => getMenu('element'), [getMenu]);

  const getElementContext = useCallback(
    (element: BuilderElement | null) => {
      return createContext('element', element);
    },
    [createContext]
  );

  return {
    menu,
    getContext: getElementContext,
    executeAction,
    hasStyleClipboard,
  };
}

/**
 * Hook for canvas context menu
 */
export function useCanvasContextMenu() {
  const { getMenu, createContext, executeAction } = useContextMenu();

  const menu = useMemo(() => getMenu('canvas'), [getMenu]);

  const getCanvasContext = useCallback(() => {
    return createContext('canvas');
  }, [createContext]);

  return {
    menu,
    getContext: getCanvasContext,
    executeAction,
  };
}

/**
 * Hook for sidebar context menu
 */
export function useSidebarContextMenu() {
  const { getMenu, createContext, executeAction } = useContextMenu();

  const menu = useMemo(() => getMenu('sidebar'), [getMenu]);

  const getSidebarContext = useCallback(
    (componentType: string, isFavorite: boolean = false) => {
      return createContext('sidebar', null, {
        componentType,
        isFavorite,
      });
    },
    [createContext]
  );

  return {
    menu,
    getContext: getSidebarContext,
    executeAction,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default useContextMenu;
