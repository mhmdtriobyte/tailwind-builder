import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BuilderElement, BuilderState, ElementStyles, HistoryState } from '@/types/builder';

const STORAGE_KEY = 'tailwind-builder-state';
const MAX_HISTORY = 50;

function generateId(): string {
  return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createDefaultStyles(): ElementStyles {
  return {
    layout: [],
    spacing: [],
    typography: [],
    colors: [],
    borders: [],
    effects: [],
    responsive: { sm: [], md: [], lg: [] },
  };
}

function findElementById(elements: BuilderElement[], id: string): BuilderElement | null {
  for (const element of elements) {
    if (element.id === id) return element;
    const found = findElementById(element.children, id);
    if (found) return found;
  }
  return null;
}

function findParentElement(elements: BuilderElement[], id: string, parent: BuilderElement | null = null): BuilderElement | null {
  for (const element of elements) {
    if (element.id === id) return parent;
    const found = findParentElement(element.children, id, element);
    if (found) return found;
  }
  return null;
}

function removeElementById(elements: BuilderElement[], id: string): BuilderElement[] {
  return elements
    .filter((el) => el.id !== id)
    .map((el) => ({
      ...el,
      children: removeElementById(el.children, id),
    }));
}

function updateElementById(
  elements: BuilderElement[],
  id: string,
  updates: Partial<BuilderElement>
): BuilderElement[] {
  return elements.map((el) => {
    if (el.id === id) {
      return { ...el, ...updates };
    }
    return {
      ...el,
      children: updateElementById(el.children, id, updates),
    };
  });
}

function addElementToParent(
  elements: BuilderElement[],
  element: BuilderElement,
  parentId: string | null,
  index?: number
): BuilderElement[] {
  if (!parentId) {
    if (typeof index === 'number') {
      const newElements = [...elements];
      newElements.splice(index, 0, element);
      return newElements;
    }
    return [...elements, element];
  }

  return elements.map((el) => {
    if (el.id === parentId) {
      const children = [...el.children];
      if (typeof index === 'number') {
        children.splice(index, 0, element);
      } else {
        children.push(element);
      }
      return { ...el, children };
    }
    return {
      ...el,
      children: addElementToParent(el.children, element, parentId, index),
    };
  });
}

function deepCloneElement(element: BuilderElement): BuilderElement {
  const newId = generateId();
  return {
    ...element,
    id: newId,
    children: element.children.map(deepCloneElement),
    parentId: null,
  };
}

function moveElementInTree(
  elements: BuilderElement[],
  activeId: string,
  overId: string,
  position: 'before' | 'after' | 'inside'
): BuilderElement[] {
  const elementToMove = findElementById(elements, activeId);
  if (!elementToMove) return elements;

  // Remove element from current position
  let newElements = removeElementById(elements, activeId);

  // Find target element
  const targetElement = findElementById(newElements, overId);
  if (!targetElement) return elements;

  if (position === 'inside') {
    // Add as child of target
    newElements = updateElementById(newElements, overId, {
      children: [...targetElement.children, { ...elementToMove, parentId: overId }],
    });
  } else {
    // Find parent of target and insert before/after
    const parentElement = findParentElement(newElements, overId, null);
    const siblings = parentElement ? parentElement.children : newElements;
    const targetIndex = siblings.findIndex((el) => el.id === overId);
    const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex;

    if (parentElement) {
      const newChildren = [...parentElement.children];
      newChildren.splice(insertIndex, 0, { ...elementToMove, parentId: parentElement.id });
      newElements = updateElementById(newElements, parentElement.id, { children: newChildren });
    } else {
      newElements.splice(insertIndex, 0, { ...elementToMove, parentId: null });
    }
  }

  return newElements;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      // Initial state
      elements: [],
      selectedId: null,
      hoveredId: null,
      viewport: 'desktop',
      zoom: 100,
      showGrid: true,
      showCodePreview: false,
      history: [],
      historyIndex: -1,
      clipboard: null,
      sidebarCollapsed: false,
      propertiesPanelCollapsed: false,

      // Element actions
      addElement: (element, parentId = null, index) => {
        const newElement: BuilderElement = {
          ...element,
          id: element.id || generateId(),
          parentId,
          styles: element.styles || createDefaultStyles(),
          children: element.children || [],
        };

        set((state) => {
          const newElements = addElementToParent(state.elements, newElement, parentId, index);
          return { elements: newElements, selectedId: newElement.id };
        });
        get().saveToHistory();
      },

      removeElement: (id) => {
        set((state) => ({
          elements: removeElementById(state.elements, id),
          selectedId: state.selectedId === id ? null : state.selectedId,
        }));
        get().saveToHistory();
      },

      updateElement: (id, updates) => {
        set((state) => ({
          elements: updateElementById(state.elements, id, updates),
        }));
        get().saveToHistory();
      },

      updateElementStyles: (id, category, classes) => {
        const element = get().getElementById(id);
        if (!element) return;

        const newStyles = {
          ...element.styles,
          [category]: classes,
        };

        set((state) => ({
          elements: updateElementById(state.elements, id, { styles: newStyles }),
        }));
        get().saveToHistory();
      },

      selectElement: (id) => set({ selectedId: id }),

      setHoveredElement: (id) => set({ hoveredId: id }),

      moveElement: (activeId, overId, position) => {
        if (activeId === overId) return;

        set((state) => ({
          elements: moveElementInTree(state.elements, activeId, overId, position),
        }));
        get().saveToHistory();
      },

      duplicateElement: (id) => {
        const element = get().getElementById(id);
        if (!element) return;

        const clone = deepCloneElement(element);
        const parent = get().getParentElement(id);

        set((state) => {
          const parentId = parent?.id || null;
          const siblings = parent ? parent.children : state.elements;
          const index = siblings.findIndex((el) => el.id === id);
          const newElements = addElementToParent(state.elements, { ...clone, parentId }, parentId, index + 1);
          return { elements: newElements, selectedId: clone.id };
        });
        get().saveToHistory();
      },

      // Viewport actions
      setViewport: (viewport) => set({ viewport }),
      setZoom: (zoom) => set({ zoom }),
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleCodePreview: () => set((state) => ({ showCodePreview: !state.showCodePreview })),

      // History actions
      saveToHistory: () => {
        set((state) => {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          const historyEntry: HistoryState = {
            elements: JSON.parse(JSON.stringify(state.elements)),
            timestamp: Date.now(),
          };
          newHistory.push(historyEntry);

          // Limit history size
          if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
          }

          return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      undo: () => {
        set((state) => {
          if (state.historyIndex <= 0) return state;
          const newIndex = state.historyIndex - 1;
          const historyEntry = state.history[newIndex];
          return {
            elements: JSON.parse(JSON.stringify(historyEntry.elements)),
            historyIndex: newIndex,
            selectedId: null,
          };
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state;
          const newIndex = state.historyIndex + 1;
          const historyEntry = state.history[newIndex];
          return {
            elements: JSON.parse(JSON.stringify(historyEntry.elements)),
            historyIndex: newIndex,
            selectedId: null,
          };
        });
      },

      // Clipboard actions
      copyElement: (id) => {
        const element = get().getElementById(id);
        if (element) {
          set({ clipboard: deepCloneElement(element) });
        }
      },

      pasteElement: (parentId = null) => {
        const { clipboard } = get();
        if (!clipboard) return;

        const clone = deepCloneElement(clipboard);
        get().addElement({ ...clone, parentId }, parentId);
      },

      // Canvas actions
      clearCanvas: () => {
        set({ elements: [], selectedId: null, hoveredId: null });
        get().saveToHistory();
      },

      saveToStorage: () => {
        const { elements } = get();
        localStorage.setItem(STORAGE_KEY + '-elements', JSON.stringify(elements));
      },

      loadFromStorage: () => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY + '-elements');
          if (stored) {
            const elements = JSON.parse(stored);
            set({ elements, selectedId: null });
            get().saveToHistory();
          }
        } catch (e) {
          console.error('Failed to load from storage:', e);
        }
      },

      // Sidebar actions
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      togglePropertiesPanel: () =>
        set((state) => ({ propertiesPanelCollapsed: !state.propertiesPanelCollapsed })),

      // Helpers
      getElementById: (id) => findElementById(get().elements, id),
      getParentElement: (id) => findParentElement(get().elements, id, null),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        elements: state.elements,
        showGrid: state.showGrid,
        zoom: state.zoom,
      }),
    }
  )
);
