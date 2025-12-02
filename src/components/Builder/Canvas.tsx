'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useBuilderStore } from '@/store/builderStore';
import { DroppedElement } from './DroppedElement';
import { cn } from '@/utils/cn';

interface CanvasProps {
  className?: string;
}

const VIEWPORT_WIDTHS = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
} as const;

const GRID_PATTERN = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239CA3AF' fill-opacity='0.1'%3E%3Crect width='1' height='1'/%3E%3C/g%3E%3C/svg%3E")`;

export function Canvas({ className }: CanvasProps) {
  const {
    elements,
    viewport,
    zoom,
    showGrid,
    selectedId,
    hoveredId,
    selectElement,
    setHoveredElement,
  } = useBuilderStore();

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
    data: {
      type: 'canvas',
      acceptsChildren: true,
    },
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on the canvas, not on a child
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredElement(null);
  };

  return (
    <div
      className={cn(
        "flex-1 bg-[#1a1a2e] overflow-auto",
        className
      )}
    >
      {/* Scrollable container */}
      <div className="min-h-full p-8 flex justify-center">
        {/* Zoom wrapper */}
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* Canvas */}
          <div
            ref={setNodeRef}
            onClick={handleCanvasClick}
            onMouseLeave={handleCanvasMouseLeave}
            className={cn(
              "min-h-[calc(100vh-200px)] bg-white transition-all duration-300 relative",
              isOver && "ring-4 ring-blue-500 ring-opacity-50",
              showGrid && "bg-repeat"
            )}
            style={{
              width: VIEWPORT_WIDTHS[viewport],
              minWidth: viewport === 'desktop' ? '100%' : VIEWPORT_WIDTHS[viewport],
              backgroundImage: showGrid ? GRID_PATTERN : 'none',
              backgroundSize: '20px 20px',
            }}
            data-canvas="true"
          >
            {elements.length === 0 ? (
              <EmptyState isOver={isOver} />
            ) : (
              <SortableContext
                items={elements.map((el) => el.id)}
                strategy={rectSortingStrategy}
              >
                <div className="flex flex-col gap-2 p-4">
                  {elements.map((element) => (
                    <DroppedElement
                      key={element.id}
                      element={element}
                      isSelected={selectedId === element.id}
                      isHovered={hoveredId === element.id}
                      depth={0}
                    />
                  ))}
                </div>
              </SortableContext>
            )}

            {/* Drop indicator overlay when dragging over canvas */}
            {isOver && elements.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  isOver: boolean;
}

function EmptyState({ isOver }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-96 text-gray-400 transition-colors duration-200",
        isOver && "text-blue-400"
      )}
    >
      <div className="mb-4">
        <svg
          className={cn(
            "w-16 h-16 transition-transform duration-200",
            isOver && "scale-110"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <p className="text-lg font-medium">
        {isOver ? 'Release to drop' : 'Drag components here to start building'}
      </p>
      <p className="text-sm mt-2 text-gray-500">
        Choose from the sidebar to add elements
      </p>
    </div>
  );
}

export default Canvas;
