/**
 * Text Variants - 30+ text variant definitions
 *
 * Comprehensive typography styling system for headings, paragraphs,
 * display text, captions, and other text elements.
 */

import {
  ComponentVariantSchema,
  SizeVariant,
  ColorVariant,
  StateVariant,
  VariantDefinition,
  CompoundVariant,
  registerVariantSchema,
  VARIANT_COLORS,
} from '../variantSystem';

// ============================================================================
// SIZE DEFINITIONS
// ============================================================================

const textSizes: Record<SizeVariant, VariantDefinition> = {
  xs: {
    name: 'Extra Small',
    description: 'Caption text size',
    classes: ['text-xs'],
    preview: { backgroundColor: 'transparent' },
  },
  sm: {
    name: 'Small',
    description: 'Small body text',
    classes: ['text-sm'],
    preview: { backgroundColor: 'transparent' },
  },
  md: {
    name: 'Medium',
    description: 'Default body text',
    classes: ['text-base'],
    preview: { backgroundColor: 'transparent' },
  },
  lg: {
    name: 'Large',
    description: 'Large body text',
    classes: ['text-lg'],
    preview: { backgroundColor: 'transparent' },
  },
  xl: {
    name: 'Extra Large',
    description: 'Subheading text',
    classes: ['text-xl'],
    preview: { backgroundColor: 'transparent' },
  },
  '2xl': {
    name: '2X Large',
    description: 'Heading text',
    classes: ['text-2xl'],
    preview: { backgroundColor: 'transparent' },
  },
};

// Extended heading sizes
const headingSizes: Record<string, VariantDefinition> = {
  h1: {
    name: 'H1',
    description: 'Main page heading',
    classes: ['text-4xl', 'lg:text-5xl', 'xl:text-6xl', 'font-bold', 'tracking-tight'],
  },
  h2: {
    name: 'H2',
    description: 'Section heading',
    classes: ['text-3xl', 'lg:text-4xl', 'font-bold', 'tracking-tight'],
  },
  h3: {
    name: 'H3',
    description: 'Subsection heading',
    classes: ['text-2xl', 'lg:text-3xl', 'font-semibold'],
  },
  h4: {
    name: 'H4',
    description: 'Card heading',
    classes: ['text-xl', 'lg:text-2xl', 'font-semibold'],
  },
  h5: {
    name: 'H5',
    description: 'Small heading',
    classes: ['text-lg', 'font-semibold'],
  },
  h6: {
    name: 'H6',
    description: 'Smallest heading',
    classes: ['text-base', 'font-semibold'],
  },
  display1: {
    name: 'Display 1',
    description: 'Extra large display text',
    classes: ['text-6xl', 'lg:text-7xl', 'xl:text-8xl', 'font-black', 'tracking-tighter'],
  },
  display2: {
    name: 'Display 2',
    description: 'Large display text',
    classes: ['text-5xl', 'lg:text-6xl', 'xl:text-7xl', 'font-black', 'tracking-tighter'],
  },
  display3: {
    name: 'Display 3',
    description: 'Medium display text',
    classes: ['text-4xl', 'lg:text-5xl', 'xl:text-6xl', 'font-bold', 'tracking-tight'],
  },
};

// ============================================================================
// COLOR DEFINITIONS
// ============================================================================

function generateTextColorVariant(color: ColorVariant): VariantDefinition {
  const displayName = color.charAt(0).toUpperCase() + color.slice(1);

  if (color === 'white') {
    return {
      name: displayName,
      description: 'White text',
      classes: ['text-white'],
      preview: { textColor: '#ffffff' },
    };
  }

  if (color === 'black') {
    return {
      name: displayName,
      description: 'Black text',
      classes: ['text-gray-900'],
      preview: { textColor: '#111827' },
    };
  }

  return {
    name: displayName,
    description: `${displayName} colored text`,
    classes: [`text-${color}-600`],
    preview: { textColor: `var(--color-${color}-600)` },
  };
}

const textColors: Record<ColorVariant, VariantDefinition> = {} as Record<ColorVariant, VariantDefinition>;
for (const color of VARIANT_COLORS) {
  textColors[color] = generateTextColorVariant(color);
}

// ============================================================================
// STYLE DEFINITIONS
// ============================================================================

const textStyles: Record<string, VariantDefinition> = {
  // Basic styles
  default: {
    name: 'Default',
    description: 'Default text styling',
    classes: [],
  },
  heading: {
    name: 'Heading',
    description: 'Heading text style',
    classes: ['font-bold', 'tracking-tight'],
  },
  subheading: {
    name: 'Subheading',
    description: 'Subheading text style',
    classes: ['font-semibold'],
  },
  body: {
    name: 'Body',
    description: 'Body text style',
    classes: ['font-normal', 'leading-relaxed'],
  },
  caption: {
    name: 'Caption',
    description: 'Caption/small text style',
    classes: ['font-normal', 'text-sm'],
  },
  label: {
    name: 'Label',
    description: 'Form label style',
    classes: ['font-medium', 'text-sm'],
  },
  overline: {
    name: 'Overline',
    description: 'Overline text style',
    classes: ['text-xs', 'font-semibold', 'uppercase', 'tracking-wider'],
  },

  // Display styles
  display: {
    name: 'Display',
    description: 'Display/hero text',
    classes: ['font-black', 'tracking-tighter'],
  },
  'display-light': {
    name: 'Display Light',
    description: 'Light display text',
    classes: ['font-light', 'tracking-tight'],
  },

  // Special styles
  gradient: {
    name: 'Gradient',
    description: 'Gradient text',
    classes: [
      'bg-gradient-to-r', 'bg-clip-text', 'text-transparent',
    ],
  },
  outlined: {
    name: 'Outlined',
    description: 'Text with stroke outline',
    classes: [
      'text-transparent',
      '[-webkit-text-stroke:2px_currentColor]',
    ],
  },
  shadow: {
    name: 'Shadow',
    description: 'Text with shadow',
    classes: ['drop-shadow-lg'],
  },
  glow: {
    name: 'Glow',
    description: 'Text with glow effect',
    classes: ['drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]'],
  },

  // Typography styles
  serif: {
    name: 'Serif',
    description: 'Serif font family',
    classes: ['font-serif'],
  },
  mono: {
    name: 'Monospace',
    description: 'Monospace font family',
    classes: ['font-mono'],
  },
  italic: {
    name: 'Italic',
    description: 'Italic text',
    classes: ['italic'],
  },

  // Weight styles
  thin: {
    name: 'Thin',
    description: 'Thin weight text',
    classes: ['font-thin'],
  },
  light: {
    name: 'Light',
    description: 'Light weight text',
    classes: ['font-light'],
  },
  normal: {
    name: 'Normal',
    description: 'Normal weight text',
    classes: ['font-normal'],
  },
  medium: {
    name: 'Medium',
    description: 'Medium weight text',
    classes: ['font-medium'],
  },
  semibold: {
    name: 'Semibold',
    description: 'Semibold weight text',
    classes: ['font-semibold'],
  },
  bold: {
    name: 'Bold',
    description: 'Bold weight text',
    classes: ['font-bold'],
  },
  extrabold: {
    name: 'Extrabold',
    description: 'Extrabold weight text',
    classes: ['font-extrabold'],
  },
  black: {
    name: 'Black',
    description: 'Black weight text',
    classes: ['font-black'],
  },

  // Decoration styles
  underline: {
    name: 'Underline',
    description: 'Underlined text',
    classes: ['underline', 'underline-offset-4'],
  },
  'underline-wavy': {
    name: 'Underline Wavy',
    description: 'Wavy underlined text',
    classes: ['underline', 'decoration-wavy', 'underline-offset-4'],
  },
  strikethrough: {
    name: 'Strikethrough',
    description: 'Strikethrough text',
    classes: ['line-through'],
  },

  // Alignment styles
  left: {
    name: 'Left',
    description: 'Left aligned text',
    classes: ['text-left'],
  },
  center: {
    name: 'Center',
    description: 'Center aligned text',
    classes: ['text-center'],
  },
  right: {
    name: 'Right',
    description: 'Right aligned text',
    classes: ['text-right'],
  },
  justify: {
    name: 'Justify',
    description: 'Justified text',
    classes: ['text-justify'],
  },

  // Line height styles
  tight: {
    name: 'Tight',
    description: 'Tight line height',
    classes: ['leading-tight'],
  },
  snug: {
    name: 'Snug',
    description: 'Snug line height',
    classes: ['leading-snug'],
  },
  relaxed: {
    name: 'Relaxed',
    description: 'Relaxed line height',
    classes: ['leading-relaxed'],
  },
  loose: {
    name: 'Loose',
    description: 'Loose line height',
    classes: ['leading-loose'],
  },

  // Truncation styles
  truncate: {
    name: 'Truncate',
    description: 'Single line truncation',
    classes: ['truncate'],
  },
  'line-clamp-2': {
    name: 'Line Clamp 2',
    description: 'Clamp to 2 lines',
    classes: ['line-clamp-2'],
  },
  'line-clamp-3': {
    name: 'Line Clamp 3',
    description: 'Clamp to 3 lines',
    classes: ['line-clamp-3'],
  },
};

// ============================================================================
// STATE DEFINITIONS
// ============================================================================

const textStates: Record<StateVariant, VariantDefinition> = {
  default: {
    name: 'Default',
    description: 'Normal text state',
    classes: [],
  },
  hover: {
    name: 'Hover',
    description: 'Hover state preview',
    classes: [],
  },
  active: {
    name: 'Active',
    description: 'Active state',
    classes: [],
  },
  focus: {
    name: 'Focus',
    description: 'Focused state',
    classes: [],
  },
  disabled: {
    name: 'Disabled',
    description: 'Disabled/muted text',
    classes: ['opacity-50'],
  },
  loading: {
    name: 'Loading',
    description: 'Loading state',
    classes: ['animate-pulse'],
  },
  success: {
    name: 'Success',
    description: 'Success state',
    classes: ['text-green-600'],
  },
  error: {
    name: 'Error',
    description: 'Error state',
    classes: ['text-red-600'],
  },
  warning: {
    name: 'Warning',
    description: 'Warning state',
    classes: ['text-amber-600'],
  },
  info: {
    name: 'Info',
    description: 'Info state',
    classes: ['text-blue-600'],
  },
};

// ============================================================================
// COMPOUND VARIANTS
// ============================================================================

const textCompoundVariants: CompoundVariant[] = [
  // Gradient text colors
  {
    conditions: { style: 'gradient', color: 'blue' },
    classes: ['from-blue-500', 'to-cyan-500'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'purple' },
    classes: ['from-purple-500', 'to-pink-500'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'pink' },
    classes: ['from-pink-500', 'to-rose-500'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'green' },
    classes: ['from-green-500', 'to-emerald-500'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'orange' },
    classes: ['from-orange-500', 'to-red-500'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'indigo' },
    classes: ['from-indigo-500', 'via-purple-500', 'to-pink-500'],
    priority: 10,
  },
  {
    conditions: { style: 'gradient', color: 'cyan' },
    classes: ['from-cyan-400', 'to-blue-500'],
    priority: 10,
  },

  // Glow effect colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'glow', color: color as ColorVariant },
    classes: [`drop-shadow-[0_0_10px_rgba(var(--color-${color}-500-rgb),0.5)]`],
    priority: 10,
  })),

  // Outlined text colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'outlined', color: color as ColorVariant },
    classes: [`[-webkit-text-stroke-color:theme(colors.${color}.600)]`],
    priority: 10,
  })),

  // Heading sizes with colors
  {
    conditions: { style: 'heading', color: 'gray' },
    classes: ['text-gray-900', 'dark:text-white'],
    priority: 8,
  },

  // Body text with muted color
  {
    conditions: { style: 'body', color: 'gray' },
    classes: ['text-gray-600', 'dark:text-gray-300'],
    priority: 8,
  },

  // Caption text with lighter color
  {
    conditions: { style: 'caption', color: 'gray' },
    classes: ['text-gray-500', 'dark:text-gray-400'],
    priority: 8,
  },

  // Overline with colors
  ...VARIANT_COLORS.filter(c => c !== 'white' && c !== 'black').slice(0, 10).map(color => ({
    conditions: { style: 'overline', color: color as ColorVariant },
    classes: [`text-${color}-600`],
    priority: 8,
  })),
];

// ============================================================================
// TEXT VARIANT SCHEMA
// ============================================================================

export const textVariantSchema: ComponentVariantSchema = {
  componentType: 'text',
  displayName: 'Text',
  category: 'text',
  baseClasses: [],
  sizes: textSizes,
  colors: textColors,
  styles: textStyles,
  states: textStates,
  compoundVariants: textCompoundVariants,
  defaultVariant: {
    size: 'md',
    color: 'gray',
    style: 'default',
    state: 'default',
  },
};

// ============================================================================
// PRESET TEXT VARIANTS
// ============================================================================

export const textPresets = {
  // Headings
  h1: { size: '2xl', color: 'black', style: 'heading', state: 'default' },
  h2: { size: 'xl', color: 'black', style: 'heading', state: 'default' },
  h3: { size: 'lg', color: 'black', style: 'subheading', state: 'default' },
  h4: { size: 'md', color: 'black', style: 'subheading', state: 'default' },

  // Display
  displayLarge: { size: '2xl', color: 'black', style: 'display', state: 'default' },
  displayGradient: { size: '2xl', color: 'blue', style: 'gradient', state: 'default' },
  displayLight: { size: '2xl', color: 'gray', style: 'display-light', state: 'default' },

  // Body text
  body: { size: 'md', color: 'gray', style: 'body', state: 'default' },
  bodyLarge: { size: 'lg', color: 'gray', style: 'body', state: 'default' },
  bodySmall: { size: 'sm', color: 'gray', style: 'body', state: 'default' },

  // Caption and labels
  caption: { size: 'xs', color: 'gray', style: 'caption', state: 'default' },
  label: { size: 'sm', color: 'black', style: 'label', state: 'default' },
  overline: { size: 'xs', color: 'blue', style: 'overline', state: 'default' },

  // Special styles
  gradient: { size: 'xl', color: 'blue', style: 'gradient', state: 'default' },
  gradientPurple: { size: 'xl', color: 'purple', style: 'gradient', state: 'default' },
  outlined: { size: 'xl', color: 'blue', style: 'outlined', state: 'default' },
  shadow: { size: 'xl', color: 'white', style: 'shadow', state: 'default' },
  glow: { size: 'xl', color: 'blue', style: 'glow', state: 'default' },

  // States
  success: { size: 'md', color: 'green', style: 'default', state: 'success' },
  error: { size: 'md', color: 'red', style: 'default', state: 'error' },
  warning: { size: 'md', color: 'amber', style: 'default', state: 'warning' },
  info: { size: 'md', color: 'blue', style: 'default', state: 'info' },
  muted: { size: 'md', color: 'gray', style: 'default', state: 'disabled' },

  // Typography styles
  serif: { size: 'md', color: 'gray', style: 'serif', state: 'default' },
  mono: { size: 'md', color: 'gray', style: 'mono', state: 'default' },
  italic: { size: 'md', color: 'gray', style: 'italic', state: 'default' },

  // Decorations
  underline: { size: 'md', color: 'blue', style: 'underline', state: 'default' },
  strikethrough: { size: 'md', color: 'gray', style: 'strikethrough', state: 'default' },
} as const;

// ============================================================================
// REGISTRATION
// ============================================================================

registerVariantSchema(textVariantSchema);

// Register variants for specific text types
const textTypes = [
  'heading',
  'paragraph',
  'badge',
  'link',
  'list',
];

for (const type of textTypes) {
  registerVariantSchema({
    ...textVariantSchema,
    componentType: type,
    displayName: type.charAt(0).toUpperCase() + type.slice(1),
  });
}

export {
  textSizes,
  headingSizes,
  textColors,
  textStyles,
  textStates,
  textCompoundVariants,
};
