'use client';

import { useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Toolbar } from '@/components/Builder/Toolbar';
import { ComponentSidebar } from '@/components/Builder/ComponentSidebar';
import { Canvas } from '@/components/Builder/Canvas';
import { PropertiesPanel } from '@/components/Builder/PropertiesPanel';
import { CodePreview } from '@/components/Builder/CodePreview';
import { useDragDrop } from '@/hooks/useDragDrop';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useBuilderStore } from '@/store/builderStore';
import { cn } from '@/utils/cn';
import type { BuilderElement } from '@/types/builder';

/**
 * Drag overlay component shown during drag operations
 * Shows a preview of the component being dragged
 */
function DragOverlayContent({ activeElement }: { activeElement: BuilderElement | null }) {
  if (!activeElement) return null;

  return (
    <div
      className={cn(
        'px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl',
        'text-sm text-white font-medium',
        'pointer-events-none opacity-90',
        'transform rotate-2'
      )}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <span>{activeElement.name || activeElement.type}</span>
      </div>
    </div>
  );
}

/**
 * Main Builder Page Component
 *
 * This is the core visual builder interface that allows users to:
 * - Drag components from the sidebar onto the canvas
 * - Select and edit element properties
 * - Preview responsive designs
 * - Export generated code
 */
export default function BuilderPage() {
  // Initialize sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
    })
  );

  // Custom drag and drop logic
  const {
    activeId,
    activeElement,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useDragDrop();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Load saved state on mount
  const { loadFromStorage, saveToStorage } = useBuilderStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Auto-save on changes
  useEffect(() => {
    const interval = setInterval(() => {
      saveToStorage();
    }, 5000); // Save every 5 seconds

    return () => clearInterval(interval);
  }, [saveToStorage]);

  // Save before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToStorage();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveToStorage]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToWindowEdges]}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">
        {/* Top Toolbar */}
        <Toolbar />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Component Library */}
          <ComponentSidebar />

          {/* Center - Canvas */}
          <Canvas />

          {/* Right Panel - Properties */}
          <PropertiesPanel />
        </div>

        {/* Code Preview Overlay */}
        <CodePreview />
      </div>

      {/* Drag Overlay - Shows preview of dragged element */}
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'ease-out',
        }}
      >
        {activeId ? <DragOverlayContent activeElement={activeElement} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
