/**
 * CSS Variables Generator
 *
 * This module generates CSS custom properties (variables) from theme configurations.
 * It supports:
 * - Color shade generation (50-950)
 * - Typography scale generation
 * - Spacing scale generation
 * - Complete CSS string export
 */

import type {
  Theme,
  ColorPalette,
  ColorScale,
  TypographyPreset,
  SpacingPreset,
  BorderRadiusPreset,
  ShadowPreset,
  AnimationPreset,
  SemanticColors,
} from './themeSystem';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/** CSS variable output format */
export type CSSOutputFormat = 'css' | 'scss' | 'less' | 'js';

/** CSS variable configuration */
export interface CSSVariableConfig {
  prefix: string;
  includeComments: boolean;
  minify: boolean;
  format: CSSOutputFormat;
}

/** Generated CSS output */
export interface GeneratedCSS {
  variables: string;
  utilities: string;
  keyframes: string;
  full: string;
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

const DEFAULT_CONFIG: CSSVariableConfig = {
  prefix: '--tw',
  includeComments: true,
  minify: false,
  format: 'css',
};

// =============================================================================
// COLOR UTILITIES
// =============================================================================

/**
 * Converts a hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converts a hex color to HSL values
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

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

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Generates color shades from 50 to 950 based on a base color
 */
export function generateColorShades(baseHex: string): ColorScale {
  const hex = baseHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

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

  const hslToHex = (h: number, s: number, l: number): string => {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let rVal: number, gVal: number, bVal: number;
    if (s === 0) {
      rVal = gVal = bVal = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      rVal = hue2rgb(p, q, h + 1 / 3);
      gVal = hue2rgb(p, q, h);
      bVal = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number): string => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(rVal)}${toHex(gVal)}${toHex(bVal)}`;
  };

  return {
    50: hslToHex(h, s * 0.9, 0.97),
    100: hslToHex(h, s * 0.95, 0.94),
    200: hslToHex(h, s * 0.9, 0.86),
    300: hslToHex(h, s * 0.85, 0.74),
    400: hslToHex(h, s * 0.8, 0.60),
    500: hslToHex(h, s, 0.50),
    600: hslToHex(h, s * 1.05, 0.42),
    700: hslToHex(h, s * 1.1, 0.34),
    800: hslToHex(h, s * 1.1, 0.26),
    900: hslToHex(h, s * 1.15, 0.18),
    950: hslToHex(h, s * 1.2, 0.10),
  };
}

// =============================================================================
// CSS VARIABLE GENERATORS
// =============================================================================

/**
 * Generates CSS variables for a color scale
 */
function generateColorScaleVariables(
  name: string,
  scale: ColorScale,
  prefix: string,
  includeRgb: boolean = true
): string[] {
  const variables: string[] = [];
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

  for (const shade of shades) {
    const hex = scale[shade];
    variables.push(`${prefix}-color-${name}-${shade}: ${hex};`);

    if (includeRgb) {
      const rgb = hexToRgb(hex);
      if (rgb) {
        variables.push(`${prefix}-color-${name}-${shade}-rgb: ${rgb.r} ${rgb.g} ${rgb.b};`);
      }
    }
  }

  return variables;
}

/**
 * Generates all color palette CSS variables
 */
function generateColorPaletteVariables(
  palette: ColorPalette,
  prefix: string,
  includeComments: boolean
): string {
  const lines: string[] = [];

  if (includeComments) {
    lines.push('/* ==========================================================================');
    lines.push(`   Color Palette: ${palette.name}`);
    lines.push('   ========================================================================== */');
    lines.push('');
  }

  // Semantic colors
  const semanticKeys = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'] as const;

  for (const key of semanticKeys) {
    if (includeComments) {
      lines.push(`/* ${key.charAt(0).toUpperCase() + key.slice(1)} Colors */`);
    }
    const colorVars = generateColorScaleVariables(key, palette.colors[key], prefix);
    lines.push(...colorVars);
    lines.push('');
  }

  // Background colors
  if (includeComments) {
    lines.push('/* Background Colors */');
  }
  lines.push(`${prefix}-bg-primary: ${palette.background.primary};`);
  lines.push(`${prefix}-bg-secondary: ${palette.background.secondary};`);
  lines.push(`${prefix}-bg-tertiary: ${palette.background.tertiary};`);
  lines.push('');

  // Foreground colors
  if (includeComments) {
    lines.push('/* Foreground Colors */');
  }
  lines.push(`${prefix}-fg-primary: ${palette.foreground.primary};`);
  lines.push(`${prefix}-fg-secondary: ${palette.foreground.secondary};`);
  lines.push(`${prefix}-fg-muted: ${palette.foreground.muted};`);
  lines.push('');

  // Border colors
  if (includeComments) {
    lines.push('/* Border Colors */');
  }
  lines.push(`${prefix}-border-default: ${palette.border.default};`);
  lines.push(`${prefix}-border-subtle: ${palette.border.subtle};`);
  lines.push(`${prefix}-border-strong: ${palette.border.strong};`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Generates typography CSS variables
 */
function generateTypographyVariables(
  typography: TypographyPreset,
  prefix: string,
  includeComments: boolean
): string {
  const lines: string[] = [];

  if (includeComments) {
    lines.push('/* ==========================================================================');
    lines.push(`   Typography: ${typography.name}`);
    lines.push('   ========================================================================== */');
    lines.push('');
  }

  // Font families
  if (includeComments) {
    lines.push('/* Font Families */');
  }
  lines.push(`${prefix}-font-heading: ${typography.fontFamily.heading};`);
  lines.push(`${prefix}-font-body: ${typography.fontFamily.body};`);
  lines.push(`${prefix}-font-mono: ${typography.fontFamily.mono};`);
  lines.push('');

  // Font sizes
  if (includeComments) {
    lines.push('/* Font Sizes */');
  }
  const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'] as const;
  for (const size of fontSizes) {
    lines.push(`${prefix}-text-${size}: ${typography.fontSize[size]};`);
  }
  lines.push('');

  // Line heights
  if (includeComments) {
    lines.push('/* Line Heights */');
  }
  const lineHeights = ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'] as const;
  for (const lh of lineHeights) {
    lines.push(`${prefix}-leading-${lh}: ${typography.lineHeight[lh]};`);
  }
  lines.push('');

  // Letter spacing
  if (includeComments) {
    lines.push('/* Letter Spacing */');
  }
  const letterSpacings = ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'] as const;
  for (const ls of letterSpacings) {
    lines.push(`${prefix}-tracking-${ls}: ${typography.letterSpacing[ls]};`);
  }
  lines.push('');

  // Font weights
  if (includeComments) {
    lines.push('/* Font Weights */');
  }
  const fontWeights = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'] as const;
  for (const fw of fontWeights) {
    lines.push(`${prefix}-font-${fw}: ${typography.fontWeight[fw]};`);
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Generates spacing CSS variables
 */
function generateSpacingVariables(
  spacing: SpacingPreset,
  prefix: string,
  includeComments: boolean
): string {
  const lines: string[] = [];

  if (includeComments) {
    lines.push('/* ==========================================================================');
    lines.push(`   Spacing: ${spacing.name} (Base Unit: ${spacing.baseUnit}rem)`);
    lines.push('   ========================================================================== */');
    lines.push('');
  }

  const spacingKeys = [
    '0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48',
    '52', '56', '60', '64', '72', '80', '96'
  ] as const;

  for (const key of spacingKeys) {
    const cssKey = key.replace('.', '_');
    lines.push(`${prefix}-spacing-${cssKey}: ${spacing.scale[key as keyof typeof spacing.scale]};`);
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Generates border radius CSS variables
 */
function generateBorderRadiusVariables(
  borderRadius: BorderRadiusPreset,
  prefix: string,
  includeComments: boolean
): string {
  const lines: string[] = [];

  if (includeComments) {
    lines.push('/* ==========================================================================');
    lines.push(`   Border Radius: ${borderRadius.name}`);
    lines.push('   ========================================================================== */');
    lines.push('');
  }

  const radiusKeys = ['none', 'sm', 'default', 'md', 'lg', 'xl', '2xl', '3xl', 'full'] as const;
  for (const key of radiusKeys) {
    const cssKey = key === 'default' ? 'DEFAULT' : key;
    lines.push(`${prefix}-rounded-${cssKey}: ${borderRadius.scale[key]};`);
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Generates shadow CSS variables
 */
function generateShadowVariables(
  shadows: ShadowPreset,
  prefix: string,
  includeComments: boolean
): string {
  const lines: string[] = [];

  if (includeComments) {
    lines.push('/* ==========================================================================');
    lines.push(`   Shadows: ${shadows.name}`);
    lines.push('   ========================================================================== */');
    lines.push('');
  }

  const shadowKeys = ['sm', 'default', 'md', 'lg', 'xl', '2xl', 'inner', 'none'] as const;
  for (const key of shadowKeys) {
    const cssKey = key === 'default' ? 'DEFAULT' : key;
    lines.push(`${prefix}-shadow-${cssKey}: ${shadows.scale[key]};`);
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Generates animation CSS variables and keyframes
 */
function generateAnimationVariables(
  animations: AnimationPreset,
  prefix: string,
  includeComments: boolean
): { variables: string; keyframes: string } {
  const variableLines: string[] = [];
  const keyframeLines: string[] = [];

  if (includeComments) {
    variableLines.push('/* ==========================================================================');
    variableLines.push(`   Animations: ${animations.name}`);
    variableLines.push('   ========================================================================== */');
    variableLines.push('');
  }

  // Duration variables
  if (includeComments) {
    variableLines.push('/* Animation Durations */');
  }
  const durationKeys = ['fastest', 'fast', 'normal', 'slow', 'slowest'] as const;
  for (const key of durationKeys) {
    variableLines.push(`${prefix}-duration-${key}: ${animations.duration[key]};`);
  }
  variableLines.push('');

  // Timing functions
  if (includeComments) {
    variableLines.push('/* Animation Timing Functions */');
  }
  const timingKeys = ['linear', 'easeIn', 'easeOut', 'easeInOut', 'bounce', 'elastic'] as const;
  for (const key of timingKeys) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    variableLines.push(`${prefix}-ease-${cssKey}: ${animations.timing[key]};`);
  }
  variableLines.push('');

  // Keyframes
  if (includeComments && Object.keys(animations.keyframes).length > 0) {
    keyframeLines.push('/* ==========================================================================');
    keyframeLines.push('   Keyframe Animations');
    keyframeLines.push('   ========================================================================== */');
    keyframeLines.push('');
  }

  for (const [name, frames] of Object.entries(animations.keyframes)) {
    keyframeLines.push(`@keyframes ${name} {`);
    for (const [step, styles] of Object.entries(frames)) {
      keyframeLines.push(`  ${step} { ${styles} }`);
    }
    keyframeLines.push('}');
    keyframeLines.push('');
  }

  return {
    variables: variableLines.join('\n'),
    keyframes: keyframeLines.join('\n'),
  };
}

// =============================================================================
// UTILITY CLASS GENERATORS
// =============================================================================

/**
 * Generates utility classes for colors
 */
function generateColorUtilities(palette: ColorPalette, prefix: string): string {
  const lines: string[] = [];
  const semanticKeys = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'] as const;
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

  lines.push('/* Color Utility Classes */');
  lines.push('');

  for (const key of semanticKeys) {
    for (const shade of shades) {
      // Background colors
      lines.push(`.bg-${key}-${shade} { background-color: var(${prefix}-color-${key}-${shade}); }`);
      // Text colors
      lines.push(`.text-${key}-${shade} { color: var(${prefix}-color-${key}-${shade}); }`);
      // Border colors
      lines.push(`.border-${key}-${shade} { border-color: var(${prefix}-color-${key}-${shade}); }`);
    }
    lines.push('');
  }

  // Semantic background utilities
  lines.push('.bg-primary { background-color: var(' + prefix + '-bg-primary); }');
  lines.push('.bg-secondary { background-color: var(' + prefix + '-bg-secondary); }');
  lines.push('.bg-tertiary { background-color: var(' + prefix + '-bg-tertiary); }');
  lines.push('');

  // Semantic text utilities
  lines.push('.text-primary { color: var(' + prefix + '-fg-primary); }');
  lines.push('.text-secondary { color: var(' + prefix + '-fg-secondary); }');
  lines.push('.text-muted { color: var(' + prefix + '-fg-muted); }');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generates utility classes for typography
 */
function generateTypographyUtilities(typography: TypographyPreset, prefix: string): string {
  const lines: string[] = [];

  lines.push('/* Typography Utility Classes */');
  lines.push('');

  // Font family utilities
  lines.push('.font-heading { font-family: var(' + prefix + '-font-heading); }');
  lines.push('.font-body { font-family: var(' + prefix + '-font-body); }');
  lines.push('.font-mono { font-family: var(' + prefix + '-font-mono); }');
  lines.push('');

  // Font size utilities
  const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'] as const;
  for (const size of fontSizes) {
    lines.push(`.text-${size} { font-size: var(${prefix}-text-${size}); }`);
  }
  lines.push('');

  // Line height utilities
  const lineHeights = ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'] as const;
  for (const lh of lineHeights) {
    lines.push(`.leading-${lh} { line-height: var(${prefix}-leading-${lh}); }`);
  }
  lines.push('');

  // Letter spacing utilities
  const letterSpacings = ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'] as const;
  for (const ls of letterSpacings) {
    lines.push(`.tracking-${ls} { letter-spacing: var(${prefix}-tracking-${ls}); }`);
  }
  lines.push('');

  // Font weight utilities
  const fontWeights = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'] as const;
  for (const fw of fontWeights) {
    lines.push(`.font-${fw} { font-weight: var(${prefix}-font-${fw}); }`);
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Generates utility classes for spacing
 */
function generateSpacingUtilities(spacing: SpacingPreset, prefix: string): string {
  const lines: string[] = [];

  lines.push('/* Spacing Utility Classes */');
  lines.push('');

  const spacingKeys = [
    '0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9',
    '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48',
    '52', '56', '60', '64', '72', '80', '96'
  ];

  for (const key of spacingKeys) {
    const cssKey = key.replace('.', '_');
    const classKey = key.replace('.', '\\.');

    // Padding
    lines.push(`.p-${classKey} { padding: var(${prefix}-spacing-${cssKey}); }`);
    lines.push(`.px-${classKey} { padding-left: var(${prefix}-spacing-${cssKey}); padding-right: var(${prefix}-spacing-${cssKey}); }`);
    lines.push(`.py-${classKey} { padding-top: var(${prefix}-spacing-${cssKey}); padding-bottom: var(${prefix}-spacing-${cssKey}); }`);

    // Margin
    lines.push(`.m-${classKey} { margin: var(${prefix}-spacing-${cssKey}); }`);
    lines.push(`.mx-${classKey} { margin-left: var(${prefix}-spacing-${cssKey}); margin-right: var(${prefix}-spacing-${cssKey}); }`);
    lines.push(`.my-${classKey} { margin-top: var(${prefix}-spacing-${cssKey}); margin-bottom: var(${prefix}-spacing-${cssKey}); }`);

    // Gap
    lines.push(`.gap-${classKey} { gap: var(${prefix}-spacing-${cssKey}); }`);
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Generates utility classes for border radius
 */
function generateBorderRadiusUtilities(borderRadius: BorderRadiusPreset, prefix: string): string {
  const lines: string[] = [];

  lines.push('/* Border Radius Utility Classes */');
  lines.push('');

  const radiusKeys = ['none', 'sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', '3xl', 'full'] as const;
  for (const key of radiusKeys) {
    const scaleKey = key === 'DEFAULT' ? 'default' : key;
    const className = key === 'DEFAULT' ? 'rounded' : `rounded-${key}`;
    lines.push(`.${className} { border-radius: var(${prefix}-rounded-${key}); }`);
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Generates utility classes for shadows
 */
function generateShadowUtilities(shadows: ShadowPreset, prefix: string): string {
  const lines: string[] = [];

  lines.push('/* Shadow Utility Classes */');
  lines.push('');

  const shadowKeys = ['sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', 'inner', 'none'] as const;
  for (const key of shadowKeys) {
    const className = key === 'DEFAULT' ? 'shadow' : `shadow-${key}`;
    lines.push(`.${className} { box-shadow: var(${prefix}-shadow-${key}); }`);
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Generates utility classes for animations
 */
function generateAnimationUtilities(animations: AnimationPreset, prefix: string): string {
  const lines: string[] = [];

  lines.push('/* Animation Utility Classes */');
  lines.push('');

  // Duration utilities
  const durationKeys = ['fastest', 'fast', 'normal', 'slow', 'slowest'] as const;
  for (const key of durationKeys) {
    lines.push(`.duration-${key} { transition-duration: var(${prefix}-duration-${key}); animation-duration: var(${prefix}-duration-${key}); }`);
  }
  lines.push('');

  // Timing function utilities
  const timingKeys = ['linear', 'ease-in', 'ease-out', 'ease-in-out', 'bounce', 'elastic'] as const;
  for (const key of timingKeys) {
    const varKey = key.replace(/-/g, '');
    lines.push(`.ease-${key} { transition-timing-function: var(${prefix}-ease-${key}); animation-timing-function: var(${prefix}-ease-${key}); }`);
  }
  lines.push('');

  // Animation utilities for keyframes
  for (const name of Object.keys(animations.keyframes)) {
    lines.push(`.animate-${name} { animation-name: ${name}; animation-duration: var(${prefix}-duration-normal); animation-timing-function: var(${prefix}-ease-ease-out); animation-fill-mode: both; }`);
  }
  lines.push('');

  return lines.join('\n');
}

// =============================================================================
// MAIN EXPORT FUNCTIONS
// =============================================================================

/**
 * Generates all CSS variables from a theme
 */
export function generateCSSVariables(
  theme: Theme,
  config: Partial<CSSVariableConfig> = {}
): string {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const { prefix, includeComments } = fullConfig;

  const sections: string[] = [];

  // Color palette variables
  sections.push(generateColorPaletteVariables(theme.colorPalette, prefix, includeComments));

  // Typography variables
  sections.push(generateTypographyVariables(theme.typography, prefix, includeComments));

  // Spacing variables
  sections.push(generateSpacingVariables(theme.spacing, prefix, includeComments));

  // Border radius variables
  sections.push(generateBorderRadiusVariables(theme.borderRadius, prefix, includeComments));

  // Shadow variables
  sections.push(generateShadowVariables(theme.shadows, prefix, includeComments));

  // Animation variables
  const animationOutput = generateAnimationVariables(theme.animations, prefix, includeComments);
  sections.push(animationOutput.variables);

  let css = `:root {\n${sections.join('\n')}\n}`;

  if (fullConfig.minify) {
    css = css.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
  }

  return css;
}

/**
 * Generates all CSS utility classes from a theme
 */
export function generateCSSUtilities(
  theme: Theme,
  config: Partial<CSSVariableConfig> = {}
): string {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const { prefix } = fullConfig;

  const sections: string[] = [];

  sections.push(generateColorUtilities(theme.colorPalette, prefix));
  sections.push(generateTypographyUtilities(theme.typography, prefix));
  sections.push(generateSpacingUtilities(theme.spacing, prefix));
  sections.push(generateBorderRadiusUtilities(theme.borderRadius, prefix));
  sections.push(generateShadowUtilities(theme.shadows, prefix));
  sections.push(generateAnimationUtilities(theme.animations, prefix));

  let css = sections.join('\n');

  if (fullConfig.minify) {
    css = css.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
  }

  return css;
}

/**
 * Generates CSS keyframes from a theme
 */
export function generateCSSKeyframes(
  theme: Theme,
  config: Partial<CSSVariableConfig> = {}
): string {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const { prefix, includeComments } = fullConfig;

  const animationOutput = generateAnimationVariables(theme.animations, prefix, includeComments);

  let css = animationOutput.keyframes;

  if (fullConfig.minify) {
    css = css.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
  }

  return css;
}

/**
 * Generates complete CSS output including variables, utilities, and keyframes
 */
export function generateFullCSS(
  theme: Theme,
  config: Partial<CSSVariableConfig> = {}
): GeneratedCSS {
  const variables = generateCSSVariables(theme, config);
  const utilities = generateCSSUtilities(theme, config);
  const keyframes = generateCSSKeyframes(theme, config);

  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  let full = `/* ==========================================================================
   Theme: ${theme.name}
   Description: ${theme.description}
   Generated: ${new Date().toISOString()}
   ========================================================================== */

${variables}

${keyframes}

${utilities}`;

  if (fullConfig.minify) {
    full = full.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
  }

  return {
    variables,
    utilities,
    keyframes,
    full,
  };
}

/**
 * Exports theme as a Tailwind config extend object (JS/TS format)
 */
export function exportAsTailwindConfig(theme: Theme): string {
  const config = {
    colors: {} as Record<string, Record<string, string>>,
    fontFamily: {
      heading: theme.typography.fontFamily.heading.split(',').map(f => f.trim()),
      body: theme.typography.fontFamily.body.split(',').map(f => f.trim()),
      mono: theme.typography.fontFamily.mono.split(',').map(f => f.trim()),
    },
    fontSize: theme.typography.fontSize,
    lineHeight: theme.typography.lineHeight,
    letterSpacing: theme.typography.letterSpacing,
    fontWeight: theme.typography.fontWeight,
    spacing: theme.spacing.scale,
    borderRadius: theme.borderRadius.scale,
    boxShadow: theme.shadows.scale,
  };

  // Add semantic colors
  const semanticKeys = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'] as const;
  for (const key of semanticKeys) {
    config.colors[key] = theme.colorPalette.colors[key];
  }

  return `// Tailwind CSS Theme Configuration
// Theme: ${theme.name}
// Generated: ${new Date().toISOString()}

module.exports = {
  theme: {
    extend: ${JSON.stringify(config, null, 2).replace(/"([^"]+)":/g, '$1:')}
  }
};`;
}

/**
 * Exports theme as SCSS variables
 */
export function exportAsSCSS(theme: Theme): string {
  const lines: string[] = [];

  lines.push(`// SCSS Variables for Theme: ${theme.name}`);
  lines.push(`// Generated: ${new Date().toISOString()}`);
  lines.push('');

  // Colors
  const semanticKeys = ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'] as const;
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

  lines.push('// Semantic Colors');
  for (const key of semanticKeys) {
    for (const shade of shades) {
      lines.push(`$color-${key}-${shade}: ${theme.colorPalette.colors[key][shade]};`);
    }
    lines.push('');
  }

  // Background colors
  lines.push('// Background Colors');
  lines.push(`$bg-primary: ${theme.colorPalette.background.primary};`);
  lines.push(`$bg-secondary: ${theme.colorPalette.background.secondary};`);
  lines.push(`$bg-tertiary: ${theme.colorPalette.background.tertiary};`);
  lines.push('');

  // Foreground colors
  lines.push('// Foreground Colors');
  lines.push(`$fg-primary: ${theme.colorPalette.foreground.primary};`);
  lines.push(`$fg-secondary: ${theme.colorPalette.foreground.secondary};`);
  lines.push(`$fg-muted: ${theme.colorPalette.foreground.muted};`);
  lines.push('');

  // Typography
  lines.push('// Typography');
  lines.push(`$font-heading: ${theme.typography.fontFamily.heading};`);
  lines.push(`$font-body: ${theme.typography.fontFamily.body};`);
  lines.push(`$font-mono: ${theme.typography.fontFamily.mono};`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Exports theme as CSS custom properties string (ready to paste)
 */
export function exportAsCSS(theme: Theme): string {
  return generateFullCSS(theme, { includeComments: true, minify: false }).full;
}

/**
 * Exports theme as minified CSS
 */
export function exportAsMinifiedCSS(theme: Theme): string {
  return generateFullCSS(theme, { includeComments: false, minify: true }).full;
}

// Re-export color utilities
export { hexToRgb, hexToHsl };
