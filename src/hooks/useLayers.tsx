/**
 * useLayers Hook
 *
 * Provides comprehensive layer management operations for the visual builder.
 * Handles layer visibility, locking, reordering, renaming, and color labels.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import {
  buildLayerTree,
  flattenLayerTree,
  filterLayers,
  toggleLayerVisibility,
  toggleLayerLock,
  toggleLayerExpanded,
  expandAllLayers,
  collapseAllLayers,
  setLayerColor,
  setLayerName,
  isLayerVisible,
  isLayerLocked,
  getLayerState,
  cleanupLayerStates,
  selectMultipleLayers,
  type LayerColor,
  type LayerStatesMap,
  type LayerTree,
  type LayerNode,
  type LayerSearchOptions,
} from '@/lib/layerSystem';

// ============================================================================
// TYPES
// ============================================================================

export interface UseLayersReturn {
  // Layer tree data
  layerTree: LayerTree;
  flattenedLayers: LayerNode[];
  filteredLayers: LayerNode[];

  // Selection state
  selectedLayerIds: string[];
  hoveredLayerId: string | null;

  // Search/filter state
  searchQuery: string;
  colorFilter: LayerColor | 'all';
  visibleOnly: boolean;
  lockedOnly: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setColorFilter: (color: LayerColor | 'all') => void;
  setVisibleOnly: (visible: boolean) => void;
  setLockedOnly: (locked: boolean) => void;
  clearFilters: () => void;

  // Layer operations
  toggleVisibility: (elementId: string, includeDescendants?: boolean) => void;
  toggleLock: (elementId: string, includeDescendants?: boolean) => void;
  toggleExpanded: (elementId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setColor: (elementId: string, color: LayerColor) => void;
  renameLayer: (elementId: string, name: string) => void;

  // Selection operations
  selectLayer: (elementId: string, shiftKey?: boolean, ctrlKey?: boolean) => void;
  selectMultiple: (elementIds: string[]) => void;
  clearSelection: () => void;
  setHoveredLayer: (elementId: string | null) => void;

  // Reorder operations
  moveLayer: (sourceId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;

  // Bulk operations
  hideSelectedLayers: () => void;
  showSelectedLayers: () => void;
  lockSelectedLayers: () => void;
  unlockSelectedLayers: () => void;
  deleteSelectedLayers: () => void;

  // Utility functions
  isVisible: (elementId: string) => boolean;
  isLocked: (elementId: string) => boolean;
  isExpanded: (elementId: string) => boolean;
  getLayerColor: (elementId: string) => LayerColor;
  getLayerName: (elementId: string) => string | null;

  // Layer states (for persistence)
  layerStates: LayerStatesMap;
}

// ============================================================================
// LOCAL STORAGE
// ============================================================================

const LAYER_STATES_KEY = 'tailwind-builder-layer-states';

function loadLayerStates(): LayerStatesMap {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(LAYER_STATES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveLayerStates(states: LayerStatesMap): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(LAYER_STATES_KEY, JSON.stringify(states));
  } catch (error) {
    console.error('Failed to save layer states:', error);
  }
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useLayers(): UseLayersReturn {
  // Get builder store state and actions
  const {
    elements,
    selectedId,
    hoveredId,
    selectElement,
    setHoveredElement,
    moveElement,
    removeElement,
  } = useBuilderStore();

  // Local state for layer-specific data
  const [layerStates, setLayerStates] = useState<LayerStatesMap>(loadLayerStates);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [colorFilter, setColorFilter] = useState<LayerColor | 'all'>('all');
  const [visibleOnly, setVisibleOnly] = useState(false);
  const [lockedOnly, setLockedOnly] = useState(false);

  // Build layer tree from elements
  const layerTree = useMemo(
    () => buildLayerTree(elements, layerStates),
    [elements, layerStates]
  );

  // Get expanded IDs for flattening
  const expandedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const [id, state] of Object.entries(layerStates)) {
      if (state.expanded) {
        ids.add(id);
      }
    }
    // By default, all containers are expanded
    for (const id of layerTree.flatIds) {
      if (!layerStates[id]) {
        ids.add(id);
      }
    }
    return ids;
  }, [layerStates, layerTree.flatIds]);

  // Flatten layer tree for rendering
  const flattenedLayers = useMemo(
    () => flattenLayerTree(layerTree.nodes, expandedIds),
    [layerTree.nodes, expandedIds]
  );

  // Filter layers based on search/filter options
  const filteredLayers = useMemo(() => {
    if (!searchQuery && colorFilter === 'all' && !visibleOnly && !lockedOnly) {
      return flattenedLayers;
    }

    const searchOptions: LayerSearchOptions = {
      query: searchQuery,
      colorFilter,
      visibleOnly,
      lockedOnly,
    };

    const filteredNodes = filterLayers(layerTree.nodes, searchOptions);
    return flattenLayerTree(filteredNodes, expandedIds);
  }, [flattenedLayers, layerTree.nodes, searchQuery, colorFilter, visibleOnly, lockedOnly, expandedIds]);

  // Sync selected layer IDs with builder store selection
  useEffect(() => {
    if (selectedId && !selectedLayerIds.includes(selectedId)) {
      setSelectedLayerIds([selectedId]);
    }
  }, [selectedId, selectedLayerIds]);

  // Clean up layer states for removed elements
  useEffect(() => {
    const validIds = new Set(layerTree.flatIds);
    const cleaned = cleanupLayerStates(layerStates, validIds);

    if (Object.keys(cleaned).length !== Object.keys(layerStates).length) {
      setLayerStates(cleaned);
    }
  }, [layerTree.flatIds, layerStates]);

  // Persist layer states
  useEffect(() => {
    saveLayerStates(layerStates);
  }, [layerStates]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setColorFilter('all');
    setVisibleOnly(false);
    setLockedOnly(false);
  }, []);

  // Layer operations
  const toggleVisibility = useCallback(
    (elementId: string, includeDescendants: boolean = false) => {
      setLayerStates((prev) =>
        toggleLayerVisibility(prev, elementId, undefined, includeDescendants, layerTree)
      );
    },
    [layerTree]
  );

  const toggleLock = useCallback(
    (elementId: string, includeDescendants: boolean = false) => {
      setLayerStates((prev) =>
        toggleLayerLock(prev, elementId, undefined, includeDescendants, layerTree)
      );
    },
    [layerTree]
  );

  const toggleExpanded = useCallback((elementId: string) => {
    setLayerStates((prev) => toggleLayerExpanded(prev, elementId));
  }, []);

  const expandAll = useCallback(() => {
    setLayerStates((prev) => expandAllLayers(prev, layerTree));
  }, [layerTree]);

  const collapseAll = useCallback(() => {
    setLayerStates((prev) => collapseAllLayers(prev, layerTree));
  }, [layerTree]);

  const setColor = useCallback((elementId: string, color: LayerColor) => {
    setLayerStates((prev) => setLayerColor(prev, elementId, color));
  }, []);

  const renameLayer = useCallback((elementId: string, name: string) => {
    const trimmedName = name.trim();
    setLayerStates((prev) =>
      setLayerName(prev, elementId, trimmedName || null)
    );
  }, []);

  // Selection operations
  const selectLayer = useCallback(
    (elementId: string, shiftKey: boolean = false, ctrlKey: boolean = false) => {
      // Check if layer is locked
      const locked = isLayerLocked(layerStates, elementId, layerTree);
      if (locked) {
        return; // Don't allow selecting locked layers
      }

      const newSelection = selectMultipleLayers(
        selectedLayerIds,
        elementId,
        shiftKey,
        ctrlKey,
        flattenedLayers
      );

      setSelectedLayerIds(newSelection);

      // Update builder store selection (single selection mode)
      if (newSelection.length === 1) {
        selectElement(newSelection[0]);
      } else if (newSelection.length > 1) {
        // For multi-select, select the last clicked element
        selectElement(elementId);
      }
    },
    [selectedLayerIds, flattenedLayers, selectElement, layerStates, layerTree]
  );

  const selectMultiple = useCallback(
    (elementIds: string[]) => {
      // Filter out locked layers
      const selectableIds = elementIds.filter(
        (id) => !isLayerLocked(layerStates, id, layerTree)
      );
      setSelectedLayerIds(selectableIds);

      if (selectableIds.length === 1) {
        selectElement(selectableIds[0]);
      }
    },
    [selectElement, layerStates, layerTree]
  );

  const clearSelection = useCallback(() => {
    setSelectedLayerIds([]);
    selectElement(null);
  }, [selectElement]);

  const setHoveredLayer = useCallback(
    (elementId: string | null) => {
      setHoveredElement(elementId);
    },
    [setHoveredElement]
  );

  // Reorder operations
  const reorderLayer = useCallback(
    (sourceId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
      moveElement(sourceId, targetId, position);
    },
    [moveElement]
  );

  // Bulk operations
  const hideSelectedLayers = useCallback(() => {
    setLayerStates((prev) => {
      let updated = prev;
      for (const id of selectedLayerIds) {
        updated = toggleLayerVisibility(updated, id, false);
      }
      return updated;
    });
  }, [selectedLayerIds]);

  const showSelectedLayers = useCallback(() => {
    setLayerStates((prev) => {
      let updated = prev;
      for (const id of selectedLayerIds) {
        updated = toggleLayerVisibility(updated, id, true);
      }
      return updated;
    });
  }, [selectedLayerIds]);

  const lockSelectedLayers = useCallback(() => {
    setLayerStates((prev) => {
      let updated = prev;
      for (const id of selectedLayerIds) {
        updated = toggleLayerLock(updated, id, true);
      }
      return updated;
    });
  }, [selectedLayerIds]);

  const unlockSelectedLayers = useCallback(() => {
    setLayerStates((prev) => {
      let updated = prev;
      for (const id of selectedLayerIds) {
        updated = toggleLayerLock(updated, id, false);
      }
      return updated;
    });
  }, [selectedLayerIds]);

  const deleteSelectedLayers = useCallback(() => {
    // Delete in reverse order to avoid index issues
    const idsToDelete = [...selectedLayerIds].reverse();
    for (const id of idsToDelete) {
      removeElement(id);
    }
    setSelectedLayerIds([]);
  }, [selectedLayerIds, removeElement]);

  // Utility functions
  const isVisible = useCallback(
    (elementId: string) => isLayerVisible(layerStates, elementId, layerTree),
    [layerStates, layerTree]
  );

  const isLocked = useCallback(
    (elementId: string) => isLayerLocked(layerStates, elementId, layerTree),
    [layerStates, layerTree]
  );

  const isExpanded = useCallback(
    (elementId: string) => {
      const state = getLayerState(layerStates, elementId);
      return state.expanded;
    },
    [layerStates]
  );

  const getLayerColorFn = useCallback(
    (elementId: string): LayerColor => {
      const state = getLayerState(layerStates, elementId);
      return state.color;
    },
    [layerStates]
  );

  const getLayerNameFn = useCallback(
    (elementId: string): string | null => {
      const state = getLayerState(layerStates, elementId);
      return state.customName;
    },
    [layerStates]
  );

  return {
    // Layer tree data
    layerTree,
    flattenedLayers,
    filteredLayers,

    // Selection state
    selectedLayerIds,
    hoveredLayerId: hoveredId,

    // Search/filter state
    searchQuery,
    colorFilter,
    visibleOnly,
    lockedOnly,

    // Actions
    setSearchQuery,
    setColorFilter,
    setVisibleOnly,
    setLockedOnly,
    clearFilters,

    // Layer operations
    toggleVisibility,
    toggleLock,
    toggleExpanded,
    expandAll,
    collapseAll,
    setColor,
    renameLayer,

    // Selection operations
    selectLayer,
    selectMultiple,
    clearSelection,
    setHoveredLayer,

    // Reorder operations
    moveLayer: reorderLayer,

    // Bulk operations
    hideSelectedLayers,
    showSelectedLayers,
    lockSelectedLayers,
    unlockSelectedLayers,
    deleteSelectedLayers,

    // Utility functions
    isVisible,
    isLocked,
    isExpanded,
    getLayerColor: getLayerColorFn,
    getLayerName: getLayerNameFn,

    // Layer states
    layerStates,
  };
}

// ============================================================================
// CONTEXT (for sharing layer state across components)
// ============================================================================

import { createContext, useContext, type ReactNode } from 'react';

const LayersContext = createContext<UseLayersReturn | null>(null);

export function LayersProvider({ children }: { children: ReactNode }) {
  const layers = useLayers();

  return (
    <LayersContext.Provider value={layers}>{children}</LayersContext.Provider>
  );
}

export function useLayersContext(): UseLayersReturn {
  const context = useContext(LayersContext);
  if (!context) {
    throw new Error('useLayersContext must be used within a LayersProvider');
  }
  return context;
}
