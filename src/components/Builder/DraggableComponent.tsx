'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/utils/cn';
import type { ComponentDefinition } from '@/types/builder';
import {
  Type,
  Square,
  Layout,
  Image,
  Menu,
  FormInput,
  Layers,
  MousePointer,
  LucideIcon,
} from 'lucide-react';

interface DraggableComponentProps {
  component: ComponentDefinition;
  className?: string;
}

// Icon mapping for component categories and types
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  buttons: MousePointer,
  cards: Square,
  navigation: Menu,
  forms: FormInput,
  sections: Layers,
  layout: Layout,
  media: Image,
  text: Type,
};

const COMPONENT_ICONS: Record<string, LucideIcon> = {
  // Buttons
  'primary-button': MousePointer,
  'secondary-button': MousePointer,
  'outline-button': MousePointer,
  'ghost-button': MousePointer,
  'icon-button': MousePointer,
  'loading-button': MousePointer,
  'gradient-button': MousePointer,
  'button-group': MousePointer,
  // Cards
  'simple-card': Square,
  'product-card': Square,
  'pricing-card': Square,
  'testimonial-card': Square,
  'profile-card': Square,
  'blog-card': Square,
  'stats-card': Square,
  'feature-card': Square,
  'image-card': Square,
  'horizontal-card': Square,
  // Navigation
  'navbar': Menu,
  'mobile-menu': Menu,
  'footer': Menu,
  'breadcrumb': Menu,
  'tabs': Menu,
  'pagination': Menu,
  // Forms
  'input-field': FormInput,
  'textarea': FormInput,
  'select-dropdown': FormInput,
  'checkbox': FormInput,
  'radio-group': FormInput,
  'toggle-switch': FormInput,
  'login-form': FormInput,
  'signup-form': FormInput,
  'contact-form': FormInput,
  'search-bar': FormInput,
  'newsletter-form': FormInput,
  'file-upload': FormInput,
  // Sections
  'hero-section': Layers,
  'hero-with-image': Layers,
  'feature-section': Layers,
  'cta-section': Layers,
  'stats-section': Layers,
  'testimonials-section': Layers,
  'team-section': Layers,
  'faq-section': Layers,
  'pricing-section': Layers,
  'contact-section': Layers,
  // Layout
  'container': Layout,
  'grid-2-col': Layout,
  'grid-3-col': Layout,
  'grid-4-col': Layout,
  'flex-row': Layout,
  'flex-column': Layout,
  'divider': Layout,
  'spacer': Layout,
  // Media
  'image': Image,
  'avatar': Image,
  'icon': Image,
  'video': Image,
  // Text
  'heading': Type,
  'paragraph': Type,
  'badge': Type,
  'link': Type,
  'list': Type,
};

export function DraggableComponent({ component, className }: DraggableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `draggable-${component.type}`,
    data: {
      type: 'new-component',
      componentType: component.type,
      component,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  // Get the appropriate icon
  const IconComponent = COMPONENT_ICONS[component.type] || CATEGORY_ICONS[component.category] || Square;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        // Base styles
        "group relative flex flex-col items-center gap-2 p-3 rounded-lg cursor-grab",
        // Background and border
        "bg-gray-800/50 border border-gray-700/50",
        // Hover state
        "hover:bg-gray-700/50 hover:border-gray-600 hover:shadow-lg",
        // Active/dragging state
        "active:cursor-grabbing",
        // Transition
        "transition-all duration-150 ease-out",
        // Dragging styles
        isDragging && [
          "opacity-50",
          "scale-105",
          "shadow-2xl",
          "z-50",
          "ring-2 ring-blue-500",
        ],
        className
      )}
      title={component.name}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md",
          "bg-gray-700/50 text-gray-300",
          "group-hover:bg-blue-600/20 group-hover:text-blue-400",
          "transition-colors duration-150"
        )}
      >
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Name */}
      <span
        className={cn(
          "text-xs text-center text-gray-400 font-medium",
          "group-hover:text-gray-200",
          "transition-colors duration-150",
          "line-clamp-2"
        )}
      >
        {component.name}
      </span>

      {/* Container indicator */}
      {component.acceptsChildren && (
        <div
          className={cn(
            "absolute top-1 right-1",
            "w-2 h-2 rounded-full",
            "bg-green-500/70",
            "group-hover:bg-green-400"
          )}
          title="Container (can hold children)"
        />
      )}

      {/* Drag handle visual indicator */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-150",
          "pointer-events-none"
        )}
      >
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
          <div className="w-1 h-1 rounded-full bg-gray-500" />
          <div className="w-1 h-1 rounded-full bg-gray-500" />
          <div className="w-1 h-1 rounded-full bg-gray-500" />
        </div>
      </div>
    </div>
  );
}

// Compact variant for list view
interface DraggableComponentListItemProps {
  component: ComponentDefinition;
  className?: string;
}

export function DraggableComponentListItem({ component, className }: DraggableComponentListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `draggable-${component.type}`,
    data: {
      type: 'new-component',
      componentType: component.type,
      component,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const IconComponent = COMPONENT_ICONS[component.type] || CATEGORY_ICONS[component.category] || Square;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        // Base styles
        "group flex items-center gap-3 p-2 rounded-md cursor-grab",
        // Background and border
        "bg-gray-800/30 border border-transparent",
        // Hover state
        "hover:bg-gray-700/50 hover:border-gray-600",
        // Active/dragging state
        "active:cursor-grabbing",
        // Transition
        "transition-all duration-150 ease-out",
        // Dragging styles
        isDragging && [
          "opacity-50",
          "scale-105",
          "shadow-xl",
          "z-50",
          "ring-2 ring-blue-500",
        ],
        className
      )}
      title={component.name}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-md flex-shrink-0",
          "bg-gray-700/50 text-gray-400",
          "group-hover:bg-blue-600/20 group-hover:text-blue-400",
          "transition-colors duration-150"
        )}
      >
        <IconComponent className="w-4 h-4" />
      </div>

      {/* Name */}
      <span
        className={cn(
          "text-sm text-gray-400 font-medium truncate",
          "group-hover:text-gray-200",
          "transition-colors duration-150"
        )}
      >
        {component.name}
      </span>

      {/* Container indicator */}
      {component.acceptsChildren && (
        <div
          className={cn(
            "ml-auto w-2 h-2 rounded-full flex-shrink-0",
            "bg-green-500/70",
            "group-hover:bg-green-400"
          )}
          title="Container"
        />
      )}
    </div>
  );
}

export default DraggableComponent;
