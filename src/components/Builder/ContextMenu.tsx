'use client';

/**
 * Context Menu Component
 *
 * A comprehensive, Radix UI-based context menu system with support for
 * nested submenus, keyboard navigation, icons, shortcuts, and animations.
 */

import React, { useCallback, useMemo } from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import {
  ChevronRight,
  Check,
  Circle,
  // Icons for menu items
  Scissors,
  Copy,
  Clipboard,
  ClipboardPaste,
  CopyPlus,
  Trash2,
  ArrowUp,
  ArrowDown,
  BringToFront,
  SendToBack,
  Box,
  ArrowRightLeft,
  ArrowUpDown,
  LayoutGrid,
  Ungroup,
  Edit3,
  Layout,
  Space,
  Type,
  Palette,
  Square,
  Sparkles,
  Paintbrush,
  Pipette,
  PaintBucket,
  Lock,
  EyeOff,
  Zap,
  Component,
  Code,
  ArrowUpToLine,
  ArrowDownToLine,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Maximize,
  Grid3x3,
  Ruler,
  AlignVerticalJustifyCenter,
  BoxSelect,
  Undo2,
  Redo2,
  Eye,
  Download,
  Star,
  StarOff,
  Layers,
  FileText,
  Wand2,
  Search,
  Menu,
  Image,
  Play,
  CircleUser,
  MousePointer,
  Ghost,
  SquareDashed,
  TextCursor,
  AlignLeft,
  ChevronDown,
  CheckSquare,
  ShoppingBag,
  DollarSign,
  Quote,
  Megaphone,
  BarChart3,
  HelpCircle,
  PanelBottom,
  MoreHorizontal,
  Heading,
  Tag,
  Link2,
  List,
  MoveVertical,
  Minus,
  ImageIcon,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  type MenuItem,
  type MenuContext,
  type ActionMenuItem,
  type SubmenuItem,
  type CheckboxMenuItem,
  type RadioGroupItem,
  evaluateCondition,
  isMenuItemDisabled,
  processMenuItems,
  contextMenuRegistry,
  type MenuDefinition,
} from '@/lib/contextMenuSystem';

// ============================================================================
// ICON MAPPING
// ============================================================================

/**
 * Map of icon names to Lucide icon components
 */
const iconMap: Record<string, LucideIcon> = {
  Scissors,
  Copy,
  Clipboard,
  ClipboardPaste,
  CopyPlus,
  Trash2,
  ArrowUp,
  ArrowDown,
  BringToFront,
  SendToBack,
  Box,
  ArrowRightLeft,
  ArrowUpDown,
  LayoutGrid,
  Ungroup,
  Edit3,
  Layout,
  Space,
  Type,
  Palette,
  Square,
  Sparkles,
  Paintbrush,
  Pipette,
  PaintBucket,
  Lock,
  EyeOff,
  Zap,
  Component,
  Code,
  ArrowUpToLine,
  ArrowDownToLine,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Maximize,
  Grid3x3,
  Ruler,
  AlignVerticalJustifyCenter,
  BoxSelect,
  Undo2,
  Redo2,
  Eye,
  Download,
  Star,
  StarOff,
  Layers,
  FileText,
  Wand2,
  Search,
  Menu,
  Image,
  Play,
  CircleUser,
  MousePointer,
  Ghost,
  SquareDashed,
  TextCursor,
  AlignLeft,
  ChevronDown,
  CheckSquare,
  ShoppingBag,
  DollarSign,
  Quote,
  Megaphone,
  BarChart3,
  HelpCircle,
  PanelBottom,
  MoreHorizontal,
  Heading,
  Tag,
  Link2,
  List,
  MoveVertical,
  Minus,
  ImageIcon,
};

/**
 * Gets an icon component by name or returns the component if already a component
 */
function getIcon(icon: string | LucideIcon | undefined): LucideIcon | undefined {
  if (!icon) return undefined;
  if (typeof icon === 'string') {
    return iconMap[icon];
  }
  return icon;
}

// ============================================================================
// SHARED STYLES
// ============================================================================

const menuContentStyles = cn(
  'min-w-[220px] overflow-hidden rounded-lg p-1',
  'bg-gray-900/95 backdrop-blur-sm border border-gray-700/50',
  'shadow-xl shadow-black/30',
  'animate-in fade-in-0 zoom-in-95',
  'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
  'data-[side=bottom]:slide-in-from-top-2',
  'data-[side=left]:slide-in-from-right-2',
  'data-[side=right]:slide-in-from-left-2',
  'data-[side=top]:slide-in-from-bottom-2'
);

const menuItemStyles = cn(
  'relative flex items-center gap-2 px-2 py-1.5 rounded-md',
  'text-sm text-gray-200 outline-none cursor-pointer',
  'transition-colors duration-100',
  'data-[highlighted]:bg-blue-600/20 data-[highlighted]:text-blue-300',
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none'
);

const menuItemDangerStyles = cn(
  'text-red-400',
  'data-[highlighted]:bg-red-600/20 data-[highlighted]:text-red-300'
);

const menuSeparatorStyles = cn(
  'h-px my-1 mx-2 bg-gray-700/50'
);

const menuLabelStyles = cn(
  'px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider'
);

const shortcutStyles = cn(
  'ml-auto text-xs text-gray-500'
);

// ============================================================================
// MENU ITEM COMPONENTS
// ============================================================================

interface MenuItemIconProps {
  icon?: string | LucideIcon;
}

function MenuItemIcon({ icon }: MenuItemIconProps) {
  const IconComponent = getIcon(icon);
  if (!IconComponent) return <span className="w-4" />;
  return <IconComponent className="w-4 h-4 text-gray-400" />;
}

interface MenuItemShortcutProps {
  shortcut?: { display: string };
}

function MenuItemShortcut({ shortcut }: MenuItemShortcutProps) {
  if (!shortcut) return null;
  return <span className={shortcutStyles}>{shortcut.display}</span>;
}

// ============================================================================
// ACTION MENU ITEM
// ============================================================================

interface ActionMenuItemComponentProps {
  item: ActionMenuItem;
  context: MenuContext;
  onAction: (action: string, params?: Record<string, unknown>) => void;
}

function ActionMenuItemComponent({
  item,
  context,
  onAction,
}: ActionMenuItemComponentProps) {
  const isDisabled = isMenuItemDisabled(item, context);

  const handleSelect = useCallback(() => {
    if (!isDisabled) {
      onAction(item.action, item.actionParams);
    }
  }, [isDisabled, item.action, item.actionParams, onAction]);

  return (
    <ContextMenuPrimitive.Item
      className={cn(
        menuItemStyles,
        item.danger && menuItemDangerStyles
      )}
      disabled={isDisabled}
      onSelect={handleSelect}
    >
      <MenuItemIcon icon={item.icon} />
      <span className="flex-1">{item.label}</span>
      <MenuItemShortcut shortcut={item.shortcut} />
    </ContextMenuPrimitive.Item>
  );
}

// ============================================================================
// CHECKBOX MENU ITEM
// ============================================================================

interface CheckboxMenuItemComponentProps {
  item: CheckboxMenuItem;
  context: MenuContext;
  onAction: (action: string, params?: Record<string, unknown>) => void;
}

function CheckboxMenuItemComponent({
  item,
  context,
  onAction,
}: CheckboxMenuItemComponentProps) {
  const isDisabled = isMenuItemDisabled(item, context);
  const isChecked = evaluateCondition(item.checked, context);

  const handleSelect = useCallback(() => {
    if (!isDisabled) {
      onAction(item.action);
    }
  }, [isDisabled, item.action, onAction]);

  return (
    <ContextMenuPrimitive.CheckboxItem
      className={menuItemStyles}
      disabled={isDisabled}
      checked={isChecked}
      onSelect={handleSelect}
    >
      <ContextMenuPrimitive.ItemIndicator className="absolute left-2">
        <Check className="w-4 h-4 text-blue-400" />
      </ContextMenuPrimitive.ItemIndicator>
      <span className="pl-4 flex-1">{item.label}</span>
      <MenuItemShortcut shortcut={item.shortcut} />
    </ContextMenuPrimitive.CheckboxItem>
  );
}

// ============================================================================
// RADIO GROUP MENU ITEM
// ============================================================================

interface RadioGroupMenuItemComponentProps {
  item: RadioGroupItem;
  context: MenuContext;
  onAction: (action: string, params?: Record<string, unknown>) => void;
}

function RadioGroupMenuItemComponent({
  item,
  context,
  onAction,
}: RadioGroupMenuItemComponentProps) {
  const isDisabled = isMenuItemDisabled(item, context);
  const currentValue = evaluateCondition(item.value, context);

  return (
    <ContextMenuPrimitive.RadioGroup
      value={currentValue}
      onValueChange={(value) => {
        if (!isDisabled) {
          onAction(item.action, { value });
        }
      }}
    >
      <ContextMenuPrimitive.Label className={menuLabelStyles}>
        {item.label}
      </ContextMenuPrimitive.Label>
      {item.options.map((option) => (
        <ContextMenuPrimitive.RadioItem
          key={option.value}
          className={menuItemStyles}
          value={option.value}
          disabled={isDisabled}
        >
          <ContextMenuPrimitive.ItemIndicator className="absolute left-2">
            <Circle className="w-2 h-2 fill-blue-400 text-blue-400" />
          </ContextMenuPrimitive.ItemIndicator>
          <span className="pl-4 flex-1">{option.label}</span>
        </ContextMenuPrimitive.RadioItem>
      ))}
    </ContextMenuPrimitive.RadioGroup>
  );
}

// ============================================================================
// SUBMENU ITEM
// ============================================================================

interface SubmenuItemComponentProps {
  item: SubmenuItem;
  context: MenuContext;
  onAction: (action: string, params?: Record<string, unknown>) => void;
}

function SubmenuItemComponent({
  item,
  context,
  onAction,
}: SubmenuItemComponentProps) {
  const isDisabled = isMenuItemDisabled(item, context);

  // Filter visible items in submenu
  const visibleItems = useMemo(() => {
    return item.items.filter((subItem) => {
      if ('visible' in subItem && subItem.visible !== undefined) {
        return evaluateCondition(subItem.visible, context);
      }
      return true;
    });
  }, [item.items, context]);

  if (visibleItems.length === 0) return null;

  return (
    <ContextMenuPrimitive.Sub>
      <ContextMenuPrimitive.SubTrigger
        className={cn(menuItemStyles, 'data-[state=open]:bg-gray-800')}
        disabled={isDisabled}
      >
        <MenuItemIcon icon={item.icon} />
        <span className="flex-1">{item.label}</span>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </ContextMenuPrimitive.SubTrigger>
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.SubContent
          className={menuContentStyles}
          sideOffset={4}
          alignOffset={-4}
        >
          {visibleItems.map((subItem) => (
            <MenuItemRenderer
              key={subItem.id}
              item={subItem}
              context={context}
              onAction={onAction}
            />
          ))}
        </ContextMenuPrimitive.SubContent>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Sub>
  );
}

// ============================================================================
// MENU ITEM RENDERER
// ============================================================================

interface MenuItemRendererProps {
  item: MenuItem;
  context: MenuContext;
  onAction: (action: string, params?: Record<string, unknown>) => void;
}

function MenuItemRenderer({ item, context, onAction }: MenuItemRendererProps) {
  switch (item.type) {
    case 'action':
      return (
        <ActionMenuItemComponent
          item={item}
          context={context}
          onAction={onAction}
        />
      );

    case 'submenu':
      return (
        <SubmenuItemComponent
          item={item}
          context={context}
          onAction={onAction}
        />
      );

    case 'checkbox':
      return (
        <CheckboxMenuItemComponent
          item={item}
          context={context}
          onAction={onAction}
        />
      );

    case 'radio-group':
      return (
        <RadioGroupMenuItemComponent
          item={item}
          context={context}
          onAction={onAction}
        />
      );

    case 'separator':
      return <ContextMenuPrimitive.Separator className={menuSeparatorStyles} />;

    case 'group-label':
      return (
        <ContextMenuPrimitive.Label className={menuLabelStyles}>
          {item.label}
        </ContextMenuPrimitive.Label>
      );

    default:
      return null;
  }
}

// ============================================================================
// CONTEXT MENU COMPONENT
// ============================================================================

export interface ContextMenuProps {
  /** Children to wrap with context menu trigger */
  children: React.ReactNode;
  /** Menu definition to render */
  menu: MenuDefinition;
  /** Context data for the menu */
  context: MenuContext;
  /** Callback when an action is selected */
  onAction?: (action: string, context: MenuContext, params?: Record<string, unknown>) => void;
  /** Whether the context menu is disabled */
  disabled?: boolean;
  /** Additional class name for the trigger wrapper */
  className?: string;
}

export function ContextMenu({
  children,
  menu,
  context,
  onAction,
  disabled = false,
  className,
}: ContextMenuProps) {
  // Process menu items based on context
  const processedItems = useMemo(() => {
    return processMenuItems(menu, context);
  }, [menu, context]);

  // Handle action selection
  const handleAction = useCallback(
    (action: string, params?: Record<string, unknown>) => {
      if (onAction) {
        onAction(action, context, params);
      } else {
        // Use global registry handler
        contextMenuRegistry.executeAction(action, context, params);
      }
    },
    [context, onAction]
  );

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger asChild className={className}>
        {children}
      </ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Content
          className={menuContentStyles}
          collisionPadding={16}
        >
          {processedItems.map((item) => (
            <MenuItemRenderer
              key={item.id}
              item={item}
              context={context}
              onAction={handleAction}
            />
          ))}
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  );
}

// ============================================================================
// SIMPLE CONTEXT MENU (FOR DIRECT USE)
// ============================================================================

export interface SimpleContextMenuProps {
  /** Children to wrap with context menu trigger */
  children: React.ReactNode;
  /** Menu items to render */
  items: MenuItem[];
  /** Context data for the menu */
  context: MenuContext;
  /** Callback when an action is selected */
  onAction?: (action: string, context: MenuContext, params?: Record<string, unknown>) => void;
  /** Whether the context menu is disabled */
  disabled?: boolean;
  /** Additional class name for the trigger wrapper */
  className?: string;
}

export function SimpleContextMenu({
  children,
  items,
  context,
  onAction,
  disabled = false,
  className,
}: SimpleContextMenuProps) {
  const menu: MenuDefinition = useMemo(
    () => ({
      id: 'simple-menu',
      type: context.type,
      items,
    }),
    [context.type, items]
  );

  return (
    <ContextMenu
      menu={menu}
      context={context}
      onAction={onAction}
      disabled={disabled}
      className={className}
    >
      {children}
    </ContextMenu>
  );
}

// ============================================================================
// CONTEXT MENU CONTENT (FOR CUSTOM TRIGGERS)
// ============================================================================

export interface ContextMenuContentProps {
  /** Menu items to render */
  items: MenuItem[];
  /** Context data for the menu */
  context: MenuContext;
  /** Callback when an action is selected */
  onAction?: (action: string, context: MenuContext, params?: Record<string, unknown>) => void;
}

export function ContextMenuContent({
  items,
  context,
  onAction,
}: ContextMenuContentProps) {
  // Handle action selection
  const handleAction = useCallback(
    (action: string, params?: Record<string, unknown>) => {
      if (onAction) {
        onAction(action, context, params);
      } else {
        contextMenuRegistry.executeAction(action, context, params);
      }
    },
    [context, onAction]
  );

  return (
    <ContextMenuPrimitive.Content
      className={menuContentStyles}
      collisionPadding={16}
    >
      {items.map((item) => (
        <MenuItemRenderer
          key={item.id}
          item={item}
          context={context}
          onAction={handleAction}
        />
      ))}
    </ContextMenuPrimitive.Content>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ContextMenuPrimitive,
  menuContentStyles,
  menuItemStyles,
  menuSeparatorStyles,
  menuLabelStyles,
};

export default ContextMenu;
