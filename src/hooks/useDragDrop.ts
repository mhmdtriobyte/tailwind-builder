'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  Over,
  UniqueIdentifier,
  Active,
} from '@dnd-kit/core';
import { useBuilderStore } from '@/store/builderStore';
import { getDefaultProps } from '@/lib/defaultProps';
import type { BuilderElement, ComponentDefinition, DropIndicator } from '@/types/builder';

interface DragDropState {
  activeId: UniqueIdentifier | null;
  overId: UniqueIdentifier | null;
  activeType: 'new-component' | 'existing-element' | null;
  activeElement: BuilderElement | null;
  dropIndicator: DropIndicator | null;
}

interface UseDragDropReturn {
  // State
  activeId: UniqueIdentifier | null;
  overId: UniqueIdentifier | null;
  activeElement: BuilderElement | null;
  activeComponent: ComponentDefinition | null;
  isDragging: boolean;
  isNewElement: boolean;
  dropIndicator: DropIndicator | null;

  // Event handlers
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
}

function generateId(): string {
  return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Checks if targetId is a descendant of the given element
 */
function isDescendant(element: BuilderElement, targetId: string): boolean {
  for (const child of element.children) {
    if (child.id === targetId) return true;
    if (isDescendant(child, targetId)) return true;
  }
  return false;
}

/**
 * Container element types that can accept children
 */
const CONTAINER_TYPES = [
  'container',
  'grid-2-col',
  'grid-3-col',
  'grid-4-col',
  'flex-row',
  'flex-column',
  'button-group',
];

/**
 * Custom hook for managing drag and drop logic in the builder
 * Integrates with the builder store and handles both new components
 * from the sidebar and reordering existing elements on the canvas
 */
export function useDragDrop(): UseDragDropReturn {
  const {
    elements,
    addElement,
    moveElement,
    getElementById,
  } = useBuilderStore();

  const [state, setState] = useState<DragDropState>({
    activeId: null,
    overId: null,
    activeType: null,
    activeElement: null,
    dropIndicator: null,
  });

  /**
   * Determines the drop position relative to the target element
   * based on cursor position within the element
   */
  const calculateDropPosition = useCallback(
    (over: Over): 'before' | 'after' | 'inside' => {
      const overData = over.data.current;
      const overId = String(over.id).replace('drop-', '');

      // If dropping on canvas root, always add inside (at the end)
      if (over.id === 'canvas-root') {
        return 'inside';
      }

      // If the target is explicitly marked as a container that accepts children
      if (overData?.type === 'container' && overData?.acceptsChildren) {
        return 'inside';
      }

      // Check if the target element type is a container
      const targetElement = getElementById(overId);
      if (targetElement && CONTAINER_TYPES.includes(targetElement.type)) {
        return 'inside';
      }

      // Default to 'after' for non-container elements
      return 'after';
    },
    [getElementById]
  );

  /**
   * Handles the start of a drag operation
   * Sets up the active dragging state
   */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (!activeData) return;

    let activeElement: BuilderElement | null = null;
    let activeType: 'new-component' | 'existing-element' | null = null;

    if (activeData.type === 'new-component') {
      // Creating new element from component palette
      const component = activeData.component as ComponentDefinition;
      const defaultConfig = getDefaultProps(activeData.componentType);

      activeElement = {
        id: generateId(),
        type: activeData.componentType,
        name: component.name,
        props: { ...component.defaultProps, ...defaultConfig.props },
        styles: defaultConfig.styles,
        children: component.defaultChildren || [],
        parentId: null,
      };
      activeType = 'new-component';
    } else if (activeData.type === 'existing-element') {
      activeElement = activeData.element as BuilderElement;
      activeType = 'existing-element';
    } else {
      // Legacy support: handle old data format
      const isNew = activeData.isNew === true;
      if (isNew && activeData.type) {
        const defaultConfig = getDefaultProps(activeData.type);
        activeElement = {
          id: generateId(),
          type: activeData.type,
          name: activeData.name || activeData.type,
          props: defaultConfig.props,
          styles: defaultConfig.styles,
          children: [],
          parentId: null,
        };
        activeType = 'new-component';
      } else {
        activeElement = getElementById(String(active.id));
        activeType = 'existing-element';
      }
    }

    setState({
      activeId: active.id,
      overId: null,
      activeType,
      activeElement,
      dropIndicator: null,
    });
  }, [getElementById]);

  /**
   * Handles the drag over event
   * Updates the current target and drop indicator
   */
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;

    if (!over) {
      setState((prev) => ({
        ...prev,
        overId: null,
        dropIndicator: null,
      }));
      return;
    }

    // Prevent dropping on itself or its children (for existing elements)
    if (state.activeType === 'existing-element' && state.activeElement) {
      const overId = String(over.id).replace('drop-', '');

      // Check if trying to drop on itself
      if (overId === state.activeElement.id) {
        setState((prev) => ({
          ...prev,
          overId: null,
          dropIndicator: null,
        }));
        return;
      }

      // Check if trying to drop on a descendant
      if (isDescendant(state.activeElement, overId)) {
        setState((prev) => ({
          ...prev,
          overId: null,
          dropIndicator: null,
        }));
        return;
      }
    }

    const position = calculateDropPosition(over);
    const targetId = String(over.id).replace('drop-', '');

    setState((prev) => ({
      ...prev,
      overId: over.id,
      dropIndicator: {
        id: targetId,
        position,
      },
    }));
  }, [state.activeType, state.activeElement, calculateDropPosition]);

  /**
   * Handles the end of a drag operation
   * Either adds a new element or moves an existing one
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { over } = event;

    // Capture the element before resetting state
    const currentActiveElement = state.activeElement;
    const currentDropIndicator = state.dropIndicator;
    const currentActiveType = state.activeType;

    // Reset state first
    setState({
      activeId: null,
      overId: null,
      activeType: null,
      activeElement: null,
      dropIndicator: null,
    });

    // No valid drop target or no active element
    if (!over || !currentActiveElement) return;

    const overId = String(over.id).replace('drop-', '');
    const position = currentDropIndicator?.position || 'after';

    // Handle new component from sidebar
    if (currentActiveType === 'new-component') {
      if (over.id === 'canvas-root') {
        // Add to root level at the end
        addElement(currentActiveElement, null);
      } else {
        const targetElement = getElementById(overId);

        if (targetElement) {
          if (position === 'inside' && CONTAINER_TYPES.includes(targetElement.type)) {
            // Add as child of container
            addElement(currentActiveElement, targetElement.id);
          } else {
            // Add as sibling (after the target element)
            const parentId = targetElement.parentId;
            const siblings = parentId
              ? getElementById(parentId)?.children || []
              : elements;
            const targetIndex = siblings.findIndex((el) => el.id === targetElement.id);

            addElement(currentActiveElement, parentId, targetIndex + 1);
          }
        } else {
          // Fallback: add to root
          addElement(currentActiveElement, null);
        }
      }
    }
    // Handle existing element being moved
    else if (currentActiveType === 'existing-element') {
      const activeId = currentActiveElement.id;

      // Prevent dropping on itself
      if (activeId === overId) return;

      if (over.id === 'canvas-root') {
        // Move to root level at the end
        if (elements.length > 0) {
          const lastElementId = elements[elements.length - 1]?.id;
          if (lastElementId && lastElementId !== activeId) {
            moveElement(activeId, lastElementId, 'after');
          }
        }
      } else {
        moveElement(activeId, overId, position);
      }
    }
  }, [state.activeElement, state.dropIndicator, state.activeType, addElement, moveElement, getElementById, elements]);

  /**
   * Handles cancellation of drag operation
   */
  const handleDragCancel = useCallback(() => {
    setState({
      activeId: null,
      overId: null,
      activeType: null,
      activeElement: null,
      dropIndicator: null,
    });
  }, []);

  // Memoized derived state
  const activeComponent = useMemo(() => {
    if (!state.activeId || state.activeType !== 'new-component') return null;
    return null; // Component data is stored in activeElement for new components
  }, [state.activeId, state.activeType]);

  return {
    activeId: state.activeId,
    overId: state.overId,
    activeElement: state.activeElement,
    activeComponent,
    isDragging: state.activeId !== null,
    isNewElement: state.activeType === 'new-component',
    dropIndicator: state.dropIndicator,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}

/**
 * Helper hook for creating a drag overlay
 * Returns the element or component being dragged for rendering in DragOverlay
 */
export function useDragOverlayContent(active: Active | null) {
  const { getElementById } = useBuilderStore();

  return useMemo(() => {
    if (!active) return null;

    const data = active.data.current;

    if (data?.type === 'new-component') {
      return {
        type: 'new-component' as const,
        component: data.component as ComponentDefinition,
        componentType: data.componentType as string,
      };
    }

    if (data?.type === 'existing-element') {
      return {
        type: 'existing-element' as const,
        element: data.element as BuilderElement,
      };
    }

    // Legacy support
    if (data?.isNew && data?.type) {
      return {
        type: 'new-component' as const,
        componentType: data.type as string,
        component: null,
      };
    }

    // Existing element by ID
    const element = getElementById(String(active.id));
    if (element) {
      return {
        type: 'existing-element' as const,
        element,
      };
    }

    return null;
  }, [active, getElementById]);
}

export default useDragDrop;
