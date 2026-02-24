// Custom Utility Class Generator
// Generate custom Tailwind utilities with responsive and state variants

// =============================================================================
// TYPES
// =============================================================================

export type ResponsiveBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type StateVariant = 'hover' | 'focus' | 'active' | 'disabled' | 'visited' |
  'focus-within' | 'focus-visible' | 'group-hover' | 'group-focus' | 'peer-hover' | 'peer-focus';
export type DarkModeStrategy = 'class' | 'media';

export interface UtilityClass {
  name: string;
  property: string;
  value: string;
  important?: boolean;
}

export interface CustomUtility {
  id: string;
  name: string;
  prefix: string;
  property: string;
  values: Record<string, string>;
  variants: StateVariant[];
  responsive: boolean;
  darkMode: boolean;
  description?: string;
}

export interface UtilityPreset {
  id: string;
  name: string;
  description: string;
  utilities: CustomUtility[];
}

export interface GeneratedCSS {
  css: string;
  classCount: number;
}

// =============================================================================
// BREAKPOINT CONFIGURATION
// =============================================================================

export const BREAKPOINTS: Record<ResponsiveBreakpoint, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const BREAKPOINT_ORDER: ResponsiveBreakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];

// =============================================================================
// STATE VARIANTS
// =============================================================================

export const STATE_VARIANTS: Record<StateVariant, { selector: string; description: string }> = {
  hover: { selector: ':hover', description: 'On mouse hover' },
  focus: { selector: ':focus', description: 'When focused' },
  active: { selector: ':active', description: 'When active (clicked)' },
  disabled: { selector: ':disabled', description: 'When disabled' },
  visited: { selector: ':visited', description: 'Visited links' },
  'focus-within': { selector: ':focus-within', description: 'When child is focused' },
  'focus-visible': { selector: ':focus-visible', description: 'Keyboard focus only' },
  'group-hover': { selector: '.group:hover &', description: 'When group parent is hovered' },
  'group-focus': { selector: '.group:focus &', description: 'When group parent is focused' },
  'peer-hover': { selector: '.peer:hover ~ &', description: 'When peer is hovered' },
  'peer-focus': { selector: '.peer:focus ~ &', description: 'When peer is focused' },
};

// =============================================================================
// UTILITY GENERATION
// =============================================================================

/**
 * Generate CSS for a single utility class
 */
export function generateUtilityCSS(
  className: string,
  property: string,
  value: string,
  important: boolean = false
): string {
  const imp = important ? ' !important' : '';
  return `.${escapeClassName(className)} {\n  ${property}: ${value}${imp};\n}`;
}

/**
 * Escape special characters in class names for CSS
 */
export function escapeClassName(className: string): string {
  return className
    .replace(/\./g, '\\.')
    .replace(/\//g, '\\/')
    .replace(/:/g, '\\:')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/%/g, '\\%')
    .replace(/,/g, '\\,')
    .replace(/#/g, '\\#');
}

/**
 * Generate responsive variant CSS
 */
export function generateResponsiveVariant(
  className: string,
  property: string,
  value: string,
  breakpoint: ResponsiveBreakpoint,
  important: boolean = false
): string {
  const minWidth = BREAKPOINTS[breakpoint];
  const prefixedClassName = `${breakpoint}\\:${escapeClassName(className)}`;
  const imp = important ? ' !important' : '';

  return `@media (min-width: ${minWidth}) {\n  .${prefixedClassName} {\n    ${property}: ${value}${imp};\n  }\n}`;
}

/**
 * Generate state variant CSS
 */
export function generateStateVariant(
  className: string,
  property: string,
  value: string,
  variant: StateVariant,
  important: boolean = false
): string {
  const variantConfig = STATE_VARIANTS[variant];
  const prefixedClassName = `${variant}\\:${escapeClassName(className)}`;
  const imp = important ? ' !important' : '';

  if (variant.startsWith('group-') || variant.startsWith('peer-')) {
    // Handle group/peer variants differently
    const selector = variantConfig.selector.replace('&', `.${prefixedClassName}`);
    return `${selector} {\n  ${property}: ${value}${imp};\n}`;
  }

  return `.${prefixedClassName}${variantConfig.selector} {\n  ${property}: ${value}${imp};\n}`;
}

/**
 * Generate dark mode variant CSS
 */
export function generateDarkModeVariant(
  className: string,
  property: string,
  value: string,
  strategy: DarkModeStrategy = 'class',
  important: boolean = false
): string {
  const prefixedClassName = `dark\\:${escapeClassName(className)}`;
  const imp = important ? ' !important' : '';

  if (strategy === 'class') {
    return `.dark .${prefixedClassName} {\n  ${property}: ${value}${imp};\n}`;
  }

  return `@media (prefers-color-scheme: dark) {\n  .${prefixedClassName} {\n    ${property}: ${value}${imp};\n  }\n}`;
}

/**
 * Generate all CSS for a custom utility
 */
export function generateCustomUtilityCSS(
  utility: CustomUtility,
  darkModeStrategy: DarkModeStrategy = 'class'
): GeneratedCSS {
  const cssBlocks: string[] = [];
  let classCount = 0;

  // Generate base classes
  for (const [suffix, value] of Object.entries(utility.values)) {
    const className = suffix ? `${utility.prefix}-${suffix}` : utility.prefix;

    // Base class
    cssBlocks.push(generateUtilityCSS(className, utility.property, value));
    classCount++;

    // State variants
    for (const variant of utility.variants) {
      cssBlocks.push(generateStateVariant(className, utility.property, value, variant));
      classCount++;
    }

    // Responsive variants
    if (utility.responsive) {
      for (const breakpoint of BREAKPOINT_ORDER) {
        cssBlocks.push(generateResponsiveVariant(className, utility.property, value, breakpoint));
        classCount++;

        // Responsive + state variants
        for (const variant of utility.variants) {
          const responsiveStateName = `${breakpoint}:${variant}:${className}`;
          cssBlocks.push(
            `@media (min-width: ${BREAKPOINTS[breakpoint]}) {\n` +
            generateStateVariant(className, utility.property, value, variant)
              .split('\n')
              .map(line => '  ' + line)
              .join('\n') +
            '\n}'
          );
          classCount++;
        }
      }
    }

    // Dark mode variants
    if (utility.darkMode) {
      cssBlocks.push(generateDarkModeVariant(className, utility.property, value, darkModeStrategy));
      classCount++;

      // Dark mode + state variants
      for (const variant of utility.variants) {
        const darkStateCSS = generateStateVariant(className, utility.property, value, variant);
        if (darkModeStrategy === 'class') {
          cssBlocks.push(`.dark ${darkStateCSS.replace(`.${variant}\\:${escapeClassName(className)}`, `.dark\\:${variant}\\:${escapeClassName(className)}`)}`);
        } else {
          cssBlocks.push(
            `@media (prefers-color-scheme: dark) {\n` +
            darkStateCSS
              .replace(`.${variant}\\:${escapeClassName(className)}`, `.dark\\:${variant}\\:${escapeClassName(className)}`)
              .split('\n')
              .map(line => '  ' + line)
              .join('\n') +
            '\n}'
          );
        }
        classCount++;
      }
    }
  }

  return {
    css: cssBlocks.join('\n\n'),
    classCount,
  };
}

// =============================================================================
// UTILITY PRESETS
// =============================================================================

export const UTILITY_PRESETS: UtilityPreset[] = [
  {
    id: 'spacing-extras',
    name: 'Extra Spacing',
    description: 'Additional spacing utilities beyond Tailwind defaults',
    utilities: [
      {
        id: 'padding-extras',
        name: 'Extra Padding',
        prefix: 'p',
        property: 'padding',
        values: {
          '18': '4.5rem',
          '22': '5.5rem',
          '26': '6.5rem',
          '30': '7.5rem',
          '34': '8.5rem',
          '38': '9.5rem',
        },
        variants: ['hover', 'focus'],
        responsive: true,
        darkMode: false,
      },
      {
        id: 'margin-extras',
        name: 'Extra Margin',
        prefix: 'm',
        property: 'margin',
        values: {
          '18': '4.5rem',
          '22': '5.5rem',
          '26': '6.5rem',
          '30': '7.5rem',
          '34': '8.5rem',
          '38': '9.5rem',
        },
        variants: [],
        responsive: true,
        darkMode: false,
      },
    ],
  },
  {
    id: 'typography-extras',
    name: 'Typography Extras',
    description: 'Additional typography utilities',
    utilities: [
      {
        id: 'text-shadow',
        name: 'Text Shadow',
        prefix: 'text-shadow',
        property: 'text-shadow',
        values: {
          'sm': '0 1px 2px rgba(0, 0, 0, 0.1)',
          '': '0 2px 4px rgba(0, 0, 0, 0.1)',
          'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
          'lg': '0 8px 16px rgba(0, 0, 0, 0.15)',
          'xl': '0 12px 24px rgba(0, 0, 0, 0.2)',
          'none': 'none',
        },
        variants: ['hover'],
        responsive: true,
        darkMode: true,
      },
      {
        id: 'text-stroke',
        name: 'Text Stroke',
        prefix: 'text-stroke',
        property: '-webkit-text-stroke',
        values: {
          '0': '0',
          '1': '1px currentColor',
          '2': '2px currentColor',
        },
        variants: ['hover'],
        responsive: false,
        darkMode: false,
      },
    ],
  },
  {
    id: 'aspect-ratios',
    name: 'Aspect Ratios',
    description: 'Common aspect ratio utilities',
    utilities: [
      {
        id: 'aspect',
        name: 'Aspect Ratio',
        prefix: 'aspect',
        property: 'aspect-ratio',
        values: {
          '1/1': '1 / 1',
          '4/3': '4 / 3',
          '3/2': '3 / 2',
          '16/9': '16 / 9',
          '21/9': '21 / 9',
          '3/4': '3 / 4',
          '2/3': '2 / 3',
          '9/16': '9 / 16',
          'golden': '1.618 / 1',
        },
        variants: [],
        responsive: true,
        darkMode: false,
      },
    ],
  },
  {
    id: 'animation-extras',
    name: 'Animation Extras',
    description: 'Additional animation utilities',
    utilities: [
      {
        id: 'animation-delay',
        name: 'Animation Delay',
        prefix: 'animation-delay',
        property: 'animation-delay',
        values: {
          '75': '75ms',
          '100': '100ms',
          '150': '150ms',
          '200': '200ms',
          '300': '300ms',
          '500': '500ms',
          '700': '700ms',
          '1000': '1000ms',
        },
        variants: [],
        responsive: false,
        darkMode: false,
      },
      {
        id: 'animation-duration',
        name: 'Animation Duration',
        prefix: 'duration',
        property: 'animation-duration',
        values: {
          '0': '0ms',
          '75': '75ms',
          '100': '100ms',
          '150': '150ms',
          '200': '200ms',
          '300': '300ms',
          '500': '500ms',
          '700': '700ms',
          '1000': '1000ms',
          '2000': '2000ms',
        },
        variants: [],
        responsive: false,
        darkMode: false,
      },
    ],
  },
  {
    id: 'gradient-extras',
    name: 'Gradient Extras',
    description: 'Advanced gradient utilities',
    utilities: [
      {
        id: 'bg-gradient-angle',
        name: 'Gradient Angle',
        prefix: 'bg-gradient',
        property: 'background-image',
        values: {
          '0': 'linear-gradient(0deg, var(--tw-gradient-stops))',
          '45': 'linear-gradient(45deg, var(--tw-gradient-stops))',
          '90': 'linear-gradient(90deg, var(--tw-gradient-stops))',
          '135': 'linear-gradient(135deg, var(--tw-gradient-stops))',
          '180': 'linear-gradient(180deg, var(--tw-gradient-stops))',
          '225': 'linear-gradient(225deg, var(--tw-gradient-stops))',
          '270': 'linear-gradient(270deg, var(--tw-gradient-stops))',
          '315': 'linear-gradient(315deg, var(--tw-gradient-stops))',
        },
        variants: ['hover'],
        responsive: false,
        darkMode: true,
      },
      {
        id: 'bg-radial-gradient',
        name: 'Radial Gradient',
        prefix: 'bg-radial',
        property: 'background-image',
        values: {
          '': 'radial-gradient(circle, var(--tw-gradient-stops))',
          'at-t': 'radial-gradient(circle at top, var(--tw-gradient-stops))',
          'at-b': 'radial-gradient(circle at bottom, var(--tw-gradient-stops))',
          'at-l': 'radial-gradient(circle at left, var(--tw-gradient-stops))',
          'at-r': 'radial-gradient(circle at right, var(--tw-gradient-stops))',
          'at-tl': 'radial-gradient(circle at top left, var(--tw-gradient-stops))',
          'at-tr': 'radial-gradient(circle at top right, var(--tw-gradient-stops))',
          'at-bl': 'radial-gradient(circle at bottom left, var(--tw-gradient-stops))',
          'at-br': 'radial-gradient(circle at bottom right, var(--tw-gradient-stops))',
        },
        variants: ['hover'],
        responsive: false,
        darkMode: true,
      },
    ],
  },
  {
    id: 'scroll-behavior',
    name: 'Scroll Behavior',
    description: 'Scroll-related utilities',
    utilities: [
      {
        id: 'scroll-behavior',
        name: 'Scroll Behavior',
        prefix: 'scroll',
        property: 'scroll-behavior',
        values: {
          'auto': 'auto',
          'smooth': 'smooth',
        },
        variants: [],
        responsive: false,
        darkMode: false,
      },
      {
        id: 'scroll-snap-type',
        name: 'Scroll Snap Type',
        prefix: 'snap',
        property: 'scroll-snap-type',
        values: {
          'none': 'none',
          'x': 'x mandatory',
          'x-proximity': 'x proximity',
          'y': 'y mandatory',
          'y-proximity': 'y proximity',
          'both': 'both mandatory',
          'both-proximity': 'both proximity',
        },
        variants: [],
        responsive: true,
        darkMode: false,
      },
      {
        id: 'scroll-snap-align',
        name: 'Scroll Snap Align',
        prefix: 'snap-align',
        property: 'scroll-snap-align',
        values: {
          'start': 'start',
          'end': 'end',
          'center': 'center',
          'none': 'none',
        },
        variants: [],
        responsive: true,
        darkMode: false,
      },
    ],
  },
  {
    id: 'backdrop-filters',
    name: 'Backdrop Filters',
    description: 'Additional backdrop filter utilities',
    utilities: [
      {
        id: 'backdrop-saturate',
        name: 'Backdrop Saturate',
        prefix: 'backdrop-saturate',
        property: 'backdrop-filter',
        values: {
          '0': 'saturate(0)',
          '50': 'saturate(0.5)',
          '100': 'saturate(1)',
          '150': 'saturate(1.5)',
          '200': 'saturate(2)',
        },
        variants: [],
        responsive: false,
        darkMode: false,
      },
      {
        id: 'backdrop-hue-rotate',
        name: 'Backdrop Hue Rotate',
        prefix: 'backdrop-hue-rotate',
        property: 'backdrop-filter',
        values: {
          '0': 'hue-rotate(0deg)',
          '15': 'hue-rotate(15deg)',
          '30': 'hue-rotate(30deg)',
          '60': 'hue-rotate(60deg)',
          '90': 'hue-rotate(90deg)',
          '180': 'hue-rotate(180deg)',
        },
        variants: [],
        responsive: false,
        darkMode: false,
      },
    ],
  },
  {
    id: 'container-queries',
    name: 'Container Queries',
    description: 'Container query utilities (CSS Container Queries)',
    utilities: [
      {
        id: 'container',
        name: 'Container',
        prefix: '@container',
        property: 'container-type',
        values: {
          '': 'inline-size',
          'size': 'size',
          'normal': 'normal',
        },
        variants: [],
        responsive: false,
        darkMode: false,
      },
    ],
  },
];

// =============================================================================
// UTILITY CLASS BUILDER
// =============================================================================

export interface UtilityBuilderOptions {
  darkModeStrategy: DarkModeStrategy;
  prefix?: string;
  important?: boolean;
}

export class UtilityClassBuilder {
  private utilities: CustomUtility[] = [];
  private options: UtilityBuilderOptions;

  constructor(options: Partial<UtilityBuilderOptions> = {}) {
    this.options = {
      darkModeStrategy: options.darkModeStrategy || 'class',
      prefix: options.prefix || '',
      important: options.important || false,
    };
  }

  /**
   * Add a custom utility
   */
  addUtility(utility: CustomUtility): this {
    this.utilities.push(utility);
    return this;
  }

  /**
   * Add utilities from a preset
   */
  addPreset(presetId: string): this {
    const preset = UTILITY_PRESETS.find(p => p.id === presetId);
    if (preset) {
      this.utilities.push(...preset.utilities);
    }
    return this;
  }

  /**
   * Remove a utility by ID
   */
  removeUtility(utilityId: string): this {
    this.utilities = this.utilities.filter(u => u.id !== utilityId);
    return this;
  }

  /**
   * Clear all utilities
   */
  clear(): this {
    this.utilities = [];
    return this;
  }

  /**
   * Get all utilities
   */
  getUtilities(): CustomUtility[] {
    return [...this.utilities];
  }

  /**
   * Generate CSS for all utilities
   */
  generate(): GeneratedCSS {
    const cssBlocks: string[] = [];
    let totalClassCount = 0;

    for (const utility of this.utilities) {
      const result = generateCustomUtilityCSS(utility, this.options.darkModeStrategy);

      // Apply prefix if specified
      let css = result.css;
      if (this.options.prefix) {
        css = css.replace(/\./g, `.${this.options.prefix}`);
      }

      // Apply !important if specified
      if (this.options.important) {
        css = css.replace(/;/g, ' !important;');
      }

      cssBlocks.push(`/* ${utility.name} */\n${css}`);
      totalClassCount += result.classCount;
    }

    return {
      css: cssBlocks.join('\n\n'),
      classCount: totalClassCount,
    };
  }
}

// =============================================================================
// QUICK UTILITY GENERATORS
// =============================================================================

/**
 * Generate a spacing scale utility
 */
export function createSpacingUtility(
  prefix: string,
  property: string,
  scale: number[],
  unit: string = 'rem',
  multiplier: number = 0.25
): CustomUtility {
  const values: Record<string, string> = {};
  for (const step of scale) {
    values[String(step)] = `${step * multiplier}${unit}`;
  }

  return {
    id: `${prefix}-spacing`,
    name: `${prefix} Spacing`,
    prefix,
    property,
    values,
    variants: [],
    responsive: true,
    darkMode: false,
  };
}

/**
 * Generate a color scale utility
 */
export function createColorUtility(
  prefix: string,
  property: string,
  colors: Record<string, string>,
  variants: StateVariant[] = ['hover', 'focus']
): CustomUtility {
  return {
    id: `${prefix}-colors`,
    name: `${prefix} Colors`,
    prefix,
    property,
    values: colors,
    variants,
    responsive: false,
    darkMode: true,
  };
}

/**
 * Generate a size utility
 */
export function createSizeUtility(
  prefix: string,
  property: string,
  sizes: Record<string, string>
): CustomUtility {
  return {
    id: `${prefix}-sizes`,
    name: `${prefix} Sizes`,
    prefix,
    property,
    values: sizes,
    variants: [],
    responsive: true,
    darkMode: false,
  };
}

// =============================================================================
// RESPONSIVE UTILITY GENERATOR
// =============================================================================

export interface ResponsiveUtilityConfig {
  baseClass: string;
  property: string;
  value: string;
  breakpoints?: ResponsiveBreakpoint[];
}

export function generateResponsiveUtilities(configs: ResponsiveUtilityConfig[]): string {
  const cssBlocks: string[] = [];

  for (const config of configs) {
    const breakpoints = config.breakpoints || BREAKPOINT_ORDER;

    // Base class
    cssBlocks.push(generateUtilityCSS(config.baseClass, config.property, config.value));

    // Responsive variants
    for (const bp of breakpoints) {
      cssBlocks.push(generateResponsiveVariant(config.baseClass, config.property, config.value, bp));
    }
  }

  return cssBlocks.join('\n\n');
}

// =============================================================================
// STATE VARIANT GENERATOR
// =============================================================================

export interface StateVariantConfig {
  baseClass: string;
  property: string;
  value: string;
  states?: StateVariant[];
}

export function generateStateVariants(configs: StateVariantConfig[]): string {
  const cssBlocks: string[] = [];

  for (const config of configs) {
    const states = config.states || ['hover', 'focus', 'active'];

    // Base class
    cssBlocks.push(generateUtilityCSS(config.baseClass, config.property, config.value));

    // State variants
    for (const state of states) {
      cssBlocks.push(generateStateVariant(config.baseClass, config.property, config.value, state));
    }
  }

  return cssBlocks.join('\n\n');
}

// =============================================================================
// DARK MODE VARIANT GENERATOR
// =============================================================================

export interface DarkModeVariantConfig {
  baseClass: string;
  property: string;
  lightValue: string;
  darkValue: string;
}

export function generateDarkModeVariants(
  configs: DarkModeVariantConfig[],
  strategy: DarkModeStrategy = 'class'
): string {
  const cssBlocks: string[] = [];

  for (const config of configs) {
    // Light mode (base) class
    cssBlocks.push(generateUtilityCSS(config.baseClass, config.property, config.lightValue));

    // Dark mode variant
    cssBlocks.push(generateDarkModeVariant(config.baseClass, config.property, config.darkValue, strategy));
  }

  return cssBlocks.join('\n\n');
}

// =============================================================================
// EXPORT
// =============================================================================

export function createUtilityBuilder(options?: Partial<UtilityBuilderOptions>): UtilityClassBuilder {
  return new UtilityClassBuilder(options);
}
