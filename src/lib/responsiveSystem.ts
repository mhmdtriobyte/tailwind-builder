/**
 * Responsive System - Advanced responsive design utilities
 *
 * Provides comprehensive breakpoint management, fluid typography/spacing,
 * container queries, aspect ratios, and media query building for
 * creating responsive designs that work across all devices.
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

/**
 * Breakpoint configuration with min/max width support
 */
export interface BreakpointConfig {
  name: string;
  minWidth: number;
  maxWidth?: number;
  label: string;
  description?: string;
}

/**
 * Custom breakpoint definition for advanced scenarios
 */
export interface CustomBreakpoint {
  id: string;
  name: string;
  minWidth: number;
  maxWidth?: number;
  orientation?: 'portrait' | 'landscape' | 'any';
  pixelDensity?: number;
  prefersDarkMode?: boolean;
  prefersReducedMotion?: boolean;
}

/**
 * Fluid typography configuration
 */
export interface FluidTypographyConfig {
  minFontSize: number;      // Font size at minimum viewport (in px)
  maxFontSize: number;      // Font size at maximum viewport (in px)
  minViewport: number;      // Minimum viewport width (in px)
  maxViewport: number;      // Maximum viewport width (in px)
  unit?: 'px' | 'rem';      // Output unit
  rootFontSize?: number;    // Root font size for rem calculation (default: 16)
}

/**
 * Fluid spacing configuration
 */
export interface FluidSpacingConfig {
  minSpacing: number;       // Spacing at minimum viewport (in px)
  maxSpacing: number;       // Spacing at maximum viewport (in px)
  minViewport: number;      // Minimum viewport width (in px)
  maxViewport: number;      // Maximum viewport width (in px)
  unit?: 'px' | 'rem';      // Output unit
  rootFontSize?: number;    // Root font size for rem calculation
}

/**
 * Aspect ratio definition
 */
export interface AspectRatio {
  name: string;
  width: number;
  height: number;
  label: string;
  category: 'video' | 'photo' | 'screen' | 'social' | 'custom';
}

/**
 * Responsive image configuration
 */
export interface ResponsiveImageConfig {
  src: string;
  alt: string;
  widths: number[];
  sizes?: string;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
}

/**
 * Generated srcset entry
 */
export interface SrcSetEntry {
  src: string;
  width: number;
  descriptor: string;
}

/**
 * Media query condition
 */
export interface MediaQueryCondition {
  type: 'min-width' | 'max-width' | 'width' | 'min-height' | 'max-height' |
        'orientation' | 'aspect-ratio' | 'resolution' | 'prefers-color-scheme' |
        'prefers-reduced-motion' | 'prefers-contrast' | 'hover' | 'pointer' |
        'any-hover' | 'any-pointer' | 'display-mode';
  value: string | number;
  unit?: string;
}

/**
 * Container query configuration
 */
export interface ContainerQueryConfig {
  name: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  condition: 'and' | 'or';
}

/**
 * Responsive visibility configuration
 */
export interface ResponsiveVisibility {
  breakpoint: string;
  show: boolean;
  customQuery?: string;
}

/**
 * Per-breakpoint style override
 */
export interface BreakpointStyleOverride {
  breakpoint: string;
  styles: Record<string, string>;
  tailwindClasses?: string[];
}

// ============================================================================
// DEFAULT BREAKPOINTS
// ============================================================================

/**
 * Standard Tailwind CSS breakpoints with extended metadata
 */
export const TAILWIND_BREAKPOINTS: BreakpointConfig[] = [
  { name: 'xs', minWidth: 0, maxWidth: 639, label: 'Extra Small', description: 'Mobile portrait' },
  { name: 'sm', minWidth: 640, maxWidth: 767, label: 'Small', description: 'Mobile landscape / Small tablets' },
  { name: 'md', minWidth: 768, maxWidth: 1023, label: 'Medium', description: 'Tablets' },
  { name: 'lg', minWidth: 1024, maxWidth: 1279, label: 'Large', description: 'Small desktops / Tablets landscape' },
  { name: 'xl', minWidth: 1280, maxWidth: 1535, label: 'Extra Large', description: 'Desktops' },
  { name: '2xl', minWidth: 1536, label: '2X Large', description: 'Large desktops' },
];

/**
 * Extended breakpoints for finer control
 */
export const EXTENDED_BREAKPOINTS: BreakpointConfig[] = [
  { name: '3xs', minWidth: 0, maxWidth: 319, label: '3X Small', description: 'Very small devices' },
  { name: '2xs', minWidth: 320, maxWidth: 374, label: '2X Small', description: 'Small phones' },
  { name: 'xs', minWidth: 375, maxWidth: 424, label: 'Extra Small', description: 'Standard phones' },
  { name: 'sm', minWidth: 425, maxWidth: 639, label: 'Small', description: 'Large phones' },
  { name: 'md', minWidth: 640, maxWidth: 767, label: 'Medium', description: 'Small tablets' },
  { name: 'lg', minWidth: 768, maxWidth: 1023, label: 'Large', description: 'Tablets' },
  { name: 'xl', minWidth: 1024, maxWidth: 1279, label: 'Extra Large', description: 'Small desktops' },
  { name: '2xl', minWidth: 1280, maxWidth: 1535, label: '2X Large', description: 'Standard desktops' },
  { name: '3xl', minWidth: 1536, maxWidth: 1919, label: '3X Large', description: 'Large desktops' },
  { name: '4xl', minWidth: 1920, maxWidth: 2559, label: '4X Large', description: 'Full HD displays' },
  { name: '5xl', minWidth: 2560, label: '5X Large', description: '4K displays' },
];

// ============================================================================
// FLUID TYPOGRAPHY
// ============================================================================

/**
 * Calculate fluid typography CSS clamp value
 *
 * Uses CSS clamp() to create responsive typography that scales
 * smoothly between viewport sizes.
 *
 * @param config - Fluid typography configuration
 * @returns CSS clamp() value string
 *
 * @example
 * calculateFluidTypography({
 *   minFontSize: 16,
 *   maxFontSize: 24,
 *   minViewport: 320,
 *   maxViewport: 1280
 * })
 * // Returns: "clamp(1rem, 0.6667rem + 0.8333vw, 1.5rem)"
 */
export function calculateFluidTypography(config: FluidTypographyConfig): string {
  const {
    minFontSize,
    maxFontSize,
    minViewport,
    maxViewport,
    unit = 'rem',
    rootFontSize = 16,
  } = config;

  // Validate inputs
  if (minFontSize <= 0 || maxFontSize <= 0) {
    throw new Error('Font sizes must be positive numbers');
  }
  if (minViewport >= maxViewport) {
    throw new Error('minViewport must be less than maxViewport');
  }

  // Calculate slope and y-intercept
  const slope = (maxFontSize - minFontSize) / (maxViewport - minViewport);
  const yAxisIntersection = minFontSize - slope * minViewport;

  // Convert to viewport-relative units
  const slopeVw = slope * 100;
  const yAxisIntersectionRem = yAxisIntersection / rootFontSize;
  const minFontSizeRem = minFontSize / rootFontSize;
  const maxFontSizeRem = maxFontSize / rootFontSize;

  if (unit === 'rem') {
    return `clamp(${minFontSizeRem.toFixed(4)}rem, ${yAxisIntersectionRem.toFixed(4)}rem + ${slopeVw.toFixed(4)}vw, ${maxFontSizeRem.toFixed(4)}rem)`;
  }

  return `clamp(${minFontSize}px, ${yAxisIntersection.toFixed(4)}px + ${slopeVw.toFixed(4)}vw, ${maxFontSize}px)`;
}

/**
 * Fluid typography scale generator
 *
 * Generates a complete typography scale with fluid values
 */
export interface FluidTypeScale {
  name: string;
  minSize: number;
  maxSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export const DEFAULT_TYPE_SCALE: FluidTypeScale[] = [
  { name: 'xs', minSize: 10, maxSize: 12, lineHeight: 1.5, letterSpacing: 0 },
  { name: 'sm', minSize: 12, maxSize: 14, lineHeight: 1.5, letterSpacing: 0 },
  { name: 'base', minSize: 14, maxSize: 16, lineHeight: 1.5, letterSpacing: 0 },
  { name: 'lg', minSize: 16, maxSize: 18, lineHeight: 1.4, letterSpacing: -0.01 },
  { name: 'xl', minSize: 18, maxSize: 20, lineHeight: 1.4, letterSpacing: -0.01 },
  { name: '2xl', minSize: 20, maxSize: 24, lineHeight: 1.3, letterSpacing: -0.02 },
  { name: '3xl', minSize: 24, maxSize: 30, lineHeight: 1.25, letterSpacing: -0.02 },
  { name: '4xl', minSize: 30, maxSize: 36, lineHeight: 1.2, letterSpacing: -0.02 },
  { name: '5xl', minSize: 36, maxSize: 48, lineHeight: 1.1, letterSpacing: -0.03 },
  { name: '6xl', minSize: 48, maxSize: 64, lineHeight: 1.05, letterSpacing: -0.03 },
  { name: '7xl', minSize: 64, maxSize: 80, lineHeight: 1, letterSpacing: -0.04 },
  { name: '8xl', minSize: 80, maxSize: 96, lineHeight: 1, letterSpacing: -0.04 },
  { name: '9xl', minSize: 96, maxSize: 128, lineHeight: 1, letterSpacing: -0.05 },
];

/**
 * Generate fluid typography CSS for a type scale
 */
export function generateFluidTypeScale(
  scale: FluidTypeScale[],
  minViewport: number = 320,
  maxViewport: number = 1280
): Record<string, { fontSize: string; lineHeight: number; letterSpacing: string }> {
  const result: Record<string, { fontSize: string; lineHeight: number; letterSpacing: string }> = {};

  for (const entry of scale) {
    result[entry.name] = {
      fontSize: calculateFluidTypography({
        minFontSize: entry.minSize,
        maxFontSize: entry.maxSize,
        minViewport,
        maxViewport,
      }),
      lineHeight: entry.lineHeight,
      letterSpacing: entry.letterSpacing === 0 ? 'normal' : `${entry.letterSpacing}em`,
    };
  }

  return result;
}

// ============================================================================
// FLUID SPACING
// ============================================================================

/**
 * Calculate fluid spacing CSS clamp value
 *
 * @param config - Fluid spacing configuration
 * @returns CSS clamp() value string
 */
export function calculateFluidSpacing(config: FluidSpacingConfig): string {
  const {
    minSpacing,
    maxSpacing,
    minViewport,
    maxViewport,
    unit = 'rem',
    rootFontSize = 16,
  } = config;

  // Validate inputs
  if (minSpacing < 0 || maxSpacing < 0) {
    throw new Error('Spacing values must be non-negative');
  }
  if (minViewport >= maxViewport) {
    throw new Error('minViewport must be less than maxViewport');
  }

  const slope = (maxSpacing - minSpacing) / (maxViewport - minViewport);
  const yAxisIntersection = minSpacing - slope * minViewport;
  const slopeVw = slope * 100;

  if (unit === 'rem') {
    const yAxisIntersectionRem = yAxisIntersection / rootFontSize;
    const minSpacingRem = minSpacing / rootFontSize;
    const maxSpacingRem = maxSpacing / rootFontSize;
    return `clamp(${minSpacingRem.toFixed(4)}rem, ${yAxisIntersectionRem.toFixed(4)}rem + ${slopeVw.toFixed(4)}vw, ${maxSpacingRem.toFixed(4)}rem)`;
  }

  return `clamp(${minSpacing}px, ${yAxisIntersection.toFixed(4)}px + ${slopeVw.toFixed(4)}vw, ${maxSpacing}px)`;
}

/**
 * Fluid spacing scale based on a base value and multipliers
 */
export interface FluidSpacingScale {
  name: string;
  minMultiplier: number;
  maxMultiplier: number;
}

export const DEFAULT_SPACING_SCALE: FluidSpacingScale[] = [
  { name: '0', minMultiplier: 0, maxMultiplier: 0 },
  { name: 'px', minMultiplier: 0.0625, maxMultiplier: 0.0625 },
  { name: '0.5', minMultiplier: 0.125, maxMultiplier: 0.125 },
  { name: '1', minMultiplier: 0.25, maxMultiplier: 0.25 },
  { name: '1.5', minMultiplier: 0.375, maxMultiplier: 0.375 },
  { name: '2', minMultiplier: 0.5, maxMultiplier: 0.5 },
  { name: '2.5', minMultiplier: 0.625, maxMultiplier: 0.625 },
  { name: '3', minMultiplier: 0.75, maxMultiplier: 0.75 },
  { name: '3.5', minMultiplier: 0.875, maxMultiplier: 0.875 },
  { name: '4', minMultiplier: 1, maxMultiplier: 1 },
  { name: '5', minMultiplier: 1.25, maxMultiplier: 1.25 },
  { name: '6', minMultiplier: 1.5, maxMultiplier: 1.5 },
  { name: '7', minMultiplier: 1.75, maxMultiplier: 1.75 },
  { name: '8', minMultiplier: 2, maxMultiplier: 2 },
  { name: '9', minMultiplier: 2.25, maxMultiplier: 2.25 },
  { name: '10', minMultiplier: 2.5, maxMultiplier: 2.5 },
  { name: '11', minMultiplier: 2.75, maxMultiplier: 2.75 },
  { name: '12', minMultiplier: 3, maxMultiplier: 3 },
  { name: '14', minMultiplier: 3.5, maxMultiplier: 3.5 },
  { name: '16', minMultiplier: 4, maxMultiplier: 4 },
  { name: '20', minMultiplier: 5, maxMultiplier: 5 },
  { name: '24', minMultiplier: 6, maxMultiplier: 6 },
  { name: '28', minMultiplier: 7, maxMultiplier: 7 },
  { name: '32', minMultiplier: 8, maxMultiplier: 8 },
  { name: '36', minMultiplier: 9, maxMultiplier: 9 },
  { name: '40', minMultiplier: 10, maxMultiplier: 10 },
  { name: '44', minMultiplier: 11, maxMultiplier: 11 },
  { name: '48', minMultiplier: 12, maxMultiplier: 12 },
  { name: '52', minMultiplier: 13, maxMultiplier: 13 },
  { name: '56', minMultiplier: 14, maxMultiplier: 14 },
  { name: '60', minMultiplier: 15, maxMultiplier: 15 },
  { name: '64', minMultiplier: 16, maxMultiplier: 16 },
  { name: '72', minMultiplier: 18, maxMultiplier: 18 },
  { name: '80', minMultiplier: 20, maxMultiplier: 20 },
  { name: '96', minMultiplier: 24, maxMultiplier: 24 },
];

/**
 * Generate fluid spacing scale
 */
export function generateFluidSpacingScale(
  baseSize: number = 16,
  minViewport: number = 320,
  maxViewport: number = 1280,
  scale: FluidSpacingScale[] = DEFAULT_SPACING_SCALE
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const entry of scale) {
    const minSpacing = baseSize * entry.minMultiplier;
    const maxSpacing = baseSize * entry.maxMultiplier;

    if (minSpacing === maxSpacing) {
      result[entry.name] = `${minSpacing / 16}rem`;
    } else {
      result[entry.name] = calculateFluidSpacing({
        minSpacing,
        maxSpacing,
        minViewport,
        maxViewport,
      });
    }
  }

  return result;
}

// ============================================================================
// ASPECT RATIOS
// ============================================================================

/**
 * Common aspect ratios for various use cases
 */
export const ASPECT_RATIOS: AspectRatio[] = [
  // Video aspect ratios
  { name: '16:9', width: 16, height: 9, label: 'Widescreen (16:9)', category: 'video' },
  { name: '4:3', width: 4, height: 3, label: 'Standard (4:3)', category: 'video' },
  { name: '21:9', width: 21, height: 9, label: 'Ultrawide (21:9)', category: 'video' },
  { name: '1:1', width: 1, height: 1, label: 'Square (1:1)', category: 'video' },

  // Photo aspect ratios
  { name: '3:2', width: 3, height: 2, label: 'DSLR (3:2)', category: 'photo' },
  { name: '4:5', width: 4, height: 5, label: 'Portrait (4:5)', category: 'photo' },
  { name: '5:4', width: 5, height: 4, label: 'Large Format (5:4)', category: 'photo' },
  { name: '2:3', width: 2, height: 3, label: 'Vertical (2:3)', category: 'photo' },

  // Screen aspect ratios
  { name: '9:16', width: 9, height: 16, label: 'Mobile Portrait (9:16)', category: 'screen' },
  { name: '9:19.5', width: 9, height: 19.5, label: 'iPhone (9:19.5)', category: 'screen' },
  { name: '3:4', width: 3, height: 4, label: 'iPad (3:4)', category: 'screen' },
  { name: '16:10', width: 16, height: 10, label: 'MacBook (16:10)', category: 'screen' },

  // Social media
  { name: '1.91:1', width: 1.91, height: 1, label: 'Facebook/Twitter (1.91:1)', category: 'social' },
  { name: '9:16', width: 9, height: 16, label: 'Stories (9:16)', category: 'social' },
  { name: '4:5', width: 4, height: 5, label: 'Instagram Portrait (4:5)', category: 'social' },
];

/**
 * Calculate aspect ratio padding percentage
 * Used for CSS aspect-ratio or padding-bottom hack
 */
export function calculateAspectRatioPadding(width: number, height: number): number {
  return (height / width) * 100;
}

/**
 * Get aspect ratio CSS value
 */
export function getAspectRatioCSS(ratio: AspectRatio): string {
  return `${ratio.width} / ${ratio.height}`;
}

/**
 * Parse aspect ratio string to width/height
 */
export function parseAspectRatio(ratio: string): { width: number; height: number } | null {
  const match = ratio.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  return {
    width: parseFloat(match[1]),
    height: parseFloat(match[2]),
  };
}

/**
 * Create custom aspect ratio
 */
export function createAspectRatio(
  name: string,
  width: number,
  height: number,
  label?: string
): AspectRatio {
  return {
    name,
    width,
    height,
    label: label || `${width}:${height}`,
    category: 'custom',
  };
}

// ============================================================================
// RESPONSIVE IMAGES
// ============================================================================

/**
 * Default image widths for srcset generation
 */
export const DEFAULT_IMAGE_WIDTHS = [320, 480, 640, 768, 1024, 1280, 1536, 1920, 2560];

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(
  config: ResponsiveImageConfig
): { srcset: string; sizes: string; entries: SrcSetEntry[] } {
  const { src, widths, sizes, format = 'auto' } = config;

  // Generate srcset entries
  const entries: SrcSetEntry[] = widths.map((width) => {
    // Build the URL with width parameter
    let imageSrc = src;
    const url = new URL(src, 'https://example.com');

    // Add width parameter
    url.searchParams.set('w', width.toString());

    // Add format if specified
    if (format !== 'auto') {
      url.searchParams.set('fm', format);
    }

    // For relative URLs, just append query params
    if (src.startsWith('/') || src.startsWith('./')) {
      const separator = src.includes('?') ? '&' : '?';
      imageSrc = `${src}${separator}w=${width}${format !== 'auto' ? `&fm=${format}` : ''}`;
    } else {
      imageSrc = url.toString();
    }

    return {
      src: imageSrc,
      width,
      descriptor: `${width}w`,
    };
  });

  // Generate srcset string
  const srcset = entries.map((entry) => `${entry.src} ${entry.descriptor}`).join(', ');

  // Generate sizes string if not provided
  const sizesStr = sizes || generateDefaultSizes(widths);

  return { srcset, sizes: sizesStr, entries };
}

/**
 * Generate default sizes attribute based on widths
 */
export function generateDefaultSizes(widths: number[]): string {
  const sortedWidths = [...widths].sort((a, b) => a - b);
  const sizeParts: string[] = [];

  for (let i = 0; i < sortedWidths.length - 1; i++) {
    const width = sortedWidths[i];
    const nextWidth = sortedWidths[i + 1];
    sizeParts.push(`(max-width: ${nextWidth}px) ${width}px`);
  }

  // Add default size
  sizeParts.push(`${sortedWidths[sortedWidths.length - 1]}px`);

  return sizeParts.join(', ');
}

/**
 * Generate picture element sources for multiple formats
 */
export interface PictureSource {
  srcset: string;
  type: string;
  media?: string;
}

export function generatePictureSources(
  src: string,
  widths: number[],
  formats: ('avif' | 'webp' | 'jpg' | 'png')[] = ['avif', 'webp', 'jpg']
): PictureSource[] {
  const sources: PictureSource[] = [];

  for (const format of formats) {
    const { srcset } = generateSrcSet({
      src,
      alt: '',
      widths,
      format,
    });

    sources.push({
      srcset,
      type: `image/${format}`,
    });
  }

  return sources;
}

// ============================================================================
// MEDIA QUERY BUILDER
// ============================================================================

/**
 * Build a media query string from conditions
 */
export function buildMediaQuery(
  conditions: MediaQueryCondition[],
  operator: 'and' | 'or' = 'and'
): string {
  if (conditions.length === 0) return '';

  const parts = conditions.map((condition) => {
    const { type, value, unit = '' } = condition;

    switch (type) {
      case 'min-width':
      case 'max-width':
      case 'width':
      case 'min-height':
      case 'max-height':
        return `(${type}: ${value}${unit || 'px'})`;

      case 'orientation':
        return `(orientation: ${value})`;

      case 'aspect-ratio':
        return `(aspect-ratio: ${value})`;

      case 'resolution':
        return `(min-resolution: ${value}dppx)`;

      case 'prefers-color-scheme':
        return `(prefers-color-scheme: ${value})`;

      case 'prefers-reduced-motion':
        return `(prefers-reduced-motion: ${value})`;

      case 'prefers-contrast':
        return `(prefers-contrast: ${value})`;

      case 'hover':
        return `(hover: ${value})`;

      case 'pointer':
        return `(pointer: ${value})`;

      case 'any-hover':
        return `(any-hover: ${value})`;

      case 'any-pointer':
        return `(any-pointer: ${value})`;

      case 'display-mode':
        return `(display-mode: ${value})`;

      default:
        return `(${type}: ${value})`;
    }
  });

  const joinStr = operator === 'and' ? ' and ' : ', ';
  return `@media ${parts.join(joinStr)}`;
}

/**
 * Create a min-width media query (mobile-first)
 */
export function minWidth(width: number, unit: string = 'px'): string {
  return `@media (min-width: ${width}${unit})`;
}

/**
 * Create a max-width media query (desktop-first)
 */
export function maxWidth(width: number, unit: string = 'px'): string {
  return `@media (max-width: ${width}${unit})`;
}

/**
 * Create a range media query
 */
export function widthRange(minW: number, maxW: number, unit: string = 'px'): string {
  return `@media (min-width: ${minW}${unit}) and (max-width: ${maxW}${unit})`;
}

/**
 * Create orientation media query
 */
export function orientation(orient: 'portrait' | 'landscape'): string {
  return `@media (orientation: ${orient})`;
}

/**
 * Create dark mode media query
 */
export function darkMode(): string {
  return '@media (prefers-color-scheme: dark)';
}

/**
 * Create light mode media query
 */
export function lightMode(): string {
  return '@media (prefers-color-scheme: light)';
}

/**
 * Create reduced motion media query
 */
export function reducedMotion(): string {
  return '@media (prefers-reduced-motion: reduce)';
}

/**
 * Create high contrast media query
 */
export function highContrast(): string {
  return '@media (prefers-contrast: more)';
}

/**
 * Create retina/high-DPI media query
 */
export function retina(minDensity: number = 2): string {
  return `@media (-webkit-min-device-pixel-ratio: ${minDensity}), (min-resolution: ${minDensity * 96}dpi)`;
}

/**
 * Create touch device media query
 */
export function touchDevice(): string {
  return '@media (hover: none) and (pointer: coarse)';
}

/**
 * Create mouse device media query
 */
export function mouseDevice(): string {
  return '@media (hover: hover) and (pointer: fine)';
}

// ============================================================================
// CONTAINER QUERIES
// ============================================================================

/**
 * Build container query CSS
 */
export function buildContainerQuery(config: ContainerQueryConfig): string {
  const conditions: string[] = [];

  if (config.minWidth !== undefined) {
    conditions.push(`(min-width: ${config.minWidth}px)`);
  }
  if (config.maxWidth !== undefined) {
    conditions.push(`(max-width: ${config.maxWidth}px)`);
  }
  if (config.minHeight !== undefined) {
    conditions.push(`(min-height: ${config.minHeight}px)`);
  }
  if (config.maxHeight !== undefined) {
    conditions.push(`(max-height: ${config.maxHeight}px)`);
  }

  if (conditions.length === 0) return '';

  const joinStr = config.condition === 'and' ? ' and ' : ' or ';
  return `@container ${config.name} ${conditions.join(joinStr)}`;
}

/**
 * Generate container CSS for responsive components
 */
export function generateContainerCSS(name: string): string {
  return `container-type: inline-size; container-name: ${name};`;
}

/**
 * Tailwind container query utilities
 */
export const CONTAINER_BREAKPOINTS = [
  { name: '@xs', minWidth: 320 },
  { name: '@sm', minWidth: 384 },
  { name: '@md', minWidth: 448 },
  { name: '@lg', minWidth: 512 },
  { name: '@xl', minWidth: 576 },
  { name: '@2xl', minWidth: 672 },
  { name: '@3xl', minWidth: 768 },
  { name: '@4xl', minWidth: 896 },
  { name: '@5xl', minWidth: 1024 },
  { name: '@6xl', minWidth: 1152 },
  { name: '@7xl', minWidth: 1280 },
];

// ============================================================================
// BREAKPOINT UTILITIES
// ============================================================================

/**
 * Get breakpoint config by name
 */
export function getBreakpoint(
  name: string,
  breakpoints: BreakpointConfig[] = TAILWIND_BREAKPOINTS
): BreakpointConfig | undefined {
  return breakpoints.find((bp) => bp.name === name);
}

/**
 * Get breakpoint for a given width
 */
export function getBreakpointForWidth(
  width: number,
  breakpoints: BreakpointConfig[] = TAILWIND_BREAKPOINTS
): BreakpointConfig | undefined {
  const sorted = [...breakpoints].sort((a, b) => b.minWidth - a.minWidth);
  return sorted.find((bp) => width >= bp.minWidth);
}

/**
 * Check if width is within breakpoint range
 */
export function isInBreakpoint(
  width: number,
  breakpoint: BreakpointConfig
): boolean {
  const inMin = width >= breakpoint.minWidth;
  const inMax = breakpoint.maxWidth === undefined || width <= breakpoint.maxWidth;
  return inMin && inMax;
}

/**
 * Generate Tailwind responsive class prefix
 */
export function responsivePrefix(
  breakpoint: string,
  className: string
): string {
  if (breakpoint === 'default' || breakpoint === 'xs' || breakpoint === '') {
    return className;
  }
  return `${breakpoint}:${className}`;
}

/**
 * Generate all responsive variants of a class
 */
export function responsiveVariants(
  className: string,
  breakpoints: string[] = ['sm', 'md', 'lg', 'xl', '2xl']
): Record<string, string> {
  const result: Record<string, string> = { default: className };

  for (const bp of breakpoints) {
    result[bp] = `${bp}:${className}`;
  }

  return result;
}

/**
 * Create custom breakpoint
 */
export function createCustomBreakpoint(config: {
  id: string;
  name: string;
  minWidth: number;
  maxWidth?: number;
  orientation?: 'portrait' | 'landscape' | 'any';
  pixelDensity?: number;
}): CustomBreakpoint {
  return {
    id: config.id,
    name: config.name,
    minWidth: config.minWidth,
    maxWidth: config.maxWidth,
    orientation: config.orientation || 'any',
    pixelDensity: config.pixelDensity,
  };
}

/**
 * Generate Tailwind config for custom breakpoints
 */
export function generateTailwindBreakpointConfig(
  breakpoints: BreakpointConfig[]
): Record<string, string> {
  const config: Record<string, string> = {};

  for (const bp of breakpoints) {
    config[bp.name] = `${bp.minWidth}px`;
  }

  return config;
}

// ============================================================================
// RESPONSIVE VALUE RESOLVER
// ============================================================================

/**
 * Responsive value map type
 */
export type ResponsiveValue<T> = T | Partial<Record<string, T>>;

/**
 * Resolve responsive value for a given breakpoint
 */
export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T>,
  breakpoint: string,
  breakpointOrder: string[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
): T | undefined {
  // If not an object, return as-is
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }

  const valueObj = value as Partial<Record<string, T>>;

  // Direct match
  if (breakpoint in valueObj) {
    return valueObj[breakpoint];
  }

  // Find fallback from smaller breakpoints
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  for (let i = currentIndex - 1; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (bp in valueObj) {
      return valueObj[bp];
    }
  }

  // Check for 'default' or 'base' key
  if ('default' in valueObj) return valueObj.default;
  if ('base' in valueObj) return valueObj.base;

  return undefined;
}

/**
 * Generate CSS variables for responsive values
 */
export function generateResponsiveCSSVariables(
  name: string,
  values: Partial<Record<string, string>>,
  breakpoints: BreakpointConfig[] = TAILWIND_BREAKPOINTS
): string {
  const cssRules: string[] = [];

  // Base value
  if (values.default || values.xs) {
    cssRules.push(`:root { --${name}: ${values.default || values.xs}; }`);
  }

  // Breakpoint-specific values
  for (const bp of breakpoints) {
    if (bp.name in values && bp.name !== 'xs' && bp.name !== 'default') {
      cssRules.push(`@media (min-width: ${bp.minWidth}px) { :root { --${name}: ${values[bp.name]}; } }`);
    }
  }

  return cssRules.join('\n');
}

// ============================================================================
// RESPONSIVE VISIBILITY UTILITIES
// ============================================================================

/**
 * Generate visibility classes for responsive hiding/showing
 */
export function generateVisibilityClasses(
  showOnBreakpoints: string[],
  hideOnBreakpoints: string[]
): string[] {
  const classes: string[] = [];

  // Hide classes
  for (const bp of hideOnBreakpoints) {
    if (bp === 'default' || bp === 'xs') {
      classes.push('hidden');
    } else {
      classes.push(`${bp}:hidden`);
    }
  }

  // Show classes (using block as default display)
  for (const bp of showOnBreakpoints) {
    if (bp === 'default' || bp === 'xs') {
      classes.push('block');
    } else {
      classes.push(`${bp}:block`);
    }
  }

  return classes;
}

/**
 * Common visibility patterns
 */
export const VISIBILITY_PATTERNS = {
  hideOnMobile: ['hidden', 'md:block'],
  showOnlyOnMobile: ['block', 'md:hidden'],
  hideOnTablet: ['block', 'md:hidden', 'lg:block'],
  showOnlyOnDesktop: ['hidden', 'lg:block'],
  hideOnDesktop: ['block', 'lg:hidden'],
} as const;

// ============================================================================
// AUTO-SUGGEST RESPONSIVE FIXES
// ============================================================================

/**
 * Responsive issue types
 */
export type ResponsiveIssue =
  | 'text-too-small'
  | 'touch-target-too-small'
  | 'horizontal-overflow'
  | 'content-overlap'
  | 'image-too-large'
  | 'spacing-too-tight'
  | 'fixed-width'
  | 'nested-scroll';

/**
 * Responsive fix suggestion
 */
export interface ResponsiveFix {
  issue: ResponsiveIssue;
  severity: 'error' | 'warning' | 'info';
  description: string;
  suggestedClasses: string[];
  currentClasses?: string[];
  breakpoints?: string[];
}

/**
 * Analyze element for responsive issues
 */
export function analyzeResponsiveIssues(
  element: {
    width?: number;
    height?: number;
    fontSize?: number;
    classes?: string[];
  },
  viewport: { width: number; height: number }
): ResponsiveFix[] {
  const fixes: ResponsiveFix[] = [];

  // Check touch target size (minimum 44x44 on mobile)
  if (viewport.width < 768) {
    if (element.width !== undefined && element.width < 44) {
      fixes.push({
        issue: 'touch-target-too-small',
        severity: 'error',
        description: 'Touch target is too small. Minimum size should be 44x44 pixels on mobile.',
        suggestedClasses: ['min-w-11', 'min-h-11', 'p-3'],
        breakpoints: ['default'],
      });
    }
    if (element.height !== undefined && element.height < 44) {
      fixes.push({
        issue: 'touch-target-too-small',
        severity: 'error',
        description: 'Touch target height is too small.',
        suggestedClasses: ['min-h-11', 'py-3'],
        breakpoints: ['default'],
      });
    }
  }

  // Check font size (minimum 16px on mobile to prevent zoom)
  if (viewport.width < 768 && element.fontSize !== undefined && element.fontSize < 16) {
    fixes.push({
      issue: 'text-too-small',
      severity: 'warning',
      description: 'Text smaller than 16px may cause browser zoom on mobile inputs.',
      suggestedClasses: ['text-base', 'md:text-sm'],
      breakpoints: ['default', 'md'],
    });
  }

  // Check for fixed width classes
  const fixedWidthPattern = /^w-\[[\d]+px\]$|^w-\d+$/;
  if (element.classes?.some(cls => fixedWidthPattern.test(cls))) {
    fixes.push({
      issue: 'fixed-width',
      severity: 'info',
      description: 'Fixed width may cause horizontal overflow on smaller screens.',
      suggestedClasses: ['w-full', 'max-w-sm', 'md:w-auto'],
      currentClasses: element.classes.filter(cls => fixedWidthPattern.test(cls)),
      breakpoints: ['default', 'md'],
    });
  }

  return fixes;
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export const ResponsiveSystem = {
  // Breakpoints
  TAILWIND_BREAKPOINTS,
  EXTENDED_BREAKPOINTS,
  getBreakpoint,
  getBreakpointForWidth,
  isInBreakpoint,
  createCustomBreakpoint,
  generateTailwindBreakpointConfig,

  // Fluid Typography
  calculateFluidTypography,
  generateFluidTypeScale,
  DEFAULT_TYPE_SCALE,

  // Fluid Spacing
  calculateFluidSpacing,
  generateFluidSpacingScale,
  DEFAULT_SPACING_SCALE,

  // Aspect Ratios
  ASPECT_RATIOS,
  calculateAspectRatioPadding,
  getAspectRatioCSS,
  parseAspectRatio,
  createAspectRatio,

  // Images
  generateSrcSet,
  generateDefaultSizes,
  generatePictureSources,
  DEFAULT_IMAGE_WIDTHS,

  // Media Queries
  buildMediaQuery,
  minWidth,
  maxWidth,
  widthRange,
  orientation,
  darkMode,
  lightMode,
  reducedMotion,
  highContrast,
  retina,
  touchDevice,
  mouseDevice,

  // Container Queries
  buildContainerQuery,
  generateContainerCSS,
  CONTAINER_BREAKPOINTS,

  // Utilities
  responsivePrefix,
  responsiveVariants,
  resolveResponsiveValue,
  generateResponsiveCSSVariables,
  generateVisibilityClasses,
  VISIBILITY_PATTERNS,
  analyzeResponsiveIssues,
};

export default ResponsiveSystem;
