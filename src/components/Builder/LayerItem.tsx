'use client';

/**
 * LayerItem Component
 *
 * Individual layer item in the layers panel.
 * Displays element info with visibility/lock toggles, drag handle,
 * color labels, and supports renaming.
 */

import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Type,
  Square,
  Image,
  Layout,
  Columns,
  Grid,
  MousePointer,
  FormInput,
  Menu,
  Minus,
  Circle,
  Link,
  List,
  Play,
  User,
  MessageSquare,
  LayoutGrid,
  Layers,
  Box,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { LayerNode, LayerColor } from '@/lib/layerSystem';
import { LAYER_COLORS } from '@/lib/layerSystem';

// ============================================================================
// TYPES
// ============================================================================

interface LayerItemProps {
  layer: LayerNode;
  isSelected: boolean;
  isHovered: boolean;
  isParentHidden: boolean;
  isParentLocked: boolean;
  onSelect: (elementId: string, shiftKey: boolean, ctrlKey: boolean) => void;
  onHover: (elementId: string | null) => void;
  onToggleVisibility: (elementId: string) => void;
  onToggleLock: (elementId: string) => void;
  onToggleExpanded: (elementId: string) => void;
  onRename: (elementId: string, name: string) => void;
  onContextMenu: (e: React.MouseEvent, elementId: string) => void;
}

// ============================================================================
// ICON MAPPING
// ============================================================================

type IconComponent = typeof Type;

const ELEMENT_ICONS: Record<string, IconComponent> = {
  // Text
  heading: Type,
  paragraph: Type,
  badge: MessageSquare,
  link: Link,
  list: List,

  // Layout
  container: Box,
  'grid-2-col': Grid,
  'grid-3-col': Grid,
  'grid-4-col': Grid,
  'flex-row': Columns,
  'flex-column': Layout,
  divider: Minus,
  spacer: Square,

  // Buttons
  'primary-button': MousePointer,
  'secondary-button': MousePointer,
  'outline-button': MousePointer,
  'ghost-button': MousePointer,
  'icon-button': MousePointer,
  'loading-button': MousePointer,
  'gradient-button': MousePointer,
  'button-group': LayoutGrid,

  // Cards
  'simple-card': Square,
  'product-card': Square,
  'pricing-card': Square,
  'testimonial-card': Square,
  'profile-card': User,
  'blog-card': Square,
  'stats-card': Square,
  'feature-card': Square,
  'image-card': Image,
  'horizontal-card': Square,

  // Navigation
  navbar: Menu,
  'mobile-menu': Menu,
  footer: Layout,
  breadcrumb: Link,
  tabs: Columns,
  pagination: LayoutGrid,

  // Forms
  'input-field': FormInput,
  textarea: FormInput,
  'select-dropdown': FormInput,
  checkbox: Square,
  'radio-group': Circle,
  'toggle-switch': Circle,
  'search-bar': FormInput,
  'login-form': FormInput,
  'signup-form': FormInput,
  'contact-form': FormInput,
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

  // Media
  image: Image,
  avatar: User,
  icon: Circle,
  video: Play,
};

function getElementIcon(type: string): IconComponent {
  return ELEMENT_ICONS[type] || Box;
}

// ============================================================================
// COLOR LABEL DOT
// ============================================================================

interface ColorDotProps {
  color: LayerColor;
  className?: string;
}

function ColorDot({ color, className }: ColorDotProps) {
  if (color === 'none') return null;

  const colorClasses: Record<Exclude<LayerColor, 'none'>, string> = {
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
      className={cn(
        'w-2 h-2 rounded-full flex-shrink-0',
        colorClasses[color],
        className
      )}
    />
  );
}

// ============================================================================
// LAYER ITEM COMPONENT
// ============================================================================

export const LayerItem = memo(function LayerItem({
  layer,
  isSelected,
  isHovered,
  isParentHidden,
  isParentLocked,
  onSelect,
  onHover,
  onToggleVisibility,
  onToggleLock,
  onToggleExpanded,
  onRename,
  onContextMenu,
}: LayerItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(layer.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sortable setup for drag and drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: layer.elementId,
    data: {
      type: 'layer',
      layer,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get icon for element type
  const Icon = getElementIcon(layer.type);

  // Effective visibility/lock (considering parent state)
  const effectivelyHidden = isParentHidden || !layer.state.visible;
  const effectivelyLocked = isParentLocked || layer.state.locked;

  // Indentation based on depth
  const indentPadding = layer.depth * 16;

  // Handle click for selection
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isEditing) {
        onSelect(layer.elementId, e.shiftKey, e.ctrlKey || e.metaKey);
      }
    },
    [layer.elementId, onSelect, isEditing]
  );

  // Handle double click to rename
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditing(true);
      setEditName(layer.name);
    },
    [layer.name]
  );

  // Handle rename submit
  const handleRenameSubmit = useCallback(() => {
    const trimmedName = editName.trim();
    if (trimmedName && trimmedName !== layer.name) {
      onRename(layer.elementId, trimmedName);
    }
    setIsEditing(false);
  }, [editName, layer.name, layer.elementId, onRename]);

  // Handle rename cancel
  const handleRenameCancel = useCallback(() => {
    setIsEditing(false);
    setEditName(layer.name);
  }, [layer.name]);

  // Handle key press in rename input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        handleRenameSubmit();
      } else if (e.key === 'Escape') {
        handleRenameCancel();
      }
    },
    [handleRenameSubmit, handleRenameCancel]
  );

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Handle visibility toggle
  const handleToggleVisibility = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleVisibility(layer.elementId);
    },
    [layer.elementId, onToggleVisibility]
  );

  // Handle lock toggle
  const handleToggleLock = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleLock(layer.elementId);
    },
    [layer.elementId, onToggleLock]
  );

  // Handle expand/collapse
  const handleToggleExpanded = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleExpanded(layer.elementId);
    },
    [layer.elementId, onToggleExpanded]
  );

  // Handle context menu
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onContextMenu(e, layer.elementId);
    },
    [layer.elementId, onContextMenu]
  );

  // Handle mouse enter/leave for hover
  const handleMouseEnter = useCallback(() => {
    onHover(layer.elementId);
  }, [layer.elementId, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center h-8 select-none',
        'border-l-2 border-transparent',
        'transition-colors duration-100',
        // Selection state
        isSelected && 'bg-blue-600/20 border-l-blue-500',
        !isSelected && isHovered && 'bg-gray-800/50',
        // Dragging state
        isDragging && 'opacity-50',
        // Disabled appearance when hidden or locked
        effectivelyHidden && 'opacity-50',
        effectivelyLocked && !isSelected && 'cursor-not-allowed'
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-layer-id={layer.elementId}
    >
      {/* Left padding for depth indentation */}
      <div style={{ width: indentPadding }} className="flex-shrink-0" />

      {/* Expand/collapse toggle for containers */}
      <div className="w-5 flex-shrink-0 flex items-center justify-center">
        {layer.isContainer && layer.children.length > 0 ? (
          <button
            onClick={handleToggleExpanded}
            className={cn(
              'p-0.5 rounded hover:bg-gray-700',
              'text-gray-400 hover:text-gray-200',
              'transition-colors duration-100'
            )}
          >
            {layer.state.expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        ) : null}
      </div>

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'w-5 flex-shrink-0 flex items-center justify-center cursor-grab',
          'text-gray-500 hover:text-gray-300',
          'opacity-0 group-hover:opacity-100',
          'transition-opacity duration-100',
          effectivelyLocked && 'cursor-not-allowed pointer-events-none'
        )}
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      {/* Color label dot */}
      <ColorDot color={layer.state.color} className="mr-1.5 flex-shrink-0" />

      {/* Element type icon */}
      <div
        className={cn(
          'w-5 flex-shrink-0 flex items-center justify-center',
          'text-gray-400',
          isSelected && 'text-blue-400'
        )}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>

      {/* Layer name */}
      <div className="flex-1 min-w-0 px-1.5">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full px-1 py-0.5 text-xs bg-gray-800 rounded',
              'text-gray-200 border border-blue-500',
              'focus:outline-none focus:ring-1 focus:ring-blue-500'
            )}
          />
        ) : (
          <span
            className={cn(
              'block text-xs truncate',
              'text-gray-300',
              isSelected && 'text-white font-medium',
              effectivelyHidden && 'text-gray-500 italic'
            )}
          >
            {layer.name}
          </span>
        )}
      </div>

      {/* Right-side controls */}
      <div
        className={cn(
          'flex items-center gap-0.5 pr-1',
          'opacity-0 group-hover:opacity-100',
          isSelected && 'opacity-100',
          'transition-opacity duration-100'
        )}
      >
        {/* Visibility toggle */}
        <button
          onClick={handleToggleVisibility}
          className={cn(
            'p-1 rounded hover:bg-gray-700',
            'transition-colors duration-100',
            layer.state.visible
              ? 'text-gray-400 hover:text-gray-200'
              : 'text-gray-600 hover:text-gray-400'
          )}
          title={layer.state.visible ? 'Hide layer' : 'Show layer'}
        >
          {layer.state.visible ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Lock toggle */}
        <button
          onClick={handleToggleLock}
          className={cn(
            'p-1 rounded hover:bg-gray-700',
            'transition-colors duration-100',
            layer.state.locked
              ? 'text-orange-400 hover:text-orange-300'
              : 'text-gray-400 hover:text-gray-200'
          )}
          title={layer.state.locked ? 'Unlock layer' : 'Lock layer'}
        >
          {layer.state.locked ? (
            <Lock className="w-3.5 h-3.5" />
          ) : (
            <Unlock className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
});

export default LayerItem;
