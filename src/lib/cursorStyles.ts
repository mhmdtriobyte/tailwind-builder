/**
 * Cursor Styles Library
 *
 * Comprehensive cursor customization system with all CSS cursor types,
 * custom cursor support, presets, and animations.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Standard CSS cursor keyword values
 */
export type CSSCursorType =
  // General
  | 'auto'
  | 'default'
  | 'none'
  // Links & Status
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  // Selection
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  // Drag & Drop
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'grab'
  | 'grabbing'
  // Resizing & Scrolling
  | 'all-scroll'
  | 'col-resize'
  | 'row-resize'
  | 'n-resize'
  | 's-resize'
  | 'e-resize'
  | 'w-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  // Zoom
  | 'zoom-in'
  | 'zoom-out';

/**
 * Cursor category for organization
 */
export type CursorCategory =
  | 'general'
  | 'links'
  | 'selection'
  | 'drag'
  | 'resize'
  | 'zoom'
  | 'custom';

/**
 * Custom cursor configuration
 */
export interface CustomCursor {
  id: string;
  name: string;
  url: string;
  fallback: CSSCursorType;
  hotspotX: number;
  hotspotY: number;
  width?: number;
  height?: number;
}

/**
 * Cursor animation configuration
 */
export interface CursorAnimation {
  id: string;
  name: string;
  frames: string[];
  frameDuration: number;
  loop: boolean;
  fallback: CSSCursorType;
}

/**
 * Cursor definition with metadata
 */
export interface CursorDefinition {
  type: CSSCursorType;
  name: string;
  description: string;
  category: CursorCategory;
  tailwindClass: string;
  cssValue: string;
  icon?: string;
}

/**
 * Element type to cursor mapping preset
 */
export interface CursorPreset {
  elementType: string;
  defaultCursor: CSSCursorType;
  hoverCursor: CSSCursorType;
  activeCursor?: CSSCursorType;
  disabledCursor: CSSCursorType;
}

// ============================================================================
// CSS CURSOR DEFINITIONS
// ============================================================================

export const CURSOR_DEFINITIONS: CursorDefinition[] = [
  // General
  {
    type: 'auto',
    name: 'Auto',
    description: 'Browser determines the cursor based on context',
    category: 'general',
    tailwindClass: 'cursor-auto',
    cssValue: 'auto',
  },
  {
    type: 'default',
    name: 'Default',
    description: 'Platform-dependent default cursor (usually arrow)',
    category: 'general',
    tailwindClass: 'cursor-default',
    cssValue: 'default',
  },
  {
    type: 'none',
    name: 'None',
    description: 'No cursor is rendered',
    category: 'general',
    tailwindClass: 'cursor-none',
    cssValue: 'none',
  },

  // Links & Status
  {
    type: 'context-menu',
    name: 'Context Menu',
    description: 'Context menu is available',
    category: 'links',
    tailwindClass: 'cursor-context-menu',
    cssValue: 'context-menu',
  },
  {
    type: 'help',
    name: 'Help',
    description: 'Help information is available',
    category: 'links',
    tailwindClass: 'cursor-help',
    cssValue: 'help',
  },
  {
    type: 'pointer',
    name: 'Pointer',
    description: 'Link or interactive element (hand)',
    category: 'links',
    tailwindClass: 'cursor-pointer',
    cssValue: 'pointer',
  },
  {
    type: 'progress',
    name: 'Progress',
    description: 'Program is busy but still interactive',
    category: 'links',
    tailwindClass: 'cursor-progress',
    cssValue: 'progress',
  },
  {
    type: 'wait',
    name: 'Wait',
    description: 'Program is busy (hourglass/spinner)',
    category: 'links',
    tailwindClass: 'cursor-wait',
    cssValue: 'wait',
  },

  // Selection
  {
    type: 'cell',
    name: 'Cell',
    description: 'Table cell can be selected',
    category: 'selection',
    tailwindClass: 'cursor-cell',
    cssValue: 'cell',
  },
  {
    type: 'crosshair',
    name: 'Crosshair',
    description: 'Cross cursor for precise selection',
    category: 'selection',
    tailwindClass: 'cursor-crosshair',
    cssValue: 'crosshair',
  },
  {
    type: 'text',
    name: 'Text',
    description: 'Text can be selected (I-beam)',
    category: 'selection',
    tailwindClass: 'cursor-text',
    cssValue: 'text',
  },
  {
    type: 'vertical-text',
    name: 'Vertical Text',
    description: 'Vertical text can be selected',
    category: 'selection',
    tailwindClass: 'cursor-vertical-text',
    cssValue: 'vertical-text',
  },

  // Drag & Drop
  {
    type: 'alias',
    name: 'Alias',
    description: 'Alias or shortcut will be created',
    category: 'drag',
    tailwindClass: 'cursor-alias',
    cssValue: 'alias',
  },
  {
    type: 'copy',
    name: 'Copy',
    description: 'Something will be copied',
    category: 'drag',
    tailwindClass: 'cursor-copy',
    cssValue: 'copy',
  },
  {
    type: 'move',
    name: 'Move',
    description: 'Something will be moved',
    category: 'drag',
    tailwindClass: 'cursor-move',
    cssValue: 'move',
  },
  {
    type: 'no-drop',
    name: 'No Drop',
    description: 'Dragged item cannot be dropped here',
    category: 'drag',
    tailwindClass: 'cursor-no-drop',
    cssValue: 'no-drop',
  },
  {
    type: 'not-allowed',
    name: 'Not Allowed',
    description: 'Action is not allowed',
    category: 'drag',
    tailwindClass: 'cursor-not-allowed',
    cssValue: 'not-allowed',
  },
  {
    type: 'grab',
    name: 'Grab',
    description: 'Something can be grabbed (open hand)',
    category: 'drag',
    tailwindClass: 'cursor-grab',
    cssValue: 'grab',
  },
  {
    type: 'grabbing',
    name: 'Grabbing',
    description: 'Something is being grabbed (closed hand)',
    category: 'drag',
    tailwindClass: 'cursor-grabbing',
    cssValue: 'grabbing',
  },

  // Resizing & Scrolling
  {
    type: 'all-scroll',
    name: 'All Scroll',
    description: 'Element can be scrolled in any direction',
    category: 'resize',
    tailwindClass: 'cursor-all-scroll',
    cssValue: 'all-scroll',
  },
  {
    type: 'col-resize',
    name: 'Column Resize',
    description: 'Column can be resized horizontally',
    category: 'resize',
    tailwindClass: 'cursor-col-resize',
    cssValue: 'col-resize',
  },
  {
    type: 'row-resize',
    name: 'Row Resize',
    description: 'Row can be resized vertically',
    category: 'resize',
    tailwindClass: 'cursor-row-resize',
    cssValue: 'row-resize',
  },
  {
    type: 'n-resize',
    name: 'North Resize',
    description: 'Resize from north edge',
    category: 'resize',
    tailwindClass: 'cursor-n-resize',
    cssValue: 'n-resize',
  },
  {
    type: 's-resize',
    name: 'South Resize',
    description: 'Resize from south edge',
    category: 'resize',
    tailwindClass: 'cursor-s-resize',
    cssValue: 's-resize',
  },
  {
    type: 'e-resize',
    name: 'East Resize',
    description: 'Resize from east edge',
    category: 'resize',
    tailwindClass: 'cursor-e-resize',
    cssValue: 'e-resize',
  },
  {
    type: 'w-resize',
    name: 'West Resize',
    description: 'Resize from west edge',
    category: 'resize',
    tailwindClass: 'cursor-w-resize',
    cssValue: 'w-resize',
  },
  {
    type: 'ne-resize',
    name: 'Northeast Resize',
    description: 'Resize from northeast corner',
    category: 'resize',
    tailwindClass: 'cursor-ne-resize',
    cssValue: 'ne-resize',
  },
  {
    type: 'nw-resize',
    name: 'Northwest Resize',
    description: 'Resize from northwest corner',
    category: 'resize',
    tailwindClass: 'cursor-nw-resize',
    cssValue: 'nw-resize',
  },
  {
    type: 'se-resize',
    name: 'Southeast Resize',
    description: 'Resize from southeast corner',
    category: 'resize',
    tailwindClass: 'cursor-se-resize',
    cssValue: 'se-resize',
  },
  {
    type: 'sw-resize',
    name: 'Southwest Resize',
    description: 'Resize from southwest corner',
    category: 'resize',
    tailwindClass: 'cursor-sw-resize',
    cssValue: 'sw-resize',
  },
  {
    type: 'ew-resize',
    name: 'East-West Resize',
    description: 'Bidirectional horizontal resize',
    category: 'resize',
    tailwindClass: 'cursor-ew-resize',
    cssValue: 'ew-resize',
  },
  {
    type: 'ns-resize',
    name: 'North-South Resize',
    description: 'Bidirectional vertical resize',
    category: 'resize',
    tailwindClass: 'cursor-ns-resize',
    cssValue: 'ns-resize',
  },
  {
    type: 'nesw-resize',
    name: 'NESW Resize',
    description: 'Bidirectional diagonal resize (NE-SW)',
    category: 'resize',
    tailwindClass: 'cursor-nesw-resize',
    cssValue: 'nesw-resize',
  },
  {
    type: 'nwse-resize',
    name: 'NWSE Resize',
    description: 'Bidirectional diagonal resize (NW-SE)',
    category: 'resize',
    tailwindClass: 'cursor-nwse-resize',
    cssValue: 'nwse-resize',
  },

  // Zoom
  {
    type: 'zoom-in',
    name: 'Zoom In',
    description: 'Content can be zoomed in',
    category: 'zoom',
    tailwindClass: 'cursor-zoom-in',
    cssValue: 'zoom-in',
  },
  {
    type: 'zoom-out',
    name: 'Zoom Out',
    description: 'Content can be zoomed out',
    category: 'zoom',
    tailwindClass: 'cursor-zoom-out',
    cssValue: 'zoom-out',
  },
];

// ============================================================================
// CURSOR PRESETS BY ELEMENT TYPE
// ============================================================================

export const ELEMENT_CURSOR_PRESETS: CursorPreset[] = [
  // Interactive Elements
  {
    elementType: 'button',
    defaultCursor: 'pointer',
    hoverCursor: 'pointer',
    activeCursor: 'pointer',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'link',
    defaultCursor: 'pointer',
    hoverCursor: 'pointer',
    activeCursor: 'pointer',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'checkbox',
    defaultCursor: 'pointer',
    hoverCursor: 'pointer',
    activeCursor: 'pointer',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'radio',
    defaultCursor: 'pointer',
    hoverCursor: 'pointer',
    activeCursor: 'pointer',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'toggle',
    defaultCursor: 'pointer',
    hoverCursor: 'pointer',
    activeCursor: 'pointer',
    disabledCursor: 'not-allowed',
  },

  // Text Input Elements
  {
    elementType: 'input',
    defaultCursor: 'text',
    hoverCursor: 'text',
    activeCursor: 'text',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'textarea',
    defaultCursor: 'text',
    hoverCursor: 'text',
    activeCursor: 'text',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'select',
    defaultCursor: 'pointer',
    hoverCursor: 'pointer',
    activeCursor: 'pointer',
    disabledCursor: 'not-allowed',
  },

  // Draggable Elements
  {
    elementType: 'draggable',
    defaultCursor: 'grab',
    hoverCursor: 'grab',
    activeCursor: 'grabbing',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'sortable-item',
    defaultCursor: 'grab',
    hoverCursor: 'grab',
    activeCursor: 'grabbing',
    disabledCursor: 'not-allowed',
  },

  // Resizable Elements
  {
    elementType: 'resizable',
    defaultCursor: 'default',
    hoverCursor: 'default',
    activeCursor: 'default',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'resize-handle-n',
    defaultCursor: 'n-resize',
    hoverCursor: 'n-resize',
    activeCursor: 'n-resize',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'resize-handle-s',
    defaultCursor: 's-resize',
    hoverCursor: 's-resize',
    activeCursor: 's-resize',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'resize-handle-e',
    defaultCursor: 'e-resize',
    hoverCursor: 'e-resize',
    activeCursor: 'e-resize',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'resize-handle-w',
    defaultCursor: 'w-resize',
    hoverCursor: 'w-resize',
    activeCursor: 'w-resize',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'resize-handle-nw',
    defaultCursor: 'nw-resize',
    hoverCursor: 'nw-resize',
    activeCursor: 'nw-resize',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'resize-handle-ne',
    defaultCursor: 'ne-resize',
    hoverCursor: 'ne-resize',
    activeCursor: 'ne-resize',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'resize-handle-sw',
    defaultCursor: 'sw-resize',
    hoverCursor: 'sw-resize',
    activeCursor: 'sw-resize',
    disabledCursor: 'not-allowed',
  },
  {
    elementType: 'resize-handle-se',
    defaultCursor: 'se-resize',
    hoverCursor: 'se-resize',
    activeCursor: 'se-resize',
    disabledCursor: 'not-allowed',
  },

  // Media Elements
  {
    elementType: 'image',
    defaultCursor: 'default',
    hoverCursor: 'zoom-in',
    activeCursor: 'zoom-in',
    disabledCursor: 'default',
  },
  {
    elementType: 'video',
    defaultCursor: 'pointer',
    hoverCursor: 'pointer',
    activeCursor: 'pointer',
    disabledCursor: 'default',
  },

  // Loading States
  {
    elementType: 'loading',
    defaultCursor: 'progress',
    hoverCursor: 'progress',
    activeCursor: 'progress',
    disabledCursor: 'wait',
  },

  // Text Elements
  {
    elementType: 'text',
    defaultCursor: 'text',
    hoverCursor: 'text',
    activeCursor: 'text',
    disabledCursor: 'default',
  },
  {
    elementType: 'heading',
    defaultCursor: 'default',
    hoverCursor: 'default',
    activeCursor: 'default',
    disabledCursor: 'default',
  },

  // Help Elements
  {
    elementType: 'tooltip-trigger',
    defaultCursor: 'help',
    hoverCursor: 'help',
    activeCursor: 'help',
    disabledCursor: 'default',
  },

  // Context Menu Elements
  {
    elementType: 'context-menu-trigger',
    defaultCursor: 'context-menu',
    hoverCursor: 'context-menu',
    activeCursor: 'context-menu',
    disabledCursor: 'default',
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get cursor definition by type
 */
export function getCursorDefinition(type: CSSCursorType): CursorDefinition | undefined {
  return CURSOR_DEFINITIONS.find((c) => c.type === type);
}

/**
 * Get cursors by category
 */
export function getCursorsByCategory(category: CursorCategory): CursorDefinition[] {
  return CURSOR_DEFINITIONS.filter((c) => c.category === category);
}

/**
 * Get cursor preset for element type
 */
export function getCursorPreset(elementType: string): CursorPreset | undefined {
  return ELEMENT_CURSOR_PRESETS.find(
    (p) => elementType.toLowerCase().includes(p.elementType.toLowerCase())
  );
}

/**
 * Convert cursor type to Tailwind class
 */
export function cursorToTailwind(cursor: CSSCursorType): string {
  const def = getCursorDefinition(cursor);
  return def?.tailwindClass || `cursor-[${cursor}]`;
}

/**
 * Convert cursor type to CSS value
 */
export function cursorToCss(cursor: CSSCursorType): string {
  return `cursor: ${cursor};`;
}

/**
 * Generate CSS for custom cursor
 */
export function customCursorToCss(cursor: CustomCursor): string {
  return `cursor: url('${cursor.url}') ${cursor.hotspotX} ${cursor.hotspotY}, ${cursor.fallback};`;
}

/**
 * Generate Tailwind arbitrary value for custom cursor
 */
export function customCursorToTailwind(cursor: CustomCursor): string {
  const encodedUrl = encodeURIComponent(cursor.url);
  return `cursor-[url('${encodedUrl}')_${cursor.hotspotX}_${cursor.hotspotY},${cursor.fallback}]`;
}

/**
 * Validate custom cursor URL
 */
export function validateCursorUrl(url: string): { valid: boolean; error?: string } {
  // Check if URL is valid
  try {
    new URL(url);
  } catch {
    // Could be a data URL or relative path
    if (!url.startsWith('data:') && !url.startsWith('/') && !url.startsWith('./')) {
      return { valid: false, error: 'Invalid URL format' };
    }
  }

  // Check file extension
  const validExtensions = ['.cur', '.png', '.gif', '.svg', '.ico'];
  const hasValidExtension = validExtensions.some((ext) =>
    url.toLowerCase().includes(ext)
  );

  if (!hasValidExtension && !url.startsWith('data:')) {
    return { valid: false, error: 'Invalid cursor file type. Use .cur, .png, .gif, .svg, or .ico' };
  }

  return { valid: true };
}

/**
 * Create a custom cursor from a file
 */
export function createCustomCursor(
  id: string,
  name: string,
  url: string,
  options?: {
    fallback?: CSSCursorType;
    hotspotX?: number;
    hotspotY?: number;
    width?: number;
    height?: number;
  }
): CustomCursor {
  return {
    id,
    name,
    url,
    fallback: options?.fallback || 'default',
    hotspotX: options?.hotspotX || 0,
    hotspotY: options?.hotspotY || 0,
    width: options?.width,
    height: options?.height,
  };
}

/**
 * Create CSS keyframes for animated cursor
 */
export function createCursorAnimation(animation: CursorAnimation): string {
  const keyframes = animation.frames
    .map((frame, index) => {
      const percentage = (index / (animation.frames.length - 1)) * 100;
      return `${percentage}% { cursor: url('${frame}'), ${animation.fallback}; }`;
    })
    .join('\n');

  return `
@keyframes cursor-animation-${animation.id} {
${keyframes}
}

.cursor-animated-${animation.id} {
  animation: cursor-animation-${animation.id} ${animation.frameDuration * animation.frames.length}ms ${
    animation.loop ? 'infinite' : 'forwards'
  };
}`;
}

/**
 * Generate cursor classes for all states of an element
 */
export function generateStateCursorClasses(preset: CursorPreset): string[] {
  const classes: string[] = [];

  classes.push(cursorToTailwind(preset.defaultCursor));

  if (preset.hoverCursor !== preset.defaultCursor) {
    classes.push(`hover:${cursorToTailwind(preset.hoverCursor)}`);
  }

  if (preset.activeCursor && preset.activeCursor !== preset.hoverCursor) {
    classes.push(`active:${cursorToTailwind(preset.activeCursor)}`);
  }

  classes.push(`disabled:${cursorToTailwind(preset.disabledCursor)}`);

  return classes;
}

/**
 * Get all cursor categories
 */
export function getAllCursorCategories(): CursorCategory[] {
  return ['general', 'links', 'selection', 'drag', 'resize', 'zoom', 'custom'];
}

/**
 * Get cursor options for a select dropdown
 */
export function getCursorOptions(): Array<{ label: string; value: CSSCursorType; category: CursorCategory }> {
  return CURSOR_DEFINITIONS.map((c) => ({
    label: c.name,
    value: c.type,
    category: c.category,
  }));
}

/**
 * Get cursor options grouped by category
 */
export function getCursorOptionsGrouped(): Record<CursorCategory, Array<{ label: string; value: CSSCursorType }>> {
  const grouped: Record<CursorCategory, Array<{ label: string; value: CSSCursorType }>> = {
    general: [],
    links: [],
    selection: [],
    drag: [],
    resize: [],
    zoom: [],
    custom: [],
  };

  for (const cursor of CURSOR_DEFINITIONS) {
    grouped[cursor.category].push({
      label: cursor.name,
      value: cursor.type,
    });
  }

  return grouped;
}

/**
 * Parse cursor CSS value to type
 */
export function parseCursorCss(cssValue: string): CSSCursorType | null {
  const match = cssValue.match(/cursor:\s*(\S+)/);
  if (match) {
    const value = match[1].replace(';', '') as CSSCursorType;
    const def = getCursorDefinition(value);
    return def ? value : null;
  }
  return null;
}

/**
 * Parse Tailwind cursor class
 */
export function parseCursorTailwind(className: string): CSSCursorType | null {
  const match = className.match(/^cursor-(.+)$/);
  if (match) {
    const value = match[1] as CSSCursorType;
    const def = getCursorDefinition(value);
    return def ? value : null;
  }
  return null;
}

/**
 * Check if cursor is a resize cursor
 */
export function isResizeCursor(cursor: CSSCursorType): boolean {
  const def = getCursorDefinition(cursor);
  return def?.category === 'resize';
}

/**
 * Check if cursor is interactive (pointer, grab, etc.)
 */
export function isInteractiveCursor(cursor: CSSCursorType): boolean {
  return ['pointer', 'grab', 'grabbing', 'move', 'copy'].includes(cursor);
}

/**
 * Get the opposite resize cursor (for bidirectional resize)
 */
export function getOppositeResizeCursor(cursor: CSSCursorType): CSSCursorType | null {
  const opposites: Record<string, CSSCursorType> = {
    'n-resize': 's-resize',
    's-resize': 'n-resize',
    'e-resize': 'w-resize',
    'w-resize': 'e-resize',
    'ne-resize': 'sw-resize',
    'nw-resize': 'se-resize',
    'se-resize': 'nw-resize',
    'sw-resize': 'ne-resize',
  };
  return opposites[cursor] || null;
}

/**
 * Suggested cursors for common use cases
 */
export const CURSOR_SUGGESTIONS = {
  clickable: 'pointer' as CSSCursorType,
  textEditable: 'text' as CSSCursorType,
  disabled: 'not-allowed' as CSSCursorType,
  loading: 'wait' as CSSCursorType,
  draggable: 'grab' as CSSCursorType,
  dragging: 'grabbing' as CSSCursorType,
  resizable: 'nwse-resize' as CSSCursorType,
  zoomable: 'zoom-in' as CSSCursorType,
  helpAvailable: 'help' as CSSCursorType,
  contextMenu: 'context-menu' as CSSCursorType,
  crosshairSelection: 'crosshair' as CSSCursorType,
  moveable: 'move' as CSSCursorType,
  copyAction: 'copy' as CSSCursorType,
};
