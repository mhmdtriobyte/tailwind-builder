/**
 * CSS Generator
 *
 * Converts Tailwind classes to vanilla CSS with support for:
 * - CSS custom properties (theming)
 * - Media queries (responsive design)
 * - Pseudo-classes (:hover, :focus, :active)
 * - Keyframe animations
 * - BEM naming convention
 * - CSS modules support
 */

import type { BuilderElement, ElementStyles } from '@/types/builder';

// ============================================================================
// TYPES
// ============================================================================

export interface CSSGeneratorOptions {
  /** Output minified CSS */
  minify: boolean;
  /** Include comments */
  includeComments: boolean;
  /** Use BEM naming convention */
  useBEM: boolean;
  /** Generate CSS modules compatible output */
  cssModules: boolean;
  /** Include CSS custom properties for theming */
  includeCustomProperties: boolean;
  /** Prefix for class names */
  classPrefix: string;
  /** Base indent size */
  indentSize: number;
}

export interface GeneratedCSS {
  /** Main stylesheet content */
  css: string;
  /** SCSS/SASS output */
  scss: string;
  /** CSS with custom properties for theming */
  themed: string;
  /** Class name mapping for CSS modules */
  classMap: Record<string, string>;
}

interface TailwindMapping {
  property: string;
  value: string;
  mediaQuery?: string;
  pseudoClass?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS: CSSGeneratorOptions = {
  minify: false,
  includeComments: true,
  useBEM: false,
  cssModules: false,
  includeCustomProperties: true,
  classPrefix: '',
  indentSize: 2,
};

/**
 * Tailwind spacing scale (in rem)
 */
const SPACING_SCALE: Record<string, string> = {
  '0': '0',
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
  'px': '1px',
};

/**
 * Tailwind color palette with hex values
 */
const COLOR_PALETTE: Record<string, Record<string, string>> = {
  slate: {
    '50': '#f8fafc', '100': '#f1f5f9', '200': '#e2e8f0', '300': '#cbd5e1',
    '400': '#94a3b8', '500': '#64748b', '600': '#475569', '700': '#334155',
    '800': '#1e293b', '900': '#0f172a', '950': '#020617',
  },
  gray: {
    '50': '#f9fafb', '100': '#f3f4f6', '200': '#e5e7eb', '300': '#d1d5db',
    '400': '#9ca3af', '500': '#6b7280', '600': '#4b5563', '700': '#374151',
    '800': '#1f2937', '900': '#111827', '950': '#030712',
  },
  zinc: {
    '50': '#fafafa', '100': '#f4f4f5', '200': '#e4e4e7', '300': '#d4d4d8',
    '400': '#a1a1aa', '500': '#71717a', '600': '#52525b', '700': '#3f3f46',
    '800': '#27272a', '900': '#18181b', '950': '#09090b',
  },
  red: {
    '50': '#fef2f2', '100': '#fee2e2', '200': '#fecaca', '300': '#fca5a5',
    '400': '#f87171', '500': '#ef4444', '600': '#dc2626', '700': '#b91c1c',
    '800': '#991b1b', '900': '#7f1d1d', '950': '#450a0a',
  },
  orange: {
    '50': '#fff7ed', '100': '#ffedd5', '200': '#fed7aa', '300': '#fdba74',
    '400': '#fb923c', '500': '#f97316', '600': '#ea580c', '700': '#c2410c',
    '800': '#9a3412', '900': '#7c2d12', '950': '#431407',
  },
  amber: {
    '50': '#fffbeb', '100': '#fef3c7', '200': '#fde68a', '300': '#fcd34d',
    '400': '#fbbf24', '500': '#f59e0b', '600': '#d97706', '700': '#b45309',
    '800': '#92400e', '900': '#78350f', '950': '#451a03',
  },
  yellow: {
    '50': '#fefce8', '100': '#fef9c3', '200': '#fef08a', '300': '#fde047',
    '400': '#facc15', '500': '#eab308', '600': '#ca8a04', '700': '#a16207',
    '800': '#854d0e', '900': '#713f12', '950': '#422006',
  },
  lime: {
    '50': '#f7fee7', '100': '#ecfccb', '200': '#d9f99d', '300': '#bef264',
    '400': '#a3e635', '500': '#84cc16', '600': '#65a30d', '700': '#4d7c0f',
    '800': '#3f6212', '900': '#365314', '950': '#1a2e05',
  },
  green: {
    '50': '#f0fdf4', '100': '#dcfce7', '200': '#bbf7d0', '300': '#86efac',
    '400': '#4ade80', '500': '#22c55e', '600': '#16a34a', '700': '#15803d',
    '800': '#166534', '900': '#14532d', '950': '#052e16',
  },
  emerald: {
    '50': '#ecfdf5', '100': '#d1fae5', '200': '#a7f3d0', '300': '#6ee7b7',
    '400': '#34d399', '500': '#10b981', '600': '#059669', '700': '#047857',
    '800': '#065f46', '900': '#064e3b', '950': '#022c22',
  },
  teal: {
    '50': '#f0fdfa', '100': '#ccfbf1', '200': '#99f6e4', '300': '#5eead4',
    '400': '#2dd4bf', '500': '#14b8a6', '600': '#0d9488', '700': '#0f766e',
    '800': '#115e59', '900': '#134e4a', '950': '#042f2e',
  },
  cyan: {
    '50': '#ecfeff', '100': '#cffafe', '200': '#a5f3fc', '300': '#67e8f9',
    '400': '#22d3ee', '500': '#06b6d4', '600': '#0891b2', '700': '#0e7490',
    '800': '#155e75', '900': '#164e63', '950': '#083344',
  },
  sky: {
    '50': '#f0f9ff', '100': '#e0f2fe', '200': '#bae6fd', '300': '#7dd3fc',
    '400': '#38bdf8', '500': '#0ea5e9', '600': '#0284c7', '700': '#0369a1',
    '800': '#075985', '900': '#0c4a6e', '950': '#082f49',
  },
  blue: {
    '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe', '300': '#93c5fd',
    '400': '#60a5fa', '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8',
    '800': '#1e40af', '900': '#1e3a8a', '950': '#172554',
  },
  indigo: {
    '50': '#eef2ff', '100': '#e0e7ff', '200': '#c7d2fe', '300': '#a5b4fc',
    '400': '#818cf8', '500': '#6366f1', '600': '#4f46e5', '700': '#4338ca',
    '800': '#3730a3', '900': '#312e81', '950': '#1e1b4b',
  },
  violet: {
    '50': '#f5f3ff', '100': '#ede9fe', '200': '#ddd6fe', '300': '#c4b5fd',
    '400': '#a78bfa', '500': '#8b5cf6', '600': '#7c3aed', '700': '#6d28d9',
    '800': '#5b21b6', '900': '#4c1d95', '950': '#2e1065',
  },
  purple: {
    '50': '#faf5ff', '100': '#f3e8ff', '200': '#e9d5ff', '300': '#d8b4fe',
    '400': '#c084fc', '500': '#a855f7', '600': '#9333ea', '700': '#7e22ce',
    '800': '#6b21a8', '900': '#581c87', '950': '#3b0764',
  },
  fuchsia: {
    '50': '#fdf4ff', '100': '#fae8ff', '200': '#f5d0fe', '300': '#f0abfc',
    '400': '#e879f9', '500': '#d946ef', '600': '#c026d3', '700': '#a21caf',
    '800': '#86198f', '900': '#701a75', '950': '#4a044e',
  },
  pink: {
    '50': '#fdf2f8', '100': '#fce7f3', '200': '#fbcfe8', '300': '#f9a8d4',
    '400': '#f472b6', '500': '#ec4899', '600': '#db2777', '700': '#be185d',
    '800': '#9d174d', '900': '#831843', '950': '#500724',
  },
  rose: {
    '50': '#fff1f2', '100': '#ffe4e6', '200': '#fecdd3', '300': '#fda4af',
    '400': '#fb7185', '500': '#f43f5e', '600': '#e11d48', '700': '#be123c',
    '800': '#9f1239', '900': '#881337', '950': '#4c0519',
  },
};

/**
 * Font size scale
 */
const FONT_SIZE_SCALE: Record<string, { size: string; lineHeight: string }> = {
  'xs': { size: '0.75rem', lineHeight: '1rem' },
  'sm': { size: '0.875rem', lineHeight: '1.25rem' },
  'base': { size: '1rem', lineHeight: '1.5rem' },
  'lg': { size: '1.125rem', lineHeight: '1.75rem' },
  'xl': { size: '1.25rem', lineHeight: '1.75rem' },
  '2xl': { size: '1.5rem', lineHeight: '2rem' },
  '3xl': { size: '1.875rem', lineHeight: '2.25rem' },
  '4xl': { size: '2.25rem', lineHeight: '2.5rem' },
  '5xl': { size: '3rem', lineHeight: '1' },
  '6xl': { size: '3.75rem', lineHeight: '1' },
  '7xl': { size: '4.5rem', lineHeight: '1' },
  '8xl': { size: '6rem', lineHeight: '1' },
  '9xl': { size: '8rem', lineHeight: '1' },
};

/**
 * Font weight scale
 */
const FONT_WEIGHT_SCALE: Record<string, string> = {
  'thin': '100',
  'extralight': '200',
  'light': '300',
  'normal': '400',
  'medium': '500',
  'semibold': '600',
  'bold': '700',
  'extrabold': '800',
  'black': '900',
};

/**
 * Border radius scale
 */
const BORDER_RADIUS_SCALE: Record<string, string> = {
  'none': '0',
  'sm': '0.125rem',
  '': '0.25rem',
  'md': '0.375rem',
  'lg': '0.5rem',
  'xl': '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  'full': '9999px',
};

/**
 * Shadow scale
 */
const SHADOW_SCALE: Record<string, string> = {
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  'none': 'none',
};

/**
 * Breakpoints for media queries
 */
const BREAKPOINTS: Record<string, string> = {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
};

/**
 * CSS Custom Properties for theming
 */
const CSS_CUSTOM_PROPERTIES = `
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-secondary: #64748b;
  --color-secondary-hover: #475569;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Typography */
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  /* Spacing */
  --spacing-unit: 0.25rem;

  /* Border Radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;
}
`;

/**
 * Common animations
 */
const ANIMATIONS = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
`;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates indentation string
 */
function createIndent(level: number, options: CSSGeneratorOptions): string {
  if (options.minify) return '';
  return ' '.repeat(level * options.indentSize);
}

/**
 * Creates newline (or empty for minified)
 */
function newline(options: CSSGeneratorOptions): string {
  return options.minify ? '' : '\n';
}

/**
 * Converts Tailwind class to CSS property-value pair
 */
function tailwindToCSS(className: string): TailwindMapping | null {
  // Handle responsive prefixes
  let mediaQuery: string | undefined;
  let pseudoClass: string | undefined;
  let baseClass = className;

  // Check for responsive prefix
  const responsiveMatch = className.match(/^(sm|md|lg|xl|2xl):/);
  if (responsiveMatch) {
    mediaQuery = BREAKPOINTS[responsiveMatch[1]];
    baseClass = className.replace(responsiveMatch[0], '');
  }

  // Check for pseudo-class prefix
  const pseudoMatch = baseClass.match(/^(hover|focus|active|disabled|focus-within|focus-visible):/);
  if (pseudoMatch) {
    pseudoClass = pseudoMatch[1];
    baseClass = baseClass.replace(pseudoMatch[0], '');
  }

  // Width
  if (baseClass.startsWith('w-')) {
    const value = baseClass.slice(2);
    if (value === 'full') return { property: 'width', value: '100%', mediaQuery, pseudoClass };
    if (value === 'screen') return { property: 'width', value: '100vw', mediaQuery, pseudoClass };
    if (value === 'auto') return { property: 'width', value: 'auto', mediaQuery, pseudoClass };
    if (value === 'min') return { property: 'width', value: 'min-content', mediaQuery, pseudoClass };
    if (value === 'max') return { property: 'width', value: 'max-content', mediaQuery, pseudoClass };
    if (value === 'fit') return { property: 'width', value: 'fit-content', mediaQuery, pseudoClass };
    if (value.includes('/')) {
      const [num, den] = value.split('/');
      return { property: 'width', value: `${(parseInt(num) / parseInt(den)) * 100}%`, mediaQuery, pseudoClass };
    }
    if (SPACING_SCALE[value]) return { property: 'width', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }

  // Height
  if (baseClass.startsWith('h-')) {
    const value = baseClass.slice(2);
    if (value === 'full') return { property: 'height', value: '100%', mediaQuery, pseudoClass };
    if (value === 'screen') return { property: 'height', value: '100vh', mediaQuery, pseudoClass };
    if (value === 'auto') return { property: 'height', value: 'auto', mediaQuery, pseudoClass };
    if (value === 'min') return { property: 'height', value: 'min-content', mediaQuery, pseudoClass };
    if (value === 'max') return { property: 'height', value: 'max-content', mediaQuery, pseudoClass };
    if (value === 'fit') return { property: 'height', value: 'fit-content', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'height', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }

  // Min/Max width/height
  if (baseClass.startsWith('min-w-')) {
    const value = baseClass.slice(6);
    if (value === 'full') return { property: 'min-width', value: '100%', mediaQuery, pseudoClass };
    if (value === '0') return { property: 'min-width', value: '0', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'min-width', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('max-w-')) {
    const value = baseClass.slice(6);
    const maxWidths: Record<string, string> = {
      'none': 'none', 'xs': '20rem', 'sm': '24rem', 'md': '28rem', 'lg': '32rem',
      'xl': '36rem', '2xl': '42rem', '3xl': '48rem', '4xl': '56rem', '5xl': '64rem',
      '6xl': '72rem', '7xl': '80rem', 'full': '100%', 'prose': '65ch',
      'screen-sm': '640px', 'screen-md': '768px', 'screen-lg': '1024px', 'screen-xl': '1280px',
    };
    if (maxWidths[value]) return { property: 'max-width', value: maxWidths[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('min-h-')) {
    const value = baseClass.slice(6);
    if (value === 'full') return { property: 'min-height', value: '100%', mediaQuery, pseudoClass };
    if (value === 'screen') return { property: 'min-height', value: '100vh', mediaQuery, pseudoClass };
    if (value === '0') return { property: 'min-height', value: '0', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'min-height', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('max-h-')) {
    const value = baseClass.slice(6);
    if (value === 'full') return { property: 'max-height', value: '100%', mediaQuery, pseudoClass };
    if (value === 'screen') return { property: 'max-height', value: '100vh', mediaQuery, pseudoClass };
    if (value === 'none') return { property: 'max-height', value: 'none', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'max-height', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }

  // Padding
  if (baseClass.startsWith('p-')) {
    const value = baseClass.slice(2);
    if (SPACING_SCALE[value]) return { property: 'padding', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('px-')) {
    const value = baseClass.slice(3);
    if (SPACING_SCALE[value]) return { property: 'padding-left', value: `${SPACING_SCALE[value]}; padding-right: ${SPACING_SCALE[value]}`, mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('py-')) {
    const value = baseClass.slice(3);
    if (SPACING_SCALE[value]) return { property: 'padding-top', value: `${SPACING_SCALE[value]}; padding-bottom: ${SPACING_SCALE[value]}`, mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('pt-')) {
    const value = baseClass.slice(3);
    if (SPACING_SCALE[value]) return { property: 'padding-top', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('pr-')) {
    const value = baseClass.slice(3);
    if (SPACING_SCALE[value]) return { property: 'padding-right', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('pb-')) {
    const value = baseClass.slice(3);
    if (SPACING_SCALE[value]) return { property: 'padding-bottom', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('pl-')) {
    const value = baseClass.slice(3);
    if (SPACING_SCALE[value]) return { property: 'padding-left', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }

  // Margin
  if (baseClass.startsWith('m-')) {
    const value = baseClass.slice(2);
    if (value === 'auto') return { property: 'margin', value: 'auto', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'margin', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('mx-')) {
    const value = baseClass.slice(3);
    if (value === 'auto') return { property: 'margin-left', value: 'auto; margin-right: auto', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'margin-left', value: `${SPACING_SCALE[value]}; margin-right: ${SPACING_SCALE[value]}`, mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('my-')) {
    const value = baseClass.slice(3);
    if (value === 'auto') return { property: 'margin-top', value: 'auto; margin-bottom: auto', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'margin-top', value: `${SPACING_SCALE[value]}; margin-bottom: ${SPACING_SCALE[value]}`, mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('mt-')) {
    const value = baseClass.slice(3);
    if (value === 'auto') return { property: 'margin-top', value: 'auto', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'margin-top', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('mr-')) {
    const value = baseClass.slice(3);
    if (value === 'auto') return { property: 'margin-right', value: 'auto', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'margin-right', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('mb-')) {
    const value = baseClass.slice(3);
    if (value === 'auto') return { property: 'margin-bottom', value: 'auto', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'margin-bottom', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('ml-')) {
    const value = baseClass.slice(3);
    if (value === 'auto') return { property: 'margin-left', value: 'auto', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'margin-left', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }

  // Gap
  if (baseClass.startsWith('gap-')) {
    const value = baseClass.slice(4);
    if (SPACING_SCALE[value]) return { property: 'gap', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('gap-x-')) {
    const value = baseClass.slice(6);
    if (SPACING_SCALE[value]) return { property: 'column-gap', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('gap-y-')) {
    const value = baseClass.slice(6);
    if (SPACING_SCALE[value]) return { property: 'row-gap', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }

  // Display
  const displayValues: Record<string, string> = {
    'block': 'block', 'inline-block': 'inline-block', 'inline': 'inline',
    'flex': 'flex', 'inline-flex': 'inline-flex', 'grid': 'grid', 'inline-grid': 'inline-grid',
    'hidden': 'none', 'table': 'table', 'table-row': 'table-row', 'table-cell': 'table-cell',
  };
  if (displayValues[baseClass]) {
    return { property: 'display', value: displayValues[baseClass], mediaQuery, pseudoClass };
  }

  // Flexbox
  if (baseClass === 'flex-row') return { property: 'flex-direction', value: 'row', mediaQuery, pseudoClass };
  if (baseClass === 'flex-row-reverse') return { property: 'flex-direction', value: 'row-reverse', mediaQuery, pseudoClass };
  if (baseClass === 'flex-col') return { property: 'flex-direction', value: 'column', mediaQuery, pseudoClass };
  if (baseClass === 'flex-col-reverse') return { property: 'flex-direction', value: 'column-reverse', mediaQuery, pseudoClass };
  if (baseClass === 'flex-wrap') return { property: 'flex-wrap', value: 'wrap', mediaQuery, pseudoClass };
  if (baseClass === 'flex-wrap-reverse') return { property: 'flex-wrap', value: 'wrap-reverse', mediaQuery, pseudoClass };
  if (baseClass === 'flex-nowrap') return { property: 'flex-wrap', value: 'nowrap', mediaQuery, pseudoClass };
  if (baseClass === 'flex-1') return { property: 'flex', value: '1 1 0%', mediaQuery, pseudoClass };
  if (baseClass === 'flex-auto') return { property: 'flex', value: '1 1 auto', mediaQuery, pseudoClass };
  if (baseClass === 'flex-initial') return { property: 'flex', value: '0 1 auto', mediaQuery, pseudoClass };
  if (baseClass === 'flex-none') return { property: 'flex', value: 'none', mediaQuery, pseudoClass };
  if (baseClass === 'flex-grow') return { property: 'flex-grow', value: '1', mediaQuery, pseudoClass };
  if (baseClass === 'flex-grow-0') return { property: 'flex-grow', value: '0', mediaQuery, pseudoClass };
  if (baseClass === 'flex-shrink') return { property: 'flex-shrink', value: '1', mediaQuery, pseudoClass };
  if (baseClass === 'flex-shrink-0') return { property: 'flex-shrink', value: '0', mediaQuery, pseudoClass };

  // Justify content
  if (baseClass.startsWith('justify-')) {
    const value = baseClass.slice(8);
    const justifyMap: Record<string, string> = {
      'start': 'flex-start', 'end': 'flex-end', 'center': 'center',
      'between': 'space-between', 'around': 'space-around', 'evenly': 'space-evenly',
    };
    if (justifyMap[value]) return { property: 'justify-content', value: justifyMap[value], mediaQuery, pseudoClass };
  }

  // Align items
  if (baseClass.startsWith('items-')) {
    const value = baseClass.slice(6);
    const alignMap: Record<string, string> = {
      'start': 'flex-start', 'end': 'flex-end', 'center': 'center',
      'baseline': 'baseline', 'stretch': 'stretch',
    };
    if (alignMap[value]) return { property: 'align-items', value: alignMap[value], mediaQuery, pseudoClass };
  }

  // Align self
  if (baseClass.startsWith('self-')) {
    const value = baseClass.slice(5);
    const selfMap: Record<string, string> = {
      'auto': 'auto', 'start': 'flex-start', 'end': 'flex-end',
      'center': 'center', 'stretch': 'stretch', 'baseline': 'baseline',
    };
    if (selfMap[value]) return { property: 'align-self', value: selfMap[value], mediaQuery, pseudoClass };
  }

  // Grid
  if (baseClass.startsWith('grid-cols-')) {
    const value = baseClass.slice(10);
    if (value === 'none') return { property: 'grid-template-columns', value: 'none', mediaQuery, pseudoClass };
    const num = parseInt(value);
    if (!isNaN(num)) return { property: 'grid-template-columns', value: `repeat(${num}, minmax(0, 1fr))`, mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('grid-rows-')) {
    const value = baseClass.slice(10);
    if (value === 'none') return { property: 'grid-template-rows', value: 'none', mediaQuery, pseudoClass };
    const num = parseInt(value);
    if (!isNaN(num)) return { property: 'grid-template-rows', value: `repeat(${num}, minmax(0, 1fr))`, mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('col-span-')) {
    const value = baseClass.slice(9);
    if (value === 'full') return { property: 'grid-column', value: '1 / -1', mediaQuery, pseudoClass };
    const num = parseInt(value);
    if (!isNaN(num)) return { property: 'grid-column', value: `span ${num} / span ${num}`, mediaQuery, pseudoClass };
  }

  // Text/Font
  if (baseClass.startsWith('text-')) {
    const value = baseClass.slice(5);
    // Font size
    if (FONT_SIZE_SCALE[value]) {
      return { property: 'font-size', value: `${FONT_SIZE_SCALE[value].size}; line-height: ${FONT_SIZE_SCALE[value].lineHeight}`, mediaQuery, pseudoClass };
    }
    // Text align
    const alignValues = ['left', 'center', 'right', 'justify', 'start', 'end'];
    if (alignValues.includes(value)) {
      return { property: 'text-align', value, mediaQuery, pseudoClass };
    }
    // Text color
    const colorMatch = value.match(/^([a-z]+)-(\d+)$/);
    if (colorMatch) {
      const [, color, shade] = colorMatch;
      if (COLOR_PALETTE[color]?.[shade]) {
        return { property: 'color', value: COLOR_PALETTE[color][shade], mediaQuery, pseudoClass };
      }
    }
    if (value === 'white') return { property: 'color', value: '#ffffff', mediaQuery, pseudoClass };
    if (value === 'black') return { property: 'color', value: '#000000', mediaQuery, pseudoClass };
    if (value === 'transparent') return { property: 'color', value: 'transparent', mediaQuery, pseudoClass };
  }

  // Font weight
  if (baseClass.startsWith('font-')) {
    const value = baseClass.slice(5);
    if (FONT_WEIGHT_SCALE[value]) {
      return { property: 'font-weight', value: FONT_WEIGHT_SCALE[value], mediaQuery, pseudoClass };
    }
    if (value === 'sans') return { property: 'font-family', value: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)', mediaQuery, pseudoClass };
    if (value === 'serif') return { property: 'font-family', value: 'var(--font-serif, ui-serif, Georgia, serif)', mediaQuery, pseudoClass };
    if (value === 'mono') return { property: 'font-family', value: 'var(--font-mono, ui-monospace, monospace)', mediaQuery, pseudoClass };
  }

  // Background color
  if (baseClass.startsWith('bg-')) {
    const value = baseClass.slice(3);
    const colorMatch = value.match(/^([a-z]+)-(\d+)$/);
    if (colorMatch) {
      const [, color, shade] = colorMatch;
      if (COLOR_PALETTE[color]?.[shade]) {
        return { property: 'background-color', value: COLOR_PALETTE[color][shade], mediaQuery, pseudoClass };
      }
    }
    if (value === 'white') return { property: 'background-color', value: '#ffffff', mediaQuery, pseudoClass };
    if (value === 'black') return { property: 'background-color', value: '#000000', mediaQuery, pseudoClass };
    if (value === 'transparent') return { property: 'background-color', value: 'transparent', mediaQuery, pseudoClass };
  }

  // Border radius
  if (baseClass.startsWith('rounded')) {
    const value = baseClass.slice(7).replace(/^-/, '');
    if (BORDER_RADIUS_SCALE[value] !== undefined) {
      return { property: 'border-radius', value: BORDER_RADIUS_SCALE[value], mediaQuery, pseudoClass };
    }
  }

  // Border width
  if (baseClass === 'border') return { property: 'border-width', value: '1px', mediaQuery, pseudoClass };
  if (baseClass.startsWith('border-')) {
    const value = baseClass.slice(7);
    const widths = ['0', '2', '4', '8'];
    if (widths.includes(value)) {
      return { property: 'border-width', value: `${value}px`, mediaQuery, pseudoClass };
    }
    // Border color
    const colorMatch = value.match(/^([a-z]+)-(\d+)$/);
    if (colorMatch) {
      const [, color, shade] = colorMatch;
      if (COLOR_PALETTE[color]?.[shade]) {
        return { property: 'border-color', value: COLOR_PALETTE[color][shade], mediaQuery, pseudoClass };
      }
    }
  }

  // Shadow
  if (baseClass.startsWith('shadow')) {
    const value = baseClass.slice(6).replace(/^-/, '');
    if (SHADOW_SCALE[value] !== undefined) {
      return { property: 'box-shadow', value: SHADOW_SCALE[value], mediaQuery, pseudoClass };
    }
  }

  // Opacity
  if (baseClass.startsWith('opacity-')) {
    const value = baseClass.slice(8);
    const num = parseInt(value);
    if (!isNaN(num)) {
      return { property: 'opacity', value: (num / 100).toString(), mediaQuery, pseudoClass };
    }
  }

  // Position
  const positions = ['static', 'fixed', 'absolute', 'relative', 'sticky'];
  if (positions.includes(baseClass)) {
    return { property: 'position', value: baseClass, mediaQuery, pseudoClass };
  }

  // Inset
  if (baseClass.startsWith('inset-')) {
    const value = baseClass.slice(6);
    if (value === '0') return { property: 'inset', value: '0', mediaQuery, pseudoClass };
    if (value === 'auto') return { property: 'inset', value: 'auto', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'inset', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('top-')) {
    const value = baseClass.slice(4);
    if (value === '0') return { property: 'top', value: '0', mediaQuery, pseudoClass };
    if (value === 'auto') return { property: 'top', value: 'auto', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'top', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('right-')) {
    const value = baseClass.slice(6);
    if (value === '0') return { property: 'right', value: '0', mediaQuery, pseudoClass };
    if (value === 'auto') return { property: 'right', value: 'auto', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'right', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('bottom-')) {
    const value = baseClass.slice(7);
    if (value === '0') return { property: 'bottom', value: '0', mediaQuery, pseudoClass };
    if (value === 'auto') return { property: 'bottom', value: 'auto', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'bottom', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('left-')) {
    const value = baseClass.slice(5);
    if (value === '0') return { property: 'left', value: '0', mediaQuery, pseudoClass };
    if (value === 'auto') return { property: 'left', value: 'auto', mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'left', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }

  // Z-index
  if (baseClass.startsWith('z-')) {
    const value = baseClass.slice(2);
    if (value === 'auto') return { property: 'z-index', value: 'auto', mediaQuery, pseudoClass };
    const num = parseInt(value);
    if (!isNaN(num)) return { property: 'z-index', value: value, mediaQuery, pseudoClass };
  }

  // Overflow
  if (baseClass.startsWith('overflow-')) {
    const value = baseClass.slice(9);
    const overflows = ['auto', 'hidden', 'visible', 'scroll', 'clip'];
    if (overflows.includes(value)) {
      return { property: 'overflow', value, mediaQuery, pseudoClass };
    }
    if (value.startsWith('x-')) {
      return { property: 'overflow-x', value: value.slice(2), mediaQuery, pseudoClass };
    }
    if (value.startsWith('y-')) {
      return { property: 'overflow-y', value: value.slice(2), mediaQuery, pseudoClass };
    }
  }

  // Object fit
  if (baseClass.startsWith('object-')) {
    const value = baseClass.slice(7);
    const fits = ['contain', 'cover', 'fill', 'none', 'scale-down'];
    if (fits.includes(value)) {
      return { property: 'object-fit', value, mediaQuery, pseudoClass };
    }
  }

  // Cursor
  if (baseClass.startsWith('cursor-')) {
    const value = baseClass.slice(7);
    return { property: 'cursor', value, mediaQuery, pseudoClass };
  }

  // Pointer events
  if (baseClass === 'pointer-events-none') return { property: 'pointer-events', value: 'none', mediaQuery, pseudoClass };
  if (baseClass === 'pointer-events-auto') return { property: 'pointer-events', value: 'auto', mediaQuery, pseudoClass };

  // Transitions
  if (baseClass === 'transition') {
    return { property: 'transition-property', value: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms', mediaQuery, pseudoClass };
  }
  if (baseClass === 'transition-all') {
    return { property: 'transition-property', value: 'all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms', mediaQuery, pseudoClass };
  }
  if (baseClass === 'transition-colors') {
    return { property: 'transition-property', value: 'color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms', mediaQuery, pseudoClass };
  }
  if (baseClass === 'transition-none') {
    return { property: 'transition-property', value: 'none', mediaQuery, pseudoClass };
  }
  if (baseClass.startsWith('duration-')) {
    const value = baseClass.slice(9);
    return { property: 'transition-duration', value: `${value}ms`, mediaQuery, pseudoClass };
  }

  // Animations
  if (baseClass === 'animate-spin') return { property: 'animation', value: 'spin 1s linear infinite', mediaQuery, pseudoClass };
  if (baseClass === 'animate-ping') return { property: 'animation', value: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', mediaQuery, pseudoClass };
  if (baseClass === 'animate-pulse') return { property: 'animation', value: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', mediaQuery, pseudoClass };
  if (baseClass === 'animate-bounce') return { property: 'animation', value: 'bounce 1s infinite', mediaQuery, pseudoClass };
  if (baseClass === 'animate-none') return { property: 'animation', value: 'none', mediaQuery, pseudoClass };

  // Transform
  if (baseClass === 'transform') return { property: 'transform', value: 'translateX(var(--tw-translate-x, 0)) translateY(var(--tw-translate-y, 0)) rotate(var(--tw-rotate, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x, 1)) scaleY(var(--tw-scale-y, 1))', mediaQuery, pseudoClass };

  // Line height
  if (baseClass.startsWith('leading-')) {
    const value = baseClass.slice(8);
    const leadings: Record<string, string> = {
      'none': '1', 'tight': '1.25', 'snug': '1.375', 'normal': '1.5',
      'relaxed': '1.625', 'loose': '2',
    };
    if (leadings[value]) return { property: 'line-height', value: leadings[value], mediaQuery, pseudoClass };
    if (SPACING_SCALE[value]) return { property: 'line-height', value: SPACING_SCALE[value], mediaQuery, pseudoClass };
  }

  // Letter spacing
  if (baseClass.startsWith('tracking-')) {
    const value = baseClass.slice(9);
    const trackings: Record<string, string> = {
      'tighter': '-0.05em', 'tight': '-0.025em', 'normal': '0',
      'wide': '0.025em', 'wider': '0.05em', 'widest': '0.1em',
    };
    if (trackings[value]) return { property: 'letter-spacing', value: trackings[value], mediaQuery, pseudoClass };
  }

  // Text decoration
  if (baseClass === 'underline') return { property: 'text-decoration-line', value: 'underline', mediaQuery, pseudoClass };
  if (baseClass === 'overline') return { property: 'text-decoration-line', value: 'overline', mediaQuery, pseudoClass };
  if (baseClass === 'line-through') return { property: 'text-decoration-line', value: 'line-through', mediaQuery, pseudoClass };
  if (baseClass === 'no-underline') return { property: 'text-decoration-line', value: 'none', mediaQuery, pseudoClass };

  // Text transform
  if (baseClass === 'uppercase') return { property: 'text-transform', value: 'uppercase', mediaQuery, pseudoClass };
  if (baseClass === 'lowercase') return { property: 'text-transform', value: 'lowercase', mediaQuery, pseudoClass };
  if (baseClass === 'capitalize') return { property: 'text-transform', value: 'capitalize', mediaQuery, pseudoClass };
  if (baseClass === 'normal-case') return { property: 'text-transform', value: 'none', mediaQuery, pseudoClass };

  // Whitespace
  if (baseClass.startsWith('whitespace-')) {
    const value = baseClass.slice(11);
    return { property: 'white-space', value, mediaQuery, pseudoClass };
  }

  // Word break
  if (baseClass === 'break-normal') return { property: 'word-break', value: 'normal; overflow-wrap: normal', mediaQuery, pseudoClass };
  if (baseClass === 'break-words') return { property: 'overflow-wrap', value: 'break-word', mediaQuery, pseudoClass };
  if (baseClass === 'break-all') return { property: 'word-break', value: 'break-all', mediaQuery, pseudoClass };
  if (baseClass === 'truncate') return { property: 'overflow', value: 'hidden; text-overflow: ellipsis; white-space: nowrap', mediaQuery, pseudoClass };

  // Italic
  if (baseClass === 'italic') return { property: 'font-style', value: 'italic', mediaQuery, pseudoClass };
  if (baseClass === 'not-italic') return { property: 'font-style', value: 'normal', mediaQuery, pseudoClass };

  // Select
  if (baseClass.startsWith('select-')) {
    const value = baseClass.slice(7);
    return { property: 'user-select', value, mediaQuery, pseudoClass };
  }

  // Space between
  if (baseClass.startsWith('space-x-')) {
    const value = baseClass.slice(8);
    if (SPACING_SCALE[value]) {
      return { property: '--tw-space-x-reverse', value: `0; margin-right: calc(${SPACING_SCALE[value]} * var(--tw-space-x-reverse)); margin-left: calc(${SPACING_SCALE[value]} * calc(1 - var(--tw-space-x-reverse)))`, mediaQuery, pseudoClass };
    }
  }
  if (baseClass.startsWith('space-y-')) {
    const value = baseClass.slice(8);
    if (SPACING_SCALE[value]) {
      return { property: '--tw-space-y-reverse', value: `0; margin-top: calc(${SPACING_SCALE[value]} * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(${SPACING_SCALE[value]} * var(--tw-space-y-reverse))`, mediaQuery, pseudoClass };
    }
  }

  return null;
}

/**
 * Extracts all unique classes from elements
 */
function extractAllClasses(elements: BuilderElement[]): string[] {
  const classes = new Set<string>();

  function traverse(element: BuilderElement) {
    // Extract classes from styles
    const styleClasses = [
      ...element.styles.layout,
      ...element.styles.spacing,
      ...element.styles.typography,
      ...element.styles.colors,
      ...element.styles.borders,
      ...element.styles.effects,
    ];

    // Add responsive classes
    element.styles.responsive.sm.forEach(c => classes.add(`sm:${c}`));
    element.styles.responsive.md.forEach(c => classes.add(`md:${c}`));
    element.styles.responsive.lg.forEach(c => classes.add(`lg:${c}`));

    styleClasses.forEach(c => classes.add(c));

    // Traverse children
    element.children.forEach(traverse);
  }

  elements.forEach(traverse);
  return Array.from(classes);
}

/**
 * Generates BEM class name
 */
function toBEMClassName(
  elementName: string,
  modifier?: string,
  options?: CSSGeneratorOptions
): string {
  const prefix = options?.classPrefix || '';
  const block = elementName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  if (modifier) {
    return `${prefix}${block}--${modifier}`;
  }
  return `${prefix}${block}`;
}

// ============================================================================
// MAIN GENERATION FUNCTIONS
// ============================================================================

/**
 * Generates CSS from Tailwind classes
 */
export function generateCSS(
  elements: BuilderElement[],
  options: Partial<CSSGeneratorOptions> = {}
): GeneratedCSS {
  const mergedOptions: CSSGeneratorOptions = { ...DEFAULT_OPTIONS, ...options };
  const nl = newline(mergedOptions);
  const indent = createIndent(1, mergedOptions);

  const allClasses = extractAllClasses(elements);
  const classMap: Record<string, string> = {};

  // Group CSS by media query
  const baseStyles: string[] = [];
  const mediaQueryStyles: Record<string, string[]> = {};

  // Process each class
  allClasses.forEach((className, index) => {
    const mapping = tailwindToCSS(className);
    if (!mapping) return;

    // Generate unique class name for CSS modules
    const cssClassName = mergedOptions.cssModules
      ? `_${className.replace(/[^a-zA-Z0-9]/g, '_')}_${index}`
      : `.${className.replace(/:/g, '\\:')}`;

    classMap[className] = cssClassName;

    // Build CSS rule
    let selector = cssClassName;
    if (mapping.pseudoClass) {
      selector += `:${mapping.pseudoClass}`;
    }

    const rule = `${selector} {${nl}${indent}${mapping.property}: ${mapping.value};${nl}}`;

    if (mapping.mediaQuery) {
      const mediaKey = `@media (min-width: ${mapping.mediaQuery})`;
      if (!mediaQueryStyles[mediaKey]) {
        mediaQueryStyles[mediaKey] = [];
      }
      mediaQueryStyles[mediaKey].push(rule);
    } else {
      baseStyles.push(rule);
    }
  });

  // Build final CSS
  const cssParts: string[] = [];

  // Add custom properties if enabled
  if (mergedOptions.includeCustomProperties) {
    cssParts.push(CSS_CUSTOM_PROPERTIES.trim());
    cssParts.push('');
  }

  // Add animations
  cssParts.push(ANIMATIONS.trim());
  cssParts.push('');

  // Add comments
  if (mergedOptions.includeComments) {
    cssParts.push('/* Base styles */');
  }

  // Add base styles
  cssParts.push(baseStyles.join(nl + nl));

  // Add media query styles
  Object.entries(mediaQueryStyles).forEach(([media, rules]) => {
    cssParts.push('');
    if (mergedOptions.includeComments) {
      cssParts.push(`/* Responsive: ${media} */`);
    }
    cssParts.push(`${media} {`);
    cssParts.push(rules.map(r => `${indent}${r.replace(/\n/g, nl + indent)}`).join(nl));
    cssParts.push('}');
  });

  const css = cssParts.join(nl);

  // Generate SCSS
  const scssParts: string[] = [];

  // Add SCSS variables
  scssParts.push('// Colors');
  Object.entries(COLOR_PALETTE).forEach(([colorName, shades]) => {
    Object.entries(shades).forEach(([shade, hex]) => {
      scssParts.push(`$${colorName}-${shade}: ${hex};`);
    });
  });

  scssParts.push('');
  scssParts.push('// Spacing');
  Object.entries(SPACING_SCALE).forEach(([key, value]) => {
    if (key && key !== 'px') {
      scssParts.push(`$spacing-${key}: ${value};`);
    }
  });

  scssParts.push('');
  scssParts.push('// Breakpoints');
  Object.entries(BREAKPOINTS).forEach(([key, value]) => {
    scssParts.push(`$breakpoint-${key}: ${value};`);
  });

  scssParts.push('');
  scssParts.push('// Mixins');
  scssParts.push(`@mixin sm { @media (min-width: $breakpoint-sm) { @content; } }`);
  scssParts.push(`@mixin md { @media (min-width: $breakpoint-md) { @content; } }`);
  scssParts.push(`@mixin lg { @media (min-width: $breakpoint-lg) { @content; } }`);
  scssParts.push(`@mixin xl { @media (min-width: $breakpoint-xl) { @content; } }`);

  scssParts.push('');
  scssParts.push('// Generated styles');
  scssParts.push(css);

  const scss = scssParts.join(nl);

  // Generate themed CSS
  const themedParts: string[] = [];
  themedParts.push(CSS_CUSTOM_PROPERTIES.trim());
  themedParts.push('');
  themedParts.push('/* Dark mode */');
  themedParts.push('@media (prefers-color-scheme: dark) {');
  themedParts.push('  :root {');
  themedParts.push('    --color-primary: #60a5fa;');
  themedParts.push('    --color-primary-hover: #3b82f6;');
  themedParts.push('    --color-secondary: #94a3b8;');
  themedParts.push('    --color-secondary-hover: #64748b;');
  themedParts.push('  }');
  themedParts.push('}');
  themedParts.push('');
  themedParts.push(css);

  const themed = themedParts.join(nl);

  return {
    css: mergedOptions.minify ? minifyCSS(css) : css,
    scss,
    themed: mergedOptions.minify ? minifyCSS(themed) : themed,
    classMap,
  };
}

/**
 * Minifies CSS
 */
function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*{\s*/g, '{') // Remove space around {
    .replace(/\s*}\s*/g, '}') // Remove space around }
    .replace(/\s*:\s*/g, ':') // Remove space around :
    .replace(/\s*;\s*/g, ';') // Remove space around ;
    .replace(/;}/g, '}') // Remove last semicolon
    .trim();
}

/**
 * Generates utility CSS with component classes
 */
export function generateUtilityCSS(
  elements: BuilderElement[],
  options: Partial<CSSGeneratorOptions> = {}
): string {
  const mergedOptions: CSSGeneratorOptions = { ...DEFAULT_OPTIONS, ...options };
  const nl = newline(mergedOptions);
  const indent = createIndent(1, mergedOptions);

  const parts: string[] = [];

  // Add reset/normalize
  parts.push('/* Reset */');
  parts.push('*, *::before, *::after { box-sizing: border-box; }');
  parts.push('* { margin: 0; }');
  parts.push('body { line-height: 1.5; -webkit-font-smoothing: antialiased; }');
  parts.push('img, picture, video, canvas, svg { display: block; max-width: 100%; }');
  parts.push('input, button, textarea, select { font: inherit; }');
  parts.push('p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }');

  parts.push('');

  // Add custom properties
  if (mergedOptions.includeCustomProperties) {
    parts.push(CSS_CUSTOM_PROPERTIES.trim());
    parts.push('');
  }

  // Add animations
  parts.push(ANIMATIONS.trim());
  parts.push('');

  // Generate component-specific CSS
  parts.push('/* Component styles */');

  function generateElementCSS(element: BuilderElement) {
    const className = mergedOptions.useBEM
      ? toBEMClassName(element.name, undefined, mergedOptions)
      : `component-${element.id.slice(-6)}`;

    const allClasses = [
      ...element.styles.layout,
      ...element.styles.spacing,
      ...element.styles.typography,
      ...element.styles.colors,
      ...element.styles.borders,
      ...element.styles.effects,
    ];

    const cssProperties: string[] = [];

    allClasses.forEach((cls) => {
      const mapping = tailwindToCSS(cls);
      if (mapping && !mapping.mediaQuery && !mapping.pseudoClass) {
        cssProperties.push(`${indent}${mapping.property}: ${mapping.value};`);
      }
    });

    if (cssProperties.length > 0) {
      parts.push(`.${className} {${nl}${cssProperties.join(nl)}${nl}}`);
    }

    // Process children
    element.children.forEach(generateElementCSS);
  }

  elements.forEach(generateElementCSS);

  return parts.join(nl);
}

/**
 * Generates CSS-in-JS compatible styles
 */
export function generateCSSinJS(elements: BuilderElement[]): Record<string, Record<string, string>> {
  const styles: Record<string, Record<string, string>> = {};

  function processElement(element: BuilderElement) {
    const componentKey = `${element.type}_${element.id.slice(-6)}`;
    const cssProps: Record<string, string> = {};

    const allClasses = [
      ...element.styles.layout,
      ...element.styles.spacing,
      ...element.styles.typography,
      ...element.styles.colors,
      ...element.styles.borders,
      ...element.styles.effects,
    ];

    allClasses.forEach((cls) => {
      const mapping = tailwindToCSS(cls);
      if (mapping && !mapping.mediaQuery && !mapping.pseudoClass) {
        // Handle compound properties (e.g., "padding: 1rem; margin: 2rem")
        const propValue = mapping.value.split(';').map(p => p.trim()).filter(Boolean);
        if (propValue.length === 1) {
          // Convert kebab-case to camelCase
          const camelProp = mapping.property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          cssProps[camelProp] = propValue[0];
        } else {
          propValue.forEach(pv => {
            const [prop, val] = pv.split(':').map(s => s.trim());
            if (prop && val) {
              const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
              cssProps[camelProp] = val;
            }
          });
        }
      }
    });

    if (Object.keys(cssProps).length > 0) {
      styles[componentKey] = cssProps;
    }

    element.children.forEach(processElement);
  }

  elements.forEach(processElement);

  return styles;
}

export { DEFAULT_OPTIONS as CSS_GENERATOR_DEFAULT_OPTIONS };
