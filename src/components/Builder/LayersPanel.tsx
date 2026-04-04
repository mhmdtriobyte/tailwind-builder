'use client';

/**
 * LayersPanel Component
 *
 * A comprehensive layers panel similar to Photoshop/Figma.
 * Features:
 * - Tree view of all elements
 * - Drag to reorder
 * - Drag to change parent
 * - Visibility toggle (eye)
 * - Lock toggle (lock)
 * - Expand/collapse groups
 * - Right-click context menu
 * - Double-click to rename
 * - Color labels
 * - Search/filter layers
 * - Selection sync with canvas
 */

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Search,
  X,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronRight,
  Trash2,
  Copy,
  Palette,
  ChevronsDown,
  ChevronsUp,
  Filter,
  Layers,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useLayers, LayersProvider } from '@/hooks/useLayers';
import { LayerItem } from './LayerItem';
import type { LayerNode, LayerColor } from '@/lib/layerSystem';
import { useBuilderStore } from '@/store/builderStore';

// ============================================================================
// TYPES
// ============================================================================

interface ContextMenuState {
  x: number;
  y: number;
  elementId: string;
  isOpen: boolean;
}

// ============================================================================
// CONTEXT MENU
// ============================================================================

interface LayerContextMenuProps {
  state: ContextMenuState;
  onClose: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSetColor: (color: LayerColor) => void;
  isVisible: boolean;
  isLocked: boolean;
  currentColor: LayerColor;
}

function LayerContextMenu({
  state,
  onClose,
  onToggleVisibility,
  onToggleLock,
  onRename,
  onDuplicate,
  onDelete,
  onSetColor,
  isVisible,
  isLocked,
  currentColor,
}: LayerContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (state.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [state.isOpen, onClose]);

  // Close on escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    if (state.isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [state.isOpen, onClose]);

  if (!state.isOpen) return null;

  const colors: LayerColor[] = ['none', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

  const colorClasses: Record<LayerColor, string> = {
    none: 'bg-gray-600',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  };

  return (
    <div
      ref={menuRef}
      className={cn(
        'fixed z-50 min-w-[180px] py-1',
        'bg-gray-800 border border-gray-700 rounded-lg shadow-xl',
        'animate-fade-in'
      )}
      style={{
        left: state.x,
        top: state.y,
      }}
    >
      {/* Visibility */}
      <button
        onClick={() => {
          onToggleVisibility();
          onClose();
        }}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-1.5 text-sm',
          'text-gray-300 hover:bg-gray-700 hover:text-white',
          'transition-colors duration-100'
        )}
      >
        {isVisible ? (
          <>
            <EyeOff className="w-4 h-4" />
            <span>Hide Layer</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            <span>Show Layer</span>
          </>
        )}
      </button>

      {/* Lock */}
      <button
        onClick={() => {
          onToggleLock();
          onClose();
        }}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-1.5 text-sm',
          'text-gray-300 hover:bg-gray-700 hover:text-white',
          'transition-colors duration-100'
        )}
      >
        {isLocked ? (
          <>
            <Unlock className="w-4 h-4" />
            <span>Unlock Layer</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Lock Layer</span>
          </>
        )}
      </button>

      <div className="h-px bg-gray-700 my-1" />

      {/* Rename */}
      <button
        onClick={() => {
          onRename();
          onClose();
        }}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-1.5 text-sm',
          'text-gray-300 hover:bg-gray-700 hover:text-white',
          'transition-colors duration-100'
        )}
      >
        <span className="w-4 h-4 flex items-center justify-center font-medium">A</span>
        <span>Rename</span>
      </button>

      {/* Color label */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-1.5 text-sm',
            'text-gray-300 hover:bg-gray-700 hover:text-white',
            'transition-colors duration-100'
          )}
        >
          <Palette className="w-4 h-4" />
          <span>Color Label</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>

        {/* Color picker submenu */}
        {showColorPicker && (
          <div
            className={cn(
              'absolute left-full top-0 ml-1 py-2 px-2',
              'bg-gray-800 border border-gray-700 rounded-lg shadow-xl',
              'flex gap-1.5'
            )}
          >
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onSetColor(color);
                  onClose();
                }}
                className={cn(
                  'w-5 h-5 rounded-full',
                  colorClasses[color],
                  'hover:ring-2 hover:ring-white/50',
                  'transition-all duration-100',
                  currentColor === color && 'ring-2 ring-white'
                )}
                title={color === 'none' ? 'No color' : color}
              />
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-gray-700 my-1" />

      {/* Duplicate */}
      <button
        onClick={() => {
          onDuplicate();
          onClose();
        }}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-1.5 text-sm',
          'text-gray-300 hover:bg-gray-700 hover:text-white',
          'transition-colors duration-100'
        )}
      >
        <Copy className="w-4 h-4" />
        <span>Duplicate</span>
      </button>

      {/* Delete */}
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-1.5 text-sm',
          'text-red-400 hover:bg-red-600/20 hover:text-red-300',
          'transition-colors duration-100'
        )}
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
      </button>
    </div>
  );
}

// ============================================================================
// SEARCH INPUT
// ============================================================================

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchInput({ value, onChange, placeholder = 'Search layers...' }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-8 pr-7 py-1.5 text-xs',
          'bg-gray-800/50 border border-gray-700/50 rounded',
          'text-gray-200 placeholder:text-gray-500',
          'focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50',
          'transition-all duration-150'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={cn(
            'absolute right-1.5 top-1/2 -translate-y-1/2',
            'p-0.5 rounded hover:bg-gray-700',
            'text-gray-500 hover:text-gray-300',
            'transition-colors duration-100'
          )}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// FILTER DROPDOWN
// ============================================================================

interface FilterDropdownProps {
  colorFilter: LayerColor | 'all';
  visibleOnly: boolean;
  lockedOnly: boolean;
  onColorFilterChange: (color: LayerColor | 'all') => void;
  onVisibleOnlyChange: (visible: boolean) => void;
  onLockedOnlyChange: (locked: boolean) => void;
  onClearFilters: () => void;
}

function FilterDropdown({
  colorFilter,
  visibleOnly,
  lockedOnly,
  onColorFilterChange,
  onVisibleOnlyChange,
  onLockedOnlyChange,
  onClearFilters,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasFilters = colorFilter !== 'all' || visibleOnly || lockedOnly;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const colors: (LayerColor | 'all')[] = ['all', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

  const colorClasses: Record<LayerColor | 'all', string> = {
    all: 'bg-gray-600',
    none: 'bg-gray-600',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-1.5 rounded',
          'transition-colors duration-100',
          hasFilters
            ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
        )}
        title="Filter layers"
      >
        <Filter className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-full mt-1 z-50',
            'w-48 py-2 px-2',
            'bg-gray-800 border border-gray-700 rounded-lg shadow-xl',
            'animate-fade-in'
          )}
        >
          {/* Color filter */}
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1.5 px-1">Color</p>
            <div className="flex flex-wrap gap-1.5">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => onColorFilterChange(color)}
                  className={cn(
                    'w-5 h-5 rounded-full',
                    color === 'all' ? 'border-2 border-dashed border-gray-500' : colorClasses[color],
                    'hover:ring-2 hover:ring-white/30',
                    'transition-all duration-100',
                    colorFilter === color && 'ring-2 ring-white'
                  )}
                  title={color === 'all' ? 'All colors' : color}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-700 my-2" />

          {/* Visibility filter */}
          <label className="flex items-center gap-2 px-1 py-1 cursor-pointer hover:bg-gray-700/50 rounded">
            <input
              type="checkbox"
              checked={visibleOnly}
              onChange={(e) => onVisibleOnlyChange(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/50"
            />
            <span className="text-xs text-gray-300">Visible only</span>
          </label>

          {/* Locked filter */}
          <label className="flex items-center gap-2 px-1 py-1 cursor-pointer hover:bg-gray-700/50 rounded">
            <input
              type="checkbox"
              checked={lockedOnly}
              onChange={(e) => onLockedOnlyChange(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/50"
            />
            <span className="text-xs text-gray-300">Locked only</span>
          </label>

          {hasFilters && (
            <>
              <div className="h-px bg-gray-700 my-2" />
              <button
                onClick={() => {
                  onClearFilters();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-2 py-1 text-xs text-left',
                  'text-gray-400 hover:text-white hover:bg-gray-700',
                  'rounded transition-colors duration-100'
                )}
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// LAYERS PANEL CONTENT
// ============================================================================

function LayersPanelContent() {
  const {
    filteredLayers,
    selectedLayerIds,
    hoveredLayerId,
    searchQuery,
    colorFilter,
    visibleOnly,
    lockedOnly,
    setSearchQuery,
    setColorFilter,
    setVisibleOnly,
    setLockedOnly,
    clearFilters,
    toggleVisibility,
    toggleLock,
    toggleExpanded,
    expandAll,
    collapseAll,
    setColor,
    renameLayer,
    selectLayer,
    setHoveredLayer,
    moveLayer,
    isVisible,
    isLocked,
    getLayerColor,
    layerTree,
  } = useLayers();

  const { duplicateElement, removeElement } = useBuilderStore();

  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    x: 0,
    y: 0,
    elementId: '',
    isOpen: false,
  });

  // Rename state (reserved for triggering rename from context menu)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [renamingLayerId, setRenamingLayerId] = useState<string | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Track dragging state
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeLayer = useMemo(() => {
    if (!activeId) return null;
    return filteredLayers.find((l) => l.elementId === activeId);
  }, [activeId, filteredLayers]);

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id) return;

      const sourceId = active.id as string;
      const targetId = over.id as string;

      // Determine position based on where in the target the item was dropped
      // For simplicity, we'll default to 'after'
      moveLayer(sourceId, targetId, 'after');
    },
    [moveLayer]
  );

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, elementId: string) => {
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      elementId,
      isOpen: true,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Context menu actions
  const handleContextToggleVisibility = useCallback(() => {
    toggleVisibility(contextMenu.elementId);
  }, [contextMenu.elementId, toggleVisibility]);

  const handleContextToggleLock = useCallback(() => {
    toggleLock(contextMenu.elementId);
  }, [contextMenu.elementId, toggleLock]);

  const handleContextRename = useCallback(() => {
    setRenamingLayerId(contextMenu.elementId);
  }, [contextMenu.elementId]);

  const handleContextDuplicate = useCallback(() => {
    duplicateElement(contextMenu.elementId);
  }, [contextMenu.elementId, duplicateElement]);

  const handleContextDelete = useCallback(() => {
    removeElement(contextMenu.elementId);
  }, [contextMenu.elementId, removeElement]);

  const handleContextSetColor = useCallback(
    (color: LayerColor) => {
      setColor(contextMenu.elementId, color);
    },
    [contextMenu.elementId, setColor]
  );

  // Get sorted layer IDs for sortable context
  const sortedIds = useMemo(
    () => filteredLayers.map((l) => l.elementId),
    [filteredLayers]
  );

  // Check if we have any layers
  const hasLayers = layerTree.count > 0;
  const hasFilteredLayers = filteredLayers.length > 0;

  // Build a map of parent visibility/lock states
  const parentStates = useMemo(() => {
    const states: Record<string, { hidden: boolean; locked: boolean }> = {};

    function traverse(nodes: LayerNode[], parentHidden: boolean, parentLocked: boolean) {
      for (const node of nodes) {
        states[node.elementId] = {
          hidden: parentHidden,
          locked: parentLocked,
        };

        const nodeHidden = parentHidden || !node.state.visible;
        const nodeLocked = parentLocked || node.state.locked;

        if (node.children.length > 0) {
          traverse(node.children, nodeHidden, nodeLocked);
        }
      }
    }

    traverse(layerTree.nodes, false, false);
    return states;
  }, [layerTree.nodes]);

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800">
      {/* Header */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-200">Layers</h3>
            <span className="text-xs text-gray-500">({layerTree.count})</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Expand all */}
            <button
              onClick={expandAll}
              className={cn(
                'p-1 rounded',
                'text-gray-400 hover:text-gray-200 hover:bg-gray-700',
                'transition-colors duration-100'
              )}
              title="Expand all"
            >
              <ChevronsDown className="w-3.5 h-3.5" />
            </button>

            {/* Collapse all */}
            <button
              onClick={collapseAll}
              className={cn(
                'p-1 rounded',
                'text-gray-400 hover:text-gray-200 hover:bg-gray-700',
                'transition-colors duration-100'
              )}
              title="Collapse all"
            >
              <ChevronsUp className="w-3.5 h-3.5" />
            </button>

            {/* Filter dropdown */}
            <FilterDropdown
              colorFilter={colorFilter}
              visibleOnly={visibleOnly}
              lockedOnly={lockedOnly}
              onColorFilterChange={setColorFilter}
              onVisibleOnlyChange={setVisibleOnly}
              onLockedOnlyChange={setLockedOnly}
              onClearFilters={clearFilters}
            />
          </div>
        </div>

        {/* Search input */}
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Layer list */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {!hasLayers ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Layers className="w-10 h-10 text-gray-600 mb-3" />
            <p className="text-sm text-gray-400">No layers yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Drag components to the canvas to create layers
            </p>
          </div>
        ) : !hasFilteredLayers ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Search className="w-8 h-8 text-gray-600 mb-3" />
            <p className="text-sm text-gray-400">No matching layers</p>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-400 hover:text-blue-300 mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
              <div className="py-1">
                {filteredLayers.map((layer) => {
                  const parentState = parentStates[layer.elementId] || { hidden: false, locked: false };

                  return (
                    <LayerItem
                      key={layer.elementId}
                      layer={layer}
                      isSelected={selectedLayerIds.includes(layer.elementId)}
                      isHovered={hoveredLayerId === layer.elementId}
                      isParentHidden={parentState.hidden}
                      isParentLocked={parentState.locked}
                      onSelect={selectLayer}
                      onHover={setHoveredLayer}
                      onToggleVisibility={toggleVisibility}
                      onToggleLock={toggleLock}
                      onToggleExpanded={toggleExpanded}
                      onRename={renameLayer}
                      onContextMenu={handleContextMenu}
                    />
                  );
                })}
              </div>
            </SortableContext>

            {/* Drag overlay */}
            <DragOverlay>
              {activeLayer && (
                <div
                  className={cn(
                    'flex items-center h-8 px-2',
                    'bg-gray-800 border border-blue-500 rounded shadow-lg',
                    'text-xs text-white'
                  )}
                >
                  <span className="truncate">{activeLayer.name}</span>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Context menu */}
      <LayerContextMenu
        state={contextMenu}
        onClose={closeContextMenu}
        onToggleVisibility={handleContextToggleVisibility}
        onToggleLock={handleContextToggleLock}
        onRename={handleContextRename}
        onDuplicate={handleContextDuplicate}
        onDelete={handleContextDelete}
        onSetColor={handleContextSetColor}
        isVisible={contextMenu.isOpen ? isVisible(contextMenu.elementId) : true}
        isLocked={contextMenu.isOpen ? isLocked(contextMenu.elementId) : false}
        currentColor={contextMenu.isOpen ? getLayerColor(contextMenu.elementId) : 'none'}
      />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT (with provider wrapper)
// ============================================================================

interface LayersPanelProps {
  className?: string;
  width?: number;
}

export function LayersPanel({ className, width = 240 }: LayersPanelProps) {
  return (
    <div
      className={cn('h-full', className)}
      style={{ width }}
    >
      <LayersProvider>
        <LayersPanelContent />
      </LayersProvider>
    </div>
  );
}

export default LayersPanel;
