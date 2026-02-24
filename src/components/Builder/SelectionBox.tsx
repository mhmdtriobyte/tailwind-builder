'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { calculateSelectionBounds, type SelectionBounds } from '@/lib/selectionSystem';
import { cn } from '@/utils/cn';
import {
  Trash2,
  Copy,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Layers,
  MoreHorizontal
} from 'lucide-react';

interface SelectionBoxProps {
  canvasRef: React.RefObject<HTMLElement>;
  className?: string;
}

interface HandlePosition {
  cursor: string;
  position: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
  x: 'left' | 'center' | 'right';
  y: 'top' | 'center' | 'bottom';
}

const RESIZE_HANDLES: HandlePosition[] = [
  { cursor: 'nwse-resize', position: 'nw', x: 'left', y: 'top' },
  { cursor: 'ns-resize', position: 'n', x: 'center', y: 'top' },
  { cursor: 'nesw-resize', position: 'ne', x: 'right', y: 'top' },
  { cursor: 'ew-resize', position: 'e', x: 'right', y: 'center' },
  { cursor: 'nwse-resize', position: 'se', x: 'right', y: 'bottom' },
  { cursor: 'ns-resize', position: 's', x: 'center', y: 'bottom' },
  { cursor: 'nesw-resize', position: 'sw', x: 'left', y: 'bottom' },
  { cursor: 'ew-resize', position: 'w', x: 'left', y: 'center' },
];

export function SelectionBox({ canvasRef, className }: SelectionBoxProps) {
  const { selectedIds, elements, duplicateMultiple, removeMultiple } = useBuilderStore();
  const [bounds, setBounds] = useState<SelectionBounds | null>(null);
  const [elementBoundsMap, setElementBoundsMap] = useState<Map<string, DOMRect>>(new Map());
  const [isResizing, setIsResizing] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Collect element bounds
  const updateElementBounds = useCallback(() => {
    if (!canvasRef.current) return;

    const newBoundsMap = new Map<string, DOMRect>();
    const canvasRect = canvasRef.current.getBoundingClientRect();

    for (const id of selectedIds) {
      const element = canvasRef.current.querySelector(`[data-element-id="${id}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Convert to canvas-relative coordinates
        const relativeRect = new DOMRect(
          rect.left - canvasRect.left,
          rect.top - canvasRect.top,
          rect.width,
          rect.height
        );
        newBoundsMap.set(id, relativeRect);
      }
    }

    setElementBoundsMap(newBoundsMap);
  }, [canvasRef, selectedIds]);

  // Update bounds when selection changes
  useEffect(() => {
    updateElementBounds();

    // Set up resize observer for canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const resizeObserver = new ResizeObserver(() => {
        updateElementBounds();
      });
      resizeObserver.observe(canvas);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [updateElementBounds, canvasRef]);

  // Calculate selection bounds
  useEffect(() => {
    if (selectedIds.length === 0) {
      setBounds(null);
      return;
    }

    const newBounds = calculateSelectionBounds(selectedIds, elementBoundsMap);
    setBounds(newBounds);
  }, [selectedIds, elementBoundsMap]);

  // Handle resize
  const handleResizeStart = useCallback((
    e: React.MouseEvent,
    _handle: HandlePosition
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    // TODO: Implement resize logic with mouse move/up handlers
    // This would typically involve:
    // 1. Tracking mouse position
    // 2. Calculating new dimensions based on handle position
    // 3. Updating element styles accordingly

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Handle rotation
  const handleRotationStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // TODO: Implement rotation logic
    // This would involve tracking angle changes and applying rotation transforms
  }, []);

  // Quick actions
  const handleDuplicate = useCallback(() => {
    if (typeof duplicateMultiple === 'function') {
      duplicateMultiple(selectedIds);
    }
  }, [selectedIds, duplicateMultiple]);

  const handleDelete = useCallback(() => {
    if (typeof removeMultiple === 'function') {
      removeMultiple(selectedIds);
    }
  }, [selectedIds, removeMultiple]);

  // Memoized selection count
  const selectionCount = useMemo(() => selectedIds.length, [selectedIds]);

  // Don't render if nothing selected or only one element
  if (!bounds || selectionCount < 2) {
    return null;
  }

  return (
    <div
      className={cn('absolute pointer-events-none', className)}
      style={{
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      }}
    >
      {/* Selection outline */}
      <div
        className={cn(
          'absolute inset-0 border-2 border-blue-500 border-dashed',
          'bg-blue-500/5',
          isResizing && 'border-solid'
        )}
      />

      {/* Selection count badge */}
      <div
        className={cn(
          'absolute -top-8 left-1/2 -translate-x-1/2',
          'px-2 py-1 rounded-md',
          'bg-blue-500 text-white text-xs font-medium',
          'pointer-events-auto',
          'flex items-center gap-1.5',
          'shadow-lg'
        )}
      >
        <Layers className="w-3 h-3" />
        <span>{selectionCount} selected</span>
      </div>

      {/* Resize handles */}
      {RESIZE_HANDLES.map((handle) => {
        let left: string | number = '0';
        let top: string | number = '0';

        switch (handle.x) {
          case 'left':
            left = -4;
            break;
          case 'center':
            left = '50%';
            break;
          case 'right':
            left = 'calc(100% - 4px)';
            break;
        }

        switch (handle.y) {
          case 'top':
            top = -4;
            break;
          case 'center':
            top = '50%';
            break;
          case 'bottom':
            top = 'calc(100% - 4px)';
            break;
        }

        return (
          <div
            key={handle.position}
            className={cn(
              'absolute w-2 h-2 bg-white border-2 border-blue-500 rounded-sm',
              'pointer-events-auto',
              'hover:bg-blue-500 hover:border-blue-600',
              'transition-colors duration-100'
            )}
            style={{
              left,
              top,
              transform: handle.x === 'center' || handle.y === 'center'
                ? `translate(${handle.x === 'center' ? '-50%' : '0'}, ${handle.y === 'center' ? '-50%' : '0'})`
                : undefined,
              cursor: handle.cursor,
            }}
            onMouseDown={(e) => handleResizeStart(e, handle)}
          />
        );
      })}

      {/* Rotation handle */}
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2',
          'flex flex-col items-center pointer-events-auto'
        )}
        style={{ top: -32 }}
      >
        {/* Connection line */}
        <div className="w-px h-4 bg-blue-500" />

        {/* Rotation handle circle */}
        <div
          className={cn(
            'w-3 h-3 rounded-full bg-white border-2 border-blue-500',
            'cursor-grab hover:bg-blue-500',
            'transition-colors duration-100'
          )}
          onMouseDown={handleRotationStart}
          title="Rotate selection"
        />
      </div>

      {/* Quick actions tooltip */}
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2',
          'flex items-center gap-1 p-1 rounded-md',
          'bg-gray-800 text-white shadow-lg',
          'pointer-events-auto',
          'transition-opacity duration-150',
          showQuickActions ? 'opacity-100' : 'opacity-0'
        )}
        style={{ bottom: -40 }}
        onMouseEnter={() => setShowQuickActions(true)}
        onMouseLeave={() => setShowQuickActions(false)}
      >
        <button
          className="p-1.5 hover:bg-gray-700 rounded"
          onClick={handleDuplicate}
          title="Duplicate selected"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          className="p-1.5 hover:bg-gray-700 rounded"
          onClick={handleDelete}
          title="Delete selected"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-600" />
        <button
          className="p-1.5 hover:bg-gray-700 rounded"
          title="Lock selected"
        >
          <Lock className="w-4 h-4" />
        </button>
        <button
          className="p-1.5 hover:bg-gray-700 rounded"
          title="Hide selected"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          className="p-1.5 hover:bg-gray-700 rounded"
          title="More actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Hover trigger for quick actions */}
      <div
        className="absolute left-0 right-0 h-8 pointer-events-auto"
        style={{ bottom: -40 }}
        onMouseEnter={() => setShowQuickActions(true)}
        onMouseLeave={() => setShowQuickActions(false)}
      />
    </div>
  );
}

// Individual element selection indicator
interface SingleSelectionIndicatorProps {
  elementId: string;
  canvasRef: React.RefObject<HTMLElement>;
}

export function SingleSelectionIndicator({
  elementId,
  canvasRef
}: SingleSelectionIndicatorProps) {
  const [bounds, setBounds] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const element = canvasRef.current.querySelector(`[data-element-id="${elementId}"]`);
    if (!element) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    setBounds(new DOMRect(
      rect.left - canvasRect.left,
      rect.top - canvasRect.top,
      rect.width,
      rect.height
    ));

    // Update on resize
    const resizeObserver = new ResizeObserver(() => {
      const newRect = element.getBoundingClientRect();
      const newCanvasRect = canvasRef.current!.getBoundingClientRect();
      setBounds(new DOMRect(
        newRect.left - newCanvasRect.left,
        newRect.top - newCanvasRect.top,
        newRect.width,
        newRect.height
      ));
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [elementId, canvasRef]);

  if (!bounds) return null;

  return (
    <div
      className="absolute pointer-events-none border-2 border-blue-500"
      style={{
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
      }}
    >
      {/* Resize handles for single selection */}
      {RESIZE_HANDLES.map((handle) => {
        let left: string | number = '0';
        let top: string | number = '0';

        switch (handle.x) {
          case 'left':
            left = -4;
            break;
          case 'center':
            left = '50%';
            break;
          case 'right':
            left = 'calc(100% - 4px)';
            break;
        }

        switch (handle.y) {
          case 'top':
            top = -4;
            break;
          case 'center':
            top = '50%';
            break;
          case 'bottom':
            top = 'calc(100% - 4px)';
            break;
        }

        return (
          <div
            key={handle.position}
            className={cn(
              'absolute w-2 h-2 bg-white border-2 border-blue-500 rounded-sm',
              'pointer-events-auto hover:bg-blue-500',
              'transition-colors duration-100'
            )}
            style={{
              left,
              top,
              transform: handle.x === 'center' || handle.y === 'center'
                ? `translate(${handle.x === 'center' ? '-50%' : '0'}, ${handle.y === 'center' ? '-50%' : '0'})`
                : undefined,
              cursor: handle.cursor,
            }}
          />
        );
      })}
    </div>
  );
}

export default SelectionBox;

// Re-export for convenience
export { Unlock, EyeOff };
