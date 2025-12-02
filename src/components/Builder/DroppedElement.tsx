'use client';

import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useBuilderStore } from '@/store/builderStore';
import { cn } from '@/utils/cn';
import type { BuilderElement, ElementStyles } from '@/types/builder';
import { Trash2, Copy, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';

interface DroppedElementProps {
  element: BuilderElement;
  isSelected: boolean;
  isHovered: boolean;
  depth: number;
}

// Combine all style categories into a single className string
function combineStyles(styles: ElementStyles): string {
  const allClasses = [
    ...styles.layout,
    ...styles.spacing,
    ...styles.typography,
    ...styles.colors,
    ...styles.borders,
    ...styles.effects,
    ...styles.responsive.sm.map((c) => `sm:${c}`),
    ...styles.responsive.md.map((c) => `md:${c}`),
    ...styles.responsive.lg.map((c) => `lg:${c}`),
  ];
  return allClasses.join(' ');
}

// Component renderers for different element types
function renderElementContent(element: BuilderElement): React.ReactNode {
  const { type, props } = element;
  const styleClasses = combineStyles(element.styles);

  switch (type) {
    // Buttons
    case 'primary-button':
    case 'secondary-button':
    case 'outline-button':
    case 'ghost-button':
    case 'gradient-button':
      return (
        <button className={styleClasses}>
          {props.text || 'Button'}
        </button>
      );

    case 'icon-button':
      return (
        <button className={styleClasses} aria-label={props.ariaLabel}>
          <span className="w-5 h-5 bg-current opacity-30 rounded" />
        </button>
      );

    case 'loading-button':
      return (
        <button className={styleClasses} disabled>
          <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          {props.text}
        </button>
      );

    // Cards
    case 'simple-card':
      return (
        <div className={styleClasses}>
          <h3 className="text-lg font-semibold text-gray-900">{props.title}</h3>
          <p className="mt-2 text-gray-600">{props.description}</p>
        </div>
      );

    case 'product-card':
      return (
        <div className={styleClasses}>
          <div className="aspect-video bg-gray-200" />
          <div className="p-4">
            <h3 className="font-semibold">{props.title}</h3>
            <p className="text-gray-600 text-sm">{props.description}</p>
            <p className="mt-2 text-lg font-bold text-blue-600">{props.price}</p>
          </div>
        </div>
      );

    case 'pricing-card':
      return (
        <div className={cn(styleClasses, props.highlighted && 'ring-2 ring-blue-500')}>
          <div className="text-center">
            <h3 className="text-xl font-bold">{props.tier}</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">{props.price}</span>
              <span className="text-gray-500">{props.period}</span>
            </div>
          </div>
          <ul className="mt-6 space-y-2">
            {(props.features || []).map((feature: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-gray-600">
                <span className="w-4 h-4 bg-green-500 rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
          <button className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg">
            {props.ctaText}
          </button>
        </div>
      );

    case 'testimonial-card':
      return (
        <div className={styleClasses}>
          <p className="text-gray-600 italic">&ldquo;{props.quote}&rdquo;</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
            <div>
              <p className="font-semibold">{props.author}</p>
              <p className="text-sm text-gray-500">{props.role}</p>
            </div>
          </div>
        </div>
      );

    // Navigation
    case 'navbar':
      return (
        <nav className={styleClasses}>
          <span className="font-bold text-xl">{props.logo}</span>
          <div className="flex items-center gap-6">
            {(props.links || []).map((link: { text: string; href: string }, i: number) => (
              <a key={i} href={link.href} className="text-gray-600 hover:text-gray-900">
                {link.text}
              </a>
            ))}
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            {props.ctaText}
          </button>
        </nav>
      );

    case 'footer':
      return (
        <footer className={styleClasses}>
          <div className="grid grid-cols-3 gap-8 mb-8">
            {(props.columns || []).map((col: { title: string; links: string[] }, i: number) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2 text-gray-400">
                  {col.links.map((link: string, j: number) => (
                    <li key={j}>{link}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500">{props.copyright}</p>
        </footer>
      );

    case 'breadcrumb':
      return (
        <nav className={styleClasses}>
          {(props.items || []).map((item: { text: string; href?: string }, i: number) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {item.href ? (
                <a href={item.href} className="hover:text-blue-600">{item.text}</a>
              ) : (
                <span className="text-gray-900">{item.text}</span>
              )}
            </span>
          ))}
        </nav>
      );

    // Forms
    case 'input-field':
      return (
        <div className={styleClasses}>
          <label className="block text-sm font-medium text-gray-700">{props.label}</label>
          <input
            type="text"
            placeholder={props.placeholder}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {props.helperText && (
            <p className="mt-1 text-sm text-gray-500">{props.helperText}</p>
          )}
        </div>
      );

    case 'textarea':
      return (
        <div className={styleClasses}>
          <label className="block text-sm font-medium text-gray-700">{props.label}</label>
          <textarea
            placeholder={props.placeholder}
            rows={props.rows || 4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      );

    case 'select-dropdown':
      return (
        <div className={styleClasses}>
          <label className="block text-sm font-medium text-gray-700">{props.label}</label>
          <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
            {(props.options || []).map((opt: string, i: number) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        </div>
      );

    case 'checkbox':
      return (
        <label className={cn(styleClasses, 'cursor-pointer')}>
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
          <span className="text-gray-700">{props.label}</span>
        </label>
      );

    case 'search-bar':
      return (
        <div className={styleClasses}>
          <input
            type="text"
            placeholder={props.placeholder}
            className="flex-1 px-4 py-2 outline-none"
          />
          <button className="px-4 py-2 bg-blue-600 text-white">
            {props.buttonText}
          </button>
        </div>
      );

    // Sections
    case 'hero-section':
      return (
        <section className={styleClasses}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">{props.headline}</h1>
            <p className="mt-6 text-xl text-gray-600">{props.subtext}</p>
            <button className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-lg text-lg">
              {props.ctaText}
            </button>
          </div>
        </section>
      );

    case 'hero-with-image':
      return (
        <section className={styleClasses}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{props.headline}</h1>
              <p className="mt-4 text-lg text-gray-600">{props.subtext}</p>
              <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg">
                {props.ctaText}
              </button>
            </div>
            <div className="aspect-video bg-gray-200 rounded-lg" />
          </div>
        </section>
      );

    case 'cta-section':
      return (
        <section className={styleClasses}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold">{props.headline}</h2>
            <p className="mt-4 text-lg opacity-90">{props.description}</p>
            <button className="mt-6 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold">
              {props.ctaText}
            </button>
          </div>
        </section>
      );

    case 'stats-section':
      return (
        <section className={styleClasses}>
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {(props.stats || []).map((stat: { value: string; label: string }, i: number) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="mt-1 text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      );

    // Layout
    case 'container':
    case 'grid-2-col':
    case 'grid-3-col':
    case 'grid-4-col':
    case 'flex-row':
    case 'flex-column':
      // Container elements render their children
      return null;

    case 'divider':
      return <hr className={styleClasses} />;

    case 'spacer':
      return <div className={styleClasses} />;

    // Media
    case 'image':
      return (
        <div className={styleClasses}>
          <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-gray-400">
            <span>Image: {props.alt}</span>
          </div>
        </div>
      );

    case 'avatar':
      return (
        <div className={cn(styleClasses, 'bg-gray-300 flex items-center justify-center text-gray-500')}>
          <span className="text-xs">A</span>
        </div>
      );

    case 'video':
      return (
        <div className={styleClasses}>
          <div className="w-full bg-gray-900 flex items-center justify-center text-white aspect-video">
            <span>Video Player</span>
          </div>
        </div>
      );

    // Text
    case 'heading':
      const HeadingTag = (props.level || 'h2') as keyof JSX.IntrinsicElements;
      return <HeadingTag className={styleClasses}>{props.text}</HeadingTag>;

    case 'paragraph':
      return <p className={styleClasses}>{props.text}</p>;

    case 'badge':
      return <span className={styleClasses}>{props.text}</span>;

    case 'link':
      return (
        <a href={props.href} className={styleClasses}>
          {props.text}
        </a>
      );

    case 'list':
      const ListTag = props.ordered ? 'ol' : 'ul';
      return (
        <ListTag className={styleClasses}>
          {(props.items || []).map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ListTag>
      );

    default:
      return (
        <div className={cn(styleClasses, 'p-4 bg-gray-100 border border-dashed border-gray-300 rounded')}>
          <span className="text-gray-500">{element.name || element.type}</span>
        </div>
      );
  }
}

// Check if element type accepts children
function elementAcceptsChildren(type: string): boolean {
  const containerTypes = [
    'container',
    'grid-2-col',
    'grid-3-col',
    'grid-4-col',
    'flex-row',
    'flex-column',
    'button-group',
  ];
  return containerTypes.includes(type);
}

export function DroppedElement({ element, depth }: DroppedElementProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    selectedId,
    hoveredId,
    selectElement,
    setHoveredElement,
    removeElement,
    duplicateElement,
  } = useBuilderStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
    data: {
      type: 'existing-element',
      element,
    },
  });

  // Droppable for container elements
  const { setNodeRef: setDroppableRef, isOver: isOverContainer } = useDroppable({
    id: `drop-${element.id}`,
    data: {
      type: 'container',
      elementId: element.id,
      acceptsChildren: elementAcceptsChildren(element.type),
    },
    disabled: !elementAcceptsChildren(element.type),
  });

  const acceptsChildren = elementAcceptsChildren(element.type);
  const hasChildren = element.children.length > 0;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  }, [element.id, selectElement]);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setHoveredElement(element.id);
  }, [element.id, setHoveredElement]);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Only clear if this element is currently hovered
    if (hoveredId === element.id) {
      setHoveredElement(null);
    }
  }, [element.id, hoveredId, setHoveredElement]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(element.id);
  }, [element.id, removeElement]);

  const handleDuplicate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateElement(element.id);
  }, [element.id, duplicateElement]);

  const handleToggleCollapse = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed((prev) => !prev);
  }, []);

  // Memoize the combined ref setter
  const setCombinedRef = useCallback((node: HTMLElement | null) => {
    setNodeRef(node);
    if (acceptsChildren) {
      setDroppableRef(node);
    }
  }, [setNodeRef, setDroppableRef, acceptsChildren]);

  // Determine if this element is truly hovered (not a descendant)
  const isTrulyHovered = hoveredId === element.id;
  const isTrulySelected = selectedId === element.id;

  const content = useMemo(() => renderElementContent(element), [element]);
  const styleClasses = useMemo(() => combineStyles(element.styles), [element.styles]);

  return (
    <div
      ref={setCombinedRef}
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative group",
        // Dragging styles
        isDragging && "opacity-50 z-50",
        // Selection outline
        isTrulySelected && "ring-2 ring-blue-500 ring-offset-1",
        // Hover outline (only when not selected)
        !isTrulySelected && isTrulyHovered && "ring-2 ring-blue-300 ring-opacity-50",
        // Container drop zone highlight
        isOverContainer && acceptsChildren && "ring-2 ring-green-500 bg-green-50/10",
        // Depth-based left margin for nested elements
        depth > 0 && "ml-0"
      )}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      {/* Action toolbar - visible on hover or selection */}
      <div
        className={cn(
          "absolute -top-8 left-0 z-20 flex items-center gap-1 py-1 px-2 rounded-md",
          "bg-gray-800 text-white text-xs shadow-lg",
          "opacity-0 transition-opacity duration-150",
          (isTrulySelected || isTrulyHovered) && "opacity-100"
        )}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-1 hover:bg-gray-700 rounded cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="w-3 h-3" />
        </button>

        {/* Element name */}
        <span className="px-1 font-medium truncate max-w-[100px]">
          {element.name}
        </span>

        {/* Collapse toggle for containers with children */}
        {acceptsChildren && hasChildren && (
          <button
            onClick={handleToggleCollapse}
            className="p-1 hover:bg-gray-700 rounded"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        )}

        <div className="w-px h-4 bg-gray-600 mx-1" />

        {/* Duplicate button */}
        <button
          onClick={handleDuplicate}
          className="p-1 hover:bg-gray-700 rounded"
          title="Duplicate"
        >
          <Copy className="w-3 h-3" />
        </button>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="p-1 hover:bg-red-600 rounded"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Element content */}
      {acceptsChildren ? (
        <div className={styleClasses}>
          {/* Render the non-container content if any */}
          {content}

          {/* Render children */}
          {!isCollapsed && hasChildren ? (
            <SortableContext
              items={element.children.map((child) => child.id)}
              strategy={rectSortingStrategy}
            >
              {element.children.map((child) => (
                <DroppedElement
                  key={child.id}
                  element={child}
                  isSelected={selectedId === child.id}
                  isHovered={hoveredId === child.id}
                  depth={depth + 1}
                />
              ))}
            </SortableContext>
          ) : !isCollapsed && !hasChildren ? (
            <div className={cn(
              "min-h-[60px] flex items-center justify-center",
              "border-2 border-dashed border-gray-300 rounded-md",
              "text-gray-400 text-sm",
              isOverContainer && "border-green-500 bg-green-50/50 text-green-600"
            )}>
              {isOverContainer ? 'Drop here' : 'Drop elements here'}
            </div>
          ) : null}

          {/* Collapsed indicator */}
          {isCollapsed && hasChildren && (
            <div className="py-2 px-3 bg-gray-100 rounded text-gray-500 text-sm">
              {element.children.length} collapsed items
            </div>
          )}
        </div>
      ) : (
        content
      )}

      {/* Drop position indicators */}
      {isDragging && (
        <>
          <div className="absolute -top-0.5 left-0 right-0 h-1 bg-blue-500 rounded-full opacity-0 pointer-events-none" />
          <div className="absolute -bottom-0.5 left-0 right-0 h-1 bg-blue-500 rounded-full opacity-0 pointer-events-none" />
        </>
      )}
    </div>
  );
}

export default DroppedElement;
