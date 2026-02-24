'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import {
  getElementsInMarquee,
  normalizeMarqueeRect,
  type MarqueeRect
} from '@/lib/selectionSystem';
import { cn } from '@/utils/cn';

interface MarqueeSelectProps {
  canvasRef: React.RefObject<HTMLElement>;
  enabled?: boolean;
  className?: string;
}

interface MarqueeState {
  isDrawing: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

const INITIAL_STATE: MarqueeState = {
  isDrawing: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
};

export function MarqueeSelect({
  canvasRef,
  enabled = true,
  className
}: MarqueeSelectProps) {
  const {
    elements,
    selectedIds,
    setSelectedIds,
    addToSelection,
    removeFromSelection
  } = useBuilderStore();

  const [state, setState] = useState<MarqueeState>(INITIAL_STATE);
  const [previewIds, setPreviewIds] = useState<string[]>([]);
  const elementBoundsRef = useRef<Map<string, DOMRect>>(new Map());
  const modifiersRef = useRef({ shift: false, alt: false });

  // Collect element bounds
  const collectElementBounds = useCallback(() => {
    if (!canvasRef.current) return;

    const newBounds = new Map<string, DOMRect>();
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const collectBounds = (element: HTMLElement) => {
      const elementId = element.dataset.elementId;
      if (elementId) {
        const rect = element.getBoundingClientRect();
        newBounds.set(elementId, new DOMRect(
          rect.left - canvasRect.left,
          rect.top - canvasRect.top,
          rect.width,
          rect.height
        ));
      }

      // Collect children
      Array.from(element.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          collectBounds(child);
        }
      });
    };

    // Start collection from canvas children
    Array.from(canvasRef.current.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        collectBounds(child);
      }
    });

    elementBoundsRef.current = newBounds;
  }, [canvasRef]);

  // Handle mouse down - start marquee
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!enabled || !canvasRef.current) return;

    // Only start marquee on left click directly on canvas (not on elements)
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    const isCanvas = target.hasAttribute('data-canvas') ||
                     target.closest('[data-canvas]');
    const isElement = target.hasAttribute('data-element-id') ||
                      target.closest('[data-element-id]');

    // Only start marquee if clicking on canvas background, not on elements
    if (!isCanvas || isElement) return;

    e.preventDefault();

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - canvasRect.left;
    const startY = e.clientY - canvasRect.top;

    // Store modifier keys
    modifiersRef.current = {
      shift: e.shiftKey,
      alt: e.altKey,
    };

    // Collect element bounds at start
    collectElementBounds();

    setState({
      isDrawing: true,
      startX,
      startY,
      currentX: startX,
      currentY: startY,
    });
  }, [enabled, canvasRef, collectElementBounds]);

  // Handle mouse move - update marquee
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!state.isDrawing || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - canvasRect.left;
    const currentY = e.clientY - canvasRect.top;

    setState(prev => ({
      ...prev,
      currentX,
      currentY,
    }));

    // Update modifier keys
    modifiersRef.current = {
      shift: e.shiftKey,
      alt: e.altKey,
    };

    // Calculate elements in marquee
    const marqueeRect: MarqueeRect = {
      startX: state.startX,
      startY: state.startY,
      endX: currentX,
      endY: currentY,
    };

    const elementsInMarquee = getElementsInMarquee(
      elements,
      marqueeRect,
      elementBoundsRef.current
    );

    setPreviewIds(elementsInMarquee);
  }, [state.isDrawing, state.startX, state.startY, canvasRef, elements]);

  // Handle mouse up - complete marquee
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!state.isDrawing) return;

    const { shift, alt } = modifiersRef.current;

    // Apply selection based on modifiers
    if (previewIds.length > 0) {
      if (shift) {
        // Add to existing selection
        if (typeof addToSelection === 'function') {
          addToSelection(previewIds);
        } else {
          // Fallback: merge with existing selection
          const newSelection = [...new Set([...selectedIds, ...previewIds])];
          setSelectedIds(newSelection);
        }
      } else if (alt) {
        // Remove from existing selection
        if (typeof removeFromSelection === 'function') {
          removeFromSelection(previewIds);
        } else {
          // Fallback: filter out from existing selection
          const newSelection = selectedIds.filter(id => !previewIds.includes(id));
          setSelectedIds(newSelection);
        }
      } else {
        // Replace selection
        setSelectedIds(previewIds);
      }
    } else if (!shift && !alt) {
      // Clear selection if clicking on empty area without modifiers
      setSelectedIds([]);
    }

    // Reset state
    setState(INITIAL_STATE);
    setPreviewIds([]);
  }, [
    state.isDrawing,
    previewIds,
    selectedIds,
    setSelectedIds,
    addToSelection,
    removeFromSelection
  ]);

  // Handle escape key to cancel
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && state.isDrawing) {
      setState(INITIAL_STATE);
      setPreviewIds([]);
    }
  }, [state.isDrawing]);

  // Attach event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown, canvasRef]);

  // Don't render if not drawing
  if (!state.isDrawing) {
    return null;
  }

  // Calculate marquee rectangle
  const marqueeRect = normalizeMarqueeRect({
    startX: state.startX,
    startY: state.startY,
    endX: state.currentX,
    endY: state.currentY,
  });

  // Determine marquee style based on modifier
  const isAddMode = modifiersRef.current.shift;
  const isRemoveMode = modifiersRef.current.alt;

  return (
    <>
      {/* Marquee selection rectangle */}
      <div
        className={cn(
          'absolute pointer-events-none',
          'border-2 border-dashed',
          isRemoveMode
            ? 'border-red-500 bg-red-500/10'
            : isAddMode
              ? 'border-green-500 bg-green-500/10'
              : 'border-blue-500 bg-blue-500/10',
          className
        )}
        style={{
          left: marqueeRect.left,
          top: marqueeRect.top,
          width: marqueeRect.width,
          height: marqueeRect.height,
          zIndex: 1000,
        }}
      />

      {/* Selection mode indicator */}
      <div
        className={cn(
          'absolute px-2 py-1 rounded text-xs font-medium pointer-events-none',
          isRemoveMode
            ? 'bg-red-500 text-white'
            : isAddMode
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white'
        )}
        style={{
          left: marqueeRect.left,
          top: marqueeRect.top - 24,
          zIndex: 1001,
        }}
      >
        {isRemoveMode
          ? `Remove ${previewIds.length}`
          : isAddMode
            ? `Add ${previewIds.length}`
            : `Select ${previewIds.length}`}
      </div>

      {/* Preview highlights for elements in marquee */}
      {previewIds.map(id => {
        const bounds = elementBoundsRef.current.get(id);
        if (!bounds) return null;

        return (
          <div
            key={id}
            className={cn(
              'absolute pointer-events-none border-2',
              isRemoveMode
                ? 'border-red-400 bg-red-400/20'
                : isAddMode
                  ? 'border-green-400 bg-green-400/20'
                  : 'border-blue-400 bg-blue-400/20'
            )}
            style={{
              left: bounds.left,
              top: bounds.top,
              width: bounds.width,
              height: bounds.height,
              zIndex: 999,
            }}
          />
        );
      })}
    </>
  );
}

// Hook for using marquee selection
export function useMarqueeSelect(
  canvasRef: React.RefObject<HTMLElement>,
  options?: { enabled?: boolean }
) {
  const [isMarqueeActive, setIsMarqueeActive] = useState(false);
  const { enabled = true } = options || {};

  // Monitor marquee state
  useEffect(() => {
    const handleMouseDown = () => {
      if (enabled) {
        setIsMarqueeActive(true);
      }
    };

    const handleMouseUp = () => {
      setIsMarqueeActive(false);
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [canvasRef, enabled]);

  return { isMarqueeActive };
}

export default MarqueeSelect;
