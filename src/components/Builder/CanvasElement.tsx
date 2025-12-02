'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useBuilderStore } from '@/store/builderStore';
import { cn } from '@/utils/cn';
import type { BuilderElement } from '@/types/builder';
import { Trash2, Copy, GripVertical } from 'lucide-react';

interface CanvasElementProps {
  element: BuilderElement;
  isSelected: boolean;
}

export function CanvasElement({ element, isSelected }: CanvasElementProps) {
  const {
    selectElement,
    setHoveredElement,
    hoveredId,
    removeElement,
    duplicateElement,
  } = useBuilderStore();

  const isHovered = hoveredId === element.id;

  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: element.id,
    data: {
      type: element.type,
      isNew: false,
      element,
    },
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: element.id,
    data: {
      type: element.type,
      position: 'inside',
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(element.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateElement(element.id);
  };

  // Combine all style classes
  const styleClasses = [
    ...element.styles.layout,
    ...element.styles.spacing,
    ...element.styles.typography,
    ...element.styles.colors,
    ...element.styles.borders,
    ...element.styles.effects,
  ].join(' ');

  // Render element based on type
  const renderElement = () => {
    const baseClasses = cn(styleClasses, 'transition-all');

    switch (element.type) {
      case 'heading':
        return (
          <h2 className={cn('text-2xl font-bold text-gray-900', baseClasses)}>
            {element.props.text || 'Heading'}
          </h2>
        );

      case 'paragraph':
        return (
          <p className={cn('text-gray-700', baseClasses)}>
            {element.props.text || 'Paragraph text goes here. Click to edit.'}
          </p>
        );

      case 'text':
        return (
          <span className={cn('text-gray-700', baseClasses)}>
            {element.props.text || 'Text content'}
          </span>
        );

      case 'button':
        return (
          <button
            className={cn(
              'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
              baseClasses
            )}
          >
            {element.props.text || 'Button'}
          </button>
        );

      case 'link':
        return (
          <a
            href="#"
            className={cn('text-blue-600 hover:underline', baseClasses)}
            onClick={(e) => e.preventDefault()}
          >
            {element.props.text || 'Link text'}
          </a>
        );

      case 'image':
        return (
          <div
            className={cn(
              'w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center',
              baseClasses
            )}
          >
            <span className="text-gray-400 text-sm">
              {element.props.src ? 'Image' : 'Image Placeholder'}
            </span>
          </div>
        );

      case 'card':
        return (
          <div
            className={cn(
              'bg-white rounded-xl shadow-lg border border-gray-200 p-6',
              baseClasses
            )}
          >
            {element.children.length > 0 ? (
              element.children.map((child) => (
                <CanvasElement
                  key={child.id}
                  element={child}
                  isSelected={false}
                />
              ))
            ) : (
              <div className="text-gray-400 text-sm text-center py-4">
                Drop elements here
              </div>
            )}
          </div>
        );

      case 'container':
      case 'section':
      case 'flexbox':
      case 'grid':
        const containerClasses = cn(
          element.type === 'flexbox' && 'flex gap-4',
          element.type === 'grid' && 'grid grid-cols-2 gap-4',
          element.type === 'section' && 'py-8',
          'min-h-[100px]',
          baseClasses
        );

        return (
          <div className={containerClasses}>
            {element.children.length > 0 ? (
              element.children.map((child) => (
                <CanvasElement
                  key={child.id}
                  element={child}
                  isSelected={false}
                />
              ))
            ) : (
              <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm p-4">
                Drop elements here
              </div>
            )}
          </div>
        );

      case 'input':
        return (
          <input
            type={element.props.type || 'text'}
            placeholder={element.props.placeholder || 'Enter text...'}
            className={cn(
              'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              baseClasses
            )}
            readOnly
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={element.props.placeholder || 'Enter text...'}
            rows={element.props.rows || 4}
            className={cn(
              'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none',
              baseClasses
            )}
            readOnly
          />
        );

      case 'divider':
        return <hr className={cn('border-gray-300 my-4', baseClasses)} />;

      case 'avatar':
        return (
          <div
            className={cn(
              'w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold',
              baseClasses
            )}
          >
            {element.props.initials || 'AB'}
          </div>
        );

      case 'badge':
        return (
          <span
            className={cn(
              'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
              baseClasses
            )}
          >
            {element.props.text || 'Badge'}
          </span>
        );

      default:
        return (
          <div className={cn('p-4 bg-gray-100 rounded-lg text-gray-600', baseClasses)}>
            {element.type}: {element.name}
          </div>
        );
    }
  };

  return (
    <div
      ref={(node) => {
        setDragRef(node);
        setDropRef(node);
      }}
      className={cn(
        'relative group',
        isDragging && 'opacity-50',
        isOver && 'ring-2 ring-blue-500 ring-offset-2'
      )}
      onClick={handleClick}
      onMouseEnter={() => setHoveredElement(element.id)}
      onMouseLeave={() => setHoveredElement(null)}
    >
      {/* Selection/hover outline */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none rounded-lg transition-all',
          isSelected && 'ring-2 ring-blue-500',
          isHovered && !isSelected && 'ring-1 ring-blue-400/50'
        )}
      />

      {/* Element label */}
      {(isSelected || isHovered) && (
        <div className="absolute -top-6 left-0 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-t">
          {element.name}
        </div>
      )}

      {/* Actions */}
      {isSelected && (
        <div className="absolute -top-6 right-0 flex items-center gap-1">
          <button
            className="p-1 bg-gray-800 text-gray-300 hover:text-white rounded transition-colors"
            {...listeners}
            {...attributes}
          >
            <GripVertical className="w-3 h-3" />
          </button>
          <button
            className="p-1 bg-gray-800 text-gray-300 hover:text-white rounded transition-colors"
            onClick={handleDuplicate}
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            className="p-1 bg-red-600 text-white rounded transition-colors"
            onClick={handleDelete}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Element content */}
      <div className="relative">{renderElement()}</div>
    </div>
  );
}
