/**
 * Context Menu Items
 *
 * Default menu item definitions for the Visual Tailwind Builder.
 * Defines menus for elements, canvas, and sidebar contexts.
 */

import {
  contextMenuRegistry,
  createActionItem,
  createSubmenuItem,
  createSeparator,
  createCheckboxItem,
  createShortcut,
  type MenuDefinition,
  type MenuItem,
  type MenuContext,
} from './contextMenuSystem';

// ============================================================================
// ELEMENT CONTEXT MENU
// ============================================================================

/**
 * Context menu for elements on the canvas
 */
const elementContextMenu: MenuDefinition = {
  id: 'element-menu',
  type: 'element',
  items: [
    // Clipboard operations
    createActionItem('cut', 'Cut', 'cut', {
      icon: 'Scissors',
      shortcut: createShortcut('X', { ctrl: true }),
    }),
    createActionItem('copy', 'Copy', 'copy', {
      icon: 'Copy',
      shortcut: createShortcut('C', { ctrl: true }),
    }),
    createActionItem('paste', 'Paste', 'paste', {
      icon: 'Clipboard',
      shortcut: createShortcut('V', { ctrl: true }),
      disabled: (ctx) => !ctx.hasClipboard,
      visible: (ctx) => ctx.isContainer,
    }),
    createActionItem('paste-after', 'Paste After', 'paste-after', {
      icon: 'ClipboardPaste',
      shortcut: createShortcut('V', { ctrl: true, shift: true }),
      disabled: (ctx) => !ctx.hasClipboard,
    }),
    createActionItem('duplicate', 'Duplicate', 'duplicate', {
      icon: 'CopyPlus',
      shortcut: createShortcut('D', { ctrl: true }),
    }),
    createActionItem('delete', 'Delete', 'delete', {
      icon: 'Trash2',
      shortcut: { display: 'Del', key: 'DELETE' },
      danger: true,
    }),

    createSeparator('sep-1'),

    // Reorder operations
    createActionItem('move-up', 'Move Up', 'move-up', {
      icon: 'ArrowUp',
      shortcut: createShortcut('ArrowUp', { ctrl: true }),
      disabled: (ctx) => !ctx.canMoveUp,
    }),
    createActionItem('move-down', 'Move Down', 'move-down', {
      icon: 'ArrowDown',
      shortcut: createShortcut('ArrowDown', { ctrl: true }),
      disabled: (ctx) => !ctx.canMoveDown,
    }),
    createActionItem('bring-to-front', 'Bring to Front', 'bring-to-front', {
      icon: 'BringToFront',
      shortcut: createShortcut(']', { ctrl: true, shift: true }),
      disabled: (ctx) => !ctx.canMoveDown,
    }),
    createActionItem('send-to-back', 'Send to Back', 'send-to-back', {
      icon: 'SendToBack',
      shortcut: createShortcut('[', { ctrl: true, shift: true }),
      disabled: (ctx) => !ctx.canMoveUp,
    }),

    createSeparator('sep-2'),

    // Structure operations
    createActionItem('wrap-in-container', 'Wrap in Container', 'wrap-in-container', {
      icon: 'Box',
      shortcut: createShortcut('G', { ctrl: true }),
    }),
    createActionItem('wrap-in-flex-row', 'Wrap in Flex Row', 'wrap-in-flex-row', {
      icon: 'ArrowRightLeft',
    }),
    createActionItem('wrap-in-flex-column', 'Wrap in Flex Column', 'wrap-in-flex-column', {
      icon: 'ArrowUpDown',
    }),
    createActionItem('wrap-in-grid', 'Wrap in Grid', 'wrap-in-grid', {
      icon: 'LayoutGrid',
    }),
    createActionItem('unwrap', 'Unwrap', 'unwrap', {
      icon: 'Ungroup',
      shortcut: createShortcut('G', { ctrl: true, shift: true }),
      visible: (ctx) => ctx.isContainer && (ctx.targetElement?.children?.length ?? 0) > 0,
    }),

    createSeparator('sep-3'),

    // Element editing
    createActionItem('edit-content', 'Edit Content', 'edit-content', {
      icon: 'Edit3',
      shortcut: { display: 'Enter', key: 'ENTER' },
      visible: (ctx) => {
        const textTypes = ['heading', 'paragraph', 'badge', 'link', 'primary-button', 'secondary-button', 'outline-button', 'ghost-button', 'gradient-button'];
        return ctx.targetElement ? textTypes.includes(ctx.targetElement.type) : false;
      },
    }),

    // Styles submenu
    createSubmenuItem('edit-styles', 'Edit Styles', [
      createActionItem('edit-layout', 'Layout', 'edit-styles-layout', {
        icon: 'Layout',
      }),
      createActionItem('edit-spacing', 'Spacing', 'edit-styles-spacing', {
        icon: 'Space',
      }),
      createActionItem('edit-typography', 'Typography', 'edit-styles-typography', {
        icon: 'Type',
      }),
      createActionItem('edit-colors', 'Colors', 'edit-styles-colors', {
        icon: 'Palette',
      }),
      createActionItem('edit-borders', 'Borders', 'edit-styles-borders', {
        icon: 'Square',
      }),
      createActionItem('edit-effects', 'Effects', 'edit-styles-effects', {
        icon: 'Sparkles',
      }),
    ], {
      icon: 'Paintbrush',
    }),

    createSeparator('sep-4'),

    // Style clipboard
    createActionItem('copy-styles', 'Copy Styles', 'copy-styles', {
      icon: 'Pipette',
      shortcut: createShortcut('C', { ctrl: true, alt: true }),
    }),
    createActionItem('paste-styles', 'Paste Styles', 'paste-styles', {
      icon: 'PaintBucket',
      shortcut: createShortcut('V', { ctrl: true, alt: true }),
      disabled: (ctx) => !(ctx.customData?.hasStyleClipboard === true),
    }),

    createSeparator('sep-5'),

    // State toggles
    createCheckboxItem('toggle-lock', 'Lock', 'toggle-lock', (ctx) => ctx.isLocked, {
      icon: 'Lock',
      shortcut: createShortcut('L', { ctrl: true }),
    }),
    createCheckboxItem('toggle-visibility', 'Hide', 'toggle-visibility', (ctx) => ctx.isHidden, {
      icon: 'EyeOff',
      shortcut: createShortcut('H', { ctrl: true }),
    }),

    createSeparator('sep-6'),

    // Advanced actions
    createActionItem('add-animation', 'Add Animation', 'add-animation', {
      icon: 'Zap',
    }),
    createActionItem('convert-to-component', 'Convert to Component', 'convert-to-component', {
      icon: 'Component',
      shortcut: createShortcut('K', { ctrl: true }),
    }),
    createActionItem('view-code', 'View Code', 'view-code', {
      icon: 'Code',
      shortcut: createShortcut('U', { ctrl: true }),
    }),

    createSeparator('sep-7'),

    // Select operations
    createActionItem('select-parent', 'Select Parent', 'select-parent', {
      icon: 'ArrowUpToLine',
      shortcut: { display: 'Esc', key: 'ESCAPE' },
      disabled: (ctx) => ctx.depth === 0,
    }),
    createActionItem('select-children', 'Select Children', 'select-children', {
      icon: 'ArrowDownToLine',
      visible: (ctx) => ctx.isContainer && (ctx.targetElement?.children?.length ?? 0) > 0,
    }),
  ],
};

// ============================================================================
// CANVAS CONTEXT MENU
// ============================================================================

/**
 * Context menu for the canvas background
 */
const canvasContextMenu: MenuDefinition = {
  id: 'canvas-menu',
  type: 'canvas',
  items: [
    // Clipboard
    createActionItem('paste', 'Paste', 'paste-to-canvas', {
      icon: 'Clipboard',
      shortcut: createShortcut('V', { ctrl: true }),
      disabled: (ctx) => !ctx.hasClipboard,
    }),

    createSeparator('sep-1'),

    // Add component submenu
    createSubmenuItem('add-component', 'Add Component', [
      createSubmenuItem('add-layout', 'Layout', [
        createActionItem('add-container', 'Container', 'add-component', {
          icon: 'Box',
          actionParams: { type: 'container' },
        }),
        createActionItem('add-flex-row', 'Flex Row', 'add-component', {
          icon: 'ArrowRightLeft',
          actionParams: { type: 'flex-row' },
        }),
        createActionItem('add-flex-column', 'Flex Column', 'add-component', {
          icon: 'ArrowUpDown',
          actionParams: { type: 'flex-column' },
        }),
        createActionItem('add-grid-2', '2 Column Grid', 'add-component', {
          icon: 'LayoutGrid',
          actionParams: { type: 'grid-2-col' },
        }),
        createActionItem('add-grid-3', '3 Column Grid', 'add-component', {
          icon: 'Grid3x3',
          actionParams: { type: 'grid-3-col' },
        }),
        createActionItem('add-divider', 'Divider', 'add-component', {
          icon: 'Minus',
          actionParams: { type: 'divider' },
        }),
        createActionItem('add-spacer', 'Spacer', 'add-component', {
          icon: 'MoveVertical',
          actionParams: { type: 'spacer' },
        }),
      ], {
        icon: 'LayoutGrid',
      }),
      createSubmenuItem('add-text', 'Text', [
        createActionItem('add-heading', 'Heading', 'add-component', {
          icon: 'Heading',
          actionParams: { type: 'heading' },
        }),
        createActionItem('add-paragraph', 'Paragraph', 'add-component', {
          icon: 'AlignLeft',
          actionParams: { type: 'paragraph' },
        }),
        createActionItem('add-badge', 'Badge', 'add-component', {
          icon: 'Tag',
          actionParams: { type: 'badge' },
        }),
        createActionItem('add-link', 'Link', 'add-component', {
          icon: 'Link2',
          actionParams: { type: 'link' },
        }),
        createActionItem('add-list', 'List', 'add-component', {
          icon: 'List',
          actionParams: { type: 'list' },
        }),
      ], {
        icon: 'Type',
      }),
      createSubmenuItem('add-buttons', 'Buttons', [
        createActionItem('add-primary-btn', 'Primary Button', 'add-component', {
          icon: 'MousePointer',
          actionParams: { type: 'primary-button' },
        }),
        createActionItem('add-secondary-btn', 'Secondary Button', 'add-component', {
          icon: 'Square',
          actionParams: { type: 'secondary-button' },
        }),
        createActionItem('add-outline-btn', 'Outline Button', 'add-component', {
          icon: 'SquareDashed',
          actionParams: { type: 'outline-button' },
        }),
        createActionItem('add-ghost-btn', 'Ghost Button', 'add-component', {
          icon: 'Ghost',
          actionParams: { type: 'ghost-button' },
        }),
      ], {
        icon: 'MousePointer',
      }),
      createSubmenuItem('add-forms', 'Forms', [
        createActionItem('add-input', 'Input Field', 'add-component', {
          icon: 'TextCursor',
          actionParams: { type: 'input-field' },
        }),
        createActionItem('add-textarea', 'Textarea', 'add-component', {
          icon: 'AlignLeft',
          actionParams: { type: 'textarea' },
        }),
        createActionItem('add-select', 'Select Dropdown', 'add-component', {
          icon: 'ChevronDown',
          actionParams: { type: 'select-dropdown' },
        }),
        createActionItem('add-checkbox', 'Checkbox', 'add-component', {
          icon: 'CheckSquare',
          actionParams: { type: 'checkbox' },
        }),
        createActionItem('add-search', 'Search Bar', 'add-component', {
          icon: 'Search',
          actionParams: { type: 'search-bar' },
        }),
      ], {
        icon: 'FormInput',
      }),
      createSubmenuItem('add-cards', 'Cards', [
        createActionItem('add-simple-card', 'Simple Card', 'add-component', {
          icon: 'Square',
          actionParams: { type: 'simple-card' },
        }),
        createActionItem('add-product-card', 'Product Card', 'add-component', {
          icon: 'ShoppingBag',
          actionParams: { type: 'product-card' },
        }),
        createActionItem('add-pricing-card', 'Pricing Card', 'add-component', {
          icon: 'DollarSign',
          actionParams: { type: 'pricing-card' },
        }),
        createActionItem('add-testimonial-card', 'Testimonial Card', 'add-component', {
          icon: 'Quote',
          actionParams: { type: 'testimonial-card' },
        }),
      ], {
        icon: 'LayoutGrid',
      }),
      createSubmenuItem('add-sections', 'Sections', [
        createActionItem('add-hero', 'Hero Section', 'add-component', {
          icon: 'Sparkles',
          actionParams: { type: 'hero-section' },
        }),
        createActionItem('add-hero-image', 'Hero with Image', 'add-component', {
          icon: 'ImageIcon',
          actionParams: { type: 'hero-with-image' },
        }),
        createActionItem('add-cta', 'CTA Section', 'add-component', {
          icon: 'Megaphone',
          actionParams: { type: 'cta-section' },
        }),
        createActionItem('add-stats', 'Stats Section', 'add-component', {
          icon: 'BarChart3',
          actionParams: { type: 'stats-section' },
        }),
        createActionItem('add-faq', 'FAQ Section', 'add-component', {
          icon: 'HelpCircle',
          actionParams: { type: 'faq-section' },
        }),
      ], {
        icon: 'Layers',
      }),
      createSubmenuItem('add-media', 'Media', [
        createActionItem('add-image', 'Image', 'add-component', {
          icon: 'Image',
          actionParams: { type: 'image' },
        }),
        createActionItem('add-avatar', 'Avatar', 'add-component', {
          icon: 'CircleUser',
          actionParams: { type: 'avatar' },
        }),
        createActionItem('add-video', 'Video', 'add-component', {
          icon: 'Play',
          actionParams: { type: 'video' },
        }),
      ], {
        icon: 'Image',
      }),
      createSubmenuItem('add-navigation', 'Navigation', [
        createActionItem('add-navbar', 'Navbar', 'add-component', {
          icon: 'Menu',
          actionParams: { type: 'navbar' },
        }),
        createActionItem('add-footer', 'Footer', 'add-component', {
          icon: 'PanelBottom',
          actionParams: { type: 'footer' },
        }),
        createActionItem('add-breadcrumb', 'Breadcrumb', 'add-component', {
          icon: 'ChevronRight',
          actionParams: { type: 'breadcrumb' },
        }),
        createActionItem('add-tabs', 'Tabs', 'add-component', {
          icon: 'Layers',
          actionParams: { type: 'tabs' },
        }),
        createActionItem('add-pagination', 'Pagination', 'add-component', {
          icon: 'MoreHorizontal',
          actionParams: { type: 'pagination' },
        }),
      ], {
        icon: 'Menu',
      }),
    ], {
      icon: 'Plus',
    }),

    createSeparator('sep-2'),

    // Zoom controls submenu
    createSubmenuItem('zoom-controls', 'Zoom', [
      createActionItem('zoom-in', 'Zoom In', 'zoom-in', {
        icon: 'ZoomIn',
        shortcut: createShortcut('=', { ctrl: true }),
      }),
      createActionItem('zoom-out', 'Zoom Out', 'zoom-out', {
        icon: 'ZoomOut',
        shortcut: createShortcut('-', { ctrl: true }),
      }),
      createSeparator('zoom-sep'),
      createActionItem('zoom-50', '50%', 'set-zoom', {
        actionParams: { zoom: 50 },
      }),
      createActionItem('zoom-75', '75%', 'set-zoom', {
        actionParams: { zoom: 75 },
      }),
      createActionItem('zoom-100', '100%', 'set-zoom', {
        icon: 'Maximize2',
        shortcut: createShortcut('0', { ctrl: true }),
        actionParams: { zoom: 100 },
      }),
      createActionItem('zoom-125', '125%', 'set-zoom', {
        actionParams: { zoom: 125 },
      }),
      createActionItem('zoom-150', '150%', 'set-zoom', {
        actionParams: { zoom: 150 },
      }),
      createActionItem('zoom-200', '200%', 'set-zoom', {
        actionParams: { zoom: 200 },
      }),
      createSeparator('zoom-sep-2'),
      createActionItem('zoom-fit', 'Fit to Screen', 'zoom-fit', {
        icon: 'Maximize',
        shortcut: createShortcut('1', { ctrl: true }),
      }),
    ], {
      icon: 'Search',
    }),

    createSeparator('sep-3'),

    // View toggles
    createCheckboxItem('toggle-grid', 'Show Grid', 'toggle-grid', (ctx) => ctx.showGrid, {
      icon: 'Grid3x3',
      shortcut: createShortcut('\'', { ctrl: true }),
    }),
    createCheckboxItem('toggle-rulers', 'Show Rulers', 'toggle-rulers', false, {
      icon: 'Ruler',
    }),
    createCheckboxItem('toggle-guides', 'Show Guides', 'toggle-guides', false, {
      icon: 'AlignVerticalJustifyCenter',
    }),

    createSeparator('sep-4'),

    // Selection
    createActionItem('select-all', 'Select All', 'select-all', {
      icon: 'BoxSelect',
      shortcut: createShortcut('A', { ctrl: true }),
      disabled: (ctx) => ctx.elementCount === 0,
    }),
    createActionItem('deselect-all', 'Deselect All', 'deselect-all', {
      icon: 'Square',
      shortcut: { display: 'Esc', key: 'ESCAPE' },
    }),

    createSeparator('sep-5'),

    // History
    createActionItem('undo', 'Undo', 'undo', {
      icon: 'Undo2',
      shortcut: createShortcut('Z', { ctrl: true }),
    }),
    createActionItem('redo', 'Redo', 'redo', {
      icon: 'Redo2',
      shortcut: createShortcut('Z', { ctrl: true, shift: true }),
    }),

    createSeparator('sep-6'),

    // Export/Preview
    createActionItem('preview', 'Preview', 'preview', {
      icon: 'Eye',
      shortcut: createShortcut('P', { ctrl: true }),
    }),
    createActionItem('export-code', 'Export Code', 'export-code', {
      icon: 'Download',
      shortcut: createShortcut('E', { ctrl: true }),
    }),

    createSeparator('sep-7'),

    // Danger zone
    createActionItem('clear-canvas', 'Clear Canvas', 'clear-canvas', {
      icon: 'Trash2',
      danger: true,
      disabled: (ctx) => ctx.elementCount === 0,
    }),
  ],
};

// ============================================================================
// SIDEBAR CONTEXT MENU
// ============================================================================

/**
 * Context menu for sidebar component items
 */
const sidebarContextMenu: MenuDefinition = {
  id: 'sidebar-menu',
  type: 'sidebar',
  items: [
    createActionItem('add-to-canvas', 'Add to Canvas', 'add-to-canvas', {
      icon: 'Plus',
      shortcut: { display: 'Enter', key: 'ENTER' },
    }),
    createActionItem('add-multiple', 'Add Multiple...', 'add-multiple', {
      icon: 'CopyPlus',
    }),

    createSeparator('sep-1'),

    createActionItem('add-to-favorites', 'Add to Favorites', 'add-to-favorites', {
      icon: 'Star',
    }),
    createActionItem('remove-from-favorites', 'Remove from Favorites', 'remove-from-favorites', {
      icon: 'StarOff',
      visible: (ctx) => ctx.customData?.isFavorite === true,
    }),

    createSeparator('sep-2'),

    createActionItem('view-variants', 'View Variants', 'view-variants', {
      icon: 'Layers',
    }),
    createActionItem('view-documentation', 'View Documentation', 'view-documentation', {
      icon: 'FileText',
    }),

    createSeparator('sep-3'),

    createActionItem('copy-as-code', 'Copy as Code', 'copy-as-code', {
      icon: 'Code',
      shortcut: createShortcut('C', { ctrl: true, shift: true }),
    }),
  ],
  dynamicItems: (context: MenuContext): MenuItem[] => {
    // Add dynamic items based on component type
    const items: MenuItem[] = [];

    if (context.customData?.componentType) {
      const componentType = context.customData.componentType as string;

      // Add variant options for certain component types
      if (['primary-button', 'secondary-button', 'outline-button'].includes(componentType)) {
        items.push(
          createSeparator('dyn-sep-1'),
          createSubmenuItem('quick-variants', 'Quick Variants', [
            createActionItem('add-small', 'Small Size', 'add-variant', {
              actionParams: { type: componentType, variant: 'small' },
            }),
            createActionItem('add-large', 'Large Size', 'add-variant', {
              actionParams: { type: componentType, variant: 'large' },
            }),
            createActionItem('add-full-width', 'Full Width', 'add-variant', {
              actionParams: { type: componentType, variant: 'full-width' },
            }),
          ], {
            icon: 'Wand2',
          })
        );
      }
    }

    return items;
  },
};

// ============================================================================
// REGISTRATION
// ============================================================================

/**
 * Registers all default context menus
 */
export function registerDefaultMenus(): void {
  contextMenuRegistry.registerMenu(elementContextMenu);
  contextMenuRegistry.registerMenu(canvasContextMenu);
  contextMenuRegistry.registerMenu(sidebarContextMenu);
}

/**
 * Registers all default action handlers
 */
export function registerDefaultActionHandlers(handlers: {
  // Clipboard
  cut: () => void;
  copy: () => void;
  paste: (parentId?: string | null) => void;
  duplicate: () => void;
  delete: () => void;
  // Movement
  moveUp: () => void;
  moveDown: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  // Structure
  wrapInContainer: (containerType: string) => void;
  unwrap: () => void;
  // Editing
  editContent: () => void;
  editStyles: (category: string) => void;
  copyStyles: () => void;
  pasteStyles: () => void;
  // State
  toggleLock: () => void;
  toggleVisibility: () => void;
  // Advanced
  addAnimation: () => void;
  convertToComponent: () => void;
  viewCode: () => void;
  // Selection
  selectParent: () => void;
  selectChildren: () => void;
  selectAll: () => void;
  deselectAll: () => void;
  // Canvas
  addComponent: (type: string) => void;
  clearCanvas: () => void;
  // Zoom
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoom: number) => void;
  zoomFit: () => void;
  // View
  toggleGrid: () => void;
  toggleRulers?: () => void;
  toggleGuides?: () => void;
  // History
  undo: () => void;
  redo: () => void;
  // Export
  preview: () => void;
  exportCode: () => void;
  // Sidebar
  addToCanvas: (componentType: string) => void;
  addToFavorites: (componentType: string) => void;
  removeFromFavorites: (componentType: string) => void;
  viewVariants: (componentType: string) => void;
  viewDocumentation: (componentType: string) => void;
  copyAsCode: (componentType: string) => void;
}): void {
  // Clipboard actions
  contextMenuRegistry.registerActionHandler('cut', (action, ctx) => {
    handlers.copy();
    handlers.delete();
  });

  contextMenuRegistry.registerActionHandler('copy', () => handlers.copy());

  contextMenuRegistry.registerActionHandler('paste', (action, ctx) => {
    handlers.paste(ctx.targetElement?.id || null);
  });

  contextMenuRegistry.registerActionHandler('paste-after', (action, ctx) => {
    handlers.paste(ctx.parentElement?.id || null);
  });

  contextMenuRegistry.registerActionHandler('paste-to-canvas', () => {
    handlers.paste(null);
  });

  contextMenuRegistry.registerActionHandler('duplicate', () => handlers.duplicate());
  contextMenuRegistry.registerActionHandler('delete', () => handlers.delete());

  // Movement actions
  contextMenuRegistry.registerActionHandler('move-up', () => handlers.moveUp());
  contextMenuRegistry.registerActionHandler('move-down', () => handlers.moveDown());
  contextMenuRegistry.registerActionHandler('bring-to-front', () => handlers.bringToFront());
  contextMenuRegistry.registerActionHandler('send-to-back', () => handlers.sendToBack());

  // Structure actions
  contextMenuRegistry.registerActionHandler('wrap-in-container', () => {
    handlers.wrapInContainer('container');
  });
  contextMenuRegistry.registerActionHandler('wrap-in-flex-row', () => {
    handlers.wrapInContainer('flex-row');
  });
  contextMenuRegistry.registerActionHandler('wrap-in-flex-column', () => {
    handlers.wrapInContainer('flex-column');
  });
  contextMenuRegistry.registerActionHandler('wrap-in-grid', () => {
    handlers.wrapInContainer('grid-2-col');
  });
  contextMenuRegistry.registerActionHandler('unwrap', () => handlers.unwrap());

  // Editing actions
  contextMenuRegistry.registerActionHandler('edit-content', () => handlers.editContent());
  contextMenuRegistry.registerActionHandler('edit-styles-layout', () => handlers.editStyles('layout'));
  contextMenuRegistry.registerActionHandler('edit-styles-spacing', () => handlers.editStyles('spacing'));
  contextMenuRegistry.registerActionHandler('edit-styles-typography', () => handlers.editStyles('typography'));
  contextMenuRegistry.registerActionHandler('edit-styles-colors', () => handlers.editStyles('colors'));
  contextMenuRegistry.registerActionHandler('edit-styles-borders', () => handlers.editStyles('borders'));
  contextMenuRegistry.registerActionHandler('edit-styles-effects', () => handlers.editStyles('effects'));
  contextMenuRegistry.registerActionHandler('copy-styles', () => handlers.copyStyles());
  contextMenuRegistry.registerActionHandler('paste-styles', () => handlers.pasteStyles());

  // State actions
  contextMenuRegistry.registerActionHandler('toggle-lock', () => handlers.toggleLock());
  contextMenuRegistry.registerActionHandler('toggle-visibility', () => handlers.toggleVisibility());

  // Advanced actions
  contextMenuRegistry.registerActionHandler('add-animation', () => handlers.addAnimation());
  contextMenuRegistry.registerActionHandler('convert-to-component', () => handlers.convertToComponent());
  contextMenuRegistry.registerActionHandler('view-code', () => handlers.viewCode());

  // Selection actions
  contextMenuRegistry.registerActionHandler('select-parent', () => handlers.selectParent());
  contextMenuRegistry.registerActionHandler('select-children', () => handlers.selectChildren());
  contextMenuRegistry.registerActionHandler('select-all', () => handlers.selectAll());
  contextMenuRegistry.registerActionHandler('deselect-all', () => handlers.deselectAll());

  // Canvas actions
  contextMenuRegistry.registerActionHandler('add-component', (action, ctx, params) => {
    if (params?.type) {
      handlers.addComponent(params.type as string);
    }
  });
  contextMenuRegistry.registerActionHandler('clear-canvas', () => handlers.clearCanvas());

  // Zoom actions
  contextMenuRegistry.registerActionHandler('zoom-in', () => handlers.zoomIn());
  contextMenuRegistry.registerActionHandler('zoom-out', () => handlers.zoomOut());
  contextMenuRegistry.registerActionHandler('set-zoom', (action, ctx, params) => {
    if (params?.zoom) {
      handlers.setZoom(params.zoom as number);
    }
  });
  contextMenuRegistry.registerActionHandler('zoom-fit', () => handlers.zoomFit());

  // View actions
  contextMenuRegistry.registerActionHandler('toggle-grid', () => handlers.toggleGrid());
  contextMenuRegistry.registerActionHandler('toggle-rulers', () => handlers.toggleRulers?.());
  contextMenuRegistry.registerActionHandler('toggle-guides', () => handlers.toggleGuides?.());

  // History actions
  contextMenuRegistry.registerActionHandler('undo', () => handlers.undo());
  contextMenuRegistry.registerActionHandler('redo', () => handlers.redo());

  // Export actions
  contextMenuRegistry.registerActionHandler('preview', () => handlers.preview());
  contextMenuRegistry.registerActionHandler('export-code', () => handlers.exportCode());

  // Sidebar actions
  contextMenuRegistry.registerActionHandler('add-to-canvas', (action, ctx) => {
    if (ctx.customData?.componentType) {
      handlers.addToCanvas(ctx.customData.componentType as string);
    }
  });
  contextMenuRegistry.registerActionHandler('add-multiple', (action, ctx) => {
    // Could open a dialog for quantity
    if (ctx.customData?.componentType) {
      handlers.addToCanvas(ctx.customData.componentType as string);
    }
  });
  contextMenuRegistry.registerActionHandler('add-to-favorites', (action, ctx) => {
    if (ctx.customData?.componentType) {
      handlers.addToFavorites(ctx.customData.componentType as string);
    }
  });
  contextMenuRegistry.registerActionHandler('remove-from-favorites', (action, ctx) => {
    if (ctx.customData?.componentType) {
      handlers.removeFromFavorites(ctx.customData.componentType as string);
    }
  });
  contextMenuRegistry.registerActionHandler('view-variants', (action, ctx) => {
    if (ctx.customData?.componentType) {
      handlers.viewVariants(ctx.customData.componentType as string);
    }
  });
  contextMenuRegistry.registerActionHandler('view-documentation', (action, ctx) => {
    if (ctx.customData?.componentType) {
      handlers.viewDocumentation(ctx.customData.componentType as string);
    }
  });
  contextMenuRegistry.registerActionHandler('copy-as-code', (action, ctx) => {
    if (ctx.customData?.componentType) {
      handlers.copyAsCode(ctx.customData.componentType as string);
    }
  });
  contextMenuRegistry.registerActionHandler('add-variant', (action, ctx, params) => {
    if (params?.type) {
      handlers.addToCanvas(params.type as string);
    }
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  elementContextMenu,
  canvasContextMenu,
  sidebarContextMenu,
};
