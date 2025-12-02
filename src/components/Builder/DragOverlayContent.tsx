'use client';

import { DragOverlay } from '@dnd-kit/core';
import type { Active } from '@dnd-kit/core';
import { useDragOverlayContent } from '@/hooks/useDragDrop';
import { cn } from '@/utils/cn';
import {
  Type,
  Square,
  Layout,
  Image,
  Menu,
  FormInput,
  Layers,
  MousePointer,
} from 'lucide-react';

interface DragOverlayWrapperProps {
  active: Active | null;
}

// Icon mapping for component types
const COMPONENT_ICONS: Record<string, typeof MousePointer> = {
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

export function DragOverlayWrapper({ active }: DragOverlayWrapperProps) {
  const content = useDragOverlayContent(active);

  if (!content) return null;

  return (
    <DragOverlay dropAnimation={null}>
      {content.type === 'new-component' ? (
        <NewComponentPreview
          componentType={content.componentType}
          componentName={content.component?.name || content.componentType}
        />
      ) : (
        <ExistingElementPreview element={content.element} />
      )}
    </DragOverlay>
  );
}

interface NewComponentPreviewProps {
  componentType: string;
  componentName: string;
}

function NewComponentPreview({ componentType, componentName }: NewComponentPreviewProps) {
  const IconComponent = COMPONENT_ICONS[componentType] || Square;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg",
        "bg-blue-600 text-white shadow-2xl",
        "border-2 border-blue-400",
        "cursor-grabbing",
        "transform scale-105"
      )}
    >
      <IconComponent className="w-5 h-5" />
      <span className="font-medium">{componentName}</span>
    </div>
  );
}

interface ExistingElementPreviewProps {
  element: {
    id: string;
    type: string;
    name: string;
  };
}

function ExistingElementPreview({ element }: ExistingElementPreviewProps) {
  const IconComponent = COMPONENT_ICONS[element.type] || Square;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg",
        "bg-gray-800 text-white shadow-2xl",
        "border-2 border-gray-600",
        "cursor-grabbing",
        "transform scale-105",
        "max-w-[200px]"
      )}
    >
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium truncate">{element.name}</span>
    </div>
  );
}

// Simple drop indicator component for showing where elements will be dropped
interface DropIndicatorProps {
  position: 'before' | 'after' | 'inside';
  isActive: boolean;
}

export function DropIndicator({ position, isActive }: DropIndicatorProps) {
  if (!isActive) return null;

  if (position === 'inside') {
    return (
      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-10",
          "border-2 border-dashed border-green-500",
          "bg-green-500/10 rounded-md"
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "absolute left-0 right-0 h-0.5 pointer-events-none z-10",
        "bg-blue-500",
        position === 'before' ? '-top-0.5' : '-bottom-0.5'
      )}
    >
      <div
        className={cn(
          "absolute -left-1 -top-1 w-2 h-2 rounded-full bg-blue-500"
        )}
      />
      <div
        className={cn(
          "absolute -right-1 -top-1 w-2 h-2 rounded-full bg-blue-500"
        )}
      />
    </div>
  );
}

export default DragOverlayWrapper;
