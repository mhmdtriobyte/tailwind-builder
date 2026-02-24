// CSS Normalization System
// Browser-specific fixes, cross-browser compatibility, vendor prefixes, and fallbacks

// =============================================================================
// TYPES
// =============================================================================

export type BrowserTarget = 'chrome' | 'firefox' | 'safari' | 'edge' | 'ie11' | 'opera';

export interface BrowserSupport {
  browser: BrowserTarget;
  version: string;
}

export interface CSSFeature {
  id: string;
  name: string;
  property: string;
  detection: string;
  fallback: string;
  supported: BrowserSupport[];
}

export interface VendorPrefix {
  property: string;
  webkit?: boolean;
  moz?: boolean;
  ms?: boolean;
  o?: boolean;
  standard: string;
}

export interface NormalizationRule {
  id: string;
  description: string;
  selector: string;
  properties: Record<string, string>;
  browsers?: BrowserTarget[];
}

// =============================================================================
// BROWSER-SPECIFIC FIXES
// =============================================================================

export const BROWSER_FIXES: NormalizationRule[] = [
  // Safari Fixes
  {
    id: 'safari-flexbox-gap',
    description: 'Safari flexbox gap fallback',
    selector: '.flex',
    properties: {
      'gap': 'var(--gap, 1rem)',
      '--gap-fallback': '1rem',
    },
    browsers: ['safari'],
  },
  {
    id: 'safari-100vh',
    description: 'Safari 100vh fix for iOS',
    selector: '.h-screen',
    properties: {
      'height': '100vh',
      'height': '-webkit-fill-available',
    },
    browsers: ['safari'],
  },
  {
    id: 'safari-smooth-scroll',
    description: 'Safari smooth scroll momentum',
    selector: '*',
    properties: {
      '-webkit-overflow-scrolling': 'touch',
    },
    browsers: ['safari'],
  },
  {
    id: 'safari-tap-highlight',
    description: 'Remove tap highlight on mobile Safari',
    selector: 'button, a, input, select, textarea',
    properties: {
      '-webkit-tap-highlight-color': 'transparent',
    },
    browsers: ['safari'],
  },

  // Firefox Fixes
  {
    id: 'firefox-focus-inner',
    description: 'Remove Firefox button inner focus ring',
    selector: 'button::-moz-focus-inner',
    properties: {
      'border': '0',
      'padding': '0',
    },
    browsers: ['firefox'],
  },
  {
    id: 'firefox-placeholder-opacity',
    description: 'Fix Firefox placeholder opacity',
    selector: '::placeholder',
    properties: {
      'opacity': '1',
    },
    browsers: ['firefox'],
  },
  {
    id: 'firefox-scrollbar',
    description: 'Firefox scrollbar styling',
    selector: '*',
    properties: {
      'scrollbar-width': 'thin',
      'scrollbar-color': 'var(--scrollbar-thumb) var(--scrollbar-track)',
    },
    browsers: ['firefox'],
  },

  // Edge/IE Fixes
  {
    id: 'edge-clear-button',
    description: 'Hide Edge input clear button',
    selector: 'input::-ms-clear',
    properties: {
      'display': 'none',
    },
    browsers: ['edge', 'ie11'],
  },
  {
    id: 'edge-reveal-button',
    description: 'Hide Edge password reveal button',
    selector: 'input::-ms-reveal',
    properties: {
      'display': 'none',
    },
    browsers: ['edge', 'ie11'],
  },

  // Chrome Fixes
  {
    id: 'chrome-autofill',
    description: 'Style Chrome autofill',
    selector: 'input:-webkit-autofill',
    properties: {
      '-webkit-box-shadow': '0 0 0 1000px var(--autofill-bg, white) inset',
      '-webkit-text-fill-color': 'var(--autofill-color, inherit)',
    },
    browsers: ['chrome'],
  },
  {
    id: 'chrome-search-decoration',
    description: 'Remove Chrome search input decoration',
    selector: 'input[type="search"]::-webkit-search-decoration',
    properties: {
      '-webkit-appearance': 'none',
    },
    browsers: ['chrome'],
  },
  {
    id: 'chrome-spinner',
    description: 'Remove Chrome number input spinner',
    selector: 'input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button',
    properties: {
      '-webkit-appearance': 'none',
      'margin': '0',
    },
    browsers: ['chrome'],
  },
];

// =============================================================================
// VENDOR PREFIXES
// =============================================================================

export const VENDOR_PREFIXES: VendorPrefix[] = [
  // Flexbox
  { property: 'display: flex', webkit: true, moz: true, ms: true, standard: 'display: flex' },
  { property: 'flex-direction', webkit: true, moz: true, ms: true, standard: 'flex-direction' },
  { property: 'flex-wrap', webkit: true, moz: true, ms: true, standard: 'flex-wrap' },
  { property: 'justify-content', webkit: true, moz: true, ms: true, standard: 'justify-content' },
  { property: 'align-items', webkit: true, moz: true, ms: true, standard: 'align-items' },
  { property: 'align-content', webkit: true, moz: true, ms: true, standard: 'align-content' },

  // Grid
  { property: 'display: grid', webkit: true, moz: true, ms: true, standard: 'display: grid' },
  { property: 'grid-template-columns', webkit: true, moz: true, ms: true, standard: 'grid-template-columns' },
  { property: 'grid-template-rows', webkit: true, moz: true, ms: true, standard: 'grid-template-rows' },
  { property: 'grid-gap', webkit: true, moz: true, standard: 'gap' },

  // Transforms
  { property: 'transform', webkit: true, moz: true, ms: true, o: true, standard: 'transform' },
  { property: 'transform-origin', webkit: true, moz: true, ms: true, o: true, standard: 'transform-origin' },
  { property: 'transform-style', webkit: true, moz: true, standard: 'transform-style' },
  { property: 'perspective', webkit: true, moz: true, standard: 'perspective' },
  { property: 'perspective-origin', webkit: true, moz: true, standard: 'perspective-origin' },
  { property: 'backface-visibility', webkit: true, moz: true, standard: 'backface-visibility' },

  // Transitions & Animations
  { property: 'transition', webkit: true, moz: true, o: true, standard: 'transition' },
  { property: 'transition-property', webkit: true, moz: true, o: true, standard: 'transition-property' },
  { property: 'transition-duration', webkit: true, moz: true, o: true, standard: 'transition-duration' },
  { property: 'transition-timing-function', webkit: true, moz: true, o: true, standard: 'transition-timing-function' },
  { property: 'transition-delay', webkit: true, moz: true, o: true, standard: 'transition-delay' },
  { property: 'animation', webkit: true, moz: true, o: true, standard: 'animation' },
  { property: 'animation-name', webkit: true, moz: true, o: true, standard: 'animation-name' },
  { property: 'animation-duration', webkit: true, moz: true, o: true, standard: 'animation-duration' },
  { property: 'animation-timing-function', webkit: true, moz: true, o: true, standard: 'animation-timing-function' },
  { property: 'animation-delay', webkit: true, moz: true, o: true, standard: 'animation-delay' },
  { property: 'animation-iteration-count', webkit: true, moz: true, o: true, standard: 'animation-iteration-count' },
  { property: 'animation-direction', webkit: true, moz: true, o: true, standard: 'animation-direction' },
  { property: 'animation-fill-mode', webkit: true, moz: true, o: true, standard: 'animation-fill-mode' },

  // Appearance
  { property: 'appearance', webkit: true, moz: true, standard: 'appearance' },

  // User Select
  { property: 'user-select', webkit: true, moz: true, ms: true, standard: 'user-select' },

  // Box Sizing
  { property: 'box-sizing', webkit: true, moz: true, standard: 'box-sizing' },

  // Background
  { property: 'background-clip', webkit: true, moz: true, standard: 'background-clip' },
  { property: 'background-size', webkit: true, moz: true, o: true, standard: 'background-size' },

  // Filters
  { property: 'filter', webkit: true, moz: true, standard: 'filter' },
  { property: 'backdrop-filter', webkit: true, standard: 'backdrop-filter' },

  // Masks
  { property: 'mask', webkit: true, standard: 'mask' },
  { property: 'mask-image', webkit: true, standard: 'mask-image' },
  { property: 'mask-size', webkit: true, standard: 'mask-size' },
  { property: 'mask-position', webkit: true, standard: 'mask-position' },
  { property: 'mask-repeat', webkit: true, standard: 'mask-repeat' },

  // Columns
  { property: 'column-count', webkit: true, moz: true, standard: 'column-count' },
  { property: 'column-gap', webkit: true, moz: true, standard: 'column-gap' },
  { property: 'column-rule', webkit: true, moz: true, standard: 'column-rule' },
  { property: 'column-width', webkit: true, moz: true, standard: 'column-width' },

  // Hyphens
  { property: 'hyphens', webkit: true, moz: true, ms: true, standard: 'hyphens' },

  // Text
  { property: 'text-decoration-line', webkit: true, moz: true, standard: 'text-decoration-line' },
  { property: 'text-decoration-color', webkit: true, moz: true, standard: 'text-decoration-color' },
  { property: 'text-decoration-style', webkit: true, moz: true, standard: 'text-decoration-style' },
  { property: 'text-size-adjust', webkit: true, moz: true, ms: true, standard: 'text-size-adjust' },

  // Scroll
  { property: 'scroll-behavior', webkit: true, moz: true, standard: 'scroll-behavior' },
  { property: 'scroll-snap-type', webkit: true, ms: true, standard: 'scroll-snap-type' },
  { property: 'scroll-snap-align', webkit: true, standard: 'scroll-snap-align' },
  { property: 'overscroll-behavior', webkit: true, moz: true, ms: true, standard: 'overscroll-behavior' },

  // Writing Mode
  { property: 'writing-mode', webkit: true, ms: true, standard: 'writing-mode' },

  // Clip Path
  { property: 'clip-path', webkit: true, standard: 'clip-path' },

  // Font Smoothing
  { property: 'font-smoothing', webkit: true, moz: true, standard: 'font-smoothing' },

  // Sticky Position
  { property: 'position: sticky', webkit: true, standard: 'position: sticky' },
];

// =============================================================================
// CSS FEATURE DETECTION
// =============================================================================

export const CSS_FEATURES: CSSFeature[] = [
  {
    id: 'css-grid',
    name: 'CSS Grid',
    property: 'display: grid',
    detection: '@supports (display: grid)',
    fallback: 'display: flex; flex-wrap: wrap;',
    supported: [
      { browser: 'chrome', version: '57' },
      { browser: 'firefox', version: '52' },
      { browser: 'safari', version: '10.1' },
      { browser: 'edge', version: '16' },
    ],
  },
  {
    id: 'css-gap',
    name: 'Gap Property',
    property: 'gap',
    detection: '@supports (gap: 1rem)',
    fallback: 'margin: -0.5rem; > * { margin: 0.5rem; }',
    supported: [
      { browser: 'chrome', version: '84' },
      { browser: 'firefox', version: '63' },
      { browser: 'safari', version: '14.1' },
      { browser: 'edge', version: '84' },
    ],
  },
  {
    id: 'css-backdrop-filter',
    name: 'Backdrop Filter',
    property: 'backdrop-filter',
    detection: '@supports (backdrop-filter: blur(10px))',
    fallback: 'background-color: rgba(255, 255, 255, 0.9);',
    supported: [
      { browser: 'chrome', version: '76' },
      { browser: 'firefox', version: '103' },
      { browser: 'safari', version: '9' },
      { browser: 'edge', version: '79' },
    ],
  },
  {
    id: 'css-aspect-ratio',
    name: 'Aspect Ratio',
    property: 'aspect-ratio',
    detection: '@supports (aspect-ratio: 16/9)',
    fallback: 'position: relative; &::before { content: ""; display: block; padding-top: 56.25%; }',
    supported: [
      { browser: 'chrome', version: '88' },
      { browser: 'firefox', version: '89' },
      { browser: 'safari', version: '15' },
      { browser: 'edge', version: '88' },
    ],
  },
  {
    id: 'css-container-queries',
    name: 'Container Queries',
    property: 'container-type',
    detection: '@supports (container-type: inline-size)',
    fallback: '/* No direct fallback, use media queries */',
    supported: [
      { browser: 'chrome', version: '105' },
      { browser: 'firefox', version: '110' },
      { browser: 'safari', version: '16' },
      { browser: 'edge', version: '105' },
    ],
  },
  {
    id: 'css-subgrid',
    name: 'Subgrid',
    property: 'grid-template-columns: subgrid',
    detection: '@supports (grid-template-columns: subgrid)',
    fallback: 'grid-template-columns: inherit;',
    supported: [
      { browser: 'chrome', version: '117' },
      { browser: 'firefox', version: '71' },
      { browser: 'safari', version: '16' },
      { browser: 'edge', version: '117' },
    ],
  },
  {
    id: 'css-has-selector',
    name: ':has() Selector',
    property: ':has()',
    detection: '@supports selector(:has(*))',
    fallback: '/* Use JavaScript for similar functionality */',
    supported: [
      { browser: 'chrome', version: '105' },
      { browser: 'firefox', version: '121' },
      { browser: 'safari', version: '15.4' },
      { browser: 'edge', version: '105' },
    ],
  },
  {
    id: 'css-color-mix',
    name: 'color-mix()',
    property: 'color-mix()',
    detection: '@supports (color: color-mix(in srgb, red, blue))',
    fallback: '/* Use pre-computed colors */',
    supported: [
      { browser: 'chrome', version: '111' },
      { browser: 'firefox', version: '113' },
      { browser: 'safari', version: '16.2' },
      { browser: 'edge', version: '111' },
    ],
  },
  {
    id: 'css-nesting',
    name: 'CSS Nesting',
    property: '& selector',
    detection: '@supports selector(&)',
    fallback: '/* Use flat CSS or preprocessor */',
    supported: [
      { browser: 'chrome', version: '120' },
      { browser: 'firefox', version: '117' },
      { browser: 'safari', version: '17.2' },
      { browser: 'edge', version: '120' },
    ],
  },
  {
    id: 'css-scroll-snap',
    name: 'Scroll Snap',
    property: 'scroll-snap-type',
    detection: '@supports (scroll-snap-type: x mandatory)',
    fallback: '/* Use JavaScript for scroll behavior */',
    supported: [
      { browser: 'chrome', version: '69' },
      { browser: 'firefox', version: '68' },
      { browser: 'safari', version: '11' },
      { browser: 'edge', version: '79' },
    ],
  },
];

// =============================================================================
// GENERATOR FUNCTIONS
// =============================================================================

/**
 * Generate vendor-prefixed CSS for a property
 */
export function generateVendorPrefixedCSS(
  property: string,
  value: string,
  prefixes?: ('webkit' | 'moz' | 'ms' | 'o')[]
): string {
  const vendorPrefix = VENDOR_PREFIXES.find(
    vp => vp.property === property || vp.standard === property
  );

  if (!vendorPrefix) {
    return `${property}: ${value};`;
  }

  const lines: string[] = [];
  const targetPrefixes = prefixes || [];

  if (!prefixes) {
    if (vendorPrefix.webkit) targetPrefixes.push('webkit');
    if (vendorPrefix.moz) targetPrefixes.push('moz');
    if (vendorPrefix.ms) targetPrefixes.push('ms');
    if (vendorPrefix.o) targetPrefixes.push('o');
  }

  // Add prefixed versions
  for (const prefix of targetPrefixes) {
    lines.push(`-${prefix}-${property}: ${value};`);
  }

  // Add standard version last
  lines.push(`${property}: ${value};`);

  return lines.join('\n');
}

/**
 * Generate feature detection CSS with fallback
 */
export function generateFeatureDetectionCSS(
  featureId: string,
  selector: string,
  modernCSS: string,
  fallbackCSS?: string
): string {
  const feature = CSS_FEATURES.find(f => f.id === featureId);
  if (!feature) return modernCSS;

  const fallback = fallbackCSS || feature.fallback;

  return `
/* Fallback for browsers without ${feature.name} support */
${selector} {
  ${fallback}
}

/* Modern browsers with ${feature.name} support */
${feature.detection} {
  ${selector} {
    ${modernCSS}
  }
}
`;
}

/**
 * Generate browser-specific fixes
 */
export function generateBrowserFixes(browsers?: BrowserTarget[]): string {
  const targetBrowsers = browsers || ['chrome', 'firefox', 'safari', 'edge'];
  const fixes = BROWSER_FIXES.filter(
    fix => !fix.browsers || fix.browsers.some(b => targetBrowsers.includes(b))
  );

  const cssBlocks: string[] = [];

  for (const fix of fixes) {
    const properties = Object.entries(fix.properties)
      .map(([prop, val]) => `  ${prop}: ${val};`)
      .join('\n');

    cssBlocks.push(`/* ${fix.description} */\n${fix.selector} {\n${properties}\n}`);
  }

  return cssBlocks.join('\n\n');
}

/**
 * Generate complete normalization CSS
 */
export function generateNormalizationCSS(options: {
  browsers?: BrowserTarget[];
  features?: string[];
  vendorPrefixes?: boolean;
}): string {
  const sections: string[] = [];

  // Browser-specific fixes
  sections.push('/* ==================== */');
  sections.push('/* Browser-Specific Fixes */');
  sections.push('/* ==================== */');
  sections.push(generateBrowserFixes(options.browsers));

  // Feature detection
  if (options.features && options.features.length > 0) {
    sections.push('\n/* ==================== */');
    sections.push('/* Feature Detection */');
    sections.push('/* ==================== */');

    for (const featureId of options.features) {
      const feature = CSS_FEATURES.find(f => f.id === featureId);
      if (feature) {
        sections.push(`\n/* ${feature.name} */`);
        sections.push(`${feature.detection} {
  /* ${feature.name} is supported */
}`);
      }
    }
  }

  return sections.join('\n');
}

// =============================================================================
// AUTOPREFIXER-LIKE FUNCTIONALITY
// =============================================================================

export interface AutoprefixOptions {
  browsers: BrowserTarget[];
  grid: boolean;
  flexbox: boolean;
  cascade: boolean;
}

export const DEFAULT_AUTOPREFIX_OPTIONS: AutoprefixOptions = {
  browsers: ['chrome', 'firefox', 'safari', 'edge'],
  grid: true,
  flexbox: true,
  cascade: true,
};

/**
 * Add vendor prefixes to CSS string
 */
export function autoprefixCSS(css: string, options: Partial<AutoprefixOptions> = {}): string {
  const opts = { ...DEFAULT_AUTOPREFIX_OPTIONS, ...options };
  let result = css;

  // Process each vendor prefix rule
  for (const prefix of VENDOR_PREFIXES) {
    // Skip grid prefixes if disabled
    if (!opts.grid && prefix.property.includes('grid')) continue;

    // Skip flexbox prefixes if disabled
    if (!opts.flexbox && (prefix.property.includes('flex') || prefix.property === 'display: flex')) continue;

    const propertyRegex = new RegExp(`(${prefix.standard}):\\s*([^;]+);`, 'g');
    const matches = result.matchAll(propertyRegex);

    for (const match of matches) {
      const fullMatch = match[0];
      const value = match[2];
      const prefixed = generateVendorPrefixedCSS(prefix.standard, value);

      if (opts.cascade) {
        result = result.replace(fullMatch, prefixed);
      }
    }
  }

  return result;
}

// =============================================================================
// FALLBACK GENERATOR
// =============================================================================

export interface FallbackRule {
  property: string;
  modernValue: string;
  fallbackValue: string;
}

export const COMMON_FALLBACKS: FallbackRule[] = [
  // Colors
  { property: 'color', modernValue: 'oklch()', fallbackValue: 'rgb()' },
  { property: 'background-color', modernValue: 'oklch()', fallbackValue: 'rgb()' },

  // Units
  { property: 'width', modernValue: 'dvw', fallbackValue: 'vw' },
  { property: 'height', modernValue: 'dvh', fallbackValue: 'vh' },
  { property: 'width', modernValue: 'svw', fallbackValue: 'vw' },
  { property: 'height', modernValue: 'svh', fallbackValue: 'vh' },
  { property: 'width', modernValue: 'lvw', fallbackValue: 'vw' },
  { property: 'height', modernValue: 'lvh', fallbackValue: 'vh' },

  // Clamp
  { property: 'font-size', modernValue: 'clamp()', fallbackValue: 'calc()' },
  { property: 'width', modernValue: 'clamp()', fallbackValue: 'min-width + max-width' },
];

/**
 * Generate CSS with fallbacks
 */
export function generateWithFallback(
  property: string,
  modernValue: string,
  fallbackValue: string
): string {
  return `${property}: ${fallbackValue};\n${property}: ${modernValue};`;
}

/**
 * Check if a CSS feature is supported
 */
export function isFeatureSupported(featureId: string, browser: BrowserTarget, version: string): boolean {
  const feature = CSS_FEATURES.find(f => f.id === featureId);
  if (!feature) return false;

  const support = feature.supported.find(s => s.browser === browser);
  if (!support) return false;

  return parseFloat(version) >= parseFloat(support.version);
}

/**
 * Get minimum browser version for a feature
 */
export function getMinimumVersion(featureId: string, browser: BrowserTarget): string | null {
  const feature = CSS_FEATURES.find(f => f.id === featureId);
  if (!feature) return null;

  const support = feature.supported.find(s => s.browser === browser);
  return support?.version || null;
}

// =============================================================================
// CROSS-BROWSER SAFE CSS
// =============================================================================

export interface SafeCSSOptions {
  modernFirst: boolean;
  includeAllPrefixes: boolean;
  addSupportsQuery: boolean;
}

export const DEFAULT_SAFE_CSS_OPTIONS: SafeCSSOptions = {
  modernFirst: false,
  includeAllPrefixes: true,
  addSupportsQuery: true,
};

/**
 * Generate cross-browser safe CSS
 */
export function generateSafeCSS(
  selector: string,
  properties: Record<string, string>,
  options: Partial<SafeCSSOptions> = {}
): string {
  const opts = { ...DEFAULT_SAFE_CSS_OPTIONS, ...options };
  const lines: string[] = [];

  for (const [property, value] of Object.entries(properties)) {
    // Check if this property needs vendor prefixes
    const vendorPrefix = VENDOR_PREFIXES.find(
      vp => vp.property === property || vp.standard === property
    );

    if (vendorPrefix && opts.includeAllPrefixes) {
      // Add prefixed versions
      if (vendorPrefix.webkit) {
        lines.push(`  -webkit-${property}: ${value};`);
      }
      if (vendorPrefix.moz) {
        lines.push(`  -moz-${property}: ${value};`);
      }
      if (vendorPrefix.ms) {
        lines.push(`  -ms-${property}: ${value};`);
      }
      if (vendorPrefix.o) {
        lines.push(`  -o-${property}: ${value};`);
      }
    }

    // Add standard property
    lines.push(`  ${property}: ${value};`);
  }

  return `${selector} {\n${lines.join('\n')}\n}`;
}

// =============================================================================
// EXPORT HELPERS
// =============================================================================

export function getBrowserFixes(browser: BrowserTarget): NormalizationRule[] {
  return BROWSER_FIXES.filter(fix => !fix.browsers || fix.browsers.includes(browser));
}

export function getFeatureSupport(featureId: string): CSSFeature | undefined {
  return CSS_FEATURES.find(f => f.id === featureId);
}

export function getAllFeatures(): CSSFeature[] {
  return [...CSS_FEATURES];
}

export function getAllVendorPrefixes(): VendorPrefix[] {
  return [...VENDOR_PREFIXES];
}
