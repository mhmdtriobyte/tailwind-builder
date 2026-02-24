/**
 * CSS IntelliSense - Intelligent CSS assistance and suggestions
 *
 * This module provides:
 * - Property value suggestions
 * - Color format conversion
 * - Unit conversion
 * - CSS function helpers (calc, var, clamp)
 * - Tailwind class suggestions
 * - Custom property references
 */

import { CSS_PROPERTIES, getPropertyNames, getPropertyValues } from './cssParser';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

/** Suggestion item for autocomplete */
export interface Suggestion {
  /** Display label */
  label: string;
  /** Value to insert */
  insertText: string;
  /** Type of suggestion */
  kind: 'property' | 'value' | 'function' | 'variable' | 'color' | 'unit' | 'class' | 'snippet';
  /** Brief description */
  detail?: string;
  /** Full documentation */
  documentation?: string;
  /** Sort priority (lower = higher priority) */
  sortOrder?: number;
  /** Whether to trigger further suggestions after insertion */
  triggerSuggest?: boolean;
}

/** Color representation */
export interface ColorValue {
  /** Hex format (#RRGGBB or #RRGGBBAA) */
  hex: string;
  /** RGB format */
  rgb: { r: number; g: number; b: number; a?: number };
  /** HSL format */
  hsl: { h: number; s: number; l: number; a?: number };
  /** CSS representation */
  css: {
    hex: string;
    rgb: string;
    hsl: string;
    hwb?: string;
  };
}

/** Unit conversion result */
export interface UnitConversion {
  /** Original value with unit */
  original: string;
  /** Value in different units */
  conversions: Record<string, string>;
}

/** CSS function info */
export interface CSSFunctionInfo {
  name: string;
  syntax: string;
  description: string;
  parameters: { name: string; type: string; required: boolean; description: string }[];
  examples: string[];
}

// =============================================================================
// CSS PROPERTY SUGGESTIONS
// =============================================================================

/** Property categories for organized suggestions */
export const PROPERTY_CATEGORIES: Record<string, string[]> = {
  layout: [
    'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index',
    'float', 'clear', 'visibility', 'overflow', 'overflow-x', 'overflow-y',
  ],
  flexbox: [
    'flex', 'flex-direction', 'flex-wrap', 'flex-flow', 'flex-grow',
    'flex-shrink', 'flex-basis', 'justify-content', 'align-items',
    'align-content', 'align-self', 'order', 'gap', 'row-gap', 'column-gap',
  ],
  grid: [
    'grid', 'grid-template', 'grid-template-columns', 'grid-template-rows',
    'grid-template-areas', 'grid-column', 'grid-row', 'grid-area',
    'grid-auto-columns', 'grid-auto-rows', 'grid-auto-flow',
  ],
  sizing: [
    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
    'box-sizing', 'aspect-ratio',
  ],
  spacing: [
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  ],
  typography: [
    'font', 'font-family', 'font-size', 'font-weight', 'font-style',
    'font-variant', 'line-height', 'letter-spacing', 'word-spacing',
    'text-align', 'text-decoration', 'text-transform', 'text-indent',
    'text-shadow', 'text-overflow', 'white-space', 'word-break', 'word-wrap',
  ],
  colors: [
    'color', 'background', 'background-color', 'background-image',
    'background-position', 'background-repeat', 'background-size',
    'background-attachment', 'background-clip', 'background-origin', 'opacity',
  ],
  borders: [
    'border', 'border-width', 'border-style', 'border-color',
    'border-top', 'border-right', 'border-bottom', 'border-left',
    'border-radius', 'border-collapse', 'outline', 'outline-width',
    'outline-style', 'outline-color', 'outline-offset',
  ],
  effects: [
    'box-shadow', 'filter', 'backdrop-filter', 'mix-blend-mode',
  ],
  transforms: [
    'transform', 'transform-origin', 'transform-style', 'perspective',
    'perspective-origin', 'backface-visibility',
  ],
  transitions: [
    'transition', 'transition-property', 'transition-duration',
    'transition-timing-function', 'transition-delay',
  ],
  animations: [
    'animation', 'animation-name', 'animation-duration',
    'animation-timing-function', 'animation-delay', 'animation-iteration-count',
    'animation-direction', 'animation-fill-mode', 'animation-play-state',
  ],
};

/**
 * Gets property suggestions based on partial input
 */
export function getPropertySuggestions(partial: string = ''): Suggestion[] {
  const allProperties = getPropertyNames();
  const partialLower = partial.toLowerCase();

  const filtered = allProperties.filter((prop) =>
    prop.toLowerCase().includes(partialLower)
  );

  // Sort by relevance
  filtered.sort((a, b) => {
    const aStartsWith = a.toLowerCase().startsWith(partialLower);
    const bStartsWith = b.toLowerCase().startsWith(partialLower);

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    return a.localeCompare(b);
  });

  return filtered.map((prop, index) => ({
    label: prop,
    insertText: `${prop}: `,
    kind: 'property' as const,
    detail: getCategoryForProperty(prop),
    documentation: getPropertyDocumentation(prop),
    sortOrder: index,
    triggerSuggest: true,
  }));
}

/**
 * Gets value suggestions for a specific property
 */
export function getValueSuggestions(property: string, partial: string = ''): Suggestion[] {
  const values = getPropertyValues(property.toLowerCase());
  const partialLower = partial.toLowerCase();
  const suggestions: Suggestion[] = [];

  for (const value of values) {
    // Skip placeholder values
    if (value.startsWith('<') && value.endsWith('>')) {
      // Add unit suggestions for length/percentage
      if (value === '<length>') {
        suggestions.push(...getLengthSuggestions(partialLower));
      } else if (value === '<percentage>') {
        suggestions.push(...getPercentageSuggestions(partialLower));
      } else if (value === '<color>') {
        suggestions.push(...getColorSuggestions(partialLower));
      } else if (value === '<time>') {
        suggestions.push(...getTimeSuggestions(partialLower));
      }
      continue;
    }

    if (!partial || value.toLowerCase().includes(partialLower)) {
      suggestions.push({
        label: value,
        insertText: value,
        kind: 'value',
        sortOrder: suggestions.length,
      });
    }
  }

  // Add CSS function suggestions for certain properties
  if (isPropertySupportingFunctions(property)) {
    suggestions.push(...getFunctionSuggestions(partial));
  }

  // Add variable suggestions
  suggestions.push(...getVariableSuggestions(partial));

  return suggestions;
}

/**
 * Gets category for a property
 */
function getCategoryForProperty(property: string): string {
  for (const [category, properties] of Object.entries(PROPERTY_CATEGORIES)) {
    if (properties.includes(property)) {
      return category.charAt(0).toUpperCase() + category.slice(1);
    }
  }
  return 'Other';
}

/**
 * Gets documentation for a property
 */
function getPropertyDocumentation(property: string): string {
  const propDef = CSS_PROPERTIES[property];
  if (!propDef) return '';

  const parts: string[] = [];

  if (propDef.inherited) {
    parts.push('Inherited: Yes');
  }

  if (propDef.animatable) {
    parts.push('Animatable: Yes');
  }

  parts.push(`Values: ${propDef.values.slice(0, 5).join(', ')}${propDef.values.length > 5 ? '...' : ''}`);

  return parts.join('\n');
}

// =============================================================================
// LENGTH AND UNIT SUGGESTIONS
// =============================================================================

/** Common length units */
const LENGTH_UNITS = ['px', 'rem', 'em', '%', 'vw', 'vh', 'vmin', 'vmax', 'ch', 'ex', 'cm', 'mm', 'in', 'pt', 'pc'];

/**
 * Gets length value suggestions
 */
function getLengthSuggestions(partial: string): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Common pixel values
  const commonPixels = [0, 1, 2, 4, 8, 12, 16, 20, 24, 32, 48, 64, 100];
  for (const px of commonPixels) {
    const value = `${px}px`;
    if (!partial || value.includes(partial)) {
      suggestions.push({
        label: value,
        insertText: value,
        kind: 'unit',
        detail: 'pixels',
      });
    }
  }

  // Common rem values
  const commonRems = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4];
  for (const rem of commonRems) {
    const value = `${rem}rem`;
    if (!partial || value.includes(partial)) {
      suggestions.push({
        label: value,
        insertText: value,
        kind: 'unit',
        detail: `${rem * 16}px (at 16px base)`,
      });
    }
  }

  // Auto
  if (!partial || 'auto'.includes(partial)) {
    suggestions.push({
      label: 'auto',
      insertText: 'auto',
      kind: 'value',
    });
  }

  return suggestions;
}

/**
 * Gets percentage suggestions
 */
function getPercentageSuggestions(partial: string): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const percentages = [0, 10, 20, 25, 30, 33.33, 40, 50, 60, 66.67, 70, 75, 80, 90, 100];

  for (const pct of percentages) {
    const value = `${pct}%`;
    if (!partial || value.includes(partial)) {
      suggestions.push({
        label: value,
        insertText: value,
        kind: 'unit',
      });
    }
  }

  return suggestions;
}

/**
 * Gets time suggestions
 */
function getTimeSuggestions(partial: string): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Milliseconds
  const milliseconds = [100, 150, 200, 250, 300, 400, 500, 750, 1000];
  for (const ms of milliseconds) {
    const value = `${ms}ms`;
    if (!partial || value.includes(partial)) {
      suggestions.push({
        label: value,
        insertText: value,
        kind: 'unit',
        detail: 'milliseconds',
      });
    }
  }

  // Seconds
  const seconds = [0.1, 0.2, 0.3, 0.5, 1, 1.5, 2];
  for (const s of seconds) {
    const value = `${s}s`;
    if (!partial || value.includes(partial)) {
      suggestions.push({
        label: value,
        insertText: value,
        kind: 'unit',
        detail: 'seconds',
      });
    }
  }

  return suggestions;
}

// =============================================================================
// COLOR UTILITIES
// =============================================================================

/** Named CSS colors */
const NAMED_COLORS: Record<string, string> = {
  'transparent': 'rgba(0, 0, 0, 0)',
  'currentColor': 'currentColor',
  'inherit': 'inherit',
  'black': '#000000',
  'white': '#ffffff',
  'red': '#ff0000',
  'green': '#008000',
  'blue': '#0000ff',
  'yellow': '#ffff00',
  'cyan': '#00ffff',
  'magenta': '#ff00ff',
  'gray': '#808080',
  'grey': '#808080',
  'silver': '#c0c0c0',
  'maroon': '#800000',
  'olive': '#808000',
  'lime': '#00ff00',
  'aqua': '#00ffff',
  'teal': '#008080',
  'navy': '#000080',
  'fuchsia': '#ff00ff',
  'purple': '#800080',
  'orange': '#ffa500',
  'pink': '#ffc0cb',
  'coral': '#ff7f50',
  'salmon': '#fa8072',
  'tomato': '#ff6347',
  'gold': '#ffd700',
  'khaki': '#f0e68c',
  'plum': '#dda0dd',
  'orchid': '#da70d6',
  'violet': '#ee82ee',
  'indigo': '#4b0082',
  'turquoise': '#40e0d0',
  'skyblue': '#87ceeb',
  'steelblue': '#4682b4',
  'royalblue': '#4169e1',
  'slategray': '#708090',
  'darkgray': '#a9a9a9',
  'lightgray': '#d3d3d3',
  'whitesmoke': '#f5f5f5',
  'ivory': '#fffff0',
  'beige': '#f5f5dc',
  'linen': '#faf0e6',
  'snow': '#fffafa',
};

/**
 * Gets color suggestions
 */
function getColorSuggestions(partial: string): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Named colors
  for (const [name, value] of Object.entries(NAMED_COLORS)) {
    if (!partial || name.toLowerCase().includes(partial.toLowerCase())) {
      suggestions.push({
        label: name,
        insertText: name,
        kind: 'color',
        detail: value !== name ? value : undefined,
      });
    }
  }

  // Color functions
  if (!partial || 'rgb'.includes(partial)) {
    suggestions.push({
      label: 'rgb()',
      insertText: 'rgb(${1:0}, ${2:0}, ${3:0})',
      kind: 'function',
      detail: 'RGB color',
    });
  }

  if (!partial || 'rgba'.includes(partial)) {
    suggestions.push({
      label: 'rgba()',
      insertText: 'rgba(${1:0}, ${2:0}, ${3:0}, ${4:1})',
      kind: 'function',
      detail: 'RGBA color with alpha',
    });
  }

  if (!partial || 'hsl'.includes(partial)) {
    suggestions.push({
      label: 'hsl()',
      insertText: 'hsl(${1:0}, ${2:100%}, ${3:50%})',
      kind: 'function',
      detail: 'HSL color',
    });
  }

  if (!partial || 'hsla'.includes(partial)) {
    suggestions.push({
      label: 'hsla()',
      insertText: 'hsla(${1:0}, ${2:100%}, ${3:50%}, ${4:1})',
      kind: 'function',
      detail: 'HSLA color with alpha',
    });
  }

  return suggestions;
}

/**
 * Parses a color string and returns all formats
 */
export function parseColor(color: string): ColorValue | null {
  const trimmed = color.trim().toLowerCase();

  // Try hex
  const hexMatch = trimmed.match(/^#([a-f0-9]{3,8})$/);
  if (hexMatch) {
    return parseHexColor(hexMatch[1]);
  }

  // Try rgb/rgba
  const rgbMatch = trimmed.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const a = rgbMatch[4] ? parseFloat(rgbMatch[4]) : undefined;
    return rgbToColorValue(r, g, b, a);
  }

  // Try hsl/hsla
  const hslMatch = trimmed.match(/^hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/);
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]);
    const l = parseFloat(hslMatch[3]);
    const a = hslMatch[4] ? parseFloat(hslMatch[4]) : undefined;
    return hslToColorValue(h, s, l, a);
  }

  // Try named color
  if (NAMED_COLORS[trimmed]) {
    return parseColor(NAMED_COLORS[trimmed]);
  }

  return null;
}

/**
 * Parses hex color
 */
function parseHexColor(hex: string): ColorValue {
  let r: number, g: number, b: number, a: number | undefined;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
    a = parseInt(hex[3] + hex[3], 16) / 255;
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    a = parseInt(hex.slice(6, 8), 16) / 255;
  }

  return rgbToColorValue(r, g, b, a);
}

/**
 * Converts RGB to ColorValue
 */
function rgbToColorValue(r: number, g: number, b: number, a?: number): ColorValue {
  const hsl = rgbToHsl(r, g, b);

  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');
  const hexA = a !== undefined ? Math.round(a * 255).toString(16).padStart(2, '0') : '';

  return {
    hex: `#${hexR}${hexG}${hexB}${hexA}`,
    rgb: { r, g, b, a },
    hsl: { h: hsl.h, s: hsl.s, l: hsl.l, a },
    css: {
      hex: `#${hexR}${hexG}${hexB}${hexA}`,
      rgb: a !== undefined
        ? `rgba(${r}, ${g}, ${b}, ${a})`
        : `rgb(${r}, ${g}, ${b})`,
      hsl: a !== undefined
        ? `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${a})`
        : `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`,
    },
  };
}

/**
 * Converts HSL to ColorValue
 */
function hslToColorValue(h: number, s: number, l: number, a?: number): ColorValue {
  const rgb = hslToRgb(h, s, l);
  return rgbToColorValue(rgb.r, rgb.g, rgb.b, a);
}

/**
 * Converts RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Converts HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Converts color to different format
 */
export function convertColor(color: string, format: 'hex' | 'rgb' | 'hsl'): string | null {
  const parsed = parseColor(color);
  if (!parsed) return null;
  return parsed.css[format];
}

// =============================================================================
// UNIT CONVERSION
// =============================================================================

/** Conversion factors */
const PX_TO_UNIT: Record<string, number> = {
  'px': 1,
  'rem': 16, // assuming 16px base
  'em': 16, // assuming 16px context
  'pt': 1.333333,
  'pc': 16,
  'in': 96,
  'cm': 37.795275591,
  'mm': 3.7795275591,
};

/**
 * Converts a CSS length value to different units
 */
export function convertUnit(value: string, baseFontSize: number = 16): UnitConversion | null {
  const match = value.match(/^(-?[\d.]+)\s*(px|rem|em|pt|pc|in|cm|mm|%|vw|vh)?$/);
  if (!match) return null;

  const numValue = parseFloat(match[1]);
  const unit = match[2] || 'px';

  // Can't convert viewport units
  if (['%', 'vw', 'vh', 'vmin', 'vmax'].includes(unit)) {
    return {
      original: value,
      conversions: { [unit]: value },
    };
  }

  // Convert to pixels first
  let pixels: number;
  if (unit === 'rem' || unit === 'em') {
    pixels = numValue * baseFontSize;
  } else {
    pixels = numValue * (PX_TO_UNIT[unit] || 1);
  }

  const conversions: Record<string, string> = {};

  // Convert to each unit
  conversions['px'] = `${Math.round(pixels * 100) / 100}px`;
  conversions['rem'] = `${Math.round((pixels / baseFontSize) * 1000) / 1000}rem`;
  conversions['em'] = `${Math.round((pixels / baseFontSize) * 1000) / 1000}em`;
  conversions['pt'] = `${Math.round((pixels / PX_TO_UNIT['pt']) * 100) / 100}pt`;

  return {
    original: value,
    conversions,
  };
}

// =============================================================================
// CSS FUNCTIONS
// =============================================================================

/** CSS function definitions */
export const CSS_FUNCTIONS: Record<string, CSSFunctionInfo> = {
  'calc': {
    name: 'calc',
    syntax: 'calc(<expression>)',
    description: 'Performs calculations to determine CSS property values.',
    parameters: [
      { name: 'expression', type: 'math-expression', required: true, description: 'A mathematical expression using +, -, *, /' },
    ],
    examples: [
      'calc(100% - 20px)',
      'calc(100vh - 4rem)',
      'calc(50% + 10px)',
      'calc(var(--spacing) * 2)',
    ],
  },
  'var': {
    name: 'var',
    syntax: 'var(<custom-property-name>, <fallback-value>?)',
    description: 'Substitutes the value of a custom property.',
    parameters: [
      { name: 'custom-property-name', type: 'custom-property', required: true, description: 'The name of the custom property (e.g., --my-color)' },
      { name: 'fallback-value', type: 'any', required: false, description: 'Fallback value if the custom property is not defined' },
    ],
    examples: [
      'var(--primary-color)',
      'var(--spacing, 1rem)',
      'var(--bg, var(--fallback-bg, white))',
    ],
  },
  'clamp': {
    name: 'clamp',
    syntax: 'clamp(<min>, <preferred>, <max>)',
    description: 'Clamps a value between a minimum and maximum.',
    parameters: [
      { name: 'min', type: 'length|percentage', required: true, description: 'Minimum value' },
      { name: 'preferred', type: 'length|percentage', required: true, description: 'Preferred value' },
      { name: 'max', type: 'length|percentage', required: true, description: 'Maximum value' },
    ],
    examples: [
      'clamp(1rem, 2.5vw, 2rem)',
      'clamp(200px, 50%, 500px)',
    ],
  },
  'min': {
    name: 'min',
    syntax: 'min(<value1>, <value2>, ...)',
    description: 'Returns the smallest value.',
    parameters: [
      { name: 'values', type: 'length|percentage', required: true, description: 'One or more values to compare' },
    ],
    examples: [
      'min(100%, 500px)',
      'min(50vw, 30rem)',
    ],
  },
  'max': {
    name: 'max',
    syntax: 'max(<value1>, <value2>, ...)',
    description: 'Returns the largest value.',
    parameters: [
      { name: 'values', type: 'length|percentage', required: true, description: 'One or more values to compare' },
    ],
    examples: [
      'max(100px, 10%)',
      'max(2rem, 20px)',
    ],
  },
  'url': {
    name: 'url',
    syntax: 'url(<path>)',
    description: 'References an external resource.',
    parameters: [
      { name: 'path', type: 'string', required: true, description: 'Path to the resource' },
    ],
    examples: [
      "url('/images/background.png')",
      'url(data:image/svg+xml,...)',
    ],
  },
  'linear-gradient': {
    name: 'linear-gradient',
    syntax: 'linear-gradient(<direction>?, <color-stop>, <color-stop>, ...)',
    description: 'Creates a linear gradient.',
    parameters: [
      { name: 'direction', type: 'angle|to-keyword', required: false, description: 'Direction of the gradient (e.g., to right, 45deg)' },
      { name: 'color-stops', type: 'color [position]', required: true, description: 'Colors and their positions' },
    ],
    examples: [
      'linear-gradient(to right, red, blue)',
      'linear-gradient(45deg, #ff0000 0%, #0000ff 100%)',
      'linear-gradient(to bottom, transparent, black)',
    ],
  },
  'radial-gradient': {
    name: 'radial-gradient',
    syntax: 'radial-gradient(<shape>? <size>? at <position>?, <color-stop>, ...)',
    description: 'Creates a radial gradient.',
    parameters: [
      { name: 'shape', type: 'circle|ellipse', required: false, description: 'Shape of the gradient' },
      { name: 'size', type: 'size-keyword|length', required: false, description: 'Size of the gradient' },
      { name: 'position', type: 'position', required: false, description: 'Center position' },
      { name: 'color-stops', type: 'color [position]', required: true, description: 'Colors and their positions' },
    ],
    examples: [
      'radial-gradient(circle, white, black)',
      'radial-gradient(ellipse at center, red 0%, blue 100%)',
    ],
  },
  'conic-gradient': {
    name: 'conic-gradient',
    syntax: 'conic-gradient(from <angle>? at <position>?, <color-stop>, ...)',
    description: 'Creates a conic gradient.',
    parameters: [
      { name: 'angle', type: 'angle', required: false, description: 'Starting angle' },
      { name: 'position', type: 'position', required: false, description: 'Center position' },
      { name: 'color-stops', type: 'color [position]', required: true, description: 'Colors and their positions' },
    ],
    examples: [
      'conic-gradient(red, yellow, green, blue, red)',
      'conic-gradient(from 90deg, red, blue)',
    ],
  },
};

/**
 * Gets CSS function suggestions
 */
function getFunctionSuggestions(partial: string): Suggestion[] {
  const suggestions: Suggestion[] = [];

  for (const [name, info] of Object.entries(CSS_FUNCTIONS)) {
    if (!partial || name.toLowerCase().includes(partial.toLowerCase())) {
      suggestions.push({
        label: `${name}()`,
        insertText: `${name}($0)`,
        kind: 'function',
        detail: info.description,
        documentation: `Syntax: ${info.syntax}\n\nExamples:\n${info.examples.join('\n')}`,
      });
    }
  }

  return suggestions;
}

/**
 * Checks if a property supports function values
 */
function isPropertySupportingFunctions(property: string): boolean {
  const functionalProperties = [
    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'top', 'right', 'bottom', 'left',
    'gap', 'row-gap', 'column-gap',
    'font-size', 'line-height', 'letter-spacing',
    'background', 'background-image', 'background-size', 'background-position',
    'color', 'background-color', 'border-color',
    'transform',
  ];
  return functionalProperties.includes(property.toLowerCase());
}

// =============================================================================
// CSS VARIABLE SUGGESTIONS
// =============================================================================

/** Common CSS variable patterns */
const COMMON_VARIABLES = [
  { name: '--primary-color', description: 'Primary brand color' },
  { name: '--secondary-color', description: 'Secondary brand color' },
  { name: '--background-color', description: 'Background color' },
  { name: '--text-color', description: 'Text color' },
  { name: '--accent-color', description: 'Accent color' },
  { name: '--border-color', description: 'Border color' },
  { name: '--spacing-xs', description: 'Extra small spacing' },
  { name: '--spacing-sm', description: 'Small spacing' },
  { name: '--spacing-md', description: 'Medium spacing' },
  { name: '--spacing-lg', description: 'Large spacing' },
  { name: '--spacing-xl', description: 'Extra large spacing' },
  { name: '--font-family', description: 'Font family' },
  { name: '--font-size-sm', description: 'Small font size' },
  { name: '--font-size-base', description: 'Base font size' },
  { name: '--font-size-lg', description: 'Large font size' },
  { name: '--border-radius', description: 'Border radius' },
  { name: '--shadow', description: 'Box shadow' },
  { name: '--transition-duration', description: 'Transition duration' },
];

/**
 * Gets CSS variable suggestions
 */
function getVariableSuggestions(partial: string): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // var() wrapper
  if (!partial || 'var'.includes(partial.toLowerCase())) {
    suggestions.push({
      label: 'var()',
      insertText: 'var(--$1)',
      kind: 'function',
      detail: 'CSS variable reference',
      triggerSuggest: true,
    });
  }

  // Common variables
  for (const variable of COMMON_VARIABLES) {
    if (!partial || variable.name.toLowerCase().includes(partial.toLowerCase())) {
      suggestions.push({
        label: variable.name,
        insertText: `var(${variable.name})`,
        kind: 'variable',
        detail: variable.description,
      });
    }
  }

  return suggestions;
}

// =============================================================================
// TAILWIND CLASS SUGGESTIONS
// =============================================================================

/** Tailwind class mapping to CSS */
export const TAILWIND_TO_CSS: Record<string, string> = {
  // Display
  'block': 'display: block',
  'inline-block': 'display: inline-block',
  'inline': 'display: inline',
  'flex': 'display: flex',
  'inline-flex': 'display: inline-flex',
  'grid': 'display: grid',
  'hidden': 'display: none',

  // Position
  'static': 'position: static',
  'fixed': 'position: fixed',
  'absolute': 'position: absolute',
  'relative': 'position: relative',
  'sticky': 'position: sticky',

  // Flexbox
  'flex-row': 'flex-direction: row',
  'flex-col': 'flex-direction: column',
  'flex-wrap': 'flex-wrap: wrap',
  'flex-nowrap': 'flex-wrap: nowrap',
  'items-start': 'align-items: flex-start',
  'items-center': 'align-items: center',
  'items-end': 'align-items: flex-end',
  'items-stretch': 'align-items: stretch',
  'justify-start': 'justify-content: flex-start',
  'justify-center': 'justify-content: center',
  'justify-end': 'justify-content: flex-end',
  'justify-between': 'justify-content: space-between',
  'justify-around': 'justify-content: space-around',

  // Typography
  'text-left': 'text-align: left',
  'text-center': 'text-align: center',
  'text-right': 'text-align: right',
  'text-justify': 'text-align: justify',
  'font-thin': 'font-weight: 100',
  'font-light': 'font-weight: 300',
  'font-normal': 'font-weight: 400',
  'font-medium': 'font-weight: 500',
  'font-semibold': 'font-weight: 600',
  'font-bold': 'font-weight: 700',
  'font-extrabold': 'font-weight: 800',
  'italic': 'font-style: italic',
  'not-italic': 'font-style: normal',
  'underline': 'text-decoration: underline',
  'line-through': 'text-decoration: line-through',
  'no-underline': 'text-decoration: none',
  'uppercase': 'text-transform: uppercase',
  'lowercase': 'text-transform: lowercase',
  'capitalize': 'text-transform: capitalize',

  // Borders
  'rounded-none': 'border-radius: 0',
  'rounded-sm': 'border-radius: 0.125rem',
  'rounded': 'border-radius: 0.25rem',
  'rounded-md': 'border-radius: 0.375rem',
  'rounded-lg': 'border-radius: 0.5rem',
  'rounded-xl': 'border-radius: 0.75rem',
  'rounded-2xl': 'border-radius: 1rem',
  'rounded-full': 'border-radius: 9999px',
  'border': 'border-width: 1px',
  'border-0': 'border-width: 0',
  'border-2': 'border-width: 2px',
  'border-4': 'border-width: 4px',
  'border-solid': 'border-style: solid',
  'border-dashed': 'border-style: dashed',
  'border-dotted': 'border-style: dotted',

  // Shadows
  'shadow-sm': 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'shadow': 'box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  'shadow-md': 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'shadow-lg': 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'shadow-xl': 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  'shadow-none': 'box-shadow: none',

  // Overflow
  'overflow-auto': 'overflow: auto',
  'overflow-hidden': 'overflow: hidden',
  'overflow-visible': 'overflow: visible',
  'overflow-scroll': 'overflow: scroll',

  // Cursor
  'cursor-pointer': 'cursor: pointer',
  'cursor-default': 'cursor: default',
  'cursor-wait': 'cursor: wait',
  'cursor-text': 'cursor: text',
  'cursor-move': 'cursor: move',
  'cursor-not-allowed': 'cursor: not-allowed',

  // User Select
  'select-none': 'user-select: none',
  'select-text': 'user-select: text',
  'select-all': 'user-select: all',
  'select-auto': 'user-select: auto',
};

/** Tailwind size scales */
const TAILWIND_SIZES: Record<string, string> = {
  '0': '0px',
  'px': '1px',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '44': '11rem',
  '48': '12rem',
  '52': '13rem',
  '56': '14rem',
  '60': '15rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '96': '24rem',
  'full': '100%',
  'screen': '100vh',
  'auto': 'auto',
};

/**
 * Converts Tailwind class to CSS
 */
export function tailwindToCSS(className: string): string | null {
  // Direct mapping
  if (TAILWIND_TO_CSS[className]) {
    return TAILWIND_TO_CSS[className];
  }

  // Margin/Padding
  const spacingMatch = className.match(/^(m|p)(t|r|b|l|x|y)?-(.+)$/);
  if (spacingMatch) {
    const [, type, direction, value] = spacingMatch;
    const property = type === 'm' ? 'margin' : 'padding';
    const size = TAILWIND_SIZES[value] || value;

    const dirMap: Record<string, string[]> = {
      't': ['top'],
      'r': ['right'],
      'b': ['bottom'],
      'l': ['left'],
      'x': ['left', 'right'],
      'y': ['top', 'bottom'],
    };

    if (direction && dirMap[direction]) {
      return dirMap[direction]
        .map((d) => `${property}-${d}: ${size}`)
        .join('; ');
    }

    return `${property}: ${size}`;
  }

  // Width/Height
  const sizeMatch = className.match(/^(w|h|min-w|min-h|max-w|max-h)-(.+)$/);
  if (sizeMatch) {
    const [, prefix, value] = sizeMatch;
    const propMap: Record<string, string> = {
      'w': 'width',
      'h': 'height',
      'min-w': 'min-width',
      'min-h': 'min-height',
      'max-w': 'max-width',
      'max-h': 'max-height',
    };
    const size = TAILWIND_SIZES[value] || value;
    return `${propMap[prefix]}: ${size}`;
  }

  // Gap
  const gapMatch = className.match(/^gap-(.+)$/);
  if (gapMatch) {
    const size = TAILWIND_SIZES[gapMatch[1]] || gapMatch[1];
    return `gap: ${size}`;
  }

  // Font size
  const textMatch = className.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/);
  if (textMatch) {
    const sizes: Record<string, string> = {
      'xs': '0.75rem',
      'sm': '0.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    };
    return `font-size: ${sizes[textMatch[1]]}`;
  }

  // Z-index
  const zMatch = className.match(/^z-(\d+|auto)$/);
  if (zMatch) {
    return `z-index: ${zMatch[1]}`;
  }

  // Opacity
  const opacityMatch = className.match(/^opacity-(\d+)$/);
  if (opacityMatch) {
    return `opacity: ${parseInt(opacityMatch[1], 10) / 100}`;
  }

  return null;
}

/**
 * Converts CSS to Tailwind classes
 */
export function cssToTailwind(css: string): string[] {
  const classes: string[] = [];

  // Parse CSS declarations
  const declarations = css.split(';').map((d) => d.trim()).filter(Boolean);

  for (const declaration of declarations) {
    const [property, value] = declaration.split(':').map((s) => s.trim());
    if (!property || !value) continue;

    const tailwindClass = cssPropertyToTailwind(property, value);
    if (tailwindClass) {
      classes.push(tailwindClass);
    }
  }

  return classes;
}

/**
 * Converts a CSS property-value pair to Tailwind class
 */
function cssPropertyToTailwind(property: string, value: string): string | null {
  // Reverse lookup in TAILWIND_TO_CSS
  for (const [twClass, cssValue] of Object.entries(TAILWIND_TO_CSS)) {
    const [cssProp, cssVal] = cssValue.split(':').map((s) => s.trim());
    if (cssProp === property && cssVal === value) {
      return twClass;
    }
  }

  // Dynamic conversions
  switch (property) {
    case 'margin':
    case 'padding':
      return spacingToTailwind(property === 'margin' ? 'm' : 'p', value);
    case 'margin-top':
    case 'padding-top':
      return spacingToTailwind(property.startsWith('margin') ? 'mt' : 'pt', value);
    case 'margin-right':
    case 'padding-right':
      return spacingToTailwind(property.startsWith('margin') ? 'mr' : 'pr', value);
    case 'margin-bottom':
    case 'padding-bottom':
      return spacingToTailwind(property.startsWith('margin') ? 'mb' : 'pb', value);
    case 'margin-left':
    case 'padding-left':
      return spacingToTailwind(property.startsWith('margin') ? 'ml' : 'pl', value);
    case 'width':
      return sizeToTailwind('w', value);
    case 'height':
      return sizeToTailwind('h', value);
    case 'gap':
      return sizeToTailwind('gap', value);
  }

  return null;
}

/**
 * Converts spacing value to Tailwind
 */
function spacingToTailwind(prefix: string, value: string): string | null {
  for (const [key, size] of Object.entries(TAILWIND_SIZES)) {
    if (size === value) {
      return `${prefix}-${key}`;
    }
  }

  // Try to match rem values
  const remMatch = value.match(/^([\d.]+)rem$/);
  if (remMatch) {
    const remValue = parseFloat(remMatch[1]);
    const key = Object.keys(TAILWIND_SIZES).find((k) => {
      const s = TAILWIND_SIZES[k];
      const sMatch = s.match(/^([\d.]+)rem$/);
      return sMatch && parseFloat(sMatch[1]) === remValue;
    });
    if (key) {
      return `${prefix}-${key}`;
    }
  }

  return null;
}

/**
 * Converts size value to Tailwind
 */
function sizeToTailwind(prefix: string, value: string): string | null {
  for (const [key, size] of Object.entries(TAILWIND_SIZES)) {
    if (size === value) {
      return `${prefix}-${key}`;
    }
  }
  return null;
}

/**
 * Gets Tailwind class suggestions based on CSS property
 */
export function getTailwindSuggestions(property: string, partial: string = ''): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Find relevant Tailwind classes
  for (const [twClass, cssDecl] of Object.entries(TAILWIND_TO_CSS)) {
    if (!cssDecl.toLowerCase().startsWith(property.toLowerCase())) {
      continue;
    }

    if (!partial || twClass.toLowerCase().includes(partial.toLowerCase())) {
      suggestions.push({
        label: twClass,
        insertText: twClass,
        kind: 'class',
        detail: cssDecl,
      });
    }
  }

  return suggestions;
}

// =============================================================================
// CONTEXT-AWARE SUGGESTIONS
// =============================================================================

/**
 * Gets suggestions based on cursor context
 */
export function getContextualSuggestions(
  line: string,
  cursorPosition: number,
  fullText: string
): Suggestion[] {
  const beforeCursor = line.substring(0, cursorPosition);

  // Check if we're in a property position
  if (beforeCursor.match(/^\s*$/) || beforeCursor.match(/[{;]\s*$/)) {
    return getPropertySuggestions('');
  }

  // Check if we're in a value position
  const propertyMatch = beforeCursor.match(/([a-z-]+)\s*:\s*([^;]*)$/i);
  if (propertyMatch) {
    const [, property, partialValue] = propertyMatch;
    return getValueSuggestions(property, partialValue.trim());
  }

  // Check if we're typing a property
  const partialPropertyMatch = beforeCursor.match(/^\s*([a-z-]*)$/i);
  if (partialPropertyMatch) {
    return getPropertySuggestions(partialPropertyMatch[1]);
  }

  return [];
}
